import { client, runQuery } from './db'
import {
  addPlayerShip,
  setPlayerActiveShip,
  setPlayerLocation,
} from './lib/player-state'
import { createPlayer } from './lib/players'
import { createShip } from './lib/universe'
import { createSolarSystem } from './utils'

const main = async () => {
  try {
    await client.connect()

    // reset the database
    await runQuery('db-down.sql')
    await runQuery('db-up.sql')

    // build the universe
    const solarSystem = await createSolarSystem()
    const { systemId, planets, station } = solarSystem

    // create an initial ship type
    const shipId = await createShip('shuttle', 10, 100)
    if (!shipId) throw Error('error creating ship')

    // create some players
    await createPlayer()
    await createPlayer()
    await createPlayer()

    // set locations for the players to the initial station
    await setPlayerLocation(1, station.stationLocationId)
    await setPlayerLocation(2, station.stationLocationId)
    await setPlayerLocation(3, station.stationLocationId)

    // give starter ships to the players
    const ship1Id = await addPlayerShip(1, shipId, 100, station.stationId)
    const ship2Id = await addPlayerShip(2, shipId, 100, station.stationId)
    const ship3Id = await addPlayerShip(3, shipId, 100, station.stationId)

    if (!ship1Id || !ship2Id || !ship3Id)
      throw Error('error adding player ships')

    // set the active ship for each player to their starter ship
    await setPlayerActiveShip(1, ship1Id)
    await setPlayerActiveShip(2, ship2Id)
    await setPlayerActiveShip(3, ship3Id)

    // give player one some extra starter ships
    await addPlayerShip(1, shipId, 100, station.stationId)
    await addPlayerShip(1, shipId, 100, station.stationId)

    // --- read some data ---

    // @ts-ignore
    const [playerOneLocation] = await runQuery(
      'player-state/get-player-location.sql',
      [1]
    )
    // @ts-ignore
    const [locationData] = await runQuery('locations/get-location.sql', [
      playerOneLocation.location_id,
    ])
    // @ts-ignore
    const [stationData] = await runQuery('stations/get-station.sql', [
      locationData.location_entity_id,
    ])

    console.log({ playerOneLocation, locationData, stationData })

    // --- end ----------------------------------------------------------------
  } catch (error) {
    console.error(error)
  } finally {
    await client.end()
  }
}

main().catch(console.error)
