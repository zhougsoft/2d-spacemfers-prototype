import dotenv from 'dotenv'
import fs from 'fs'
import { dirname, join } from 'path'
import pg from 'pg'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { Client } = pg

export const client = new Client({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PW,
  port: 5432,
})

export const runQuery = async (
  filename: string,
  params: (number | string | boolean | null)[] = []
) => {
  try {
    const filePath = join(__dirname, 'sql', filename)
    const query = fs.readFileSync(filePath, 'utf-8')
    const result = await client.query(query, params)
    return result.rows
  } catch (error) {
    console.error(`error executing query ${filename}:`, error)
    return null
  }
}
