import { client, runQuery } from './db'

import { createCelestial } from './lib/universe'

const main = async () => {
  await client.connect()
  console.log('connected to database...\n')

  await runQuery('db-down.sql')
  await runQuery('db-up.sql')

  const sunResult = await createCelestial('sun', 1, null, 0)
  const earthResult = await createCelestial('earth', 2, sunResult.celestial_id, 1)
  await createCelestial('moon', 3, earthResult.celestial_id, 0.00257)

  const qGet = `SELECT * FROM celestials`
  const result = await client.query(qGet)
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
