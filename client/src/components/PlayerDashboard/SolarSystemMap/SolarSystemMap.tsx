import { useState } from 'react'
import { DataObject } from '../../../types'
import { AU_IN_KM, CELESTIAL_TYPES, EMOJI } from '../../../utils/constants'
import CelestialModal from './CelestialModal'
import styles from './SolarSystemMap.module.css'

const treeItemStyles = {
  width: 'fit-content',
  marginLeft: '2rem',
  cursor: 'pointer',
  padding: '0.25rem 0',
}

const renderCelestialTree = (
  celestial: DataObject,
  highlightedCelestialId: number | null,
  onCelestialClick: (celestial: DataObject) => void
) => {
  const hasChildren = celestial.children?.length > 0
  const isHighlighted = celestial.celestial_id === highlightedCelestialId
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

  const celestialInfo = (
    <div
      className={`${styles.item} ${isHighlighted ? 'outline-orange' : ''}`}
      onClick={() => onCelestialClick(celestial)}
      role="button">
      <b>
        {celestialTypeInfo.emoji} {celestial.name || 'no name'}
      </b>{' '}
      ({celestialTypeInfo.name}
      {celestial.parent_celestial_id && `, distance: ${formattedDistance}`})
    </div>
  )

  return (
    <li key={celestial.celestial_id} style={treeItemStyles}>
      {celestialInfo}
      {hasChildren && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {celestial.children.map((child: DataObject) =>
            renderCelestialTree(child, highlightedCelestialId, onCelestialClick)
          )}
        </ul>
      )}
    </li>
  )
}

const SolarSystemMap = ({
  solarSystemTree,
  highlightedCelestialId,
}: {
  solarSystemTree: DataObject
  highlightedCelestialId: number | null
}) => {
  const [selectedCelestial, setSelectedCelestial] = useState<DataObject | null>(
    null
  )

  if (!solarSystemTree) return null

  return (
    <>
      <h3>solar system</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {renderCelestialTree(
          solarSystemTree,
          highlightedCelestialId,
          celestial => setSelectedCelestial(celestial)
        )}
      </ul>

      {selectedCelestial && (
        <CelestialModal
          celestial={selectedCelestial}
          onClose={() => setSelectedCelestial(null)}
        />
      )}
    </>
  )
}

export default SolarSystemMap
