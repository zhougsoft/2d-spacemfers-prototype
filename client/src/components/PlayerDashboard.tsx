import { useEffect, useState } from 'react'
import { getPlayer } from '../api'

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

    if (player.target_location_id) {
      // TODO: fetch the player's target location data
      // consider arrival_time logic (if player is en route or already arrived)
      setPlayerLocation({ msg: 'player has a target location' })
    } else {
      setPlayerLocation(null)
    }

    if (player.active_ship_id) {
      // TODO: fetch the player's ship data
      setPlayerShip({ msg: 'player has an active ship' })
    } else {
      setPlayerShip(null)
    }

    // TODO: fetch the player's current location & active ship data
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
          <h3>player</h3>
          <span>id:&nbsp;</span>
          <span>{player.player_id}</span>
          <br />
          <br />
          <br />
          <span>location:</span>
          <pre>
            {playerLocation
              ? JSON.stringify(playerLocation)
              : 'no location set'}
          </pre>
          <br />
          <br />
          <span>active ship:</span>
          <pre>
            {playerShip ? JSON.stringify(playerShip) : 'no active ship'}
          </pre>
        </div>
      ) : (
        <div>no player...</div>
      )}
    </>
  )
}

export default PlayerDashboard
