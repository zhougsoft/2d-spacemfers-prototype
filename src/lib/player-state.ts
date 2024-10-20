import { runQuery } from '../db'

export const setPlayerLocation = async (
  playerId: number,
  celestialId: number
) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')
  if (typeof celestialId !== 'number') throw Error('invalid celestial id')

  await runQuery('player-state/set-player-location.sql', [
    playerId,
    celestialId,
  ])
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

  const playerShipResult = await runQuery('player-state/add-player-ship.sql', [
    playerId,
    shipTypeId,
    stationId,
  ])

  if (!playerShipResult || playerShipResult.length === 0) {
    throw Error('error adding player ship')
  }

  const { status, player_ship_id } = playerShipResult[0]

  if (status === 'invalid_station') {
    throw new Error(
      'invalid location: ships can only be added to station celestials'
    )
  }

  if (status !== 'success') {
    throw new Error('error occurred while adding the ship')
  }

  return player_ship_id
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
  if (typeof playerId !== 'number') throw Error('Invalid player ID')
  if (playerShipId && typeof playerShipId !== 'number')
    throw Error('Invalid player ship ID')

  const result = await runQuery('player-state/set-active-player-ship.sql', [
    playerId,
    playerShipId,
  ])

  if (!result || result.length === 0) {
    throw Error('error setting active player ship')
  }

  const { status, updated_ship_id } = result[0]

  if (status === 'invalid_location') {
    throw new Error(
      'invalid location: player must be in the same location as the ship to set it as active'
    )
  }

  if (status !== 'success') {
    throw new Error(
      'unknown error occurred while trying to set the active ship'
    )
  }

  return updated_ship_id
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
