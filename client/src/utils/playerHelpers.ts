import { DataObject } from '../types'

export const isTraveling = (player: DataObject) => {
  if (!player.arrival_time) return false
  const arrivalTime = Number(player.arrival_time) * 1000
  const currentTime = new Date().getTime()
  return currentTime < arrivalTime
}

export const getTravelProgress = (player: DataObject): number => {
  if (!isTraveling(player)) return 100

  const arrivalTime = Number(player.arrival_time) * 1000
  const departureTime = Number(player.departure_time) * 1000
  const currentTime = new Date().getTime()

  const totalTime = arrivalTime - departureTime
  const elapsedTime = currentTime - departureTime

  return Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100))
}
