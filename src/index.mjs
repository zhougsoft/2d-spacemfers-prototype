import pg from 'pg'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { Client } = pg

const client = new Client({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
})

async function runQuery(filename, params = []) {
  try {
    await client.connect()

    const filePath = join(__dirname, 'sql', filename)
    const query = await fs.readFile(filePath, 'utf-8')

    const result = await client.query(query, params)
    console.log('Query result:', result.rows)
  } catch (err) {
    console.error('Error executing query:', err)
  } finally {
    await client.end()
  }
}

// Example usage:
// runQuery('players/create-player.sql');
// runQuery('player-state/set-active-ship.sql', [1, 1]);
