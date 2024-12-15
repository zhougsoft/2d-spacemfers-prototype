import { DataObject, DataIndex } from '../../../types'
import { AU_IN_KILOMETERS } from '../../../utils/constants'

const OverviewPanel = ({
  playerLocation,
  starSystemIndex,
}: {
  playerLocation: DataObject
  starSystemIndex: DataIndex
}) => {
  // Calculate absolute distance from root star for any celestial object
  const getAbsoluteDistanceFromStar = (
    celestialId: number,
    systemIndex: DataIndex
  ): number => {
    let distance = 0
    let currentId: number | null = celestialId

    while (currentId !== null) {
      distance += systemIndex[currentId].distance_from_parent
      currentId = systemIndex[currentId].parent_celestial_id
    }
    return distance
  }

  // Calculate relative distance between two objects using their absolute distances
  const calculateRelativeDistance = (
    fromId: number,
    toId: number,
    systemIndex: DataIndex
  ): number => {
    const fromDistance = getAbsoluteDistanceFromStar(fromId, systemIndex)
    const toDistance = getAbsoluteDistanceFromStar(toId, systemIndex)
    return Math.abs(toDistance - fromDistance)
  }

  // Compute relative distances for all celestial objects
  const celestialObjects = Object.values(starSystemIndex).map(obj => ({
    ...obj,
    total_distance_from_player: calculateRelativeDistance(
      playerLocation.celestial_id,
      obj.celestial_id,
      starSystemIndex
    ),
  }))

  // Sort celestial objects by total distance from the player location
  const sortedCelestialObjects = celestialObjects.sort(
    (a, b) => a.total_distance_from_player - b.total_distance_from_player
  )

  return (
    <table>
      <thead>
        <tr>
          <th>distance</th>
          <th>name</th>
        </tr>
      </thead>
      <tbody>
        {sortedCelestialObjects.map(obj => {
          const { total_distance_from_player } = obj

          const distanceValue =
            total_distance_from_player < 0.1
              ? `${(total_distance_from_player * AU_IN_KILOMETERS).toFixed(0)} km`
              : `${total_distance_from_player.toFixed(1)} au`

          return (
            <tr key={obj.celestial_id}>
              <td>{distanceValue}</td>
              <td>{obj.name}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default OverviewPanel
