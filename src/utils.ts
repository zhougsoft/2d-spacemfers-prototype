import { createShipType } from './lib/universe'

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

// TODO: create the solar system from starData
export const createSolarSystem = async () => {
  return true
}

export const createGameShips = async () => {
  const shuttle = await createShipType('shuttle', 500, 5000, 10)
  if (!shuttle) throw Error('error creating shuttle')

  const corvette = await createShipType('corvette', 300, 15000, 125)
  if (!corvette) throw Error('error creating corvette')

  const frigate = await createShipType('frigate', 400, 20000, 150)
  if (!frigate) throw Error('error creating frigate')

  const cruiser = await createShipType('cruiser', 200, 100000, 500)
  if (!cruiser) throw Error('error creating cruiser')

  const hauler = await createShipType('hauler', 100, 200000, 4000)
  if (!hauler) throw Error('error creating hauler')

  return true
}
