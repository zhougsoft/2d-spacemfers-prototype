import { forwardRef, useRef, type InputHTMLAttributes } from 'react'
import {
  addPlayerShip,
  dbUp,
  dbDown,
  createPlayer,
  getGameShips,
  getPlayer,
  getPlayerLocation,
  getPlayers,
  getSolarSystem,
  initiatePlayerTravel,
  setPlayerLocation,
  setActivePlayerShip,
} from '../api'

const LineDivider = () => <span>&nbsp;|&nbsp;</span>

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
  const onGetSolarSystem = () => getSolarSystem()
  const onGetGameShips = () => getGameShips()

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
    <main style={{ padding: '0 1rem' }}>
      <h1>📡 spacemfers admin</h1>
      <p>(output in console)</p>
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
        <button onClick={onGetSolarSystem}>get solar system</button>
      </Section>
      <Section>
        <button onClick={onGetGameShips}>get game ships</button>
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
    </main>
  )
}

export default AdminDashboard
