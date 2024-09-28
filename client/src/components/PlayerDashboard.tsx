import { useEffect, useState } from 'react'
import { getPlayer } from '../api'

const planetsData = [
  {
    name: 'sun',
    color: '#ffdd00',
    distance: 0,
    description: 'The Sun is the star at the center of the solar system.',
  },
  {
    name: 'mercury',
    color: '#b3b3b3',
    distance: 0.4,
    description: 'Mercury is the smallest planet and closest to the Sun.',
  },
  {
    name: 'venus',
    color: '#e0c865',
    distance: 0.7,
    description: 'Venus has a thick, toxic atmosphere and the hottest surface.',
  },
  {
    name: 'earth',
    color: '#2a6db8',
    distance: 1,
    description: 'Earth is the only planet known to support life.',
  },
  {
    name: 'mars',
    color: '#d14c32',
    distance: 1.5,
    description: 'Mars is home to the tallest volcano in the solar system.',
  },
  {
    name: 'jupiter',
    color: '#d5b495',
    distance: 5.2,
    description: 'Jupiter is the largest planet with a massive storm.',
  },
  {
    name: 'saturn',
    color: '#e3d9b7',
    distance: 9.5,
    description: 'Saturn is famous for its prominent ring system.',
  },
  {
    name: 'uranus',
    color: '#82d4d4',
    distance: 19.8,
    description: 'Uranus rotates on its side and has faint rings.',
  },
  {
    name: 'neptune',
    color: '#2e3b7b',
    distance: 30,
    description: 'Neptune is the furthest planet and has strong winds.',
  },
  {
    name: 'pluto',
    color: '#deb887',
    distance: 39.5,
    description: 'Pluto is a dwarf planet with a very elliptical orbit.',
  },
]

const Sun = ({
  onClick,
  selected,
}: {
  onClick: () => void
  selected: boolean
}) => (
  <div
    style={{
      minWidth: '100px',
      minHeight: '100px',
      borderRadius: '50%',
      backgroundColor: planetsData[0].color,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
      color: 'black',
      marginRight: '50px',
      cursor: 'pointer',
      border: selected ? '3px solid white' : 'none', // Highlight the selected sun
    }}
    onClick={onClick}>
    sun
  </div>
)

const Planet = ({
  name,
  index,
  onClick,
  selected,
}: {
  name: string
  index: number
  onClick: () => void
  selected: boolean
}) => {
  const planet = planetsData.find(p => p.name === name)
  const previousDistance = index === 0 ? 0 : planetsData[index]?.distance ?? 0

  return (
    <div
      style={{
        position: 'relative',
        minWidth: '50px',
        minHeight: '50px',
        borderRadius: '50%',
        backgroundColor: planet?.color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        fontSize: '10px',
        textAlign: 'center',
        marginLeft: `${((planet?.distance ?? 0) - previousDistance) * 100}px`,
        cursor: 'pointer',
        border: selected ? '3px solid white' : 'none', // Highlight the selected planet
      }}
      onClick={onClick}>
      {name}
    </div>
  )
}

const PlayerDashboard = () => {
  const [player, setPlayer] = useState<{ player_id: number } | null>(null)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)

  useEffect(() => {
    getPlayer(1).then(setPlayer).catch(console.error)
  }, [])

  return (
    <>
      <h1>🚀 map prototype</h1>
      <hr />
      {player && (
        <div
          style={{
            marginBottom: '20px',
            padding: '10px',
            border: '2px solid black',
            backgroundColor: '#f4f4f4',
            maxWidth: '400px',
          }}>
          <h2>Player Info</h2>
          <p>
            <strong>Player ID:</strong> {player.player_id}
          </p>
        </div>
      )}

      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          height: '350px',
          border: '2px solid black',
          overflowX: 'auto',
          backgroundColor: '#111',
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            padding: '0 20px',
          }}>
          <Sun
            onClick={() => setSelectedPlanet('sun')}
            selected={selectedPlanet === 'sun'}
          />
          {planetsData.slice(1).map((planet, index) => (
            <Planet
              key={planet.name}
              name={planet.name}
              index={index}
              onClick={() => setSelectedPlanet(planet.name)}
              selected={selectedPlanet === planet.name}
            />
          ))}
        </div>
      </div>

      {selectedPlanet && (
        <div
          style={{
            marginTop: '20px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '200px',
            border: '2px solid black',
            overflowY: 'auto',
            backgroundColor: '#f4f4f4',
            padding: '10px',
          }}>
          <h2>{selectedPlanet.toUpperCase()}</h2>
          <p>{planetsData.find(p => p.name === selectedPlanet)?.description}</p>
        </div>
      )}
    </>
  )
}

export default PlayerDashboard
