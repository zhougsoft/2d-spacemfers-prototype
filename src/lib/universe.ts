import { runQuery } from '../db'

export const createSystem = async (name: string) => {
  if (!name || typeof name !== 'string') throw Error('invalid system name')

  const systemResult = await runQuery('systems/create-system.sql', [name])

  if (!systemResult) return null
  return systemResult[0]
}

export const createPlanet = async (systemId: number, name: string) => {
  if (typeof systemId !== 'number') throw Error('invalid system id')
  if (!name || typeof name !== 'string') throw Error('invalid planet name')

  const planetResult = await runQuery('planets/create-planet.sql', [
    systemId,
    name,
  ])

  if (!planetResult) return null
  return planetResult[0]
}

export const createStation = async (planetId: number, name: string) => {
  if (typeof planetId !== 'number') throw Error('invalid planet id')
  if (!name || typeof name !== 'string') throw Error('invalid station name')

  const stationResult = await runQuery('stations/create-station.sql', [
    planetId,
    name,
  ])

  if (!stationResult) return null
  return stationResult[0]
}

export const createMoon = async (planetId: number, name: string) => {
  if (typeof planetId !== 'number') throw Error('invalid planet id')
  if (!name || typeof name !== 'string') throw Error('invalid moon name')

  const moonResult = await runQuery('moons/create-moon.sql', [planetId, name])

  if (!moonResult) return null
  return moonResult[0]
}

export const createBelt = async (planetId: number, name: string) => {
  if (typeof planetId !== 'number') throw Error('invalid planet id')
  if (!name || typeof name !== 'string') throw Error('invalid belt name')

  const beltResult = await runQuery('belts/create-belt.sql', [planetId, name])

  if (!beltResult) return null
  return beltResult[0]
}

export const createShip = async (
  name: string,
  speed: number,
  size: number,
  maxCargoSize: number
) => {
  if (!name || typeof name !== 'string') throw Error('invalid ship name')
  if (typeof speed !== 'number') throw Error('invalid ship speed')
  if (typeof size !== 'number') throw Error('invalid ship size')
  if (typeof maxCargoSize !== 'number') throw Error('invalid max cargo size')

  const shipResult = await runQuery('ships/create-ship.sql', [
    name,
    speed,
    size,
    maxCargoSize,
  ])

  if (!shipResult) return null
  return shipResult[0]
}

export const getLocation = async (locationId: number) => {
  if (typeof locationId !== 'number') throw Error('invalid location id')

  const locationResult = await runQuery('locations/get-location.sql', [
    locationId,
  ])

  if (!locationResult) return null
  return locationResult[0]
}

export const getStation = async (stationId: number) => {
  if (typeof stationId !== 'number') throw Error('invalid station id')

  const stationResult = await runQuery('stations/get-station.sql', [stationId])

  if (!stationResult) return null
  return stationResult[0]
}
