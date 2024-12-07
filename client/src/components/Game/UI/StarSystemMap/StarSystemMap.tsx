import { useState } from 'react'
import { DataObject } from '../../../../types'
import { AU_IN_KM, CELESTIAL_TYPES, EMOJI } from '../../../../utils/constants'
import { usePlayerCelestialTravel } from '../../../../hooks/usePlayerCelestialTravel'
import CelestialModal from './CelestialModal'
import styles from './StarSystemMap.module.css'

const treeItemStyles = {
  width: 'fit-content',
  marginLeft: '2rem',
  cursor: 'pointer',
  padding: '0.25rem 0',
}

const renderCelestialTree = (
  celestial: DataObject,
  highlightedCelestialId: number | null,
  player: DataObject | null,
  onCelestialClick: (celestial: DataObject) => void
) => {
  const { isTraveling } = usePlayerCelestialTravel(player)
  const hasChildren = celestial.children?.length > 0
  const isHighlighted = celestial.celestial_id === highlightedCelestialId
  const isCurrentlyTraveling = player && isHighlighted && isTraveling

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
      className={`${styles.item} ${
        isHighlighted
          ? isCurrentlyTraveling
            ? styles.highlightedTraveling
            : styles.highlighted
          : ''
      }`}
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
            renderCelestialTree(
              child,
              highlightedCelestialId,
              player,
              onCelestialClick
            )
          )}
        </ul>
      )}
    </li>
  )
}

const StarSystemMap = ({
  starSystemTree,
  highlightedCelestialId,
  playerId,
  onDataChange,
  player,
  onClose,
}: {
  starSystemTree: DataObject
  highlightedCelestialId: number | null
  playerId: number
  onDataChange: () => void
  player: DataObject | null
  onClose: () => void
}) => {
  const [selectedCelestial, setSelectedCelestial] = useState<DataObject | null>(
    null
  )

  if (!starSystemTree) return null

  return (
    <>
      <button onClick={onClose}>{EMOJI.CROSS_MARK}</button>
      <h3>star system</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {renderCelestialTree(
          starSystemTree,
          highlightedCelestialId,
          player,
          celestial => setSelectedCelestial(celestial)
        )}
      </ul>

      {selectedCelestial && (
        <CelestialModal
          celestial={selectedCelestial}
          onClose={() => setSelectedCelestial(null)}
          playerId={playerId}
          onDataChange={onDataChange}
        />
      )}
    </>
  )
}

export default StarSystemMap
