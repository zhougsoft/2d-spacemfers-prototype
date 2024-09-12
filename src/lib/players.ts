import { runQuery } from '../db'

export const createPlayer = async () => {
  const playerResult = await runQuery('players/create-player.sql')

  if (!playerResult) return null
  const { player_id } = playerResult[0]

  if (typeof player_id !== 'number') return null
  return player_id as number
}
