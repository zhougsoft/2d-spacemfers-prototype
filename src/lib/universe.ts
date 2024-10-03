import { runQuery } from '../db'

export const getAllLocations = async () => {
  const locationsResult = await runQuery('locations/get-all-locations.sql')

  if (!locationsResult) return null
  return locationsResult
}

export const getLocation = async (locationId: number) => {
  if (typeof locationId !== 'number') throw Error('invalid location id')

  const locationResult = await runQuery('locations/get-location.sql', [
    locationId,
  ])

  if (!locationResult) return null
  return locationResult[0]
}

export const createSystem = async (name: string) => {
  if (!name || typeof name !== 'string') throw Error('invalid system name')

  const systemResult = await runQuery('systems/create-system.sql', [name])

  if (!systemResult) return null
  return systemResult[0]
}

export const getAllSystems = async () => {
  const systemsResult = await runQuery('systems/get-all-systems.sql')

  if (!systemsResult) return null
  return systemsResult[0]
}

export const getSystem = async (systemId: number) => {
  if (typeof systemId !== 'number') throw Error('invalid system id')

  const systemResult = await runQuery('systems/get-system.sql', [systemId])

  if (!systemResult) return null
  return systemResult[0]
}

export const createPlanet = async (
  systemId: number,
  name: string,
  distanceFromStarAU: number
) => {
  if (typeof systemId !== 'number') throw Error('invalid system id')
  if (!name || typeof name !== 'string') throw Error('invalid planet name')
  if (typeof distanceFromStarAU !== 'number')
    throw Error('invalid AU distance from star')

  const planetResult = await runQuery('planets/create-planet.sql', [
    systemId,
    name,
    distanceFromStarAU,
  ])

  if (!planetResult) return null
  return planetResult[0]
}

export const getPlanetsBySystem = async (systemId: number) => {
  if (typeof systemId !== 'number') throw Error('invalid system id')

  const planetResults = await runQuery('planets/get-planets-by-system.sql', [
    systemId,
  ])

  if (!planetResults) return null
  return planetResults
}

export const getPlanet = async (planetId: number) => {
  if (typeof planetId !== 'number') throw Error('invalid planet id')

  const planetResult = await runQuery('planets/get-planet.sql', [planetId])

  if (!planetResult) return null
  return planetResult[0]
}

export const getPlanetByLocation = async (locationId: number) => {
  if (typeof locationId !== 'number') throw Error('invalid location id')

  const planetResult = await runQuery('planets/get-planet-by-location.sql', [
    locationId,
  ])

  if (!planetResult) return null
  return planetResult[0]
}

export const createStation = async (
  planetId: number,
  name: string,
  distanceFromPlanetKM: number
) => {
  if (typeof planetId !== 'number') throw Error('invalid planet id')
  if (!name || typeof name !== 'string') throw Error('invalid station name')
  if (typeof distanceFromPlanetKM !== 'number')
    throw Error('invalid KM distance from planet')

  const stationResult = await runQuery('stations/create-station.sql', [
    planetId,
    name,
    distanceFromPlanetKM,
  ])

  if (!stationResult) return null
  return stationResult[0]
}

export const getStation = async (stationId: number) => {
  if (typeof stationId !== 'number') throw Error('invalid station id')

  const stationResult = await runQuery('stations/get-station.sql', [stationId])

  if (!stationResult) return null
  return stationResult[0]
}

export const getStationByLocation = async (locationId: number) => {
  if (typeof locationId !== 'number') throw Error('invalid location id')

  const stationResult = await runQuery('stations/get-station-by-location.sql', [
    locationId,
  ])

  if (!stationResult) return null
  return stationResult[0]
}

export const createMoon = async (
  planetId: number,
  name: string,
  distanceFromPlanetKM: number
) => {
  if (typeof planetId !== 'number') throw Error('invalid planet id')
  if (!name || typeof name !== 'string') throw Error('invalid moon name')
  if (typeof distanceFromPlanetKM !== 'number')
    throw Error('invalid KM distance from planet')

  const moonResult = await runQuery('moons/create-moon.sql', [
    planetId,
    name,
    distanceFromPlanetKM,
  ])

  if (!moonResult) return null
  return moonResult[0]
}

export const getMoon = async (moonId: number) => {
  if (typeof moonId !== 'number') throw Error('invalid moon id')

  const moonResult = await runQuery('moons/get-moon.sql', [moonId])

  if (!moonResult) return null
  return moonResult[0]
}

export const getMoonByLocation = async (locationId: number) => {
  if (typeof locationId !== 'number') throw Error('invalid location id')

  const moonResult = await runQuery('moons/get-moon-by-location.sql', [
    locationId,
  ])

  if (!moonResult) return null
  return moonResult[0]
}

export const createBelt = async (
  planetId: number,
  name: string,
  distanceFromPlanetKM: number
) => {
  if (typeof planetId !== 'number') throw Error('invalid planet id')
  if (!name || typeof name !== 'string') throw Error('invalid belt name')
  if (typeof distanceFromPlanetKM !== 'number')
    throw Error('invalid KM distance from planet')

  const beltResult = await runQuery('belts/create-belt.sql', [
    planetId,
    name,
    distanceFromPlanetKM,
  ])

  if (!beltResult) return null
  return beltResult[0]
}

export const getBelt = async (beltId: number) => {
  if (typeof beltId !== 'number') throw Error('invalid belt id')

  const beltResult = await runQuery('belts/get-belt.sql', [beltId])

  if (!beltResult) return null
  return beltResult[0]
}

export const getBeltByLocation = async (locationId: number) => {
  if (typeof locationId !== 'number') throw Error('invalid location id')

  const beltResult = await runQuery('belts/get-belt-by-location.sql', [
    locationId,
  ])

  if (!beltResult) return null
  return beltResult[0]
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
