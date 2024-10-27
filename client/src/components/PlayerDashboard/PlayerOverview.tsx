import { DataIndex, DataObject } from '../../types'
import { CELESTIAL_TYPES } from '../../utils/constants'

const PlayerOverview = ({
  player,
  playerLocation,
  playerShips,
  activePlayerShip,
  solarSystemIndexed,
}: {
  player: DataObject | null
  playerLocation: DataObject | null
  playerShips: DataObject | null
  activePlayerShip: DataObject | null
  solarSystemIndexed: DataIndex | null
}) => {
  if (!player) return <div>no player</div>

  console.log('<PlayerOverview />', {
    data: {
      player,
      playerLocation,
      playerShips,
      activePlayerShip,
      solarSystemIndexed,
    },
  })

  return (
    <>
      <h3>player overview</h3>
      <ul>
        <li>
          <b>player id</b>: {player.player_id}
        </li>
        <li>
          <b>location:</b>{' '}
          {!!playerLocation
            ? `${playerLocation.name} (${
                CELESTIAL_TYPES[playerLocation.celestial_type_id].name
              })`
            : 'none'}
        </li>
        <li>
          <b>active ship:</b>{' '}
          {activePlayerShip
            ? `${activePlayerShip.ship_type.name} (speed: ${activePlayerShip.ship_type.speed}, cargo: ${activePlayerShip.ship_type.max_cargo_size})`
            : 'none'}
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
        <div>no ships</div>
      )}
    </>
  )
}

export default PlayerOverview
