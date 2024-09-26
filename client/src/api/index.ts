const API_URL = 'http://localhost:6969'

const request = async (url: string, method?: string) => {
  try {
    const res = await fetch(url, {
      method: method ?? 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
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

export const getSolarSystem = async () => {
  const data = await request(`${API_URL}/api/solar-system`)
  console.log(data)
  return data as Record<string, any>
}

export const getGameShips = async () => {
  const data = await request(`${API_URL}/api/game-ships`)
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
  shipId: number,
  stationId: number
) => {
  const url = `${API_URL}/api/player-state/add-ship/${playerId}/${shipId}/${stationId}`
  const data = await request(url, 'POST')
  console.log(data)
  return data
}

export const setActivePlayerShip = async (playerId: number, shipId: number) => {
  const url = `${API_URL}/api/player-state/set-active-ship/${playerId}/${shipId}`
  const data = await request(url, 'POST')
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
