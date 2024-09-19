import cors from 'cors'
import express from 'express'
import { client, runQuery } from './db'
import {
  createPlayer,
  getAllPlayers,
  getPlayer,
  getPlayers,
} from './lib/players'
import { createSolarSystem } from './utils'

const PORT = 6969

const main = async () => {
  await client.connect()
  console.log('connected to database...')

  const app = express()
  app.use(cors())

  let solarSystem: Record<any, any> | null = null

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
      solarSystem = await createSolarSystem()

      console.log('reset database')
      res.json({ solarSystem })
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
      solarSystem = null

      console.log('dropped tables')
      res.json({ msg: 'success' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  // --- universe routes ------------------------------------------------------

  /**
   * Get the solar system data.
   * @route GET /api/solar-system
   * @returns {Object} Response with the solar system data or an error message.
   */
  app.get('/api/solar-system', async (_req, res) => {
    try {
      if (!solarSystem) {
        return res.status(404).json({ error: 'no solar system found' })
      }

      res.json(solarSystem)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  // --- player routes --------------------------------------------------------

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
      res.json({ playerId })
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

      if (isNaN(playerId)) {
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
