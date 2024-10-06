import { forwardRef, useRef, type InputHTMLAttributes } from 'react'
import {
  addPlayerShip,
  dbUp,
  dbDown,
  createPlayer,
  getPlayer,
  getPlayerLocation,
  getPlayers,
  initiatePlayerTravel,
  setPlayerLocation,
  setActivePlayerShip,
  getAllShipTypes,
  getShipType,
  getActivePlayerShip,
  getPlayerShips,
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

  const onGetAllShipTypes = () => getAllShipTypes()

  const refgetShipType_ShipId = useRef<HTMLInputElement>(null)
  const onGetShipType = async () => {
    const id = refgetShipType_ShipId.current?.value
    if (!id) {
      alert('ship_id is required')
      return
    }

    getShipType(parseInt(id))
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
  const refSetPlayerLocation_CelestialId = useRef<HTMLInputElement>(null)
  const onSetPlayerLocation = async () => {
    const playerId = refSetPlayerLocation_PlayerId.current?.value
    const celestialId = refSetPlayerLocation_CelestialId.current?.value
    if (!playerId || !celestialId) {
      alert('player_id and celestial_id are required')
      return
    }

    setPlayerLocation(parseInt(playerId), parseInt(celestialId))
  }

  const refAddPlayerShip_PlayerId = useRef<HTMLInputElement>(null)
  const refAddPlayerShip_ShipTypeId = useRef<HTMLInputElement>(null)
  const refAddPlayerShip_StationId = useRef<HTMLInputElement>(null)
  const onAddPlayerShip = async () => {
    const playerId = refAddPlayerShip_PlayerId.current?.value
    const shipTypeId = refAddPlayerShip_ShipTypeId.current?.value
    const stationId = refAddPlayerShip_StationId.current?.value
    if (!playerId || !shipTypeId || !stationId) {
      alert('player_id, ship_type_id, and station_celestial_id are required')
      return
    }

    addPlayerShip(parseInt(playerId), parseInt(shipTypeId), parseInt(stationId))
  }

  const refGetPlayerShips_PlayerId = useRef<HTMLInputElement>(null)
  const onGetPlayerShips = () => {
    const playerId = refGetPlayerShips_PlayerId.current?.value
    if (!playerId) {
      alert('player_id is required')
      return
    }

    getPlayerShips(parseInt(playerId))
  }

  const refSetActivePlayerShip_PlayerId = useRef<HTMLInputElement>(null)
  const refSetActivePlayerShip_PlayerShipId = useRef<HTMLInputElement>(null)
  const onSetActivePlayerShip = async () => {
    const playerId = refSetActivePlayerShip_PlayerId.current?.value
    const playerShipId = refSetActivePlayerShip_PlayerShipId.current?.value
    if (!playerId || !playerShipId) {
      alert('player_id and player_ship_id are required')
      return
    }

    setActivePlayerShip(parseInt(playerId), parseInt(playerShipId))
  }

  const refGetActivePlayerShip_PlayerId = useRef<HTMLInputElement>(null)
  const onGetActivePlayerShip = async () => {
    const playerId = refGetActivePlayerShip_PlayerId.current?.value
    if (!playerId) {
      alert('player_id is required')
      return
    }

    getActivePlayerShip(parseInt(playerId))
  }

  const refInitiatePlayerTravel_PlayerId = useRef<HTMLInputElement>(null)
  const refInitiatePlayerTravel_CelestialId = useRef<HTMLInputElement>(null)
  const onInitiatePlayerTravel = async () => {
    const playerId = refInitiatePlayerTravel_PlayerId.current?.value
    const celestialId = refInitiatePlayerTravel_CelestialId.current?.value
    if (!playerId || !celestialId) {
      alert('player_id and celestial_id are required')
      return
    }

    initiatePlayerTravel(parseInt(playerId), parseInt(celestialId))
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
        <button onClick={onGetAllShipTypes}>get all ship types</button>
      </Section>
      <Section>
        <button onClick={onGetShipType}>get ship type</button>
        <LineDivider />
        <NumberInput ref={refgetShipType_ShipId} placeholder="ship_id" />
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
          ref={refSetPlayerLocation_CelestialId}
          placeholder="celestial_id"
        />
      </Section>
      <Section>
        <button onClick={onAddPlayerShip}>add player ship</button>
        <LineDivider />
        <NumberInput ref={refAddPlayerShip_PlayerId} placeholder="player_id" />
        <LineDivider />
        <NumberInput
          ref={refAddPlayerShip_ShipTypeId}
          placeholder="ship_type_id"
          min="0"
        />
        <LineDivider />
        <NumberInput
          ref={refAddPlayerShip_StationId}
          placeholder="station_celestial_id"
        />
      </Section>
      <Section>
        <button onClick={onGetPlayerShips}>get player ships</button>
        <LineDivider />
        <NumberInput ref={refGetPlayerShips_PlayerId} placeholder="player_id" />
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
          ref={refSetActivePlayerShip_PlayerShipId}
          placeholder="player_ship_id"
        />
      </Section>
      <Section>
        <button onClick={onGetActivePlayerShip}>get active player ship</button>
        <LineDivider />
        <NumberInput
          ref={refGetActivePlayerShip_PlayerId}
          placeholder="player_id"
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
          ref={refInitiatePlayerTravel_CelestialId}
          placeholder="celestial_id"
        />
      </Section>
    </>
  )
}

export default AdminDashboard
