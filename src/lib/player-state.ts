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
      'invalid location: ships can only be added to station celestial locations'
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
  // Validate input
  if (typeof playerId !== 'number') throw new Error('invalid player id')
  if (playerShipId !== null && typeof playerShipId !== 'number')
    throw new Error('invalid player ship id')

  // Execute the query
  const result = await runQuery('player-state/set-active-player-ship.sql', [
    playerId,
    playerShipId,
  ])

  if (!result || result.length === 0 || !result[0]) {
    throw new Error('error setting active player ship')
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

  return { status, updated_ship_id }
}

export const unsetActivePlayerShip = async (playerId: number) => {
  if (typeof playerId !== 'number') throw new Error('invalid player id')

  const result = await runQuery('player-state/unset-active-player-ship.sql', [
    playerId,
  ])

  if (!result || result.length === 0 || !result[0]) {
    throw new Error('error unsetting active player ship')
  }

  const { status } = result[0]

  if (status === 'invalid_location') {
    throw new Error(
      'invalid location: player must be at a station to unset active ship'
    )
  }

  if (status === 'no_active_ship') {
    throw new Error(
      'no active ship: set an active ship before trying to unset it'
    )
  }

  if (status !== 'success') {
    throw new Error(
      'unknown error occurred while trying to unset the active ship'
    )
  }

  return status
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
  celestialId: number,
  travelDuration: number
) => {
  if (typeof playerId !== 'number') throw Error('invalid player id')
  if (typeof celestialId !== 'number') throw Error('invalid celestial id')
  if (typeof celestialId !== 'number' || travelDuration <= 0)
    throw Error('invalid travel duration')

  const playerTravelResult = await runQuery(
    'player-state/initiate-player-travel.sql',
    [playerId, celestialId, travelDuration]
  )

  if (!playerTravelResult) return null
  return playerTravelResult[0]
}
