import { client, runQuery } from './db'

const main = async () => {
  try {
    await client.connect()

    // --- RUN SQL QUERY FILES HERE -------------------------------------------

    // refresh the db
    await runQuery('db-down.sql')
    await runQuery('db-up.sql')

    // create an initial star system
    const systemResult = await runQuery('systems/create-system.sql', ['sol'])
    if (!systemResult) throw Error('error creating star system')
    const systemId = systemResult[0].system_id
    if (typeof systemId !== 'number') throw Error('error creating star system')

    // create an initial planet in the system
    const planetResult = await runQuery('planets/create-planet.sql', [
      systemId,
      'earth',
    ])
    if (!planetResult) throw Error('error creating planet')
    const planetId = planetResult[0].planet_id
    if (typeof planetId !== 'number' || typeof planetId !== 'number')
      throw Error('error creating planet')

    // create some more planets for testing
    await runQuery('planets/create-planet.sql', [systemId, 'mars'])
    await runQuery('planets/create-planet.sql', [systemId, 'mercury'])
    await runQuery('planets/create-planet.sql', [systemId, 'venus'])

    // create a station to orbit the planet
    const stationResult = await runQuery('stations/create-station.sql', [
      planetId,
      'bingus outpost',
    ])
    if (!stationResult) throw Error('error creating station')
    const { station_id: stationId, location_id: stationLocationId } =
      stationResult[0]
    if (typeof stationId !== 'number') throw Error('error creating station')

    // create some more stations for testing
    await runQuery('stations/create-station.sql', [planetId, 'industry place'])
    await runQuery('stations/create-station.sql', [planetId, 'fleet hq'])

    // create an initial ship type
    const shipResult = await runQuery('ships/create-ship.sql', [
      'shuttle', // name
      10, // size
      100, // max_cargo_size
    ])
    if (!shipResult) throw Error('error creating ship')
    const shipId = shipResult[0].ship_id
    if (typeof shipId !== 'number') throw Error('error creating ship type')

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
    // ------------------------------------------------------------------------
  } catch (error) {
    console.error(error)
  } finally {
    await client.end()
  }
}

main().catch(console.error)
