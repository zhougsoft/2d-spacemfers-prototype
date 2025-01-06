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
import { Background } from './Logic/Background'
import { Camera } from './Logic/Camera'
import { EntityManager, type EntityInfo } from './Logic/EntityManager'
import { Ship } from './Logic/Ship'
import PhaserScene from './PhaserScene'
import OverviewPanel from './UI/OverviewPanel'
import SelectedItemPanel from './UI/SelectedItemPanel'
import ShipControls from './UI/ShipControls'

const IS_HUD_ENABLED = true
const OVERVIEW_UPDATE_INTERVAL = 1000 // every 1 second

const Game = () => {
  // Game refs
  const background = useRef<Background>()
  const camera = useRef<Camera>()
  const entityManager = useRef<EntityManager>()
  const ship = useRef<Ship>()

  // UI state
  const [reloadKey, setReloadKey] = useState(0)
  const [playerSpeed, setPlayerSpeed] = useState(0)
  const [playerLocation, setPlayerLocation] = useState({ x: 0, y: 0 })
  const [overviewItems, setOverviewItems] = useState<EntityInfo[]>([])
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null)
  const lastOverviewUpdate = useRef(0)

  // Resets all game state to initial values & forces a fresh Phaser instance
  const reload = () => {
    background.current = undefined
    camera.current = undefined
    entityManager.current = undefined
    ship.current = undefined

    setPlayerSpeed(0)
    setPlayerLocation({ x: 0, y: 0 })
    setOverviewItems([])
    setSelectedEntityId(null)
    lastOverviewUpdate.current = 0

    setReloadKey(prev => prev + 1)
  }

  const refreshOverviewItems = useCallback(() => {
    if (!ship.current || !entityManager.current) return

    const { x, y } = ship.current.getPosition()
    const entities = entityManager.current.getEntitiesInfo(x, y)
    setOverviewItems(entities)
  }, [])

  const handleEntitySelection = (id: string | null) => {
    setSelectedEntityId(id)
  }

  const handleAlignTo = (id: string) => {
    if (!ship.current || !entityManager.current) return

    const targetPosition = entityManager.current.getEntityPosition(id)
    if (!targetPosition) return

    ship.current.alignTo(targetPosition.x, targetPosition.y)
  }

  const handleApproach = (id: string) => {
    if (!ship.current || !entityManager.current) return

    const targetPosition = entityManager.current.getEntityPosition(id)
    if (!targetPosition) return

    ship.current.approach(targetPosition.x, targetPosition.y)
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

    entityManager.current = new EntityManager()

    // Create some test asteroid game objects
    const createAsteroidEntity = (
      x: number,
      y: number,
      scale: number,
      rotation: number
    ) => {
      const id = `asteroid-${entityManager.current?.getEntities().length! + 1}`
      const sprite = scene.add
        .sprite(metersToPixels(x), metersToPixels(y), 'asteroid')
        .setName(id)
        .setScale(scale)
        .setRotation(rotation)
        .setInteractive()

      entityManager.current?.addEntity({ id, sprite })
      return { id, sprite }
    }

    createAsteroidEntity(0, -100, 3, 0.4)
    createAsteroidEntity(-150, -125, 2, 1.5)
    createAsteroidEntity(-100, -100, 1, 1.1)
    createAsteroidEntity(-90, -60, 0.75, 0.8)
    createAsteroidEntity(-75, -25, 1.5, 0.3)
    createAsteroidEntity(-45, -5, 0.5, 1.3)

    // Add game object click event
    scene.input.on(
      'pointerdown',
      (_: any, gameObjects: Phaser.GameObjects.GameObject[]) => {
        if (gameObjects.length === 0) return
        const clickedId = gameObjects[0].name
        handleEntitySelection(clickedId)
      }
    )

    // Add the player ship & follow w/ the camera
    const shipSprite = scene.add.sprite(0, 0, 'ship').setScale(1)
    ship.current = new Ship(shipSprite)
    camera.current?.follow(shipSprite)

    // Initialize overview panel data
    refreshOverviewItems()
  }, [])

  // Runs every frame
  const onUpdate = useCallback(
    (_scene: Phaser.Scene, time: number, delta: number) => {
      // Update player ship
      if (ship.current) {
        ship.current.update(delta)
        setPlayerSpeed(ship.current.getSpeed())
        setPlayerLocation(ship.current.getPosition())
      }

      // Update background parallax
      if (background.current && camera.current) {
        const { x, y } = camera.current.getScroll()
        background.current.updateParallax(x, y)
      }

      // Update overview panel data in intervals
      if (time - lastOverviewUpdate.current >= OVERVIEW_UPDATE_INTERVAL) {
        refreshOverviewItems()
        lastOverviewUpdate.current = time
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
        {IS_HUD_ENABLED && (
          <div>{`( x: ${playerLocation.x.toFixed(
            3
          )}m, y: ${playerLocation.y.toFixed(3)}m )`}</div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          maxWidth: '20rem',
        }}>
        {IS_HUD_ENABLED && (
          <>
            <SelectedItemPanel
              selectedItem={
                overviewItems.find(entity => entity.id === selectedEntityId) ??
                null
              }
              onAlignTo={handleAlignTo}
              onApproach={handleApproach}
            />
            <OverviewPanel
              overviewItems={overviewItems}
              selectedItemId={selectedEntityId}
              onSelectItem={id => handleEntitySelection(id)}
            />
          </>
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
