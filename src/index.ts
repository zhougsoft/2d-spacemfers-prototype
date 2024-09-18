import cors from 'cors'
import express from 'express'
import { client, runQuery } from './db'
import { createPlayer } from './lib/players'
import { createSolarSystem } from './utils'

const PORT = 6969

const main = async () => {
  await client.connect()
  console.log('connected to database...')

  const app = express()
  app.use(cors())

  // --- db admin -------------------------------------------------------------
  app.get('/api/db-up', async (req, res) => {
    try {
      await runQuery('db-down.sql')
      await runQuery('db-up.sql')
      const solarSystem = await createSolarSystem()

      console.log('reset database')
      res.json({ solarSystem })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  app.get('/api/db-down', async (req, res) => {
    try {
      await runQuery('db-down.sql')

      console.log('dropped tables')
      res.json({ msg: 'success' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  // --- player routes --------------------------------------------------------
  app.post('/api/players/create', async (req, res) => {
    try {
      const playerId = await createPlayer()
      if (!playerId) throw Error('error creating player')

      console.log('created player - id:', playerId)
      res.json({ playerId })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  // TODO
  app.get('/api/players', async (req, res) => {
    res.json({ msg: 'ok' })
  })

  // TODO
  app.get('/api/players/:id', async (req, res) => {
    res.json({ msg: req.params.id })
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
