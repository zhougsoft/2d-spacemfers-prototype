const API_URL = 'http://localhost:6969'

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
      justifyContent: flex ? 'space-evenly' : 'initial',
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

const App = () => {
  const onDbUp = async () => {
    const data = await request(`${API_URL}/api/db-up`)
    console.log(data)
  }

  const onDbDown = async () => {
    const data = await request(`${API_URL}/api/db-down`)
    console.log(data)
  }

  const onCreatePlayer = async () => {
    const data = await request(`${API_URL}/api/players/create`, 'POST')
    console.log(data)
  }

  return (
    <main>
      <h1>spacemfers</h1>
      <Section flex>
        <div>
          <button onClick={onDbUp}>db up</button>
          <pre>[output here]</pre>
        </div>
        <div>
          <button onClick={onDbDown}>db down</button>
          <pre>[output here]</pre>
        </div>
      </Section>
      <Section>
        <button onClick={onCreatePlayer}>create player</button>
        <pre>[output here]</pre>
      </Section>
      <Section>
        <button>get all players</button>
        <pre>[output here]</pre>
      </Section>
      <Section>
        <button>get player</button>
        <input type="number" min="1" placeholder="player_id" />
        <pre>[output here]</pre>
      </Section>
    </main>
  )
}

export default App
