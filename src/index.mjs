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

    // create some star systems
    const systemResult = await runQuery('systems/create-system.sql', ['sol'])
    const systemId = systemResult[0].system_id
    if (typeof systemId !== 'number') throw Error('error creating star system')

    // create some players
    await runQuery('players/create-player.sql')
    await runQuery('players/create-player.sql')
    await runQuery('players/create-player.sql')

    // set star system locations for the players
    await runQuery('player-state/set-location.sql', [1, systemId])
    await runQuery('player-state/set-location.sql', [2, systemId])
    await runQuery('player-state/set-location.sql', [3, systemId])

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
