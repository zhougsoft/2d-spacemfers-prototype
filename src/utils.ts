import {
  createBelt,
  createMoon,
  createPlanet,
  createShipType,
  createStar,
  createStation,
} from './lib/universe'

const CELESTIAL_TYPE = {
  STAR: 1,
  PLANET: 2,
  MOON: 3,
  BELT: 4,
  STATION: 5,
}

const starData = {
  celestial_type_id: CELESTIAL_TYPE.STAR,
  name: 'sun',
  distance_from_parent: 0,
  children: [
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
      children: [
        {
          celestial_type_id: CELESTIAL_TYPE.STATION,
          name: 'international space station',
          distance_from_parent: 0.000239,
        },
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
      children: [
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
      children: [
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
}

const createChildCelestial = async (
  typeId: number,
  name: string,
  parentId: number,
  distanceFromParent: number
) => {
  let celestialResult = null

  switch (typeId) {
    case CELESTIAL_TYPE.PLANET:
      celestialResult = await createPlanet(name, parentId, distanceFromParent)
      break
    case CELESTIAL_TYPE.MOON:
      celestialResult = await createMoon(name, parentId, distanceFromParent)
      break
    case CELESTIAL_TYPE.BELT:
      celestialResult = await createBelt(name, parentId, distanceFromParent)
      break
    case CELESTIAL_TYPE.STATION:
      celestialResult = await createStation(name, parentId, distanceFromParent)
      break
    default:
      throw Error('invalid celestial type')
  }

  if (!celestialResult) throw Error(`failed to create celestial: ${name}`)

  const { celestial_id } = celestialResult
  return celestial_id as number
}

export const createSolarSystem = async () => {
  const sunResult = await createStar(starData.name)
  const { celestial_id: sunId } = sunResult

  for (const starChild of starData.children) {
    const { celestial_type_id, name, distance_from_parent } = starChild

    const celestialId = await createChildCelestial(
      celestial_type_id,
      name,
      sunId,
      distance_from_parent
    )

    if (!starChild.children?.length) continue

    for (const starChildChild of starChild.children) {
      const { celestial_type_id, name, distance_from_parent } = starChildChild

      await createChildCelestial(
        celestial_type_id,
        name,
        celestialId,
        distance_from_parent
      )
    }
  }

  return true
}

export const createGameShips = async () => {
  await createShipType('shuttle', 500, 5000, 10)
  await createShipType('corvette', 300, 15000, 125)
  await createShipType('frigate', 400, 20000, 150)
  await createShipType('cruiser', 200, 100000, 500)
  await createShipType('hauler', 100, 200000, 4000)
  return true
}
