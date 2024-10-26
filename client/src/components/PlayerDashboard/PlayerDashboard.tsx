import { useEffect, useState } from 'react'
import {
  getAllShipTypes,
  getCelestial,
  getCelestialsByRoot,
  getPlayer,
  getPlayerShips,
} from '../../api'
import { DataObject } from '../../types'
import SolarSystemMap from './SolarSystemMap'

/*

TODO: render out formatted player data, something like this:

---
Player Overview:
- Location: International Space Station (Station)
- Active Ship: Corvette (Speed: 300, Cargo: 125)
---

---
Ships:
| Ship Type    | Speed (km/h) | Cargo Size | Location                     | Active?  |
|--------------|--------------|------------|---------------------------- -|----------|
| Shuttle      | 500          | 10         | International Space Station  | No       |
| Hauler       | 100          | 4000       | International Space Station  | No       |
| Corvette     | 300          | 125        | [player location]            | Yes      |
---


*/

const TEST_PLAYER_ID = 1

const buildSolarSystemTree = (
  rootCelestial: DataObject,
  celestials: DataObject[]
): any => {
  const children = celestials
    .filter(
      celestial => celestial.parent_celestial_id === rootCelestial.celestial_id
    )
    .map(child => buildSolarSystemTree(child, celestials))

  return {
    ...rootCelestial,
    ...(children.length > 0 && { children }),
  }
}

const PlayerDashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [player, setPlayer] = useState<DataObject | null>(null)
  const [playerLocation, setPlayerLocation] = useState<DataObject | null>(null)
  const [solarSystem, setSolarSystem] = useState<DataObject | null>(null)
  const [playerShips, setPlayerShips] = useState<DataObject | null>(null)
  const [activePlayerShip, setActivePlayerShip] = useState<DataObject | null>(
    null
  )

  // fetching all req'd API data in this nasty useEffect on component mount
  useEffect(() => {
    setIsLoading(true)
    getPlayer(TEST_PLAYER_ID)
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
                  const tree = buildSolarSystemTree(
                    rootCelestial,
                    childrenCelestials
                  )

                  setSolarSystem(tree)
                }
              )
            )
          })
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <div>...</div>

  return (
    <>
      <h1>🚀 player dashboard</h1>
      <hr />
      {player ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '100%',
            marginBottom: '1.5rem',
            padding: '1rem',
          }}>
          <div
            style={{
              width: '100%',
              border: '2px solid white',
              padding: '0 0 2rem 1rem',
            }}>
            <h3>solar system</h3>
            {solarSystem ? (
              <SolarSystemMap solarSystem={solarSystem} />
            ) : (
              'no available solar system'
            )}
          </div>

          <hr style={{ width: '100%' }} />

          <div
            style={{
              width: '100%',
              border: '2px solid white',
              padding: '0 0 2rem 1rem',
            }}>
            <h3>player:</h3>
            <pre>{JSON.stringify(player, null, 2)}</pre>
            <h3>player location:</h3>
            <pre>
              {playerLocation
                ? JSON.stringify(playerLocation, null, 2)
                : 'no location set'}
            </pre>
            <h3>player ships:</h3>
            <pre>
              {playerShips ? JSON.stringify(playerShips, null, 2) : 'no ships'}
            </pre>
            <h3>player active ship:</h3>
            <pre>
              {activePlayerShip
                ? JSON.stringify(activePlayerShip, null, 2)
                : 'no active ship'}
            </pre>
          </div>
        </div>
      ) : (
        <div>no player...</div>
      )}
    </>
  )
}

export default PlayerDashboard
