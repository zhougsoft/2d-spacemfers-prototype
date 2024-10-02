import {
  createBelt,
  createMoon,
  createPlanet,
  createShip,
  createStation,
  createSystem,
} from './lib/universe'

export const createSolarSystem = async () => {
  const systemResults = await createSystem('sol')
  if (!systemResults) throw Error('error creating system')
  const systemId: number = systemResults.system_id

  const mercuryResults = await createPlanet(systemId, 'mercury', 0.39)
  if (!mercuryResults) throw Error('error creating mercury')

  const venusResults = await createPlanet(systemId, 'venus', 0.72)
  if (!venusResults) throw Error('error creating venus')

  const earthResults = await createPlanet(systemId, 'earth', 1)
  if (!earthResults) throw Error('error creating earth')

  const marsResults = await createPlanet(systemId, 'mars', 1.52)
  if (!marsResults) throw Error('error creating mars')

  const jupiterResults = await createPlanet(systemId, 'jupiter', 5.2)
  if (!jupiterResults) throw Error('error creating jupiter')

  const saturnResults = await createPlanet(systemId, 'saturn', 9.58)
  if (!saturnResults) throw Error('error creating saturn')

  const uranusResults = await createPlanet(systemId, 'uranus', 19.22)
  if (!uranusResults) throw Error('error creating uranus')

  const neptuneResults = await createPlanet(systemId, 'neptune', 30.05)
  if (!neptuneResults) throw Error('error creating neptune')

  const earthStationResult = await createStation(
    earthResults.planet_id,
    'international space station',
    10000
  )
  if (!earthStationResult) throw Error('error creating station')

  const earthMoonResult = await createMoon(
    earthResults.planet_id,
    'the moon',
    384400
  )
  if (!earthMoonResult) throw Error('error creating moon')

  const marsBeltResult = await createBelt(
    marsResults.planet_id,
    'the main belt',
    50000000
  )
  if (!marsBeltResult) throw Error('error creating belt')

  return true
}

export const createGameShips = async () => {
  const shuttleId = await createShip('shuttle', 500, 5000, 10)
  if (!shuttleId) throw Error('error creating shuttle')

  const corvetteId = await createShip('corvette', 300, 15000, 125)
  if (!corvetteId) throw Error('error creating corvette')

  const frigateId = await createShip('frigate', 400, 20000, 150)
  if (!frigateId) throw Error('error creating frigate')

  const cruiserId = await createShip('cruiser', 200, 100000, 500)
  if (!cruiserId) throw Error('error creating cruiser')

  const haulerId = await createShip('hauler', 100, 200000, 4000)
  if (!haulerId) throw Error('error creating hauler')

  return true
}
