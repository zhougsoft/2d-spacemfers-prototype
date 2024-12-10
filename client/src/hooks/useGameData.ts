import { useEffect, useState } from 'react'
import {
  getAllShipTypes,
  getCelestial,
  getCelestialsByRoot,
  getPlayer,
  getPlayerShips,
} from '../api'
import { DataIndex, DataObject } from '../types'

const buildStarSystemTree = (
  rootCelestial: DataObject,
  celestials: DataObject[]
): any => {
  const children = celestials
    .filter(
      celestial => celestial.parent_celestial_id === rootCelestial.celestial_id
    )
    .map(child => buildStarSystemTree(child, celestials))

  return {
    ...rootCelestial,
    ...(children.length > 0 && { children }),
  }
}

export const useGameData = (playerId: number) => {
  const [isLoading, setIsLoading] = useState(false)

  const [starSystemIndex, setStarSystemIndex] = useState<DataIndex | null>(null)
  const [starSystemTree, setStarSystemTree] = useState<DataObject | null>(null)

  const [player, setPlayer] = useState<DataObject | null>(null)
  const [playerLocation, setPlayerLocation] = useState<DataObject | null>(null)
  const [playerShips, setPlayerShips] = useState<DataObject | null>(null)
  const [activePlayerShip, setActivePlayerShip] = useState<DataObject | null>(
    null
  )

  const refreshData = (callback?: () => void) => {
    setIsLoading(true)
    getPlayer(playerId)
      .then(player => {
        if (!player || !player.player_id) {
          console.warn('no player found')
          return
        }

        setPlayer(player)

        getPlayerShips(player.player_id).then(async ships => {
          if (ships?.length) {
            const shipTypeData = await getAllShipTypes()
            const shipTypeMap: Record<number, any> = shipTypeData.reduce(
              (acc: any, shipType: any) => {
                acc[shipType.ship_type_id] = shipType
                return acc
              },
              {}
            )

            setPlayerShips(
              ships.map((ship: any) => ({
                ...ship,
                ship_type: shipTypeMap[ship.ship_type_id],
              }))
            )

            if (player.active_ship_id) {
              const activeShip = ships.find(
                (ship: any) => ship.player_ship_id === player.active_ship_id
              )

              if (activeShip)
                setActivePlayerShip({
                  ...activeShip,
                  ship_type: shipTypeMap[activeShip.ship_type_id],
                })
            }
          }
        })

        // fetch player location info
        if (player.target_celestial_id) {
          getCelestial(player.target_celestial_id).then(celestial => {
            setPlayerLocation(celestial)

            // get solar system data for player location
            getCelestial(celestial.root_celestial_id).then(rootCelestial =>
              getCelestialsByRoot(rootCelestial.celestial_id).then(
                childrenCelestials => {
                  const tree = buildStarSystemTree(
                    rootCelestial,
                    childrenCelestials
                  )

                  const celestialsIndexedById = [
                    rootCelestial,
                    ...childrenCelestials,
                  ].reduce((acc: any, celestial: any) => {
                    acc[celestial.celestial_id] = celestial
                    return acc
                  }, {})

                  setStarSystemIndex(celestialsIndexedById)
                  setStarSystemTree(tree)
                }
              )
            )
          })
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false)
        if (callback) callback()
      })
  }

  useEffect(() => {
    refreshData()
  }, [])

  return {
    isLoading,
    starSystemIndex,
    starSystemTree,
    player,
    playerLocation,
    playerShips,
    activePlayerShip,
    refreshData,
  }
}
