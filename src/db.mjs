import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()

const { Client } = pg

export const client = new Client({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PW,
  port: 5432,
})
