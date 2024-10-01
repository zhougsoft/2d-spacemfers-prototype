import { useEffect, useState } from 'react'
import { getLocation, getPlayer, getSolarSystem } from '../api'

type DataObject = Record<string, any> // generic type to hold TBD data from api

const TEST_PLAYER_ID = 1
const PLANET_DISTANCE_SCALE = 100

const sunData = {
  name: 'Sun',
  description: 'the sun is the star at the center of the solar system',
  radius: 696340,
  distance_from_star: 0,
}

const Sun = ({
  systemName,
  onClick,
  isSelected,
}: {
  systemName: string
  onClick: () => void
  isSelected: boolean
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
      border: isSelected ? '3px solid white' : 'none',
    }}
    onClick={onClick}>
    {systemName}
  </div>
)

const Planet = ({
  planet,
  previousDistance,
  onClick,
  isSelected,
}: {
  planet: any
  previousDistance: number
  onClick: () => void
  isSelected: boolean
}) => {
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
          (planet.distance_from_star - previousDistance) * PLANET_DISTANCE_SCALE
        }px`,
        cursor: 'pointer',
        border: isSelected ? '3px solid white' : 'none',
      }}
      onClick={onClick}>
      {planet.name}
    </div>
  )
}

const PlayerDashboard = () => {
  const [solarSystem, setSolarSystem] = useState<DataObject | null>(null)
  const [selectedPlanet, setSelectedPlanet] = useState<DataObject | null>(null)

  const [player, setPlayer] = useState<DataObject | null>(null)
  const [playerTargetLocation, setPlayerTargetLocation] =
    useState<DataObject | null>(null)

  // fetch api data on component mount
  useEffect(() => {
    // fetch the game universe data
    getSolarSystem().then(setSolarSystem).catch(console.error)

    // fetch the player data
    getPlayer(TEST_PLAYER_ID)
      .then(playerData => {
        setPlayer(playerData)

        if (!playerData.target_location_id) return
        getLocation(playerData.target_location_id)
          .then(setPlayerTargetLocation)
          .catch(console.error)
      })
      .catch(console.error)
  }, [])

  // do stuff with the api data
  useEffect(() => {
    if (!player || !playerTargetLocation) return

    // TODO: check stuff out here
    console.log({ player, playerTargetLocation })
  }, [player, playerTargetLocation])

  const handleSunClick = () => setSelectedPlanet(sunData)
  const handlePlanetClick = (planet: DataObject) => setSelectedPlanet(planet)

  return (
    <>
      <h1>🚀 player dashboard</h1>
      <p>wip...</p>
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
          <h2>player</h2>
          <p>
            <strong>id:</strong> {player.player_id}
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
              onClick={handleSunClick}
              isSelected={selectedPlanet?.name === 'Sun'}
            />
            {solarSystem.planets.map((planet: DataObject, index: number) => (
              <Planet
                key={planet.planetId}
                planet={planet}
                previousDistance={
                  index === 0
                    ? 0
                    : solarSystem.planets[index - 1].distance_from_star
                }
                onClick={() => handlePlanetClick(planet)}
                isSelected={selectedPlanet?.name === planet.name}
              />
            ))}
          </div>
        </div>
      )}

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
          <h2>{selectedPlanet.name.toUpperCase()}</h2>
          <p>
            <strong>description:</strong> {selectedPlanet.description}
          </p>
          <p>
            <strong>radius:</strong> {selectedPlanet.radius} km
          </p>
          {selectedPlanet.name !== 'Sun' && (
            <p>
              <strong>distance from star:</strong>{' '}
              {selectedPlanet.distance_from_star} AU
            </p>
          )}

          {selectedPlanet.moons && (
            <>
              <h3>moons</h3>
              <ul>
                {selectedPlanet.moons.map((moon: any, index: number) => (
                  <li key={index}>{moon.name}</li>
                ))}
              </ul>
            </>
          )}

          {selectedPlanet.stations && (
            <>
              <h3>stations</h3>
              <ul>
                {selectedPlanet.stations.map((station: any, index: number) => (
                  <li key={index}>{station.name}</li>
                ))}
              </ul>
            </>
          )}

          {selectedPlanet.belts && (
            <>
              <h3>belts</h3>
              <ul>
                {selectedPlanet.belts.map((belt: any, index: number) => (
                  <li key={index}>{belt.name}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default PlayerDashboard
