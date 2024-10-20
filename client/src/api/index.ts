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

export const getAllCelestials = async () => {
  const data = await request(`${API_URL}/api/celestials`)
  console.log(data)
  return data
}

export const getCelestialsByRoot = async (rootCelestialId: number) => {
  const data = await request(
    `${API_URL}/api/celestials/${rootCelestialId}/root`
  )
  console.log(data)
  return data
}

export const getCelestial = async (celestialId: number) => {
  const data = await request(`${API_URL}/api/celestials/${celestialId}`)
  console.log(data)
  return data
}

export const getAllShipTypes = async () => {
  const data = await request(`${API_URL}/api/ships`)
  console.log(data)
  return data
}

export const getShipType = async (shipTypeId: number) => {
  const data = await request(`${API_URL}/api/ships/${shipTypeId}`)
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
  celestialId: number
) => {
  const url = `${API_URL}/api/player-state/set-location/${playerId}/${celestialId}`
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
  celestialId: number
) => {
  const url = `${API_URL}/api/player-state/initiate-travel/${playerId}/${celestialId}`
  const data = await request(url, 'POST')
  console.log(data)
  return data
}
