import { runQuery } from '../db'

export const createPlayer = async () => {
  const playerResult = await runQuery('players/create-player.sql')

  if (!playerResult) return null
  const { player_id } = playerResult[0]

  if (typeof player_id !== 'number') return null
  return player_id as number
}

export const getAllPlayers = async () => {
  const playersResult = await runQuery('players/get-all-players.sql')

  if (!playersResult || playersResult.length === 0) return null
  return playersResult
}

export const getPlayers = async (playerIds: number[]) => {
  const playersResult = await runQuery('players/get-players.sql', [playerIds])

  if (!playersResult || playersResult.length === 0) return null
  return playersResult
}

export const getPlayer = async (playerId: number) => {
  const playerResult = await runQuery('players/get-player.sql', [playerId])

  if (!playerResult || playerResult.length === 0) return null
  const player = playerResult[0]

  return player
}
