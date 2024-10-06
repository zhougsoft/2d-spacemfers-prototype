import { client, runQuery } from './db'
import { createSolarSystem } from './utils'

const main = async () => {
  await client.connect()
  console.log('connected to database...\n')

  await runQuery('db-down.sql')
  await runQuery('db-up.sql')
  await createSolarSystem()

  const q = `SELECT * FROM celestials`
  const result = await client.query(q)
  console.log(result.rows)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => {
    console.log('\nclosing database connection...')
    client.end()
  })
