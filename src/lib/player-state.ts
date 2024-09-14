import { runQuery } from '../db'

export const setPlayerLocation = async (
  playerId: number,
  locationId: number
) => {
  await runQuery('player-state/set-player-location.sql', [playerId, locationId])
  return true
}

export const addPlayerShip = async (
  playerId: number,
  shipId: number,
  condition: number,
  stationId: number | null
) => {
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
  await runQuery('player-state/set-player-active-ship.sql', [
    playerId,
    playerShipId,
  ])
  return true
}
