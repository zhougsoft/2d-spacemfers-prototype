import { client, runQuery } from './db'
import {
  createPlanet,
  createShip,
  createStation,
  createSystem,
} from './lib/universe'

const main = async () => {
  try {
    await client.connect()

    // refresh the db
    await runQuery('db-down.sql')
    await runQuery('db-up.sql')

    // create an initial star system
    const systemId = await createSystem('sol')
    if (!systemId) throw Error('error creating system')

    // create an initial planet in the system
    const planetResults = await createPlanet(systemId, 'earth')
    if (!planetResults) throw Error('error creating planet')
    const { planetId } = planetResults

    // create some more planets for testing
    await createPlanet(systemId, 'mars')
    await createPlanet(systemId, 'mercury')
    await createPlanet(systemId, 'venus')

    // create a station to orbit the planet
    const stationResult = await createStation(planetId, 'trade hub')
    if (!stationResult) throw Error('error creating station')
    const { stationId, locationId: stationLocationId } = stationResult

    // create some more stations for testing
    await createStation(planetId, 'industry place')
    await createStation(planetId, 'fleet hq')

    // create an initial ship type
    const shipId = await createShip('shuttle', 10, 100)
    if (!shipId) throw Error('error creating ship')

    // create some players
    await runQuery('players/create-player.sql')
    await runQuery('players/create-player.sql')
    await runQuery('players/create-player.sql')

    // set locations for the players to the initial station
    await runQuery('player-state/set-player-location.sql', [
      1,
      stationLocationId,
    ])
    await runQuery('player-state/set-player-location.sql', [
      2,
      stationLocationId,
    ])
    await runQuery('player-state/set-player-location.sql', [
      3,
      stationLocationId,
    ])

    // give starter ships to the players
    // @ts-ignore
    const [{ player_ship_id: ship1Id }] = await runQuery(
      'player-state/add-player-owned-ship.sql',
      [1, shipId, 100, stationId]
    )
    // @ts-ignore
    const [{ player_ship_id: ship2Id }] = await runQuery(
      'player-state/add-player-owned-ship.sql',
      [2, shipId, 100, stationId]
    )
    // @ts-ignore
    const [{ player_ship_id: ship3Id }] = await runQuery(
      'player-state/add-player-owned-ship.sql',
      [3, shipId, 100, stationId]
    )

    // set the active ship for each player to their starter ship
    await runQuery('player-state/set-player-active-ship.sql', [1, ship1Id])
    await runQuery('player-state/set-player-active-ship.sql', [2, ship2Id])
    await runQuery('player-state/set-player-active-ship.sql', [3, ship3Id])

    // give player one some extra starter ships
    await runQuery('player-state/add-player-owned-ship.sql', [
      1,
      shipId,
      100,
      stationId,
    ])
    await runQuery('player-state/add-player-owned-ship.sql', [
      1,
      shipId,
      100,
      stationId,
    ])

    // read data
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
