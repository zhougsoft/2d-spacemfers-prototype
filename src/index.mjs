import fs from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { client } from './db.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const runQuery = async (filename, params = []) => {
  try {
    const filePath = join(__dirname, 'sql', filename)
    const query = await fs.readFile(filePath, 'utf-8')
    const result = await client.query(query, params)
    return result.rows
  } catch (error) {
    console.error(`error executing query ${filename}:`, error)
  }
}

const main = async () => {
  try {
    await client.connect()
    console.log('connected to db')

    // --- RUN SQL QUERY FILES HERE -------------------------------------------

    // refresh the db
    await runQuery('db-down.sql')
    await runQuery('db-up.sql')

    // create an initial star system
    const systemResult = await runQuery('systems/create-system.sql', ['sol'])
    const systemId = systemResult[0].system_id
    if (typeof systemId !== 'number') throw Error('error creating star system')

    // create an initial ship type
    const shipResult = await runQuery('ships/create-ship.sql', [
      'shuttle', // name
      10, // size
      100, // max_cargo_size
    ])
    const shipId = shipResult[0].ship_id
    if (typeof shipId !== 'number') throw Error('error creating ship type')

    // create some players
    await runQuery('players/create-player.sql')
    await runQuery('players/create-player.sql')
    await runQuery('players/create-player.sql')

    // set star system locations for the players
    await runQuery('player-state/set-location.sql', [1, systemId])
    await runQuery('player-state/set-location.sql', [2, systemId])
    await runQuery('player-state/set-location.sql', [3, systemId])

    // TODO: player ships - make the players own a shuttle, then make it their active ship
    // will have to edit two tables: player_ships and player_active_ship

    // read the data
    const results = await runQuery('players/get-all-players.sql')
    console.log({ results })
    // ------------------------------------------------------------------------
  } catch (error) {
    console.error(error)
  } finally {
    await client.end()
    console.log('disconnected from db')
  }
}

main().catch(console.error)
