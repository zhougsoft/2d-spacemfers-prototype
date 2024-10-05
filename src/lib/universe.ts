import { runQuery } from '../db'

// TODO: create wrapper for create-celestial.sql & fix utils.ts
// celestials (celestial_type_id, parent_celestial_id, distance_from_parent, name)

const createCelestial = async (
  celestialTypeId: number,
  parentCelestialId: number | null,
  distanceFromParent: number
) => {
  if (typeof celestialTypeId !== 'number')
    throw Error('invalid celestial type id')
  if (typeof parentCelestialId !== 'number' && parentCelestialId !== null)
    throw Error('invalid parent celestial id')
  if (typeof distanceFromParent !== 'number' || distanceFromParent < 0)
    throw Error('invalid distance from parent')

  // TODO: implement
  console.log(
    'createCelestial',
    celestialTypeId,
    parentCelestialId,
    distanceFromParent
  )
}

export const createShipType = async (
  name: string,
  speed: number,
  size: number,
  maxCargoSize: number
) => {
  if (!name || typeof name !== 'string') throw Error('invalid ship name')
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
