import { AU_IN_KM, EMOJI } from '../../constants'
import { DataObject } from '../../types'

const celestialTypeMap: Record<number, { name: string; emoji: string }> = {
  1: { name: 'star', emoji: EMOJI.STAR },
  2: { name: 'planet', emoji: EMOJI.RINGED_PLANET },
  3: { name: 'moon', emoji: EMOJI.CRESCENT_MOON },
  4: { name: 'belt', emoji: EMOJI.ROCK },
  5: { name: 'station', emoji: EMOJI.SATELLITE },
}

const renderCelestialBody = (celestial: DataObject) => {
  const hasChildren = celestial.children?.length > 0
  const celestialTypeInfo = celestialTypeMap[celestial.celestial_type_id] ?? {
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
        <strong>
          {celestialTypeInfo.emoji} {celestial.name || 'no name'}
        </strong>{' '}
        ({celestialTypeInfo.name}
        {celestial.parent_celestial_id && `, distance: ${formattedDistance}`})
      </summary>
      <div>
        {celestial.children.map((child: DataObject) =>
          renderCelestialBody(child)
        )}
      </div>
    </details>
  ) : (
    <div
      key={celestial.celestial_id}
      style={{ marginLeft: '20px', marginTop: '10px' }}>
      <strong>
        {celestialTypeInfo.emoji} {celestial.name || 'no name'}
      </strong>{' '}
      ({celestialTypeInfo.name}, distance: {formattedDistance})
    </div>
  )
}

const SolarSystemMap = ({ solarSystem }: { solarSystem: DataObject }) => {
  if (!solarSystem) return null
  return <div>{renderCelestialBody(solarSystem)}</div>
}

export default SolarSystemMap
