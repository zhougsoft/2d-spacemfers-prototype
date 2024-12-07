/**
 * Utility hook to calculate the inter-celestial travel status of a player based on their "slow state" timestamp data
 */

import { useState, useEffect, useMemo } from 'react'
import { DataObject } from '../types'

interface TravelStatus {
  isTraveling: boolean
  hasArrived: boolean
  progress: number
  remainingSeconds: number
  departureTime: number
  arrivalTime: number
  totalTravelTime: number
  elapsedTime: number
  formattedRemainingTime: string
}

const formatRemainingTime = (seconds: number): string => {
  if (seconds <= 0) return 'Arrived'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}

export const usePlayerCelestialTravel = (
  player: DataObject | null
): TravelStatus => {
  const [now, setNow] = useState(() => Date.now())

  const { departureTime, arrivalTime } = useMemo(
    () => ({
      departureTime: player?.departure_time
        ? Number(player.departure_time) * 1000
        : 0,
      arrivalTime: player?.arrival_time
        ? Number(player.arrival_time) * 1000
        : 0,
    }),
    [player?.departure_time, player?.arrival_time]
  )

  useEffect(() => {
    if (!arrivalTime) return

    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [arrivalTime])

  return useMemo(() => {
    if (!arrivalTime || !departureTime) {
      return {
        isTraveling: false,
        hasArrived: false,
        progress: 0,
        remainingSeconds: 0,
        departureTime: 0,
        arrivalTime: 0,
        totalTravelTime: 0,
        elapsedTime: 0,
        formattedRemainingTime: '',
      }
    }

    const totalTravelTime = arrivalTime - departureTime
    const elapsedTime = now - departureTime
    const remainingTime = arrivalTime - now

    const isTraveling = now < arrivalTime && now >= departureTime
    const hasArrived = now >= arrivalTime

    const progress = hasArrived
      ? 100
      : Math.min(100, Math.max(0, (elapsedTime / totalTravelTime) * 100))

    return {
      isTraveling,
      hasArrived,
      progress,
      remainingSeconds: Math.max(0, Math.ceil(remainingTime / 1000)),
      departureTime,
      arrivalTime,
      totalTravelTime,
      elapsedTime,
      formattedRemainingTime: formatRemainingTime(
        Math.max(0, Math.ceil(remainingTime / 1000))
      ),
    }
  }, [now, departureTime, arrivalTime])
}
