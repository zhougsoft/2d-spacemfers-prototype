import { useEffect, useState } from 'react'
import {
  getAllShipTypes,
  getCelestial,
  getCelestialsByRoot,
  getPlayer,
  getPlayerShips,
} from '../api'

const TEST_PLAYER_ID = 1

type DataObject = Record<string, any> // generic type to hold TBD data from api

const PlayerDashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [player, setPlayer] = useState<DataObject | null>(null)
  const [playerLocation, setPlayerLocation] = useState<DataObject | null>(null)
  const [solarSystem, setSolarSystem] = useState<DataObject | null>(null)
  const [playerShips, setPlayerShips] = useState<DataObject | null>(null)
  const [activePlayerShip, setActivePlayerShip] = useState<DataObject | null>(
    null
  )

  // fetch player data from api data on component mount
  useEffect(() => {
    setIsLoading(true)
    getPlayer(TEST_PLAYER_ID)
      .then(setPlayer)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  // do stuff with the player data
  useEffect(() => {
    if (!player || !player.player_id) return

    // fetch player ship info
    getPlayerShips(player.player_id)
      .then(async ships => {
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
      .catch(console.error)

    // fetch player location info
    if (player.target_celestial_id) {
      getCelestial(player.target_celestial_id)
        .then(celestial => {
          setPlayerLocation(celestial)

          // get solar system data for player location
          getCelestial(celestial.root_celestial_id)
            .then(rootCelestial =>
              getCelestialsByRoot(rootCelestial.celestial_id).then(
                childrenCelestials => {
                  setSolarSystem({
                    ...rootCelestial,
                    children: childrenCelestials,
                  })
                }
              )
            )
            .catch(console.error)
        })
        .catch(console.error)
    } else {
      setPlayerLocation(null)
    }
  }, [player])

  if (isLoading) return <div>...</div>

  return (
    <>
      <h1>🚀 player dashboard</h1>
      <p>wip...</p>
      <hr />

      {player ? (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            border: '2px solid black',
            backgroundColor: '#f4f4f4',
            maxWidth: '100%',
          }}>
          <div style={{ border: '2px solid black', width: '100%' }}>
            <h3>player:</h3>
            <pre>{JSON.stringify(player, null, 2)}</pre>
            <br />
            <br />
            <br />
            <h3>player location:</h3>
            <pre>
              {playerLocation
                ? JSON.stringify(playerLocation, null, 2)
                : 'no location set'}
            </pre>
            <br />
            <br />
            <h3>player ships:</h3>
            <pre>
              {playerShips ? JSON.stringify(playerShips, null, 2) : 'no ships'}
            </pre>
            <br />
            <br />
            <h3>player active ship:</h3>
            <pre>
              {activePlayerShip
                ? JSON.stringify(activePlayerShip, null, 2)
                : 'no active ship'}
            </pre>
          </div>
          <div style={{ border: '2px solid black', width: '100%' }}>
            <h3>solar system</h3>
            <pre>
              {solarSystem
                ? JSON.stringify(solarSystem, null, 2)
                : 'no available solar system'}
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
