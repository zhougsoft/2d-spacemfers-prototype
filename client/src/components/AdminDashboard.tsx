import { useRef } from 'react'

const API_URL = 'http://localhost:6969'

const LineDivider = () => <span>&nbsp;|&nbsp;</span>

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

const request = async (url: string, method?: string) => {
  try {
    const res = await fetch(url, {
      method: method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

const AdminDashboard = () => {
  const onDbUp = async () => {
    const data = await request(`${API_URL}/api/db-up`)
    console.log(data)
  }

  const onDbDown = async () => {
    const data = await request(`${API_URL}/api/db-down`)
    console.log(data)
  }

  const onGetSolarSystem = async () => {
    const data = await request(`${API_URL}/api/solar-system`)
    console.log(data)
  }

  const onGetGameShips = async () => {
    const data = await request(`${API_URL}/api/game-ships`)
    console.log(data)
  }

  const onCreatePlayer = async () => {
    const data = await request(`${API_URL}/api/players/create`, 'POST')
    console.log(data)
  }

  const onGetPlayers = async () => {
    const data = await request(`${API_URL}/api/players`)
    console.log(data)
  }

  const refGetPlayer_PlayerId = useRef<HTMLInputElement>(null)
  const onGetPlayer = async () => {
    const id = refGetPlayer_PlayerId.current?.value
    if (!id) {
      alert('player_id is required')
      return
    }

    const data = await request(`${API_URL}/api/players/${id}`)
    console.log(data)
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
      <h2>universe</h2>
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
        <input
          ref={refGetPlayer_PlayerId}
          type="number"
          min="1"
          placeholder="player_id"
        />
      </Section>
      <h2>player state</h2>
      <Section>
        <button onClick={() => console.log('todo')}>
          todo: set player location
        </button>
      </Section>
      <Section>
        <button onClick={() => console.log('todo')}>
          todo: add player ship
        </button>
      </Section>
      <Section>
        <button onClick={() => console.log('todo')}>
          todo: set active player ship
        </button>
      </Section>
      <Section>
        <button onClick={() => console.log('todo')}>
          todo: initiate player travel
        </button>
      </Section>
    </main>
  )
}

export default AdminDashboard
