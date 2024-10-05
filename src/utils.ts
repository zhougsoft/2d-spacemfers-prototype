import { createShipType } from './lib/universe'

const CELESTIAL_TYPE = {
  STAR: 1,
  PLANET: 2,
  MOON: 3,
  BELT: 4,
  STATION: 5,
}

const systemData = {
  star: {
    celestial_type_id: CELESTIAL_TYPE.STAR,
    name: 'sun',
    distance_from_parent: 0,
    planets: [
      {
        celestial_type_id: CELESTIAL_TYPE.PLANET,
        name: 'mercury',
        distance_from_parent: 0.387104,
      },
      {
        celestial_type_id: CELESTIAL_TYPE.PLANET,
        name: 'venus',
        distance_from_parent: 0.723272,
      },
      {
        celestial_type_id: CELESTIAL_TYPE.PLANET,
        name: 'earth',
        distance_from_parent: 1.0,
        moons: [
          {
            celestial_type_id: CELESTIAL_TYPE.MOON,
            name: 'the moon',
            distance_from_parent: 0.00257,
          },
        ],
      },
      {
        celestial_type_id: CELESTIAL_TYPE.PLANET,
        name: 'mars',
        distance_from_parent: 1.523685,
      },
      {
        celestial_type_id: CELESTIAL_TYPE.BELT,
        name: 'asteroid belt',
        distance_from_parent: 2.697231,
      },
      {
        celestial_type_id: CELESTIAL_TYPE.PLANET,
        name: 'ceres',
        distance_from_parent: 2.765414,
      },
      {
        celestial_type_id: CELESTIAL_TYPE.PLANET,
        name: 'jupiter',
        distance_from_parent: 5.202815,
        moons: [
          {
            celestial_type_id: CELESTIAL_TYPE.MOON,
            name: 'io',
            distance_from_parent: 0.002819,
          },
          {
            celestial_type_id: CELESTIAL_TYPE.MOON,
            name: 'ganyemede',
            distance_from_parent: 0.007155,
          },
        ],
      },
      {
        celestial_type_id: CELESTIAL_TYPE.PLANET,
        name: 'saturn',
        distance_from_parent: 9.554949,
        moons: [
          {
            celestial_type_id: CELESTIAL_TYPE.MOON,
            name: 'titan',
            distance_from_parent: 0.008168,
          },
        ],
      },
      {
        celestial_type_id: CELESTIAL_TYPE.PLANET,
        name: 'uranus',
        distance_from_parent: 19.191383,
      },
      {
        celestial_type_id: CELESTIAL_TYPE.PLANET,
        name: 'neptune',
        distance_from_parent: 30.109386,
      },
      {
        celestial_type_id: CELESTIAL_TYPE.PLANET,
        name: 'pluto',
        distance_from_parent: 39.439064,
      },
      {
        celestial_type_id: CELESTIAL_TYPE.BELT,
        name: 'kuiper belt',
        distance_from_parent: 42.0,
      },
    ],
  },
}

// TODO: port this over to use celestials abstraction
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
    0.00257
  )
  if (!earthMoonResult) throw Error('error creating moon')

  const marsBeltResult = await createBelt(
    marsResults.planet_id,
    'asteroid belt',
    2.697231
  )
  if (!marsBeltResult) throw Error('error creating belt')

  return true
}

export const createGameShips = async () => {
  const shuttleId = await createShipType('shuttle', 500, 5000, 10)
  if (!shuttleId) throw Error('error creating shuttle')

  const corvetteId = await createShipType('corvette', 300, 15000, 125)
  if (!corvetteId) throw Error('error creating corvette')

  const frigateId = await createShipType('frigate', 400, 20000, 150)
  if (!frigateId) throw Error('error creating frigate')

  const cruiserId = await createShipType('cruiser', 200, 100000, 500)
  if (!cruiserId) throw Error('error creating cruiser')

  const haulerId = await createShipType('hauler', 100, 200000, 4000)
  if (!haulerId) throw Error('error creating hauler')

  return true
}
