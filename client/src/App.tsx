import { useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import Game from './components/Game'
import { PlayerProvider } from './contexts/PlayerContext'

const App = () => {
  const [activeTab, setActiveTab] = useState('game')

  const tabs = {
    admin: <AdminDashboard />,
    game: <Game />,
  }

  return (
    <PlayerProvider>
      <main>
        <header>
          <button onClick={() => setActiveTab('admin')}>admin</button>
          <span>&nbsp;|&nbsp;</span>
          <button onClick={() => setActiveTab('game')}>game</button>
        </header>
        {tabs[activeTab as keyof typeof tabs]}
      </main>
    </PlayerProvider>
  )
}

export default App
