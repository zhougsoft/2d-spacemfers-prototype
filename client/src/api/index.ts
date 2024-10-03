const API_URL = 'http://localhost:6969'

const request = async (url: string, method?: string) => {
  try {
    const res = await fetch(url, {
      method: method ?? 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) throw new Error('network response was not ok')
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

// --- database admin -------------------------------------------------------

export const dbUp = async () => {
  const data = await request(`${API_URL}/api/db-up`)
  console.log(data)
  return data
}

export const dbDown = async () => {
  const data = await request(`${API_URL}/api/db-down`)
  console.log(data)
  return data
}

// --- universe admin -------------------------------------------------------

export const getAllLocations = async () => {
  const data = await request(`${API_URL}/api/locations`)
  console.log(data)
  return data
}

export const getLocation = async (locationId: number) => {
  const data = await request(`${API_URL}/api/locations/${locationId}`)
  console.log(data)
  return data
}

export const getAllSystems = async () => {
  const data = await request(`${API_URL}/api/systems`)
  console.log(data)
  return data
}

export const getSystem = async (systemId: number) => {
  const data = await request(`${API_URL}/api/systems/${systemId}`)
  console.log(data)
  return data as Record<string, any>
}

export const getPlanetsBySystem = async (systemId: number) => {
  const data = await request(`${API_URL}/api/planets/system/${systemId}`)
  console.log(data)
  return data
}

export const getPlanetByLocation = async (locationId: number) => {
  const data = await request(`${API_URL}/api/planets/location/${locationId}`)
  console.log(data)
  return data
}

export const getStationByLocation = async (locationId: number) => {
  const data = await request(`${API_URL}/api/stations/location/${locationId}`)
  console.log(data)
  return data
}

export const getMoonByLocation = async (locationId: number) => {
  const data = await request(`${API_URL}/api/moons/location/${locationId}`)
  console.log(data)
  return data
}

export const getBeltByLocation = async (locationId: number) => {
  const data = await request(`${API_URL}/api/belts/location/${locationId}`)
  console.log(data)
  return data
}

export const getAllShipTypes = async () => {
  const data = await request(`${API_URL}/api/ships`)
  console.log(data)
  return data
}

export const getShipType = async (shipId: number) => {
  const data = await request(`${API_URL}/api/ships/${shipId}`)
  console.log(data)
  return data
}

// --- player admin ---------------------------------------------------------

export const createPlayer = async () => {
  const data = await request(`${API_URL}/api/players/create`, 'POST')
  console.log(data)
  return data
}

export const getPlayers = async () => {
  const data = await request(`${API_URL}/api/players`)
  console.log(data)
  return data
}

export const getPlayer = async (playerId: number) => {
  const data = await request(`${API_URL}/api/players/${playerId}`)
  console.log(data)
  return data
}

// --- player state ---------------------------------------------------------

export const getPlayerLocation = async (playerId: number) => {
  const url = `${API_URL}/api/player-state/get-location/${playerId}`
  const data = await request(url)
  console.log(data)
  return data
}

export const setPlayerLocation = async (
  playerId: number,
  locationId: number
) => {
  const url = `${API_URL}/api/player-state/set-location/${playerId}/${locationId}`
  const data = await request(url, 'POST')
  console.log(data)
  return data
}

export const addPlayerShip = async (
  playerId: number,
  shipTypeId: number,
  stationId: number
) => {
  const url = `${API_URL}/api/player-state/add-ship/${playerId}/${shipTypeId}/${stationId}`
  const data = await request(url, 'POST')
  console.log(data)
  return data
}

export const getPlayerShips = async (playerId: number) => {
  const url = `${API_URL}/api/player-state/get-ships/${playerId}`
  const data = await request(url)
  console.log(data)
  return data
}

export const setActivePlayerShip = async (
  playerId: number,
  playerShipId: number
) => {
  const url = `${API_URL}/api/player-state/set-active-ship/${playerId}/${playerShipId}`
  const data = await request(url, 'POST')
  console.log(data)
  return data
}

export const getActivePlayerShip = async (playerId: number) => {
  const url = `${API_URL}/api/player-state/get-active-ship/${playerId}`
  const data = await request(url)
  console.log(data)
  return data
}

export const initiatePlayerTravel = async (
  playerId: number,
  locationId: number
) => {
  const url = `${API_URL}/api/player-state/initiate-travel/${playerId}/${locationId}`
  const data = await request(url, 'POST')
  console.log(data)
  return data
}
