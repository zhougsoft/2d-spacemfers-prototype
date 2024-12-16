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
import backgroundBaseImage from '../../assets/bg/base.png'
import backgroundFarImage from '../../assets/bg/far.png'
import backgroundMidImage from '../../assets/bg/mid.png'
import backgroundNearImage from '../../assets/bg/near.png'
import shuttleImage from '../../assets/shuttle.png'
import { usePlayerContext } from '../../contexts/PlayerContext'
import { useGameData } from '../../hooks/useGameData'
import {
  AU_IN_METERS,
  EMOJI,
  PIXELS_PER_KILOMETER,
} from '../../utils/constants'
import { drawDebugGrid } from '../../utils/graphics'
import { Ship } from './Logic/Ship'
import PhaserScene from './PhaserScene'
import OverviewPanel from './UI/OverviewPanel'
import PlayerOverview from './UI/PlayerOverview'
import ShipControls from './UI/ShipControls'
import StarSystemMap from './UI/StarSystemMap'

// ~~~ WIP zone ~~~

// TODO: plan out the star system space & coordinate system
// there is access to the following constants:
// - PIXELS_PER_METER
// - PIXELS_PER_KILOMETER
// - AU_IN_METERS
// - AU_IN_KILOMETERS

const STAR_SYSTEM_SIZE_AU = 100

interface Celestial {
  id: string
  x: number
  y: number
}

const starCelestial: Celestial = {
  id: 'star',
  // the star will always be at the center of the star system
  x: 0,
  y: 0,
}

const planetCelestial: Celestial = {
  id: 'planet',
  // xy coordinates are always represented in meters
  x: AU_IN_METERS * 1, // 1 AU away from the star
  y: AU_IN_METERS * 1,
}

const asteroidCelestial: Celestial = {
  id: 'asteroid',
  x: AU_IN_METERS * 4, // 4 AU away from the star
  y: AU_IN_METERS * 4,
}

const celestials: Celestial[] = [
  starCelestial,
  planetCelestial,
  asteroidCelestial,
]

// ~~~~~~~~~~~~~~~~

// Feature flags
const IS_DEBUG_MODE = true
const IS_BACKGROUND_ENABLED = false
const IS_HUD_ENABLED = false

const DEBUG_GRID_SIZE = PIXELS_PER_KILOMETER * 1

// Camera control factors
const MIN_ZOOM = 0.25
const MAX_ZOOM = 3
const STARTING_ZOOM = 1
const ZOOM_SPEED = 0.5
const BG_PARALLAX_FAR = 0.01
const BG_PARALLAX_MID = 0.1
const BG_PARALLAX_NEAR = 0.2

const Game = () => {
  const { playerId } = usePlayerContext()

  // TODO: probably remove the starSystemIndex and starSystemTree entirely since rewriting backend w/ static data & to spatial partitioning system
  // Backend player data & "slow" game state (system data, universe state, etc.)
  const {
    starSystemIndex,
    starSystemTree,
    player,
    playerLocation,
    playerShips,
    activePlayerShip,
    refreshData: refreshBackendGameData,
  } = useGameData(playerId)

  // Phaser game state refs for "fast" game state (ship position, velocity, etc.)
  const ship = useRef<Ship>()

  // UI management state
  const [reloadKey, setReloadKey] = useState(0)
  const [speedDisplay, setSpeedDisplay] = useState(0)
  const [starSystemMapIsExpanded, setStarSystemMapIsExpanded] = useState(false)

  // Resets all game state to initial values & forces a fresh Phaser instance
  const reload = () => {
    refreshBackendGameData(() => {
      ship.current = undefined
      setReloadKey(prev => prev + 1)
    })
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
    scene.load.image('bg-base', backgroundBaseImage)
    scene.load.image('bg-far', backgroundFarImage)
    scene.load.image('bg-mid', backgroundMidImage)
    scene.load.image('bg-near', backgroundNearImage)
    scene.load.image('ship', shuttleImage)
  }, [])

  // Runs once when the scene is created
  const onCreate = useCallback((scene: Phaser.Scene) => {
    if (IS_BACKGROUND_ENABLED) {
      const { width, height } = scene.sys.canvas
      // Add static base background
      scene.add
        .image(0, 0, 'bg-base')
        .setDisplaySize(scene.cameras.main.width, scene.cameras.main.height)
        .setOrigin(0, 0)
        .setScrollFactor(0)

      // Add far background layer
      const bgFar = scene.add
        .tileSprite(0, 0, width, height, 'bg-far')
        .setTileScale(0.2)
        .setOrigin(0, 0)
        .setScrollFactor(0)

      // Add mid background layer
      const bgMid = scene.add
        .tileSprite(0, 0, width, height, 'bg-mid')
        .setTileScale(0.2)
        .setOrigin(0, 0)
        .setScrollFactor(0)

      // Add near background layer
      const bgNear = scene.add
        .tileSprite(0, 0, width, height, 'bg-near')
        .setTileScale(0.2)
        .setOrigin(0, 0)
        .setScrollFactor(0)

      // Set background layers in scene data to access in update loop for parallax logic
      scene.data.set('bg-far', bgFar)
      scene.data.set('bg-mid', bgMid)
      scene.data.set('bg-near', bgNear)
    }

    if (IS_DEBUG_MODE) {
      drawDebugGrid(scene, DEBUG_GRID_SIZE)
    }

    // Create the player ship
    const shipSprite = scene.add.sprite(0, 0, 'ship')
    shipSprite.setScale(1)
    ship.current = new Ship(shipSprite)

    // Set up camera
    scene.cameras.main.setBackgroundColor('#000000')
    scene.cameras.main.setZoom(STARTING_ZOOM)
    scene.cameras.main.startFollow(ship.current.getSprite(), false, 0.75, 0.75)

    // Add camera zoom in/out controls on scroll
    scene.input.on('wheel', (_: any, __: any, ___: number, deltaY: number) => {
      const zoom = scene.cameras.main.zoom - (deltaY * ZOOM_SPEED) / 1000
      scene.cameras.main.setZoom(Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM))
    })
  }, [])

  // Runs every frame
  const onUpdate = useCallback(
    (scene: Phaser.Scene, _time: number, delta: number) => {
      // Update player ship
      if (ship.current) {
        ship.current.update(delta)
        setSpeedDisplay(ship.current.getSpeed())

        // ~~~ for debugging purposes ~~~
        const { x, y } = ship.current.getPosition()
        console.log(x, y)
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      }

      if (IS_BACKGROUND_ENABLED) {
        // Apply background layer parallax offsets
        const camera = scene.cameras.main
        const bgFar = scene.data.get('bg-far')
        const bgMid = scene.data.get('bg-mid')
        const bgNear = scene.data.get('bg-near')

        bgFar.tilePositionX = camera.scrollX * BG_PARALLAX_FAR
        bgFar.tilePositionY = camera.scrollY * BG_PARALLAX_FAR

        bgMid.tilePositionX = camera.scrollX * BG_PARALLAX_MID
        bgMid.tilePositionY = camera.scrollY * BG_PARALLAX_MID

        bgNear.tilePositionX = camera.scrollX * BG_PARALLAX_NEAR
        bgNear.tilePositionY = camera.scrollY * BG_PARALLAX_NEAR
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
        {IS_HUD_ENABLED && starSystemTree ? (
          <div>
            {starSystemMapIsExpanded ? (
              <StarSystemMap
                starSystemTree={starSystemTree}
                highlightedCelestialId={playerLocation?.celestial_id}
                playerId={playerId}
                onDataChange={refreshBackendGameData}
                player={player}
                onClose={() => setStarSystemMapIsExpanded(false)}
              />
            ) : (
              <button onClick={() => setStarSystemMapIsExpanded(true)}>
                {`${EMOJI.MILKY_WAY} system map`}
              </button>
            )}
          </div>
        ) : (
          <div>...</div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}>
        {IS_HUD_ENABLED && playerLocation && starSystemIndex ? (
          <OverviewPanel
            playerLocation={playerLocation}
            starSystemIndex={starSystemIndex}
          />
        ) : (
          <div>...</div>
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
        {IS_HUD_ENABLED && player ? (
          <PlayerOverview
            playerData={{
              player,
              playerLocation,
              playerShips,
              activePlayerShip,
            }}
            starSystemIndex={starSystemIndex}
          />
        ) : (
          <div>...</div>
        )}
      </div>
    </div>
  )
}

export default Game
