import {
  addPlayerShip,
  createPlayer,
  dbDown,
  dbUp,
  getActivePlayerShip,
  getAllShipTypes,
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
        <AdminSection buttonLabel="🚀 db up" onSubmit={() => dbUp()} />
        &nbsp;
        <AdminSection buttonLabel="💥 db down" onSubmit={() => dbDown()} />
      </div>

      <h2>🌌 universe admin</h2>

      <AdminSection
        buttonLabel="get all ship types"
        onSubmit={() => getAllShipTypes()}
      />

      <AdminSection
        buttonLabel="get ship type"
        inputs={[{ placeholder: 'ship_type_id', key: 'shipTypeId' }]}
        onSubmit={({ shipTypeId }) => getShipType(shipTypeId)}
      />

      <h2>🧑‍🚀 player admin</h2>

      <AdminSection
        buttonLabel="create player"
        onSubmit={() => createPlayer()}
      />

      <AdminSection
        buttonLabel="get all players"
        onSubmit={() => getPlayers()}
      />

      <AdminSection
        buttonLabel="get player"
        inputs={[{ placeholder: 'player_id', key: 'playerId' }]}
        onSubmit={({ playerId }) => getPlayer(playerId)}
      />

      <h2>🎮 player state</h2>

      <AdminSection
        buttonLabel="get player location"
        inputs={[{ placeholder: 'player_id', key: 'playerId' }]}
        onSubmit={({ playerId }) => getPlayerLocation(playerId)}
      />

      <AdminSection
        buttonLabel="set player location"
        inputs={[
          { placeholder: 'player_id', key: 'playerId' },
          { placeholder: 'celestial_id', key: 'celestialId' },
        ]}
        onSubmit={({ playerId, celestialId }) =>
          setPlayerLocation(playerId, celestialId)
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
          addPlayerShip(playerId, shipTypeId, stationCelestialId)
        }
      />

      <AdminSection
        buttonLabel="get player ships"
        inputs={[{ placeholder: 'player_id', key: 'playerId' }]}
        onSubmit={({ playerId }) => getPlayerShips(playerId)}
      />

      <AdminSection
        buttonLabel="set active player ship"
        inputs={[
          { placeholder: 'player_id', key: 'playerId' },
          { placeholder: 'player_ship_id', key: 'playerShipId' },
        ]}
        onSubmit={({ playerId, playerShipId }) =>
          setActivePlayerShip(playerId, playerShipId)
        }
      />

      <AdminSection
        buttonLabel="get active player ship"
        inputs={[{ placeholder: 'player_id', key: 'playerId' }]}
        onSubmit={({ playerId }) => getActivePlayerShip(playerId)}
      />

      <AdminSection
        buttonLabel="initiate player travel"
        inputs={[
          { placeholder: 'player_id', key: 'playerId' },
          { placeholder: 'celestial_id', key: 'celestialId' },
        ]}
        onSubmit={({ playerId, celestialId }) =>
          initiatePlayerTravel(playerId, celestialId)
        }
      />
    </>
  )
}

export default AdminDashboard
