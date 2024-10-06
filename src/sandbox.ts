import { client, runQuery } from './db'
import {
  createBelt,
  createMoon,
  createPlanet,
  createStar,
} from './lib/universe'

const main = async () => {
  await client.connect()
  console.log('connected to database...\n')

  await runQuery('db-down.sql')
  await runQuery('db-up.sql')

  const sunResult = await createStar('sun')
  const { celestial_id: sunId } = sunResult

  await createPlanet('mercury', sunId, 0.39)
  await createPlanet('venus', sunId, 0.79)

  const earthResult = await createPlanet('earth', sunId, 1)
  await createMoon('moon', earthResult.celestial_id, 0.25)

  const marsResult = await createPlanet('mars', sunId, 1.56)
  await createBelt('asteroid belt', marsResult.celestial_id, 1.6)

  const qGet = `SELECT * FROM celestials WHERE parent_celestial_id = ${sunId}`
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
