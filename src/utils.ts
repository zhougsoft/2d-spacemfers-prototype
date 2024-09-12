import { createPlanet, createStation, createSystem } from './lib/universe'

export const createSolarSystem = async () => {
  const systemId = await createSystem('sol')
  if (!systemId) throw Error('error creating system')

  const mercuryResults = await createPlanet(systemId, 'mercury')
  if (!mercuryResults) throw Error('error creating mercury')
  const { planetId: mercuryId } = mercuryResults

  const venusResults = await createPlanet(systemId, 'venus')
  if (!venusResults) throw Error('error creating venus')
  const { planetId: venusId } = venusResults

  const earthResults = await createPlanet(systemId, 'earth')
  if (!earthResults) throw Error('error creating earth')
  const { planetId: earthId } = earthResults

  const marsResults = await createPlanet(systemId, 'mars')
  if (!marsResults) throw Error('error creating mars')
  const { planetId: marsId } = marsResults

  const jupiterResults = await createPlanet(systemId, 'jupiter')
  if (!jupiterResults) throw Error('error creating jupiter')
  const { planetId: jupiterId } = jupiterResults

  const saturnResults = await createPlanet(systemId, 'saturn')
  if (!saturnResults) throw Error('error creating saturn')
  const { planetId: saturnId } = saturnResults

  const uranusResults = await createPlanet(systemId, 'uranus')
  if (!uranusResults) throw Error('error creating uranus')
  const { planetId: uranusId } = uranusResults

  const neptuneResults = await createPlanet(systemId, 'neptune')
  if (!neptuneResults) throw Error('error creating neptune')
  const { planetId: neptuneId } = neptuneResults

  const plutoResults = await createPlanet(systemId, 'pluto')
  if (!plutoResults) throw Error('error creating pluto')
  const { planetId: plutoId } = plutoResults

  const stationResult = await createStation(earthId, 'starter outpost')
  if (!stationResult) throw Error('error creating station')
  const { stationId, locationId: stationLocationId } = stationResult

  return {
    systemId,
    planets: {
      mercuryId,
      venusId,
      earthId,
      marsId,
      jupiterId,
      saturnId,
      uranusId,
      neptuneId,
      plutoId,
    },
    station: {
      stationId,
      stationLocationId,
    },
  }
}
