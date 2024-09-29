import { runQuery } from '../db'

export const createSystem = async (name: string) => {
  if (!name || typeof name !== 'string') throw Error('invalid system name')

  const systemResult = await runQuery('systems/create-system.sql', [name])

  if (!systemResult) return null
  const { system_id } = systemResult[0]

  if (typeof system_id !== 'number') return null
  return system_id as number
}

export const createPlanet = async (systemId: number, name: string) => {
  if (typeof systemId !== 'number') throw Error('invalid system id')
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
  if (typeof planetId !== 'number') throw Error('invalid planet id')
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

export const createMoon = async (planetId: number, name: string) => {
  if (typeof planetId !== 'number') throw Error('invalid planet id')
  if (!name || typeof name !== 'string') throw Error('invalid moon name')

  const moonResult = await runQuery('moons/create-moon.sql', [planetId, name])

  if (!moonResult) return null
  const { moon_id, location_id } = moonResult[0]

  if (typeof moon_id !== 'number' || typeof location_id !== 'number') {
    return null
  }

  return { moonId: moon_id as number, locationId: location_id as number }
}

export const createBelt = async (planetId: number, name: string) => {
  if (typeof planetId !== 'number') throw Error('invalid planet id')
  if (!name || typeof name !== 'string') throw Error('invalid belt name')

  const beltResult = await runQuery('belts/create-belt.sql', [planetId, name])

  if (!beltResult) return null
  const { belt_id, location_id } = beltResult[0]

  if (typeof belt_id !== 'number' || typeof location_id !== 'number') {
    return null
  }

  return { beltId: belt_id as number, locationId: location_id as number }
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
  const { ship_id } = shipResult[0]

  if (typeof ship_id !== 'number') return null
  return ship_id as number
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
