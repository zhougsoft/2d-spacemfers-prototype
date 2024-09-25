import { runQuery } from '../db'

export const setPlayerLocation = async (
  playerId: number,
  locationId: number
) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')
  if (typeof locationId !== 'number') throw Error('invalid location id')

  await runQuery('player-state/set-player-location.sql', [playerId, locationId])
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
  shipId: number,
  stationId: number
) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')
  if (typeof shipId !== 'number') throw Error('invalid ship id')
  if (typeof stationId !== 'number') throw Error('invalid station id')

  const playerShipResult = await runQuery(
    'player-state/add-player-owned-ship.sql',
    [playerId, shipId, stationId]
  )

  if (!playerShipResult) return null
  return playerShipResult[0]
}

export const setPlayerActiveShip = async (
  playerId: number,
  playerShipId: number | null = null
) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')
  if (playerShipId && typeof playerShipId !== 'number')
    throw Error('invalid player ship id')

  await runQuery('player-state/set-player-active-ship.sql', [
    playerId,
    playerShipId,
  ])
  return true
}

export const initiatePlayerTravel = async (
  playerId: number,
  locationId: number
) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')
  if (typeof locationId !== 'number') throw Error('invalid location id')

  const playerTravelResult = await runQuery(
    'player-state/initiate-player-travel.sql',
    [playerId, locationId]
  )

  if (!playerTravelResult) return null
  return playerTravelResult[0]
}
