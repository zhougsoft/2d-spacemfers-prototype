import {
  createPlanet,
  createShip,
  createStation,
  createSystem,
} from './lib/universe'

export const createSolarSystem = async () => {
  const systemId = await createSystem('sol')
  if (!systemId) throw Error('error creating system')

  const mercuryResults = await createPlanet(systemId, 'mercury')
  if (!mercuryResults) throw Error('error creating mercury')

  const venusResults = await createPlanet(systemId, 'venus')
  if (!venusResults) throw Error('error creating venus')

  const earthResults = await createPlanet(systemId, 'earth')
  if (!earthResults) throw Error('error creating earth')

  const marsResults = await createPlanet(systemId, 'mars')
  if (!marsResults) throw Error('error creating mars')

  const jupiterResults = await createPlanet(systemId, 'jupiter')
  if (!jupiterResults) throw Error('error creating jupiter')

  const saturnResults = await createPlanet(systemId, 'saturn')
  if (!saturnResults) throw Error('error creating saturn')

  const uranusResults = await createPlanet(systemId, 'uranus')
  if (!uranusResults) throw Error('error creating uranus')

  const neptuneResults = await createPlanet(systemId, 'neptune')
  if (!neptuneResults) throw Error('error creating neptune')

  const plutoResults = await createPlanet(systemId, 'pluto')
  if (!plutoResults) throw Error('error creating pluto')

  const stationResult = await createStation(
    earthResults.planetId,
    'starter outpost'
  )
  if (!stationResult) throw Error('error creating station')
  const { stationId, locationId: stationLocationId } = stationResult

  return {
    systemId,
    planets: {
      mercury: {
        planetId: mercuryResults.planetId,
        locationId: mercuryResults.locationId,
      },
      venus: {
        planetId: venusResults.planetId,
        locationId: venusResults.locationId,
      },
      earth: {
        planetId: earthResults.planetId,
        locationId: earthResults.locationId,
      },
      mars: {
        planetId: marsResults.planetId,
        locationId: marsResults.locationId,
      },
      jupiter: {
        planetId: jupiterResults.planetId,
        locationId: jupiterResults.locationId,
      },
      saturn: {
        planetId: saturnResults.planetId,
        locationId: saturnResults.locationId,
      },
      uranus: {
        planetId: uranusResults.planetId,
        locationId: uranusResults.locationId,
      },
      neptune: {
        planetId: neptuneResults.planetId,
        locationId: neptuneResults.locationId,
      },
      pluto: {
        planetId: plutoResults.planetId,
        locationId: plutoResults.locationId,
      },
    },
    station: {
      stationId,
      stationLocationId,
    },
  }
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

  return {
    shuttleId,
    corvetteId,
    frigateId,
    cruiserId,
    haulerId,
  }
}
