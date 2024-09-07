import dotenv from 'dotenv'
import fs from 'fs/promises'
import { dirname, join } from 'path'
import pg from 'pg'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { Client } = pg

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PW,
  port: 5432,
})

const runQuery = async (filename, params = []) => {
  try {
    const filePath = join(__dirname, 'sql', filename)
    const query = await fs.readFile(filePath, 'utf-8')
    const result = await client.query(query, params)
    console.log(`query ${filename} result:`, result.rows)
    return result
  } catch (error) {
    console.error(`error executing query ${filename}:`, error)
  }
}

async function main() {
  try {
    await client.connect()
    console.log('connected to db')

    // --- RUN SQL QUERY FILES HERE -------------------------------------------
    await runQuery('db-up.sql')
    await runQuery('players/create-player.sql')
    // await runQuery('player-state/set-active-ship.sql', [1, 1])
    // await runQuery('db-down.sql')
    // ------------------------------------------------------------------------
  } catch (error) {
    console.error(error)
  } finally {
    await client.end()
    console.log('disconnected from db')
  }
}

main().catch(console.error)
