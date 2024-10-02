import cors from 'cors'
import express from 'express'
import { client, runQuery } from './db'
import {
  addPlayerShip,
  getPlayerLocation,
  initiatePlayerTravel,
  setPlayerActiveShip,
  setPlayerLocation,
} from './lib/player-state'
import {
  createPlayer,
  getAllPlayers,
  getPlayer,
  getPlayers,
} from './lib/players'
import {
  getAllLocations,
  getAllShips,
  getAllSystems,
  getBeltByLocation,
  getLocation,
  getMoonByLocation,
  getPlanetByLocation,
  getShip,
  getStationByLocation,
  getSystem,
} from './lib/universe'
import { createGameShips, createSolarSystem } from './utils'

const PORT = 6969

const main = async () => {
  await client.connect()
  console.log('connected to database...')

  const app = express()
  app.use(cors())

  // some in-memory state for easy access
  let solarSystem: Record<any, any> | null = null
  let gameShips: Record<any, any> | null = null

  // --- db admin routes ------------------------------------------------------

  /**
   * Reset the database by dropping and recreating all tables, and creating a new solar system.
   * @route GET /api/db-up
   * @returns {Object} Response with the new solar system data.
   */
  app.get('/api/db-up', async (_req, res) => {
    try {
      await runQuery('db-down.sql')
      await runQuery('db-up.sql')
      console.log('reset database')

      solarSystem = await createSolarSystem()
      gameShips = await createGameShips()

      res.json({ solarSystem, gameShips })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  /**
   * Drop all tables in the database.
   * @route GET /api/db-down
   * @returns {Object} Response with a success message.
   */
  app.get('/api/db-down', async (_req, res) => {
    try {
      await runQuery('db-down.sql')
      console.log('dropped tables')

      // clear in-memory state
      solarSystem = null
      gameShips = null

      res.json({ msg: 'success' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  // --- universe admin routes ------------------------------------------------

  /**
   * Get all locations in the game.
   * @route GET /api/locations
   * @returns {Object} Response with the locations data or an error message.
   */
  app.get('/api/locations', async (_req, res) => {
    try {
      const locations = await getAllLocations()

      if (!locations) {
        return res.status(404).json({ error: 'locations not found' })
      }

      return res.status(200).json(locations)
    } catch (error) {
      console.error(`error fetching locations:`, error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get data for a location by its ID.
   * @route GET /api/locations/:id
   * @param {number} id - The location ID.
   * @returns {Object} Response with the location data or an error message.
   */
  app.get('/api/locations/:id', async (req, res) => {
    try {
      const locationId = parseInt(req.params.id, 10)

      if (isNaN(locationId) || locationId < 1) {
        return res.status(400).json({ error: 'invalid location id' })
      }

      const location = await getLocation(locationId)

      if (!location) {
        return res.status(404).json({ error: 'location not found' })
      }

      return res.status(200).json(location)
    } catch (error) {
      console.error(`error fetching location ${req.params.id}:`, error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get all star systems in the game.
   * @route GET /api/systems
   * @returns {Object} Response with the star systems data or an error message.
   */
  app.get('/api/systems', async (_req, res) => {
    try {
      const systems = await getAllSystems()

      if (!systems) {
        return res.status(404).json({ error: 'star systems not found' })
      }

      return res.status(200).json(systems)
    } catch (error) {
      console.error(`error fetching star systems:`, error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get data for a star system by its ID.
   * @route GET /api/systems/:id
   * @param {number} id - The star system ID.
   * @returns {Object} Response with the star system data or an error message.
   */
  app.get('/api/systems/:id', async (req, res) => {
    try {
      const systemId = parseInt(req.params.id, 10)

      if (isNaN(systemId) || systemId < 1) {
        return res.status(400).json({ error: 'invalid system id' })
      }

      const system = await getSystem(systemId)

      if (!system) {
        return res.status(404).json({ error: 'system not found' })
      }

      return res.status(200).json(system)
    } catch (error) {
      console.error(`error fetching system ${req.params.id}:`, error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get a single planet by its location ID.
   * @route GET /api/planets/:locationId
   * @param {number} id - The planet location ID.
   * @returns {Object} Response with the planet data or an error message.
   */
  app.get('/api/planets/:locationId', async (req, res) => {
    try {
      const locationId = parseInt(req.params.locationId, 10)

      if (isNaN(locationId) || locationId < 1) {
        return res.status(400).json({ error: 'invalid location id' })
      }

      const planet = await getPlanetByLocation(locationId)

      if (!planet) {
        return res.status(404).json({ error: 'planet not found' })
      }

      return res.status(200).json(planet)
    } catch (error) {
      const msg = `error fetching planet location ${req.params.locationId}:`
      console.error(msg, error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get a single station by its location ID.
   * @route GET /api/stations/:locationId
   * @param {number} id - The station location ID.
   * @returns {Object} Response with the station data or an error message.
   */
  app.get('/api/stations/:locationId', async (req, res) => {
    try {
      const locationId = parseInt(req.params.locationId, 10)

      if (isNaN(locationId) || locationId < 1) {
        return res.status(400).json({ error: 'invalid location id' })
      }

      const station = await getStationByLocation(locationId)

      if (!station) {
        return res.status(404).json({ error: 'station not found' })
      }

      return res.status(200).json(station)
    } catch (error) {
      const msg = `error fetching station ${req.params.locationId}:`
      console.error(msg, error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get a single moon by its location ID.
   * @route GET /api/moons/:locationId
   * @param {number} id - The moon location ID.
   * @returns {Object} Response with the moon data or an error message.
   */
  app.get('/api/moons/:locationId', async (req, res) => {
    try {
      const locationId = parseInt(req.params.locationId, 10)

      if (isNaN(locationId) || locationId < 1) {
        return res.status(400).json({ error: 'invalid location id' })
      }

      const moon = await getMoonByLocation(locationId)

      if (!moon) {
        return res.status(404).json({ error: 'moon not found' })
      }

      return res.status(200).json(moon)
    } catch (error) {
      const msg = `error fetching moon ${req.params.locationId}:`
      console.error(msg, error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get a single belt by its location ID.
   * @route GET /api/belts/:locationId
   * @param {number} id - The belt location ID.
   * @returns {Object} Response with the belt data or an error message.
   */
  app.get('/api/belts/:locationId', async (req, res) => {
    try {
      const locationId = parseInt(req.params.locationId, 10)

      if (isNaN(locationId) || locationId < 1) {
        return res.status(400).json({ error: 'invalid location id' })
      }

      const belt = await getBeltByLocation(locationId)

      if (!belt) {
        return res.status(404).json({ error: 'belt not found' })
      }

      return res.status(200).json(belt)
    } catch (error) {
      const msg = `error fetching belt ${req.params.locationId}:`
      console.error(msg, error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get all ships in the game.
   * @route GET /api/ships
   * @returns {Object} Response with the ships data or an error message.
   */
  app.get('/api/ships', async (_req, res) => {
    try {
      const ships = await getAllShips()

      if (!ships) {
        return res.status(404).json({ error: 'ships not found' })
      }

      return res.status(200).json(ships)
    } catch (error) {
      console.error(`error fetching ships:`, error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get data for a ship by its ID.
   * @route GET /api/ships/:id
   * @param {number} id - The ship ID.
   * @returns {Object} Response with the ship data or an error message.
   */
  app.get('/api/ships/:id', async (req, res) => {
    try {
      const shipId = parseInt(req.params.id, 10)

      if (isNaN(shipId) || shipId < 1) {
        return res.status(400).json({ error: 'invalid ship id' })
      }

      const ship = await getShip(shipId)

      if (!ship) {
        return res.status(404).json({ error: 'ship not found' })
      }

      return res.status(200).json(ship)
    } catch (error) {
      console.error(`error fetching ship ${req.params.id}:`, error)
      return res.status(500).json({ error: 'internal server error' })
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
          return res.status(400).json({ error: 'invalid player ids' })
        }

        const players = await getPlayers(playerIds)

        if (!players || players.length === 0) {
          return res.status(404).json({ error: 'no players found' })
        }

        return res.status(200).json(players)
      } else {
        const players = await getAllPlayers()

        if (!players) {
          return res.status(404).json({ error: 'no players found' })
        }

        return res.status(200).json(players)
      }
    } catch (error) {
      console.error('error fetching players:', error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Get a single player by their ID.
   * @route GET /api/players/:id
   * @param {number} id - The player ID.
   * @returns {Object} Response with the player data or an error message.
   */
  app.get('/api/players/:id', async (req, res) => {
    try {
      const playerId = parseInt(req.params.id, 10)

      if (isNaN(playerId) || playerId < 1) {
        return res.status(400).json({ error: 'invalid player id' })
      }

      const player = await getPlayer(playerId)

      if (!player) {
        return res.status(404).json({ error: 'player not found' })
      }

      return res.status(200).json(player)
    } catch (error) {
      console.error(`error fetching player ${req.params.id}:`, error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  // --- player state routes --------------------------------------------------

  /**
   * Get the location of a player by their ID.
   * @route GET /api/player-state/get-location/:playerId
   * @param {number} playerId - The ID of the player whose location is being fetched.
   * @returns {Object} Response with the player's location or an error message.
   */
  app.get('/api/player-state/get-location/:playerId', async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId, 10)

      if (isNaN(playerId) || playerId < 1) {
        return res.status(400).json({ error: 'invalid player id' })
      }

      const playerLocation = await getPlayerLocation(playerId)

      if (!playerLocation) {
        return res.status(404).json({ error: 'no player location found' })
      }

      return res.status(200).json(playerLocation)
    } catch (error) {
      console.error(`error fetching player ${req.params.playerId}:`, error)
      return res.status(500).json({ error: 'internal server error' })
    }
  })

  /**
   * Set the location of a player by their ID.
   * @route POST /api/player-state/set-location/:playerId/:locationId
   * @param {number} playerId - The ID of the player whose location is being updated.
   * @param {number} locationId - The ID of the new location to set for the player.
   * @returns {Object} Response with the result of setting the player's location or an error message.
   */
  app.post(
    '/api/player-state/set-location/:playerId/:locationId',
    async (req, res) => {
      try {
        const playerId = parseInt(req.params.playerId, 10)
        const locationId = parseInt(req.params.locationId, 10)

        if (isNaN(playerId) || playerId < 1) {
          return res.status(400).json({ error: 'invalid player id' })
        }

        if (isNaN(locationId) || locationId < 1) {
          return res.status(400).json({ error: 'invalid location id' })
        }

        const playerLocationResult = await setPlayerLocation(
          playerId,
          locationId
        )

        if (!playerLocationResult) {
          return res
            .status(500)
            .json({ error: 'error setting player location' })
        }

        return res.status(200).json(playerLocationResult)
      } catch (error) {
        const errorMsg = `error setting player id ${req.params.playerId} to location id ${req.params.locationId}:`
        console.error(errorMsg, error)
        return res.status(500).json({ error: 'internal server error' })
      }
    }
  )

  /**
   * Add a ship to the player's ship inventory.
   * @route POST /api/player-state/add-ship/:playerId/:shipId
   * @param {number} playerId - The ID of the player.
   * @param {number} shipId - The ID of the ship to add.
   * @param {number} stationId - ID of the station where the ship is docked.
   * @returns {Object} Response with the added player ship ID or an error message.
   */
  app.post(
    '/api/player-state/add-ship/:playerId/:shipId/:stationId',
    async (req, res) => {
      try {
        const playerId = parseInt(req.params.playerId, 10)
        const shipId = parseInt(req.params.shipId, 10)
        const stationId = parseInt(req.params.stationId, 10)

        if (isNaN(playerId) || playerId < 1) {
          return res.status(400).json({ error: 'invalid player id' })
        }

        if (isNaN(shipId) || shipId < 1) {
          return res.status(400).json({ error: 'invalid ship id' })
        }

        if (isNaN(stationId) || stationId < 1) {
          return res.status(400).json({ error: 'invalid station id' })
        }

        const playerShipResult = await addPlayerShip(
          playerId,
          shipId,
          stationId
        )

        if (!playerShipResult) {
          return res.status(500).json({ error: 'error adding player ship' })
        }

        return res.status(200).json(playerShipResult)
      } catch (error) {
        const errorMsg = `error adding ship id ${req.params.shipId} to player id ${req.params.playerId}:`
        console.error(errorMsg, error)
        return res.status(500).json({ error: 'internal server error' })
      }
    }
  )

  /**
   * Set the active ship for a player by their ID.
   * If ship ID 0 is passed, it will unset the active ship.
   * @route POST /api/player-state/set-active-ship/:playerId/:shipId
   * @param {number} playerId - The ID of the player whose active ship is being updated.
   * @param {number} shipId - The ID of the ship to set as active. Use 0 to unset the active ship.
   * @returns {Object} Response with the result of setting the active ship or an error message.
   */
  app.post(
    '/api/player-state/set-active-ship/:playerId/:shipId',
    async (req, res) => {
      try {
        const playerId = parseInt(req.params.playerId, 10)
        const shipId = parseInt(req.params.shipId, 10)

        if (isNaN(playerId) || playerId < 1) {
          return res.status(400).json({ error: 'invalid player id' })
        }

        if (isNaN(shipId) || shipId < 0) {
          return res.status(400).json({ error: 'invalid active ship id' })
        }

        const activeShipId = shipId === 0 ? null : shipId

        const playerActiveShipResult = await setPlayerActiveShip(
          playerId,
          activeShipId
        )

        if (!playerActiveShipResult) {
          return res
            .status(500)
            .json({ error: 'error setting player active ship' })
        }

        return res.status(200).json(playerActiveShipResult)
      } catch (error) {
        const errorMsg = `error setting ship id ${req.params.shipId} as player id ${req.params.playerId} active ship:`
        console.error(errorMsg, error)
        return res.status(500).json({ error: 'internal server error' })
      }
    }
  )

  /**
   * Initiate travel for a player to a new location.
   * @route POST /api/player-state/initiate-travel/:playerId/:locationId
   * @param {number} playerId - The ID of the player initiating travel.
   * @param {number} locationId - The ID of the destination location.
   * @returns {Object} Response with the result of the travel initiation or an error message.
   */
  app.post(
    '/api/player-state/initiate-travel/:playerId/:locationId',
    async (req, res) => {
      try {
        const playerId = parseInt(req.params.playerId, 10)
        const locationId = parseInt(req.params.locationId, 10)

        if (isNaN(playerId) || playerId < 1) {
          return res.status(400).json({ error: 'invalid player id' })
        }

        if (isNaN(locationId) || locationId < 1) {
          return res.status(400).json({ error: 'invalid location id' })
        }

        const playerTravelResult = await initiatePlayerTravel(
          playerId,
          locationId
        )

        if (!playerTravelResult) {
          return res
            .status(500)
            .json({ error: 'error initiating player travel' })
        }

        return res.status(200).json(playerTravelResult)
      } catch (error) {
        const errorMsg = `error initiating travel for player id ${req.params.playerId} to location id ${req.params.locationId}:`
        console.error(errorMsg, error)
        return res.status(500).json({ error: 'internal server error' })
      }
    }
  )

  // --- run server -----------------------------------------------------------
  app.listen(PORT, () => {
    console.log(`\n📡 spacemfers server running on port ${PORT}\n`)
  })
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})

process.on('SIGINT', async () => {
  console.log('\nshutting down spacemfers server...')
  await client.end()
  process.exit(0)
})
