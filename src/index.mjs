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

    // create an initial planet in the system
    const planetResult = await runQuery('planets/create-planet.sql', [
      systemId,
      'earth',
    ])
    const planetId = planetResult[0].planet_id
    if (typeof planetId !== 'number') throw Error('error creating planet')

    // create a station to orbit the planet
    const stationResult = await runQuery('stations/create-station.sql', [
      planetId,
      'bingus outpost',
    ])
    const stationId = stationResult[0].station_id
    if (typeof stationId !== 'number') throw Error('error creating station')

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

    // give starter ships to the players
    const [{ player_ship_id: ship1Id }] = await runQuery(
      'player-state/add-owned-ship.sql',
      [1, shipId, 100, stationId]
    )
    const [{ player_ship_id: ship2Id }] = await runQuery(
      'player-state/add-owned-ship.sql',
      [2, shipId, 100, stationId]
    )
    const [{ player_ship_id: ship3Id }] = await runQuery(
      'player-state/add-owned-ship.sql',
      [3, shipId, 100, stationId]
    )

    // set the active ship for each player to their starter ship
    await runQuery('player-state/set-active-ship.sql', [1, ship1Id])
    await runQuery('player-state/set-active-ship.sql', [2, ship2Id])
    await runQuery('player-state/set-active-ship.sql', [3, ship3Id])

    // give player one some extra starter ships
    await runQuery('player-state/add-owned-ship.sql', [
      1,
      shipId,
      100,
      stationId,
    ])
    await runQuery('player-state/add-owned-ship.sql', [
      1,
      shipId,
      100,
      stationId,
    ])

    // read data
    const allPlayers = await runQuery('players/get-all-players.sql')
    const playerOneOwnedShips = await runQuery(
      'player-state/get-owned-ships.sql',
      [1]
    )
    const playerOneActiveShip = await runQuery(
      'player-state/get-active-ship.sql',
      [1]
    )

    console.log({ allPlayers, playerOneOwnedShips, playerOneActiveShip })
    // ------------------------------------------------------------------------
  } catch (error) {
    console.error(error)
  } finally {
    await client.end()
    console.log('disconnected from db')
  }
}

main().catch(console.error)
