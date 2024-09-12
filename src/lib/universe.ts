import { runQuery } from '../db'

export const createSystem = async (name: string) => {
  if (!name || typeof name !== 'string') throw Error('invalid system name')

  const systemResult = await runQuery('systems/create-system.sql', [name])
  const systemId = systemResult?.[0].system_id

  if (typeof systemId !== 'number') return null
  return systemId as number
}

export const createPlanet = async (systemId: number, name: string) => {
  if (!systemId || typeof systemId !== 'number')
    throw Error('invalid system id')
  if (!name || typeof name !== 'string') throw Error('invalid planet name')

  const planetResult = await runQuery('planets/create-planet.sql', [
    systemId,
    name,
  ])

  if (!planetResult) return null
  const { planet_id, location_id } = planetResult[0]

  if (typeof planet_id !== 'number' || typeof location_id !== 'number') {
    return null
  }

  return { planetId: planet_id as number, locationId: location_id as number }
}

export const createStation = async (planetId: number, name: string) => {
  if (!planetId || typeof planetId !== 'number')
    throw Error('invalid planet id')
  if (!name || typeof name !== 'string') throw Error('invalid station name')

  const stationResult = await runQuery('stations/create-station.sql', [
    planetId,
    name,
  ])

  if (!stationResult) return null
  const { station_id, location_id } = stationResult[0]

  if (typeof station_id !== 'number' || typeof location_id !== 'number') {
    return null
  }

  return { stationId: station_id as number, locationId: location_id as number }
}
