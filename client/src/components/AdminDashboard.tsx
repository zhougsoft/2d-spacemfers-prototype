import { forwardRef, useRef, type InputHTMLAttributes } from 'react'
import {
  addPlayerShip,
  dbUp,
  dbDown,
  createPlayer,
  getPlayer,
  getPlayerLocation,
  getPlayers,
  getSystem,
  initiatePlayerTravel,
  setPlayerLocation,
  setActivePlayerShip,
  getLocation,
  getAllLocations,
  getPlanetByLocation,
  getStationByLocation,
  getMoonByLocation,
  getBeltByLocation,
  getAllShips,
  getShip,
  getAllSystems,
  getPlanetsBySystem,
} from '../api'
import { LineDivider } from './Shared'

const NumberInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ placeholder, ...props }, ref) => (
  <input
    ref={ref}
    type="number"
    min="1"
    style={{ maxWidth: '10rem' }}
    placeholder={placeholder}
    {...props}
  />
))

const Section = ({
  children,
  flex,
}: {
  children?: React.ReactNode | React.ReactNode[]
  flex?: boolean
}) => (
  <div
    style={{
      display: flex ? 'flex' : 'block',
      border: '2px dotted black',
      marginBottom: '1rem',
      padding: '1rem',
    }}>
    {children}
  </div>
)

const AdminDashboard = () => {
  // --- database admin -------------------------------------------------------
  const onDbUp = () => dbUp()
  const onDbDown = () => dbDown()

  // --- universe admin -------------------------------------------------------
  const onGetAllLocations = () => getAllLocations()

  const refGetLocation_LocationId = useRef<HTMLInputElement>(null)
  const onGetLocation = async () => {
    const id = refGetLocation_LocationId.current?.value
    if (!id) {
      alert('location_id is required')
      return
    }

    getLocation(parseInt(id))
  }

  const onGetAllSystems = () => getAllSystems()

  const refGetSystem_SystemId = useRef<HTMLInputElement>(null)
  const onGetSystem = async () => {
    const id = refGetSystem_SystemId.current?.value
    if (!id) {
      alert('system_id is required')
      return
    }

    getSystem(parseInt(id))
  }

  const refGetPlanetsBySystem_SystemId = useRef<HTMLInputElement>(null)
  const onGetPlanetsBySystem = async () => {
    const id = refGetPlanetsBySystem_SystemId.current?.value
    if (!id) {
      alert('system_id is required')
      return
    }

    getPlanetsBySystem(parseInt(id))
  }

  const refGetPlanetByLocation_LocationId = useRef<HTMLInputElement>(null)
  const onGetPlanetByLocation = async () => {
    const id = refGetPlanetByLocation_LocationId.current?.value
    if (!id) {
      alert('location_id is required')
      return
    }

    getPlanetByLocation(parseInt(id))
  }

  const refGetStation_LocationId = useRef<HTMLInputElement>(null)
  const onGetStation = async () => {
    const id = refGetStation_LocationId.current?.value
    if (!id) {
      alert('location_id is required')
      return
    }

    getStationByLocation(parseInt(id))
  }

  const refGetMoon_LocationId = useRef<HTMLInputElement>(null)
  const onGetMoon = async () => {
    const id = refGetMoon_LocationId.current?.value
    if (!id) {
      alert('location_id is required')
      return
    }

    getMoonByLocation(parseInt(id))
  }

  const refGetBelt_LocationId = useRef<HTMLInputElement>(null)
  const onGetBelt = async () => {
    const id = refGetBelt_LocationId.current?.value
    if (!id) {
      alert('location_id is required')
      return
    }

    getBeltByLocation(parseInt(id))
  }

  const onGetAllShips = () => getAllShips()

  const refGetShip_ShipId = useRef<HTMLInputElement>(null)
  const onGetShip = async () => {
    const id = refGetShip_ShipId.current?.value
    if (!id) {
      alert('ship_id is required')
      return
    }

    getShip(parseInt(id))
  }

  // --- player admin ---------------------------------------------------------
  const onCreatePlayer = () => createPlayer()
  const onGetPlayers = () => getPlayers()

  const refGetPlayer_PlayerId = useRef<HTMLInputElement>(null)
  const onGetPlayer = async () => {
    const id = refGetPlayer_PlayerId.current?.value
    if (!id) {
      alert('player_id is required')
      return
    }

    getPlayer(parseInt(id))
  }

  // --- player state ---------------------------------------------------------
  const refGetPlayerLocation_PlayerId = useRef<HTMLInputElement>(null)
  const onGetPlayerLocation = async () => {
    const id = refGetPlayerLocation_PlayerId.current?.value
    if (!id) {
      alert('player_id is required')
      return
    }

    getPlayerLocation(parseInt(id))
  }

  const refSetPlayerLocation_PlayerId = useRef<HTMLInputElement>(null)
  const refSetPlayerLocation_LocationId = useRef<HTMLInputElement>(null)
  const onSetPlayerLocation = async () => {
    const playerId = refSetPlayerLocation_PlayerId.current?.value
    const locationId = refSetPlayerLocation_LocationId.current?.value
    if (!playerId || !locationId) {
      alert('player_id and location_id are required')
      return
    }

    setPlayerLocation(parseInt(playerId), parseInt(locationId))
  }

  const refAddPlayerShip_PlayerId = useRef<HTMLInputElement>(null)
  const refAddPlayerShip_ShipId = useRef<HTMLInputElement>(null)
  const refAddPlayerShip_StationId = useRef<HTMLInputElement>(null)
  const onAddPlayerShip = async () => {
    const playerId = refAddPlayerShip_PlayerId.current?.value
    const shipId = refAddPlayerShip_ShipId.current?.value
    const stationId = refAddPlayerShip_StationId.current?.value
    if (!playerId || !shipId || !stationId) {
      alert('player_id, ship_id, and station_id are required')
      return
    }

    addPlayerShip(parseInt(playerId), parseInt(shipId), parseInt(stationId))
  }

  const refSetActivePlayerShip_PlayerId = useRef<HTMLInputElement>(null)
  const refSetActivePlayerShip_ShipId = useRef<HTMLInputElement>(null)
  const onSetActivePlayerShip = async () => {
    const playerId = refSetActivePlayerShip_PlayerId.current?.value
    const shipId = refSetActivePlayerShip_ShipId.current?.value
    if (!playerId || !shipId) {
      alert('player_id and ship_id are required')
      return
    }

    setActivePlayerShip(parseInt(playerId), parseInt(shipId))
  }

  const refInitiatePlayerTravel_PlayerId = useRef<HTMLInputElement>(null)
  const refInitiatePlayerTravel_LocationId = useRef<HTMLInputElement>(null)
  const onInitiatePlayerTravel = async () => {
    const playerId = refInitiatePlayerTravel_PlayerId.current?.value
    const locationId = refInitiatePlayerTravel_LocationId.current?.value
    if (!playerId || !locationId) {
      alert('player_id and location_id are required')
      return
    }

    initiatePlayerTravel(parseInt(playerId), parseInt(locationId))
  }

  return (
    <>
      <h1>📡 spacemfers admin</h1>
      <p>output in console</p>
      <hr />
      <h2>db admin</h2>
      <Section flex>
        <div>
          <button onClick={onDbUp}>db up</button>
        </div>
        <LineDivider />
        <div>
          <button onClick={onDbDown}>db down</button>
        </div>
      </Section>
      <h2>universe admin</h2>
      <Section>
        <button onClick={onGetAllLocations}>get all locations</button>
      </Section>
      <Section>
        <button onClick={onGetLocation}>get location</button>
        <LineDivider />
        <NumberInput
          ref={refGetLocation_LocationId}
          placeholder="location_id"
        />
      </Section>
      <Section>
        <button onClick={onGetAllSystems}>get all systems</button>
      </Section>
      <Section>
        <button onClick={onGetSystem}>get system</button>
        <LineDivider />
        <NumberInput ref={refGetSystem_SystemId} placeholder="system_id" />
      </Section>
      <Section>
        <button onClick={onGetPlanetsBySystem}>get planets by system</button>
        <LineDivider />
        <NumberInput
          ref={refGetPlanetsBySystem_SystemId}
          placeholder="system_id"
        />
      </Section>
      <Section>
        <button onClick={onGetPlanetByLocation}>get planet by location</button>
        <LineDivider />
        <NumberInput
          ref={refGetPlanetByLocation_LocationId}
          placeholder="location_id"
        />
      </Section>
      <Section>
        <button onClick={onGetStation}>get station by location</button>
        <LineDivider />
        <NumberInput ref={refGetStation_LocationId} placeholder="location_id" />
      </Section>
      <Section>
        <button onClick={onGetMoon}>get moon by location</button>
        <LineDivider />
        <NumberInput ref={refGetMoon_LocationId} placeholder="location_id" />
      </Section>
      <Section>
        <button onClick={onGetBelt}>get belt by location</button>
        <LineDivider />
        <NumberInput ref={refGetBelt_LocationId} placeholder="location_id" />
      </Section>
      <Section>
        <button onClick={onGetAllShips}>get all ships</button>
      </Section>
      <Section>
        <button onClick={onGetShip}>get ship</button>
        <LineDivider />
        <NumberInput ref={refGetShip_ShipId} placeholder="ship_id" />
      </Section>
      <h2>player admin</h2>
      <Section>
        <button onClick={onCreatePlayer}>create player</button>
      </Section>
      <Section>
        <button onClick={onGetPlayers}>get players</button>
      </Section>
      <Section>
        <button onClick={onGetPlayer}>get player</button>
        <LineDivider />
        <NumberInput ref={refGetPlayer_PlayerId} placeholder="player_id" />
      </Section>
      <h2>player state</h2>
      <Section>
        <button onClick={onGetPlayerLocation}>get player location</button>
        <LineDivider />
        <NumberInput
          ref={refGetPlayerLocation_PlayerId}
          placeholder="player_id"
        />
      </Section>
      <Section>
        <button onClick={onSetPlayerLocation}>set player location</button>
        <LineDivider />
        <NumberInput
          ref={refSetPlayerLocation_PlayerId}
          placeholder="player_id"
        />
        <LineDivider />
        <NumberInput
          ref={refSetPlayerLocation_LocationId}
          placeholder="location_id"
        />
      </Section>
      <Section>
        <button onClick={onAddPlayerShip}>add player ship</button>
        <LineDivider />
        <NumberInput ref={refAddPlayerShip_PlayerId} placeholder="player_id" />
        <LineDivider />
        <NumberInput
          ref={refAddPlayerShip_ShipId}
          placeholder="ship_id"
          min="0"
        />
        <LineDivider />
        <NumberInput
          ref={refAddPlayerShip_StationId}
          placeholder="station_id"
        />
      </Section>
      <Section>
        <button onClick={onSetActivePlayerShip}>set active player ship</button>
        <LineDivider />
        <NumberInput
          ref={refSetActivePlayerShip_PlayerId}
          placeholder="player_id"
        />
        <LineDivider />
        <NumberInput
          ref={refSetActivePlayerShip_ShipId}
          placeholder="ship_id"
        />
      </Section>
      <Section>
        <button onClick={onInitiatePlayerTravel}>initiate player travel</button>
        <LineDivider />
        <NumberInput
          ref={refInitiatePlayerTravel_PlayerId}
          placeholder="player_id"
        />
        <LineDivider />
        <NumberInput
          ref={refInitiatePlayerTravel_LocationId}
          placeholder="location_id"
        />
      </Section>
    </>
  )
}

export default AdminDashboard
