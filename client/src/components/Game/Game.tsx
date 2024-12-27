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
import asteroidImage from '../../assets/asteroid.png'
import shipImage from '../../assets/shuttle.png'
import { metersToPixels } from '../../utils/measurements'
import { Camera } from './Logic/Camera'
import { Background } from './Logic/Background'
import { Ship } from './Logic/Ship'
import PhaserScene from './PhaserScene'
import OverviewPanel from './UI/OverviewPanel'
import ShipControls from './UI/ShipControls'

const IS_HUD_ENABLED = true

const Game = () => {
  // Game state object refs
  const background = useRef<Background>()
  const camera = useRef<Camera>()
  const sceneSprites = useRef<Phaser.GameObjects.Sprite[]>()
  const ship = useRef<Ship>()

  // UI state management
  const [reloadKey, setReloadKey] = useState(0)
  const [playerSpeed, setPlayerSpeed] = useState(0)
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [overviewItems, setOverviewItems] = useState<
    Phaser.GameObjects.Sprite[]
  >([])

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

  const onSceneSpriteClick = (sprite: Phaser.GameObjects.Sprite) => {
    console.log('sprite clicked:', sprite)
  }

  // ~~~ PHASER SCENE CALLBACKS ~~~

  // Runs once before the scene is created
  const onPreload = useCallback((scene: Phaser.Scene) => {
    // Setup background & camera
    background.current = new Background(scene)
    camera.current = new Camera(scene, (zoom, zoomTier) =>
      background.current?.zoom(zoom, zoomTier)
    )

    // Preload assets
    background.current.preload()
    scene.load.image('ship', shipImage)
    scene.load.image('asteroid', asteroidImage)
  }, [])

  // Runs once when the scene is created
  const onCreate = useCallback((scene: Phaser.Scene) => {
    // Create background layers
    if (background.current) {
      background.current.create()
    }

    // Create some test asteroid game objects
    const asteroid1 = scene.add
      .sprite(metersToPixels(-100), metersToPixels(-100), 'asteroid')
      .setScale(1)
      .setRotation(1)
      .setInteractive()

    const asteroid2 = scene.add
      .sprite(metersToPixels(-90), metersToPixels(-60), 'asteroid')
      .setScale(0.75)
      .setRotation(0.75)
      .setInteractive()

    const asteroid3 = scene.add
      .sprite(metersToPixels(-75), metersToPixels(-25), 'asteroid')
      .setScale(1.5)
      .setRotation(0.25)
      .setInteractive()

    // just hold stuff in a ref array for now
    sceneSprites.current = [asteroid1, asteroid2, asteroid3]

    // Add game object click event
    scene.input.on(
      'pointerdown',
      (
        _pointer: Phaser.Input.Pointer,
        gameObjects: Phaser.GameObjects.GameObject[]
      ) => {
        if (gameObjects.length > 0) {
          const clickedSprite = sceneSprites.current?.find(
            a => a === gameObjects[0]
          )
          if (clickedSprite) {
            onSceneSpriteClick(clickedSprite)
          }
        }
      }
    )

    // Add the player ship & follow w/ the camera
    const shipSprite = scene.add.sprite(0, 0, 'ship').setScale(1)
    ship.current = new Ship(shipSprite)
    camera.current?.follow(shipSprite)
  }, [])

  // Runs every frame
  const onUpdate = useCallback(
    (_scene: Phaser.Scene, _time: number, delta: number) => {
      // Update player ship
      if (ship.current) {
        ship.current.update(delta)
        // TODO: debounce this
        setPlayerSpeed(ship.current.getSpeed())
        setPlayerPosition(ship.current.getPosition())
      }

      // Update background parallax
      if (background.current && camera.current) {
        const { x, y } = camera.current.getScroll()
        background.current.updateParallax(x, y)
      }

      // Update overview UI
      if (sceneSprites.current) {
        // TODO: debounce this
        setOverviewItems(sceneSprites.current)
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
        {IS_HUD_ENABLED && (
          <OverviewPanel
            overviewItems={overviewItems}
            playerPosition={playerPosition}
          />
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 25,
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
        <ShipControls
          speedDisplay={playerSpeed}
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
