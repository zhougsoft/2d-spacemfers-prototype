import {
  addPlayerShip,
  createPlayer,
  dbDown,
  dbUp,
  getActivePlayerShip,
  getAllCelestials,
  getAllShipTypes,
  getCelestial,
  getCelestialsByRoot,
  getDistanceBetweenCelestials,
  getPlayer,
  getPlayerLocation,
  getPlayerShips,
  getPlayers,
  getShipType,
  initiatePlayerTravel,
  setActivePlayerShip,
  setPlayerLocation,
} from '../../api'
import AdminSection from './AdminSection'

const AdminDashboard = () => {
  return (
    <>
      <h1>📡 spacemfers admin</h1>
      <p>output in console</p>
      <hr />

      <h2>🗄️ db admin</h2>

      <div style={{ display: 'flex' }}>
        <AdminSection
          buttonLabel="🚀 db up"
          onSubmit={() => dbUp().then(console.log)}
          className="outline-green"
        />
        &nbsp;
        <AdminSection
          buttonLabel="💥 db down"
          onSubmit={() => dbDown().then(console.log)}
          className="outline-red"
        />
      </div>

      <h2>🌌 universe admin</h2>

      <AdminSection
        buttonLabel="get all celestials"
        onSubmit={() => getAllCelestials().then(console.log)}
      />

      <AdminSection
        buttonLabel="get celestial"
        inputs={[{ placeholder: 'celestial_id', key: 'celestialId' }]}
        onSubmit={({ celestialId }) =>
          getCelestial(celestialId).then(console.log)
        }
      />

      <AdminSection
        buttonLabel="get celestials by root"
        inputs={[{ placeholder: 'root_celestial_id', key: 'rootCelestialId' }]}
        onSubmit={({ rootCelestialId }) =>
          getCelestialsByRoot(rootCelestialId).then(console.log)
        }
      />

      <AdminSection
        buttonLabel="get distance between celestials"
        inputs={[
          { placeholder: 'celestial_id_1', key: 'celestialId1' },
          { placeholder: 'celestial_id_2', key: 'celestialId2' },
        ]}
        onSubmit={({ celestialId1, celestialId2 }) =>
          getDistanceBetweenCelestials(celestialId1, celestialId2).then(
            console.log
          )
        }
      />

      <AdminSection
        buttonLabel="get all ship types"
        onSubmit={() => getAllShipTypes().then(console.log)}
      />

      <AdminSection
        buttonLabel="get ship type"
        inputs={[{ placeholder: 'ship_type_id', key: 'shipTypeId' }]}
        onSubmit={({ shipTypeId }) => getShipType(shipTypeId).then(console.log)}
      />

      <h2>🧑‍🚀 player admin</h2>

      <AdminSection
        buttonLabel="create player"
        onSubmit={() => createPlayer().then(console.log)}
      />

      <AdminSection
        buttonLabel="get all players"
        onSubmit={() => getPlayers().then(console.log)}
      />

      <AdminSection
        buttonLabel="get player"
        inputs={[{ placeholder: 'player_id', key: 'playerId' }]}
        onSubmit={({ playerId }) => getPlayer(playerId).then(console.log)}
      />

      <h2>🎮 player state</h2>

      <AdminSection
        buttonLabel="get player location"
        inputs={[{ placeholder: 'player_id', key: 'playerId' }]}
        onSubmit={({ playerId }) =>
          getPlayerLocation(playerId).then(console.log)
        }
      />

      <AdminSection
        buttonLabel="set player location"
        inputs={[
          { placeholder: 'player_id', key: 'playerId' },
          { placeholder: 'celestial_id', key: 'celestialId' },
        ]}
        onSubmit={({ playerId, celestialId }) =>
          setPlayerLocation(playerId, celestialId).then(console.log)
        }
      />

      <AdminSection
        buttonLabel="add player ship"
        inputs={[
          { placeholder: 'player_id', key: 'playerId' },
          { placeholder: 'ship_type_id', key: 'shipTypeId' },
          { placeholder: 'station_celestial_id', key: 'stationCelestialId' },
        ]}
        onSubmit={({ playerId, shipTypeId, stationCelestialId }) =>
          addPlayerShip(playerId, shipTypeId, stationCelestialId).then(
            console.log
          )
        }
      />

      <AdminSection
        buttonLabel="get player ships"
        inputs={[{ placeholder: 'player_id', key: 'playerId' }]}
        onSubmit={({ playerId }) => getPlayerShips(playerId).then(console.log)}
      />

      <AdminSection
        buttonLabel="set active player ship"
        inputs={[
          { placeholder: 'player_id', key: 'playerId' },
          { placeholder: 'player_ship_id', key: 'playerShipId', min: 0 },
        ]}
        onSubmit={({ playerId, playerShipId }) =>
          setActivePlayerShip(playerId, playerShipId).then(console.log)
        }
      />

      <AdminSection
        buttonLabel="get active player ship"
        inputs={[{ placeholder: 'player_id', key: 'playerId' }]}
        onSubmit={({ playerId }) =>
          getActivePlayerShip(playerId).then(console.log)
        }
      />

      <AdminSection
        buttonLabel="initiate player travel"
        inputs={[
          { placeholder: 'player_id', key: 'playerId' },
          { placeholder: 'celestial_id', key: 'celestialId' },
        ]}
        onSubmit={({ playerId, celestialId }) =>
          initiatePlayerTravel(playerId, celestialId).then(console.log)
        }
      />
    </>
  )
}

export default AdminDashboard
