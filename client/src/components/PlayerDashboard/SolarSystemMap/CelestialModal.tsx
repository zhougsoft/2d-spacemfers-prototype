import { useState } from 'react'
import { DataObject } from '../../../types'
import { CELESTIAL_TYPES, EMOJI } from '../../../utils/constants'
import { initiatePlayerTravel } from '../../../api'

const modalOverlayStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
}

const modalContentStyle = {
  background: '#111',
  padding: '2rem',
  borderRadius: '4px',
  minWidth: '300px',
  maxWidth: '600px',
  border: '1px solid #333',
}

interface CelestialModalProps {
  celestial: DataObject
  onClose: () => void
  playerId: number
  onDataChange: () => void
}

const CelestialModal = ({ celestial, onClose, playerId, onDataChange }: CelestialModalProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleTravel = async () => {
    setIsLoading(true)
    try {
      await initiatePlayerTravel(playerId, celestial.celestial_id)
      onDataChange()
      onClose()
    } catch (error) {
      console.error('Travel failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const celestialTypeInfo = CELESTIAL_TYPES[celestial.celestial_type_id]

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
          <h3>
            {celestialTypeInfo.emoji} {celestial.name}
          </h3>
          <button onClick={onClose}>{EMOJI.CROSS_MARK}</button>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p>
            <b>type:</b> {celestialTypeInfo.name}
          </p>
          <p>
            <b>celestial id:</b> {celestial.celestial_id}
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h4>actions:</h4>
          <button 
            style={{ marginRight: '0.5rem' }}
            onClick={handleTravel}
            disabled={isLoading}
          >
            {isLoading ? EMOJI.HOURGLASS_NOT_DONE : 'travel here'}
          </button>
          <button>view stuff</button>
        </div>

        <div>
          <h4>placeholder stats:</h4>
          <p>something: 1,000,000</p>
          <p>something else: high</p>
          <p>another thing: medium</p>
        </div>
      </div>
    </div>
  )
}

export default CelestialModal
