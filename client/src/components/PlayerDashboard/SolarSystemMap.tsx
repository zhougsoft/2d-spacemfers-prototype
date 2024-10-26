import { DataObject } from '../../types'

const AU_IN_KM = 149597870.7

const celestialTypeMap: Record<number, { name: string; emoji: string }> = {
  1: { name: 'star', emoji: '💫' },
  2: { name: 'planet', emoji: '🪐' },
  3: { name: 'moon', emoji: '🌕' },
  4: { name: 'belt', emoji: '🪨' },
  5: { name: 'station', emoji: '🛰️' },
}

const SolarSystemMap = ({ solarSystem }: { solarSystem: DataObject }) => {
  const renderCelestialBody = (body: DataObject) => {
    const hasChildren = body.children?.length > 0
    const celestialTypeInfo = celestialTypeMap[body.celestial_type_id] ?? {
      name: 'unknown',
      emoji: '❓',
    }

    const distance = Number(body.distance_from_parent)
    const formattedDistance = !isNaN(distance)
      ? distance > 0.1
        ? `${distance.toFixed(2).toLocaleString()} au`
        : `${Math.round(distance * AU_IN_KM).toLocaleString()} km`
      : 'n/a'

    return hasChildren ? (
      <details
        key={body.celestial_id}
        style={{ marginLeft: '20px', marginTop: '10px' }}
        open>
        <summary>
          <strong>
            {celestialTypeInfo.emoji} {body.name || 'no name'}
          </strong>{' '}
          ({celestialTypeInfo.name}, Distance: {formattedDistance})
        </summary>
        <div>
          {body.children.map((child: DataObject) => renderCelestialBody(child))}
        </div>
      </details>
    ) : (
      <div
        key={body.celestial_id}
        style={{ marginLeft: '20px', marginTop: '10px' }}>
        <strong>
          {celestialTypeInfo.emoji} {body.name || 'no name'}
        </strong>{' '}
        ({celestialTypeInfo.name}: distance: {formattedDistance})
      </div>
    )
  }

  if (!solarSystem) return null
  return <div>{renderCelestialBody(solarSystem)}</div>
}

export default SolarSystemMap
