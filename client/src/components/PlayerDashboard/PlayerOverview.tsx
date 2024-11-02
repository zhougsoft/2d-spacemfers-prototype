import { DataIndex, DataObject } from '../../types'
import { CELESTIAL_TYPES } from '../../utils/constants'
import { isTraveling, getTravelProgress } from '../../utils/playerHelpers'

/*

TODO:

start parsing the travel stuff, logic, etc.

*/

const PlayerOverview = ({
  playerData,
  solarSystemIndexed,
}: {
  playerData: Record<string, DataObject | null>
  solarSystemIndexed: DataIndex | null
}) => {
  if (!playerData) return <div>no player data</div>
  const { player, playerLocation, playerShips, activePlayerShip } = playerData

  const traveling = player && isTraveling(player)
  const travelProgress = player ? getTravelProgress(player) : 0

  return (
    <>
      <h3>player overview</h3>
      <ul>
        <li>
          <b>player id</b>: {player?.player_id}
        </li>
        <li>
          <b>location:</b>{' '}
          {playerLocation
            ? `${playerLocation.name} (${
                CELESTIAL_TYPES[playerLocation.celestial_type_id].name
              })${
                traveling
                  ? ` - Traveling... ${Math.round(travelProgress)}%`
                  : ''
              }`
            : 'no current location'}
        </li>
        <li>
          <b>active ship:</b>{' '}
          {activePlayerShip
            ? `${activePlayerShip.ship_type.name} (speed: ${activePlayerShip.ship_type.speed}, cargo: ${activePlayerShip.ship_type.max_cargo_size})`
            : 'no active ship'}
        </li>
      </ul>

      <h3>owned ships</h3>
      {playerShips?.length ? (
        <table>
          <thead>
            <tr>
              <th>type</th>
              <th>speed</th>
              <th>cargo size</th>
              <th>location</th>
              <th>is active?</th>
            </tr>
          </thead>
          <tbody>
            {playerShips.map((ship: DataObject) => (
              <tr key={ship.player_ship_id}>
                <td>{ship.ship_type.name}</td>
                <td>{ship.ship_type.speed}</td>
                <td>{ship.ship_type.max_cargo_size}</td>
                <td>
                  {ship.player_ship_id === null
                    ? 'n/a'
                    : !!solarSystemIndexed &&
                      solarSystemIndexed[ship.station_celestial_id]
                    ? solarSystemIndexed[ship.station_celestial_id].name
                    : ship.station_celestial_id}
                </td>
                <td>
                  {ship.player_ship_id === activePlayerShip?.player_ship_id
                    ? 'yes'
                    : 'no'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>no owned ships</div>
      )}
    </>
  )
}

export default PlayerOverview
