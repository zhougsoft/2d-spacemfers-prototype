import { DataObject } from '../../types'

const AU_IN_KM = 149597870.7

const celestialTypeMap: Record<number, string> = {
  1: 'star',
  2: 'planet',
  3: 'moon',
  4: 'belt',
  5: 'station',
}

const SolarSystemMap = ({ solarSystem }: { solarSystem: DataObject }) => {
  const renderCelestialBody = (body: DataObject) => {
    const hasChildren = body.children?.length > 0
    const celestialType = celestialTypeMap[body.celestial_type_id] ?? 'unknown'

    // Ensure distance_from_parent is treated as a number
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
          <strong>{body.name || 'Unnamed'}</strong> ({celestialType}, Distance:{' '}
          {formattedDistance})
        </summary>
        <div>
          {body.children.map((child: DataObject) => renderCelestialBody(child))}
        </div>
      </details>
    ) : (
      <div
        key={body.celestial_id}
        style={{ marginLeft: '20px', marginTop: '10px' }}>
        <strong>{body.name || 'Unnamed'}</strong> ({celestialType}: distance:{' '}
        {formattedDistance})
      </div>
    )
  }

  if (!solarSystem) return null

  return <div>{renderCelestialBody(solarSystem)}</div>
}

export default SolarSystemMap
