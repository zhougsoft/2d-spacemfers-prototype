import { useGameData } from '../../hooks/useGameData'
import { EMOJI } from '../../utils/constants'
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

const PlayerDashboard = () => {
  const {
    isLoading,
    player,
    solarSystem,
    playerLocation,
    playerShips,
    activePlayerShip,
  } = useGameData(TEST_PLAYER_ID)

  if (isLoading) return <div>{EMOJI.HOURGLASS_NOT_DONE}</div>

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
              <div>{EMOJI.HOURGLASS_NOT_DONE}</div>
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
