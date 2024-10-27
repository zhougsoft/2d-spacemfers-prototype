import { AU_IN_KM, CELESTIAL_TYPES, EMOJI } from '../../utils/constants'
import { DataObject } from '../../types'

const renderCelestialTree = (celestial: DataObject) => {
  const hasChildren = celestial.children?.length > 0
  const celestialTypeInfo = CELESTIAL_TYPES[celestial.celestial_type_id] ?? {
    name: 'unknown',
    emoji: EMOJI.QUESTION_MARK,
  }

  const distance = Number(celestial.distance_from_parent)
  const formattedDistance = !isNaN(distance)
    ? distance > 0.1
      ? `${distance.toFixed(1).toLocaleString()} au`
      : `${Math.round(distance * AU_IN_KM).toLocaleString()} km`
    : 'n/a'

  return hasChildren ? (
    <details
      key={celestial.celestial_id}
      style={{ marginLeft: '20px', marginTop: '10px' }}
      open>
      <summary>
        <b>
          {celestialTypeInfo.emoji} {celestial.name || 'no name'}
        </b>{' '}
        ({celestialTypeInfo.name}
        {celestial.parent_celestial_id && `, distance: ${formattedDistance}`})
      </summary>
      <div>
        {celestial.children.map((child: DataObject) =>
          renderCelestialTree(child)
        )}
      </div>
    </details>
  ) : (
    <div
      key={celestial.celestial_id}
      style={{ marginLeft: '20px', marginTop: '10px' }}>
      <b>
        {celestialTypeInfo.emoji} {celestial.name || 'no name'}
      </b>{' '}
      ({celestialTypeInfo.name}, distance: {formattedDistance})
    </div>
  )
}

const SolarSystemMap = ({
  solarSystemTree,
}: {
  solarSystemTree: DataObject
}) => {
  if (!solarSystemTree) return null
  return (
    <>
      <h2>solar system</h2>
      <div>{renderCelestialTree(solarSystemTree)}</div>
    </>
  )
}

export default SolarSystemMap
