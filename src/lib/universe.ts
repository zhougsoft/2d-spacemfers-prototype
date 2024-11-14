import { runQuery } from '../db'

export const getAllCelestials = async () => {
  const celestialsResult = await runQuery('celestials/get-all-celestials.sql')

  if (!celestialsResult) return null
  return celestialsResult
}

export const getCelestial = async (celestialId: number) => {
  if (typeof celestialId !== 'number') throw Error('invalid celestial id')

  const celestialResult = await runQuery('celestials/get-celestial.sql', [
    celestialId,
  ])

  if (!celestialResult) return null
  return celestialResult[0]
}

export const getCelestialsByRoot = async (rootCelestialId: number) => {
  const celestialsResult = await runQuery(
    'celestials/get-celestials-by-root.sql',
    [rootCelestialId]
  )

  if (!celestialsResult) return null
  return celestialsResult
}

export const getDistanceBetweenCelestials = async (
  celestialId1: number,
  celestialId2: number
) => {
  if (typeof celestialId1 !== 'number') throw Error('invalid celestial id')
  if (typeof celestialId2 !== 'number') throw Error('invalid celestial id')

  const distanceResult = await runQuery(
    'celestials/get-distance-between-celestials.sql',
    [celestialId1, celestialId2]
  )

  if (!distanceResult) return null
  return distanceResult[0]
}

export const createStar = async (name: string) => {
  if (!name || typeof name !== 'string') throw Error('invalid name')

  const starResult = await runQuery('celestials/stars/create-star.sql', [name])

  if (!starResult) return null
  return starResult[0]
}

export const getAllStars = async () => {
  const starsResult = await runQuery('celestials/stars/get-all-stars.sql')

  if (!starsResult) return null
  return starsResult
}

export const getStar = async (celestialId: number) => {
  if (typeof celestialId !== 'number') throw Error('invalid celestial id')

  const starResult = await runQuery('celestials/stars/get-star.sql', [
    celestialId,
  ])

  if (!starResult) return null
  return starResult[0]
}

export const createPlanet = async (
  name: string,
  parentCelestialId: number,
  distanceToParent: number
) => {
  if (!name || typeof name !== 'string') throw Error('invalid name')
  if (typeof parentCelestialId !== 'number') throw Error('invalid parent id')
  if (typeof distanceToParent !== 'number')
    throw Error('invalid distance to parent')

  const planetResult = await runQuery('celestials/planets/create-planet.sql', [
    name,
    parentCelestialId,
    distanceToParent,
  ])

  if (!planetResult) return null
  return planetResult[0]
}

export const getPlanet = async (celestialId: number) => {
  if (typeof celestialId !== 'number') throw Error('invalid celestial id')

  const planetResult = await runQuery('celestials/planets/get-planet.sql', [
    celestialId,
  ])

  if (!planetResult) return null
  return planetResult[0]
}

export const createMoon = async (
  name: string,
  parentCelestialId: number,
  distanceToParent: number
) => {
  if (!name || typeof name !== 'string') throw Error('invalid name')
  if (typeof parentCelestialId !== 'number') throw Error('invalid parent id')
  if (typeof distanceToParent !== 'number')
    throw Error('invalid distance to parent')

  const moonResult = await runQuery('celestials/moons/create-moon.sql', [
    name,
    parentCelestialId,
    distanceToParent,
  ])

  if (!moonResult) return null
  return moonResult[0]
}

export const getMoon = async (celestialId: number) => {
  if (typeof celestialId !== 'number') throw Error('invalid celestial id')

  const moonResult = await runQuery('celestials/moons/get-moon.sql', [
    celestialId,
  ])

  if (!moonResult) return null
  return moonResult[0]
}

export const createBelt = async (
  name: string,
  parentCelestialId: number,
  distanceToParent: number
) => {
  if (!name || typeof name !== 'string') throw Error('invalid name')
  if (typeof parentCelestialId !== 'number') throw Error('invalid parent id')
  if (typeof distanceToParent !== 'number')
    throw Error('invalid distance to parent')

  const beltResult = await runQuery('celestials/belts/create-belt.sql', [
    name,
    parentCelestialId,
    distanceToParent,
  ])

  if (!beltResult) return null
  return beltResult[0]
}

export const getBelt = async (celestialId: number) => {
  if (typeof celestialId !== 'number') throw Error('invalid celestial id')

  const beltResult = await runQuery('celestials/belts/get-belt.sql', [
    celestialId,
  ])

  if (!beltResult) return null
  return beltResult[0]
}

export const createStation = async (
  name: string,
  parentCelestialId: number,
  distanceToParent: number
) => {
  if (!name || typeof name !== 'string') throw Error('invalid name')
  if (typeof parentCelestialId !== 'number') throw Error('invalid parent id')
  if (typeof distanceToParent !== 'number')
    throw Error('invalid distance to parent')

  const stationResult = await runQuery(
    'celestials/stations/create-station.sql',
    [name, parentCelestialId, distanceToParent]
  )

  if (!stationResult) return null
  return stationResult[0]
}

export const getStation = async (celestialId: number) => {
  if (typeof celestialId !== 'number') throw Error('invalid celestial id')

  const stationResult = await runQuery('celestials/stations/get-station.sql', [
    celestialId,
  ])

  if (!stationResult) return null
  return stationResult[0]
}

export const createShipType = async (
  name: string,
  speed: number,
  size: number,
  maxCargoSize: number
) => {
  if (!name || typeof name !== 'string') throw Error('invalid name')
  if (typeof speed !== 'number') throw Error('invalid ship speed')
  if (typeof size !== 'number') throw Error('invalid ship size')
  if (typeof maxCargoSize !== 'number') throw Error('invalid max cargo size')

  const shipTypeResult = await runQuery('ships/create-ship-type.sql', [
    name,
    speed,
    size,
    maxCargoSize,
  ])

  if (!shipTypeResult) return null
  return shipTypeResult[0]
}

export const getAllShipTypes = async () => {
  const shipTypesResult = await runQuery('ships/get-all-ship-types.sql')

  if (!shipTypesResult) return null
  return shipTypesResult
}

export const getShipType = async (shipTypeId: number) => {
  if (typeof shipTypeId !== 'number') throw Error('invalid ship id')

  const shipTypeResult = await runQuery('ships/get-ship-type.sql', [shipTypeId])

  if (!shipTypeResult) return null
  return shipTypeResult[0]
}
