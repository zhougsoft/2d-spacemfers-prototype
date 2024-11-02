import { DataObject } from '../types'

// TODO: the client-side timestamps are way off from what the server (postgres) is taking

export const isTraveling = (player: DataObject) => {
  if (!player.arrival_time) return false
  const arrivalTime = new Date(player.arrival_time)
  const now = new Date()
  return now < arrivalTime
}

export const getTravelProgress = (player: DataObject): number => {
  if (!isTraveling(player)) return 100

  const arrivalTime = new Date(player.arrival_time).getTime()
  const departureTime = new Date(player.departure_time).getTime()
  const now = new Date().getTime()
  1
  const totalTime = arrivalTime - departureTime
  const elapsed = now - departureTime

  return Math.min(100, Math.max(0, (elapsed / totalTime) * 100))
}
