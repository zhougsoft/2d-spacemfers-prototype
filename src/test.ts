import { client, runQuery } from './db'
import {
  addPlayerShip,
  getPlayerLocation,
  initiatePlayerTravel,
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

    // build the universes
    const solarSystem = await createSolarSystem()
    const { planets, station } = solarSystem
    const { stationId, stationLocationId } = station

    // create an initial ship type
    const shipName = 'shuttle'
    const shipSize = 10
    const shipMaxCargoSize = 100
    const shipId = await createShip(shipName, shipSize, shipMaxCargoSize)
    if (!shipId) throw Error('error creating ship')

    // create some players
    const player1Id = await createPlayer()
    const player2Id = await createPlayer()
    const player3Id = await createPlayer()
    if (!player1Id || !player2Id || !player3Id)
      throw Error('error creating players')

    // set locations for the players to the initial station
    const setLocationResult1 = await setPlayerLocation(
      player1Id,
      stationLocationId
    )
    const setLocationResult2 = await setPlayerLocation(
      player2Id,
      stationLocationId
    )
    const setLocationResult3 = await setPlayerLocation(
      player2Id,
      stationLocationId
    )
    if (!setLocationResult1 || !setLocationResult2 || !setLocationResult3)
      throw Error('error setting player locations')

    // give starter ships to the players
    const addShipArgs: [number, number, number] = [
      shipId,
      100, // starting condition 100%
      stationId,
    ]
    const ship1Id = await addPlayerShip(player1Id, ...addShipArgs)
    const ship2Id = await addPlayerShip(player2Id, ...addShipArgs)
    const ship3Id = await addPlayerShip(player3Id, ...addShipArgs)
    if (!ship1Id || !ship2Id || !ship3Id)
      throw Error('error adding player ships')

    // set the active ship for each player to their starter ship
    const setActiveShipResult1 = await setPlayerActiveShip(player1Id, ship1Id)
    const setActiveShipResult2 = await setPlayerActiveShip(player2Id, ship2Id)
    const setActiveShipResult3 = await setPlayerActiveShip(player3Id, ship3Id)
    if (!setActiveShipResult1 || !setActiveShipResult2 || !setActiveShipResult3)
      throw Error('error setting active player ships')

    // give player one some extra starter ships
    const extraShipResult1 = await addPlayerShip(player1Id, ...addShipArgs)
    const extraShipResult2 = await addPlayerShip(player1Id, ...addShipArgs)
    const extraShipResult3 = await addPlayerShip(player1Id, ...addShipArgs)
    if (!extraShipResult1 || !extraShipResult2 || !extraShipResult3)
      throw Error('error giving extra ships to player')

    // test the travel system
    const playerLocationData = await getPlayerLocation(1)
    if (!playerLocationData) throw Error('error getting player location')

    console.log('location before travel (idle):', playerLocationData)

    const playerLocationAfterTravel = await initiatePlayerTravel(
      player1Id,
      planets.uranus.locationId
    )
    if (!playerLocationAfterTravel)
      throw Error('error initiating player travel')

    console.log('location after travel initiated:', playerLocationAfterTravel)

    const playerLocationAfterTravelChange = await initiatePlayerTravel(
      1,
      planets.mars.locationId
    )
    if (!playerLocationAfterTravelChange)
      throw Error('error updating player travel')

    console.log(
      'location after travel changed while travelling:',
      playerLocationAfterTravelChange
    )

    // remove active ship for player one & try to travel (should fail)
    console.log('\ninitiating travel with no active ship (should fail)...\n')
    await setPlayerActiveShip(player1Id, null)
    const updatedPlayerLocationDataFail = await initiatePlayerTravel(
      player1Id,
      planets.earth.locationId
    )
    if (!updatedPlayerLocationDataFail)
      throw Error(
        'success! travel initation failed with no active ship, as expected :)'
      )
    // ------------------------------------------------------------------------
  } catch (error) {
    console.error(error)
  } finally {
    await client.end()
  }
}

main().catch(console.error)
