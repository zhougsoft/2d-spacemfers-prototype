import { useEffect, useState } from 'react'
import { getPlayer, getSolarSystem } from '../api' // Assuming these are API calls

const Sun = ({
  systemName,
  onClick,
  selected,
}: {
  systemName: string
  onClick: () => void
  selected: boolean
}) => (
  <div
    style={{
      minWidth: '100px',
      minHeight: '100px',
      borderRadius: '50%',
      backgroundColor: '#ffdd00',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
      color: 'black',
      marginRight: '50px',
      cursor: 'pointer',
      border: selected ? '3px solid white' : 'none',
    }}
    onClick={onClick}>
    {systemName}
  </div>
)

const Planet = ({
  planet,
  previousDistance,
  onClick,
  selected,
}: {
  planet: any
  previousDistance: number
  onClick: () => void
  selected: boolean
}) => {
  // Scale factor to ensure the distances are not too far apart
  const distanceScale = 100 // Adjust this scale factor as needed

  return (
    <div
      style={{
        position: 'relative',
        minWidth: '50px',
        minHeight: '50px',
        borderRadius: '50%',
        backgroundColor: planet.color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        fontSize: '10px',
        textAlign: 'center',
        marginLeft: `${
          (planet.distance_from_star - previousDistance) * distanceScale
        }px`, // Relative distance
        cursor: 'pointer',
        border: selected ? '3px solid white' : 'none',
      }}
      onClick={onClick}>
      {planet.name}
    </div>
  )
}

const PlayerDashboard = () => {
  const [player, setPlayer] = useState<{ player_id: number } | null>(null)
  const [solarSystem, setSolarSystem] = useState<any | null>(null)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)

  useEffect(() => {
    // Fetch player and solar system data
    getPlayer(1).then(setPlayer).catch(console.error)
    getSolarSystem().then(setSolarSystem).catch(console.error)
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

      {solarSystem && (
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
              systemName={solarSystem.systemName}
              onClick={() => setSelectedPlanet('sun')}
              selected={selectedPlanet === 'sun'}
            />
            {solarSystem.planets.map((planet: any, index: number) => (
              <Planet
                key={planet.planetId}
                planet={planet}
                previousDistance={
                  index === 0
                    ? 0
                    : solarSystem.planets[index - 1].distance_from_star
                }
                onClick={() => setSelectedPlanet(planet.name)}
                selected={selectedPlanet === planet.name}
              />
            ))}
          </div>
        </div>
      )}

      {selectedPlanet && solarSystem && (
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
          <p>
            {
              solarSystem.planets.find((p: any) => p.name === selectedPlanet)
                ?.description
            }
          </p>
        </div>
      )}
    </>
  )
}

export default PlayerDashboard
