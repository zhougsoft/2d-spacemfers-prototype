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
import shipImage from '../../assets/ship.png'
import { usePlayerContext } from '../../contexts/PlayerContext'
import { Ship } from './Logic/Ship'
import PhaserScene from './PhaserScene'
import PlayerOverview from './UI/PlayerOverview'
import ShipControls from './UI/ShipControls'
import { useGameData } from '../../hooks/useGameData'
import StarSystemMap from './UI/StarSystemMap'
import { EMOJI } from '../../utils/constants'

const MAP_SIZE = 10000 // Total size of the game world in pixels
const LINE_SPACING = 100 // Spacing between grid lines

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
  const { playerId } = usePlayerContext()

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
    refreshBackendGameData()
    ship.current = undefined
    setReloadKey(prev => prev + 1)
  }

  /**
   * Updates ship's target rotation angle
   * @param angle Target angle in degrees (0-359)
   */
  const setShipAngle = (angle: number) => {
    ship.current?.setTargetAngle(angle)
  }

  /**
   * Sets ship's target thrust level
   * @param thrust Thrust value (0.0-1.0) where 1.0 = 100% thrust
   */
  const setShipThrust = (thrust: number) => {
    ship.current?.setTargetThrust(thrust)
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

    // create the player ship
    const shipSprite = scene.add.sprite(MAP_SIZE / 2, MAP_SIZE / 2, 'ship')
    shipSprite.setScale(0.5)
    ship.current = new Ship(shipSprite)

    // camera setup
    scene.cameras.main.setBackgroundColor('#000000')
    scene.cameras.main.setZoom(1)
    scene.cameras.main.startFollow(ship.current.getSprite(), false)
  }, [])

  // Runs every frame
  const onUpdate = useCallback((_scene: Phaser.Scene) => {
    if (ship.current) {
      ship.current.update()
      setSpeedDisplay(ship.current.getSpeed())
    }
  }, [])

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
          top: 100,
          left: 100,
        }}>
        {starSystemTree ? (
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
          top: 100,
          right: 100,
        }}>
        <span>[celestial overview here]</span>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          right: 100,
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
          bottom: 100,
          left: 100,
        }}>
        {player ? (
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
