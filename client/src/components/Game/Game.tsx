/**
 * Game.tsx - Phaser + React Integration
 * -----------------------------------------
 * A spaceship control prototype using following Phaser-React integration pattern:
 *
 * Architecture Overview:
 * 1. Component Structure
 *    - <Game/> (this component): Main game logic, UI elements, and state management
 *    - <PhaserContainer/>: Handles Phaser instance lifecycle and canvas
 *    - usePhaser hook: Manages Phaser game instance creation/destruction
 *
 * 2. State Management Pattern:
 *    - Game state stored in Refs for Phaser access
 *    - React state only used for UI updates
 *    - Phaser callbacks (preload/create/update) modify Refs directly
 *    - UI components read from React state
 *    - NOTE: React useState values cannot be accessed in Phaser callbacks, but their setters can be called
 *
 * 3. Input Flow:
 *    - UI buttons trigger state changes via setShipAlignment/setShipThrust
 *    - Changes update Refs (target angle/thrust)
 *    - Phaser update loop gradually applies these changes
 *    - Current values update UI via React state
 */

import { useCallback, useRef, useState } from 'react'
import shipImage from '../../assets/ship.png'
import PhaserContainer from './PhaserContainer'

// World Configuration
const MAP_SIZE = 10000 // Total size of the game world in pixels
const LINE_SPACING = 100 // Spacing between grid lines

// Ship Physics Constants
const SHIP_ROTATION_SPEED = 1 // Degrees per frame ship can rotate
const SHIP_ACCELERATION = 0.1 // Base acceleration per frame
const MAX_SPEED = 10 // Maximum possible speed at 100% thrust

// Motion Smoothing Factors
const THRUST_LERP_FACTOR = 0.1 // How quickly thrust changes (0-1)
const VELOCITY_LERP_FACTOR = 0.05 // How quickly velocity changes (0-1)

/**
 * Linear interpolation helper
 * @param start Starting value
 * @param end Target value
 * @param t Interpolation factor (0-1)
 */
const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t
}

/**
 * Draws the game world grid
 * @param graphics Phaser graphics object to draw with
 */
const drawGrid = (graphics: Phaser.GameObjects.Graphics) => {
  graphics.lineStyle(1, 0x333333)

  // Draw vertical lines
  for (let x = 0; x <= MAP_SIZE; x += LINE_SPACING) {
    graphics.moveTo(x, 0)
    graphics.lineTo(x, MAP_SIZE)
  }

  // Draw horizontal lines
  for (let y = 0; y <= MAP_SIZE; y += LINE_SPACING) {
    graphics.moveTo(0, y)
    graphics.lineTo(MAP_SIZE, y)
  }

  graphics.strokePath()
}

const Game = () => {
  // UI management state
  const [reloadKey, setReloadKey] = useState(0)
  const [speedDisplay, setSpeedDisplay] = useState(0)

  // Game state refs
  const shipRef = useRef<Phaser.GameObjects.Image>()
  const shipVelocityXRef = useRef(0)
  const shipVelocityYRef = useRef(0)
  const shipTargetAngleRef = useRef(0)
  const shipTargetThrustRef = useRef(0)
  const shipCurrentThrustRef = useRef(0)

  /**
   * Resets all game state to initial values and forces a fresh Phaser container instance
   */
  const reload = () => {
    shipRef.current = undefined
    shipVelocityXRef.current = 0
    shipVelocityYRef.current = 0
    shipTargetAngleRef.current = 0
    shipTargetThrustRef.current = 0
    shipCurrentThrustRef.current = 0
    setReloadKey(prev => prev + 1)
  }

  /**
   * Updates ship's target rotation angle
   * @param angle Target angle in degrees (0-359)
   */
  const setShipAlignment = (angle: number) => {
    shipTargetAngleRef.current = angle
  }

  /**
   * Sets ship's target thrust level
   * @param thrust Thrust value (0.0-1.0) where 1.0 = 100% thrust
   */
  const setShipThrust = (thrust: number) => {
    shipTargetThrustRef.current = thrust
  }

  // ~~~ PHASER SCENE CALLBACKS ~~~

  // Runs once before the scene is created
  const onPreload = useCallback((scene: Phaser.Scene) => {
    scene.load.image('ship', shipImage)
  }, [])

  // Runs once when the scene is created
  const onCreate = useCallback((scene: Phaser.Scene) => {
    // add stuff to the scene
    drawGrid(scene.add.graphics())

    // add player ship to the scene
    // TODO: instead of piecing together the ship & it's state in here, make a nice abstracted Ship class
    const shipImage = scene.add.image(MAP_SIZE / 2, MAP_SIZE / 2, 'ship')
    shipImage.setScale(0.5)
    shipRef.current = shipImage

    // camera setup
    scene.cameras.main.setBackgroundColor('#000000')
    scene.cameras.main.setZoom(1)
    scene.cameras.main.startFollow(shipRef.current, false)
  }, [])

  // Runs every frame
  const onUpdate = useCallback((scene: Phaser.Scene) => {
    if (shipRef.current) {
      // ~~~ ROTATION HANDLING ~~~

      // Calculate shortest rotation path to target angle
      const currentAngle = shipRef.current.angle
      const angleDiff = shipTargetAngleRef.current - currentAngle
      // Normalize to -180/+180 to ensure ship rotates the shortest direction
      const normalizedDiff = ((angleDiff + 180) % 360) - 180

      // Apply rotation with speed limiting
      if (Math.abs(normalizedDiff) > SHIP_ROTATION_SPEED) {
        shipRef.current.angle += Math.sign(normalizedDiff) * SHIP_ROTATION_SPEED
      } else {
        shipRef.current.angle = shipTargetAngleRef.current
      }

      // ~~~ THRUST HANDLING ~~~

      // Smoothly interpolate current thrust towards target thrust
      shipCurrentThrustRef.current = lerp(
        shipCurrentThrustRef.current,
        shipTargetThrustRef.current,
        THRUST_LERP_FACTOR
      )

      // Convert ship's angle to radians and adjust for Phaser's coordinate system
      // (subtract 90° because Phaser's 0° points right, we want it to point up)
      const currentAngleRad = (shipRef.current.angle - 90) * (Math.PI / 180)

      // Calculate thrust vector components based on ship's orientation
      const thrustX = Math.cos(currentAngleRad) * SHIP_ACCELERATION
      const thrustY = Math.sin(currentAngleRad) * SHIP_ACCELERATION

      // ~~~ VELOCITY HANDLING ~~~

      if (shipTargetThrustRef.current === 0) {
        // When not thrusting, gradually slow down both velocity components
        shipVelocityXRef.current = lerp(
          shipVelocityXRef.current,
          0,
          VELOCITY_LERP_FACTOR
        )
        shipVelocityYRef.current = lerp(
          shipVelocityYRef.current,
          0,
          VELOCITY_LERP_FACTOR
        )
      } else {
        // Apply thrust to velocity components
        shipVelocityXRef.current += thrustX * shipCurrentThrustRef.current
        shipVelocityYRef.current += thrustY * shipCurrentThrustRef.current

        // ~~~ SPEED LIMITING ~~~

        // Calculate current velocity magnitude (speed)
        const currentSpeed = Math.sqrt(
          shipVelocityXRef.current * shipVelocityXRef.current +
            shipVelocityYRef.current * shipVelocityYRef.current
        )
        // Calculate max allowed speed based on current thrust setting
        const maxSpeedForThrust = MAX_SPEED * shipCurrentThrustRef.current

        // If exceeding max speed, scale velocity components down proportionally
        if (currentSpeed > maxSpeedForThrust) {
          const scale = maxSpeedForThrust / currentSpeed
          shipVelocityXRef.current *= scale
          shipVelocityYRef.current *= scale
        }
      }

      // ~~~ POSITION UPDATE ~~~

      // Apply current velocity to ship's position
      shipRef.current.x += shipVelocityXRef.current
      shipRef.current.y += shipVelocityYRef.current

      // ~~~ UI UPDATE ~~~

      // Calculate and display current speed
      const currentSpeed = Math.sqrt(
        shipVelocityXRef.current * shipVelocityXRef.current +
          shipVelocityYRef.current * shipVelocityYRef.current
      )
      setSpeedDisplay(currentSpeed)
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{ position: 'absolute', top: 0, left: 0 }}
        onClick={reload}>
        RELOAD
      </button>
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          right: 100,
          display: 'flex',
        }}>
        <div>
          <div>
            <button onClick={() => setShipAlignment(315)}>↖️</button>
            <button onClick={() => setShipAlignment(0)}>⬆️</button>
            <button onClick={() => setShipAlignment(45)}>↗️</button>
          </div>
          <div>
            <button onClick={() => setShipAlignment(270)}>⬅️</button>
            <button onClick={() => setShipThrust(0)}>🛑</button>
            <button onClick={() => setShipAlignment(90)}>➡️</button>
          </div>
          <div>
            <button onClick={() => setShipAlignment(225)}>↙️</button>
            <button onClick={() => setShipAlignment(180)}>⬇️</button>
            <button onClick={() => setShipAlignment(135)}>↘️</button>
          </div>
        </div>
        <div>
          <button onClick={() => setShipThrust(1)}>FULL THRUST</button>
          <button onClick={() => setShipThrust(0.5)}>HALF THRUST</button>
          <button onClick={() => setShipThrust(0)}>STOP</button>
          <div
            style={{
              backgroundColor: '#111',
              padding: '0.075em 0.35em',
            }}>
            SPEED: {speedDisplay.toFixed(2)}
          </div>
        </div>
      </div>
      <PhaserContainer
        key={reloadKey}
        onPreload={onPreload}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </div>
  )
}

export default Game
