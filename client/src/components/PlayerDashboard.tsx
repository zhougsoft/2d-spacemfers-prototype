import { useEffect, useState } from 'react'
import { getSolarSystem } from '../api'

const planetOrder = [
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
]

const planetColors: Record<string, string> = {
  mercury: '#b3b3b3', // Gray
  venus: '#e0c865', // Pale yellow
  earth: '#2a6db8', // Blue and green
  mars: '#d14c32', // Reddish
  jupiter: '#d5b495', // Brown and white
  saturn: '#e3d9b7', // Pale gold
  uranus: '#82d4d4', // Light blue
  neptune: '#2e3b7b', // Dark blue
  pluto: '#deb887', // Brownish
}

// todo: add "distance_to_star" to the planet object in the database to create space in solar system (will need for travel time calculation later)
const planetDistances: Record<string, number> = {
  mercury: 0.4, // Scaled distance from the sun (arbitrary scaling)
  venus: 0.7,
  earth: 1,
  mars: 1.5,
  jupiter: 5.2,
  saturn: 9.5,
  uranus: 19.8,
  neptune: 30,
  pluto: 39.5,
}

const Sun = () => {
  return (
    <div
      style={{
        minWidth: '100px',
        minHeight: '100px',
        borderRadius: '50%',
        backgroundColor: 'yellow',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '20px',
        color: 'black',
        marginRight: '50px', // space between first planet and sun
      }}>
      sun
    </div>
  )
}

const Planet = ({ name, index }: { name: string; index: number }) => {
  return (
    <div
      key={name}
      style={{
        position: 'relative',
        minWidth: '50px',
        minHeight: '50px',
        borderRadius: '50%',
        backgroundColor: planetColors[name],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        fontSize: '10px',
        textAlign: 'center',
        marginLeft: `${
          (planetDistances[name] -
            (index === 0 ? 0 : planetDistances[planetOrder[index - 1]])) *
          100
        }px`, // Relative distance between planets
      }}>
      {name}
    </div>
  )
}

const PlayerDashboard = () => {
  const [solarSystem, setSolarSystem] = useState<Record<string, any> | null>(
    null
  )

  useEffect(() => {
    if (solarSystem !== null) return
    getSolarSystem().then(setSolarSystem).catch(console.error)
  }, [solarSystem])

  return (
    <>
      <h1>🚀 map prototype</h1>
      <p>wip...</p>
      <hr />
      {/* Solar system scrollable window */}
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          height: '350px',
          border: '2px solid black',
          overflowX: 'auto', // Enable horizontal scrolling
          overflowY: 'hidden', // Prevent vertical scrolling
          whiteSpace: 'nowrap', // Ensure elements don't wrap onto the next line
          backgroundColor: '#111',
        }}>
        {/* Solar system scroll content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            padding: '0 20px',
            position: 'relative',
          }}>
          <Sun />
          {planetOrder.map((name, index) => (
            <Planet name={name} index={index} />
          ))}
        </div>
      </div>
    </>
  )
}

export default PlayerDashboard
