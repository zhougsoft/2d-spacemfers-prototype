import {
  createBelt,
  createMoon,
  createPlanet,
  createShip,
  createStation,
  createSystem,
} from './lib/universe'

export const createSolarSystem = async () => {
  const systemName = 'sol'
  const systemResults = await createSystem(systemName)
  if (!systemResults) throw Error('error creating system')
  const systemId: number = systemResults.system_id

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

  const earthStationResult = await createStation(
    earthResults.planet_id,
    'international space station'
  )
  if (!earthStationResult) throw Error('error creating station')

  const earthMoonResult = await createMoon(earthResults.planet_id, 'the moon')
  if (!earthMoonResult) throw Error('error creating moon')

  const earthBeltResult = await createBelt(earthResults.planet_id, 'lil belt')
  if (!earthBeltResult) throw Error('error creating belt')

  return {
    systemId,
    systemName,
    planets: [
      {
        planetId: mercuryResults.planet_id,
        locationId: mercuryResults.location_id,
        name: 'mercury',
        description: 'mercury is the smallest planet and closest to the sun',
        color: '#b3b3b3',
        distance_from_star: 0.39,
        radius: 2440,
      },
      {
        planetId: venusResults.planet_id,
        locationId: venusResults.location_id,
        name: 'venus',
        description:
          'venus has a thick, toxic atmosphere and the hottest surface',
        color: '#e0c865',
        distance_from_star: 0.72,
        radius: 6052,
      },
      {
        planetId: earthResults.planet_id,
        locationId: earthResults.location_id,
        name: 'earth',
        description: 'earth is the only planet known to support life',
        color: '#2a6db8',
        distance_from_star: 1,
        radius: 6371,
        stations: [earthStationResult],
        moons: [earthMoonResult],
        belts: [earthBeltResult],
      },
      {
        planetId: marsResults.planet_id,
        locationId: marsResults.location_id,
        name: 'mars',
        description: 'mars is home to the tallest volcano in the solar system',
        color: '#d14c32',
        distance_from_star: 1.52,
        radius: 3390,
      },
      {
        planetId: jupiterResults.planet_id,
        locationId: jupiterResults.location_id,
        name: 'jupiter',
        description: 'jupiter is the largest planet with a massive storm',
        color: '#d5b495',
        distance_from_star: 5.2,
        radius: 69911,
      },
      {
        planetId: saturnResults.planet_id,
        locationId: saturnResults.location_id,
        name: 'saturn',
        description: 'saturn is famous for its prominent ring system',
        color: '#e3d9b7',
        distance_from_star: 9.58,
        radius: 58232,
      },
      {
        planetId: uranusResults.planet_id,
        locationId: uranusResults.location_id,
        name: 'uranus',
        description: 'uranus rotates on its side and has faint rings',
        color: '#82d4d4',
        distance_from_star: 19.22,
        radius: 25362,
      },
      {
        planetId: neptuneResults.planet_id,
        locationId: neptuneResults.location_id,
        name: 'neptune',
        description: 'neptune is the furthest planet and has strong winds',
        color: '#2e3b7b',
        distance_from_star: 30.05,
        radius: 24622,
      },
    ],
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
