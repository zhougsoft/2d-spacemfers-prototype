/**
 * Game.tsx - Phaser + React Integration
 * -----------------------------------------
 * A spaceship control prototype using following Phaser-React integration pattern:
 *
 * Architecture Overview:
 * 1. Component Structure
 *    - <Game/> (this component): Main game logic, UI elements, and state management
 *    - <PhaserScene/>: Handles Phaser scene instance lifecycle and canvas rendering
 *
 * 2. State Management Pattern:
 *    - Game state class objects stored in React refs for cross-render Phaser access
 *    - React state only used for UI updates
 *    - Phaser callbacks (preload/create/update) interface with game state object refs for game logic
 *    - React state updates triggered by Phaser callbacks based on the result of the game logic
 *    - UI components trigger updates based on React state
 *    - NOTE: React useState values cannot be accessed in Phaser callbacks, but their setters can be called
 *
 * 3. Input Flow:
 *    - UI buttons trigger state changes, ex: setShipAngle() & setShipThrust()
 *    - Changes call game logic object refs
 *    - Game logic is applied based on these changes in the Phaser update loop
 *    - Updated values display in UI via React state setters called from the Phaser update loop
 */

import { useCallback, useRef, useState } from 'react'
import shuttleImage from '../../assets/shuttle.png'
import { createDebugGridTexture } from '../../utils/graphics'
import { Camera } from './Logic/Camera'
import { Background } from './Logic/Background'
import { Ship } from './Logic/Ship'
import PhaserScene from './PhaserScene'
import OverviewPanel from './UI/OverviewPanel'
import ShipControls from './UI/ShipControls'

// Feature flags
const IS_DEBUG_MODE = true
const IS_BACKGROUND_ENABLED = true
const IS_HUD_ENABLED = true

// Debug settings
const DEBUG_GRID_SIZE = 100 // 100m² debug grid
const DEBUG_GRID_KEY = 'debug-grid'

const Game = () => {
  // Game state object refs
  const background = useRef<Background>()
  const ship = useRef<Ship>()
  const camera = useRef<Camera>()

  // UI state management
  const [reloadKey, setReloadKey] = useState(0)
  const [speedDisplay, setSpeedDisplay] = useState(0)

  // Resets all game state to initial values & forces a fresh Phaser instance
  const reload = () => {
    ship.current = undefined
    setReloadKey(prev => prev + 1)
  }

  const setShipAngle = (angle: number) => {
    ship.current?.setTargetAngle(angle)
  }

  const setShipThrust = (thrust: number) => {
    ship.current?.setTargetThrust(thrust)
  }

  // ~~~ PHASER SCENE CALLBACKS ~~~

  // Runs once before the scene is created
  const onPreload = useCallback((scene: Phaser.Scene) => {
    background.current = new Background(scene)
    background.current.preload()
    scene.load.image('ship', shuttleImage)
  }, [])

  // Runs once when the scene is created
  const onCreate = useCallback((scene: Phaser.Scene) => {
    // Create background layers
    if (IS_BACKGROUND_ENABLED && background.current) {
      background.current.create()
    }

    // Create debug grid
    if (IS_DEBUG_MODE && background.current) {
      const { width, height } = background.current.getScreenSize()
      createDebugGridTexture(scene, DEBUG_GRID_SIZE, DEBUG_GRID_KEY)
      const gridTile = scene.add.tileSprite(0, 0, width, height, DEBUG_GRID_KEY)
      gridTile.setTileScale(1)
      gridTile.setOrigin(0, 0)
      gridTile.setScrollFactor(0)
      scene.data.set(DEBUG_GRID_KEY, gridTile)
    }

    // Add the player ship
    const shipSprite = scene.add.sprite(0, 0, 'ship').setScale(1)
    ship.current = new Ship(shipSprite)

    // Set up camera
    camera.current = new Camera(scene)
    camera.current.follow(ship.current.getSprite())
  }, [])

  // Runs every frame
  const onUpdate = useCallback(
    (scene: Phaser.Scene, _time: number, delta: number) => {
      // Update player ship
      if (ship.current) {
        ship.current.update(delta)
        setSpeedDisplay(ship.current.getSpeed())

        // ~~~ for debugging purposes ~~~
        // const { x, y } = ship.current.getPosition()
        // console.log(x, y)
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      }

      // Update background parallax
      if (IS_BACKGROUND_ENABLED && background.current && camera.current) {
        const { x, y } = camera.current.getScroll()
        background.current.updateParallax(x, y)
      }

      // Update debug grid position
      if (IS_DEBUG_MODE && camera.current) {
        const gridTile = scene.data.get(
          DEBUG_GRID_KEY
        ) as Phaser.GameObjects.TileSprite

        const { x, y } = camera.current.getScroll()

        gridTile.tilePositionX = x
        gridTile.tilePositionY = y
      }
    },
    []
  )

  return (
    <div
      style={{ position: 'relative', userSelect: 'none', overflow: 'hidden' }}>
      <PhaserScene
        key={reloadKey}
        onPreload={onPreload}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
      <button
        style={{ position: 'absolute', top: 0, left: 0, fontWeight: 'bold' }}
        onClick={reload}>
        RELOAD
      </button>
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 10,
        }}>
        {IS_HUD_ENABLED && <div>...</div>}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}>
        {IS_HUD_ENABLED && <OverviewPanel overviewItems={[]} />}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 25,
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
        <ShipControls
          speedDisplay={speedDisplay}
          setShipAngle={setShipAngle}
          setShipThrust={setShipThrust}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 25,
          left: 10,
        }}>
        {IS_HUD_ENABLED && <div>...</div>}
      </div>
    </div>
  )
}

export default Game
