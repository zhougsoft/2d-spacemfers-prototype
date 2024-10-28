import { useGameData } from '../../hooks/useGameData'
import { EMOJI } from '../../utils/constants'
import PlayerOverview from './PlayerOverview'
import SolarSystemMap from './SolarSystemMap'

const TEST_PLAYER_ID = 1

const PlayerDashboard = () => {
  const {
    isLoading,
    solarSystemIndexed,
    solarSystemTree,
    player,
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
            {solarSystemTree ? (
              <SolarSystemMap
                solarSystemTree={solarSystemTree}
                highlightedCelestialId={playerLocation?.celestial_id}
              />
            ) : (
              <div>
                {player.target_celestial_id
                  ? EMOJI.HOURGLASS_NOT_DONE
                  : 'no player location'}
              </div>
            )}
          </div>

          <hr style={{ width: '100%' }} />

          <div
            style={{
              width: '100%',
              border: '2px solid white',
              padding: '0 0 2rem 1rem',
            }}>
            <PlayerOverview
              playerData={{
                player,
                playerLocation,
                playerShips,
                activePlayerShip,
              }}
              solarSystemIndexed={solarSystemIndexed}
            />
          </div>
        </div>
      ) : (
        <div>no player...</div>
      )}
    </>
  )
}

export default PlayerDashboard
