import { useEffect, useState } from 'react'
import { getActivePlayerShip, getPlayer } from '../api'

type DataObject = Record<string, any> // generic type to hold TBD data from api

const TEST_PLAYER_ID = 1

const PlayerDashboard = () => {
  const [isLoading, setIsLoading] = useState(false)

  const [player, setPlayer] = useState<DataObject | null>(null)
  const [playerLocation, setPlayerLocation] = useState<DataObject | null>(null)
  const [playerShip, setPlayerShip] = useState<DataObject | null>(null)

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
    if (!player) return

    if (player.target_celestial_id) {
      console.log('todo: implement player target location fetching')
    } else {
      setPlayerLocation(null)
    }

    if (player.active_ship_id) {
      getActivePlayerShip(player.player_id)
        .then(setPlayerShip)
        .catch(console.error)
    } else {
      setPlayerShip(null)
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
            marginBottom: '20px',
            padding: '10px',
            border: '2px solid black',
            backgroundColor: '#f4f4f4',
            maxWidth: '400px',
          }}>
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
          <h3>player active ship:</h3>
          <pre>
            {playerShip
              ? JSON.stringify(playerShip, null, 2)
              : 'no active ship'}
          </pre>
        </div>
      ) : (
        <div>no player...</div>
      )}
    </>
  )
}

export default PlayerDashboard
