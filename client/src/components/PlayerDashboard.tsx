import { useEffect, useState } from 'react'
import { getPlayer } from '../api'

type DataObject = Record<string, any> // generic type to hold TBD data from api

const TEST_PLAYER_ID = 1

const PlayerDashboard = () => {
  const [isLoading, setIsLoading] = useState(false)

  const [player, setPlayer] = useState<DataObject | null>(null)
  const [playLocation, setPlayerLocation] = useState<DataObject | null>(null)

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

    if (!player.target_location_id) {
      setPlayerLocation(null)
      return
    }

    // TODO: fetch the player's current location system, then fetch that system's planets
    // use that data to build the solar system object & set it in state
    console.log({ player })
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
          <h2>player</h2>
          <p>
            <strong>id:</strong> {player.player_id}
          </p>
        </div>
      ) : (
        <div>no player...</div>
      )}
    </>
  )
}

export default PlayerDashboard
