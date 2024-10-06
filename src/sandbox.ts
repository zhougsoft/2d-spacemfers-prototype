/*

🚧 SANDBOX TESTING STUFF ZONE SCRIPT 🚧

*/

import { client, runQuery } from './db'
import { createSolarSystem } from './utils'
import { getAllCelestials, getCelestial } from './lib/universe'

const main = async () => {
  await client.connect()
  console.log('connected to database...\n')

  await runQuery('db-down.sql')
  await runQuery('db-up.sql')
  await createSolarSystem()

  const celestials = await getAllCelestials()
  if (!celestials) throw Error('no celestials found')
  console.log({ celestials })

  const firstCelestial = await getCelestial(celestials[0].celestial_id)
  console.log({ firstCelestial })
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
