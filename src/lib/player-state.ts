import { runQuery } from '../db'

export const setPlayerLocation = async (
  playerId: number,
  celestialId: number
) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')
  if (typeof celestialId !== 'number') throw Error('invalid celestial id')

  await runQuery('player-state/set-player-location.sql', [playerId, celestialId])
  return true
}

export const getPlayerLocation = async (playerId: number) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')

  const playerLocationResult = await runQuery(
    'player-state/get-player-location.sql',
    [playerId]
  )

  if (!playerLocationResult) return null
  return playerLocationResult[0]
}

export const addPlayerShip = async (
  playerId: number,
  shipTypeId: number,
  stationId: number
) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')
  if (typeof shipTypeId !== 'number') throw Error('invalid ship type id')
  if (typeof stationId !== 'number') throw Error('invalid station id')

  const playerShipResult = await runQuery(
    'player-state/add-player-ship.sql',
    [playerId, shipTypeId, stationId]
  )

  if (!playerShipResult) return null
  return playerShipResult[0]
}

export const getPlayerShips = async (playerId: number) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')

  const playerShipsResult = await runQuery(
    'player-state/get-player-ships.sql',
    [playerId]
  )

  if (!playerShipsResult) return null
  return playerShipsResult
}

export const setActivePlayerShip = async (
  playerId: number,
  playerShipId: number | null = null
) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')
  if (playerShipId && typeof playerShipId !== 'number')
    throw Error('invalid player ship id')

  await runQuery('player-state/set-active-player-ship.sql', [
    playerId,
    playerShipId,
  ])
  return true
}

export const getActivePlayerShip = async (playerId: number) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')

  const activePlayerShipResult = await runQuery(
    'player-state/get-active-player-ship.sql',
    [playerId]
  )

  if (!activePlayerShipResult) return null
  return activePlayerShipResult[0]
}

export const initiatePlayerTravel = async (
  playerId: number,
  celestialId: number
) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')
  if (typeof celestialId !== 'number') throw Error('invalid celestial id')

  const playerTravelResult = await runQuery(
    'player-state/initiate-player-travel.sql',
    [playerId, celestialId]
  )

  if (!playerTravelResult) return null
  return playerTravelResult[0]
}
