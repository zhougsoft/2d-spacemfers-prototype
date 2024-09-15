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
  condition: number,
  stationId: number | null
) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')
  if (typeof shipId !== 'number') throw Error('invalid ship id')
  if (typeof condition !== 'number') throw Error('invalid condition value')
  if (stationId && typeof condition !== 'number')
    throw Error('invalid station id')

  const playerShipResult = await runQuery(
    'player-state/add-player-owned-ship.sql',
    [playerId, shipId, condition, stationId]
  )

  if (!playerShipResult) return null
  const { player_ship_id } = playerShipResult[0]

  if (typeof player_ship_id !== 'number') return null
  return player_ship_id as number
}

export const setPlayerActiveShip = async (
  playerId: number,
  playerShipId: number
) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')
  if (typeof playerShipId !== 'number') throw Error('invalid player ship id')

  await runQuery('player-state/set-player-active-ship.sql', [
    playerId,
    playerShipId,
  ])
  return true
}
