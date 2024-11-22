import cors from 'cors'
import express from 'express'
import { client, runQuery } from './db'
import {
  addPlayerShip,
  getActivePlayerShip,
  getPlayerLocation,
  getPlayerShips,
  initiatePlayerTravel,
  setActivePlayerShip,
  setPlayerLocation,
  unsetActivePlayerShip,
} from './lib/player-state'
import {
  createPlayer,
  getAllPlayers,
  getPlayer,
  getPlayers,
} from './lib/players'
import {
  getAllCelestials,
  getAllShipTypes,
  getCelestial,
  getCelestialsByRoot,
  getDistanceBetweenCelestials,
  getShipType,
} from './lib/universe'
import { createGameShips, createSolarSystem } from './utils'

const PORT = 6969

const main = async () => {
  await client.connect()
  console.log('connected to database...')

  const app = express()
  app.use(cors())

  // --- db admin routes ------------------------------------------------------

  /**
   * Reset the database by dropping and recreating all tables, and creating a new solar system + game objects.
   * @route GET /api/db-up
   * @returns {Object} Response with a success or error message.
   */
  app.get('/api/db-up', async (_req, res) => {
    try {
      await runQuery('db-down.sql')
      await runQuery('db-up.sql')
      console.log('reset database')

      const solarSystemResult = await createSolarSystem()
      const gameShipsResult = await createGameShips()

      if (!solarSystemResult || !gameShipsResult) {
        throw Error('error creating universe')
      }

      console.log('created universe')
      res.json({ msg: 'db up success' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  /**
   * Drop all tables in the database.
   * @route GET /api/db-down
   * @returns {Object} Response with a success or error message.
   */
  app.get('/api/db-down', async (_req, res) => {
    try {
      await runQuery('db-down.sql')
      console.log('dropped tables')

      res.json({ msg: 'db down success' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  // --- universe admin routes ------------------------------------------------

  // TODO: if needed, routes for higher fidelity data on celestials (w/ the *_info tables joined):
  // - /api/celestials/stars
  // - /api/celestials/stars/:starCelestialId
  // - /api/celestials/planets/:planetCelestialId
  // - /api/celestials/moons/:moonCelestialId
  // - /api/celestials/belts/:beltCelestialId
  // - /api/celestials/station/:stationCelestialId

  /**
   * Get all celestials in the universe.
   * @route GET /api/celestials
   * @returns {Object} Response with celestials data or an error message.
   */
  app.get('/api/celestials', async (_req, res) => {
    try {
      const celestials = await getAllCelestials()

      if (!celestials) {
        res.status(404).json({ error: 'celestials not found' })
        return
      }

      res.status(200).json(celestials)
    } catch (error) {
      console.error(`error fetching celestials:`, error)
      res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get data for a celestial by its ID.
   * @route GET /api/celestials/:celestialId
   * @param {number} id - The celestial ID.
   * @returns {Object} Response with the celestial data or an error message.
   */
  app.get('/api/celestials/:celestialId', async (req, res) => {
    try {
      const celestialId = parseInt(req.params.celestialId, 10)

      if (isNaN(celestialId) || celestialId < 1) {
        res.status(400).json({ error: 'invalid celestial id' })
        return
      }

      const celestial = await getCelestial(celestialId)

      if (!celestial) {
        res.status(404).json({ error: 'celestial not found' })
        return
      }

      res.status(200).json(celestial)
    } catch (error) {
      console.error(
        `error fetching celestial ${req.params.celestialId}:`,
        error
      )
      res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get data for all celestials sharing a root ID.
   * @route GET /api/celestials/:rootCelestialId
   * @param {number} id - The root celestial ID.
   * @returns {Object} Response with the celestials data or an error message.
   */
  app.get('/api/celestials/root/:rootCelestialId', async (req, res) => {
    try {
      const rootCelestialId = parseInt(req.params.rootCelestialId, 10)

      if (isNaN(rootCelestialId) || rootCelestialId < 1) {
        res.status(400).json({ error: 'invalid celestial id' })
        return
      }

      const celestial = await getCelestialsByRoot(rootCelestialId)

      if (!celestial) {
        res.status(404).json({ error: 'celestials not found' })
        return
      }

      res.status(200).json(celestial)
    } catch (error) {
      console.error(
        `error fetching celestials for root id ${req.params.rootCelestialId}:`,
        error
      )
      res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get distance between two celestials.
   * @route GET /api/celestials/distance/:celestialId1/:celestialId2
   * @param {number} celestialId1 - The ID of the first celestial.
   * @param {number} celestialId2 - The ID of the second celestial.
   * @returns {Object} Response with the distance between the celestials or an error message.
   */
  app.get(
    '/api/celestials/distance/:celestialId1/:celestialId2',
    async (req, res) => {
      try {
        const celestialId1 = parseInt(req.params.celestialId1, 10)
        const celestialId2 = parseInt(req.params.celestialId2, 10)

        if (isNaN(celestialId1) || celestialId1 < 1) {
          res.status(400).json({ error: 'invalid celestial id #1' })
          return
        }

        if (isNaN(celestialId2) || celestialId2 < 1) {
          res.status(400).json({ error: 'invalid celestial id #2' })
          return
        }

        const result = await getDistanceBetweenCelestials(
          celestialId1,
          celestialId2
        )

        if (!result) {
          res.status(404).json({ error: 'distance not found' })
          return
        }

        res.status(200).json(result)
      } catch (error) {
        console.error(
          `error fetching distance between celestials ${req.params.celestialId1} and ${req.params.celestialId2}:`,
          error
        )
        res.status(500).json({ error: 'internal server error' })
      }
    }
  )

  /**
   * Get all ships in the game.
   * @route GET /api/ships
   * @returns {Object} Response with the ships data or an error message.
   */
  app.get('/api/ships', async (_req, res) => {
    try {
      const ships = await getAllShipTypes()

      if (!ships) {
        res.status(404).json({ error: 'ships not found' })
        return
      }

      res.status(200).json(ships)
    } catch (error) {
      console.error(`error fetching ships:`, error)
      res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get data for a ship by its ID.
   * @route GET /api/ships/:shipId
   * @param {number} id - The ship ID.
   * @returns {Object} Response with the ship data or an error message.
   */
  app.get('/api/ships/:shipId', async (req, res) => {
    try {
      const shipId = parseInt(req.params.shipId, 10)

      if (isNaN(shipId) || shipId < 1) {
        res.status(400).json({ error: 'invalid ship id' })
        return
      }

      const ship = await getShipType(shipId)

      if (!ship) {
        res.status(404).json({ error: 'ship not found' })
        return
      }

      res.status(200).json(ship)
    } catch (error) {
      console.error(`error fetching ship ${req.params.shipId}:`, error)
      res.status(500).json({ error: 'internal server error' })
    }
  })

  // --- player admin routes --------------------------------------------------

  /**
   * Create a new player.
   * @route POST /api/players/create
   * @returns {Object} Response with the created player ID.
   */
  app.post('/api/players/create', async (_req, res) => {
    try {
      const playerId = await createPlayer()
      if (!playerId) throw Error('error creating player')

      console.log('created player - id:', playerId)
      res.json({ player_id: playerId })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  /**
   * Get all players or a set of players by their IDs.
   * If `ids` query param is provided, fetch players by those IDs.
   * @route GET /api/players
   * @queryparam {string} [ids] - Comma-separated list of player IDs to fetch.
   * @returns {Object[]} Response with the list of players or an error message.
   */
  app.get('/api/players', async (req, res) => {
    try {
      const playerIdsParam = req.query.ids

      if (playerIdsParam) {
        const playerIds = Array.isArray(playerIdsParam)
          ? playerIdsParam.map(Number)
          : typeof playerIdsParam === 'string'
          ? playerIdsParam.split(',').map(Number)
          : []

        if (playerIds.some(isNaN)) {
          res.status(400).json({ error: 'invalid player ids' })
          return
        }

        const players = await getPlayers(playerIds)

        if (!players || players.length === 0) {
          res.status(404).json({ error: 'no players found' })
          return
        }

        res.status(200).json(players)
      } else {
        const players = await getAllPlayers()

        if (!players) {
          res.status(404).json({ error: 'no players found' })
          return
        }

        res.status(200).json(players)
      }
    } catch (error) {
      console.error('error fetching players:', error)
      res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get a single player by their ID.
   * @route GET /api/players/:playerId
   * @param {number} playerId - The player ID.
   * @returns {Object} Response with the player data or an error message.
   */
  app.get('/api/players/:playerId', async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId, 10)

      if (isNaN(playerId) || playerId < 1) {
        res.status(400).json({ error: 'invalid player id' })
        return
      }

      const player = await getPlayer(playerId)

      if (!player) {
        res.status(404).json({ error: 'player not found' })
        return
      }

      res.status(200).json(player)
    } catch (error) {
      console.error(`error fetching player ${req.params.playerId}:`, error)
      res.status(500).json({ error: 'internal server error' })
    }
  })

  // --- player state routes --------------------------------------------------

  /**
   * Get the celestial location of a player by their ID.
   * @route GET /api/player-state/get-location/:playerId
   * @param {number} playerId - The ID of the player whose location is being fetched.
   * @returns {Object} Response with the player's location or an error message.
   */
  app.get('/api/player-state/get-location/:playerId', async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId, 10)

      if (isNaN(playerId) || playerId < 1) {
        res.status(400).json({ error: 'invalid player id' })
        return
      }

      const playerLocation = await getPlayerLocation(playerId)

      if (!playerLocation) {
        res.status(404).json({ error: 'no player location found' })
        return
      }

      res.status(200).json(playerLocation)
    } catch (error) {
      console.error(`error fetching player ${req.params.playerId}:`, error)
      res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Set the celestial location of a player by their ID.
   * @route POST /api/player-state/set-location/:playerId/:celestialId
   * @param {number} playerId - The ID of the player whose location is being updated.
   * @param {number} celestialId - The celestial ID of the new location to set for the player.
   * @returns {Object} Response with the result of setting the player's location or an error message.
   */
  app.post(
    '/api/player-state/set-location/:playerId/:celestialId',
    async (req, res) => {
      try {
        const playerId = parseInt(req.params.playerId, 10)
        const celestialId = parseInt(req.params.celestialId, 10)

        if (isNaN(playerId) || playerId < 1) {
          res.status(400).json({ error: 'invalid player id' })
          return
        }

        if (isNaN(celestialId) || celestialId < 1) {
          res.status(400).json({ error: 'invalid celestial id' })
          return
        }

        const playerLocationResult = await setPlayerLocation(
          playerId,
          celestialId
        )

        if (!playerLocationResult) {
          res.status(500).json({ error: 'error setting player location' })
          return
        }

        res.status(200).json(playerLocationResult)
      } catch (error) {
        const errorMsg = `error setting player id ${req.params.playerId} to celestial id ${req.params.celestialId}:`
        console.error(errorMsg, error)
        res.status(500).json({ error: 'internal server error' })
      }
    }
  )

  /**
   * Add a ship to the player's ship inventory.
   * @route POST /api/player-state/add-ship/:playerId/:shipTypeId
   * @param {number} playerId - The ID of the player.
   * @param {number} shipTypeId - The ID of the ship to add.
   * @param {number} stationId - ID of the station where the ship is docked.
   * @returns {Object} Response with the added player ship ID or an error message.
   */
  app.post(
    '/api/player-state/add-ship/:playerId/:shipTypeId/:stationId',
    async (req, res) => {
      try {
        const playerId = parseInt(req.params.playerId, 10)
        const shipTypeId = parseInt(req.params.shipTypeId, 10)
        const stationId = parseInt(req.params.stationId, 10)

        if (isNaN(playerId) || playerId < 1) {
          res.status(400).json({ error: 'invalid player id' })
          return
        }

        if (isNaN(shipTypeId) || shipTypeId < 1) {
          res.status(400).json({ error: 'invalid ship id' })
          return
        }

        if (isNaN(stationId) || stationId < 1) {
          res.status(400).json({ error: 'invalid station id' })
          return
        }

        const playerShipId = await addPlayerShip(
          playerId,
          shipTypeId,
          stationId
        )

        res.status(200).json({ player_ship_id: playerShipId })
      } catch (error) {
        if (error.message.includes('invalid location')) {
          res.status(400).json({ error: error.message })
          return
        }

        const errorMsg = `error adding ship type id ${req.params.shipTypeId} to player id ${req.params.playerId}:`
        console.error(errorMsg, error)
        res.status(500).json({ error: 'internal server error' })
      }
    }
  )

  /**
   * Get the ships owned by a player by their ID.
   * @route GET /api/player-state/get-ships/:playerId
   * @param {number} playerId - The ID of the player whose owned ships are being fetched.
   * @returns {Object} Response with the player's owned ships or an error message.
   */
  app.get('/api/player-state/get-ships/:playerId', async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId, 10)

      if (isNaN(playerId) || playerId < 1) {
        res.status(400).json({ error: 'invalid player id' })
        return
      }

      const playerShips = await getPlayerShips(playerId)

      if (!playerShips) {
        res.status(404).json({ error: 'no player ships found' })
        return
      }

      res.status(200).json(playerShips)
    } catch (error) {
      console.error(
        `error fetching ships for player ${req.params.playerId}:`,
        error
      )
      res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Set the active ship for a player by their ID.
   * If playerShipId is 0, the active ship is unset.
   * @route POST /api/player-state/set-active-ship/:playerId/:playerShipId
   * @param {number} playerId - The ID of the player whose active ship is being updated.
   * @param {number} playerShipId - The ID of the player ship to set as active. Use 0 to unset the active ship.
   * @returns {Object} Response with the result of setting the active ship or an error message.
   */
  app.post(
    '/api/player-state/set-active-ship/:playerId/:playerShipId',
    async (req, res) => {
      try {
        const playerId = parseInt(req.params.playerId, 10)
        const playerShipId = parseInt(req.params.playerShipId, 10)

        if (isNaN(playerId) || playerId < 1) {
          res.status(400).json({ error: 'invalid player ID' })
          return
        }

        let updatedActiveShipId = null

        if (playerShipId === 0) {
          await unsetActivePlayerShip(playerId)
        } else {
          const status = await setActivePlayerShip(playerId, playerShipId)
          updatedActiveShipId = status.updated_ship_id
        }

        res.status(200).json({ active_ship_id: updatedActiveShipId })
      } catch (error) {
        if (error.message.includes('invalid location')) {
          res.status(400).json({ error: error.message })
          return
        }

        console.error(
          `error setting active ship for player ${req.params.playerId}:`,
          error
        )
        res.status(500).json({ error: 'internal server error' })
      }
    }
  )

  /**
   * Get the active ship of a player by their ID.
   * @route GET /api/player-state/get-active-ship/:playerId
   * @param {number} playerId - The ID of the player whose active ship is being fetched.
   * @returns {Object} Response with the player's active ship or an error message.
   */
  app.get('/api/player-state/get-active-ship/:playerId', async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId, 10)

      if (isNaN(playerId) || playerId < 1) {
        res.status(400).json({ error: 'invalid player id' })
        return
      }

      const activePlayerShip = await getActivePlayerShip(playerId)

      if (!activePlayerShip) {
        res.status(404).json({ error: 'no player active ship found' })
        return
      }

      res.status(200).json(activePlayerShip)
    } catch (error) {
      console.error(`error fetching player ${req.params.playerId}:`, error)
      res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Initiate travel for a player to a new celestial location.
   * @route POST /api/player-state/initiate-travel/:playerId/:celestialId
   * @param {number} playerId - The ID of the player initiating travel.
   * @param {number} celestialId - The ID of the celestial destination.
   * @returns {Object} Response with the result of the travel initiation or an error message.
   */
  app.post(
    '/api/player-state/initiate-travel/:playerId/:celestialId',
    async (req, res) => {
      try {
        const playerId = parseInt(req.params.playerId, 10)
        const celestialId = parseInt(req.params.celestialId, 10)

        if (isNaN(playerId) || playerId < 1) {
          res.status(400).json({ error: 'invalid player id' })
          return
        }

        if (isNaN(celestialId) || celestialId < 1) {
          res.status(400).json({ error: 'invalid celestial id' })
          return
        }

        // TODO:

        // ## 1. get player's current location
        // const playerLocation = await getPlayerLocation(playerId)

        // check if player actually has a current location to travel from (they may not be in the universe yet):
        // if target_celestial_id is null, throw a 400 bad request

        // check if player is currently travelling using the timestamps:
        // playerLocation.departure_time: BIGINT | NULL
        // playerLocation.arrival_time: BIGINT | NULL

        // is travelling? use prev_celestial_id as the starting location
        // is not travelling? use target_celestial_id as the starting location

        // ## 2. get distance between starting location and destination w/ getDistanceBetweenCelestials()

        // ## 3. get player active ship stats (for speed, etc.)

        // ## 4. calculate travel duration based on distance and speed

        // ## 5. initiate travel w/ the calculated duration below:

        const playerTravelResult = await initiatePlayerTravel(
          playerId,
          celestialId,
          10 // TODO: use the calculated duration here
        )

        if (!playerTravelResult) {
          res.status(500).json({ error: 'error initiating player travel' })
          return
        }

        res.status(200).json(playerTravelResult)
      } catch (error) {
        const errorMsg = `error initiating travel for player id ${req.params.playerId} to celestial id ${req.params.celestialId}:`
        console.error(errorMsg, error)
        res.status(500).json({ error: 'internal server error' })
      }
    }
  )

  // --- run server -----------------------------------------------------------
  app.listen(PORT, () => {
    console.log(`\n📡 spacemfers server running on port ${PORT}\n`)
  })
}

main().catch(async error => {
  console.error(error)
  await client.end()
  process.exit(1)
})

process.on('SIGINT', async () => {
  console.log('\nshutting down spacemfers server...')
  await client.end()
  process.exit(0)
})
