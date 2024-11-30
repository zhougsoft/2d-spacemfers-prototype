import { useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import PlayerDashboard from './components/PlayerDashboard'
import Game from './components/Game'

const App = () => {
  const [activeTab, setActiveTab] = useState('game')

  const tabs = {
    admin: <AdminDashboard />,
    player: <PlayerDashboard />,
    game: <Game />,
  }

  return (
    <main>
      <header>
        <button onClick={() => setActiveTab('admin')}>admin</button>
        <span>&nbsp;|&nbsp;</span>
        <button onClick={() => setActiveTab('player')}>player</button>
        <span>&nbsp;|&nbsp;</span>
        <button onClick={() => setActiveTab('game')}>game</button>
      </header>
      {tabs[activeTab as keyof typeof tabs]}
    </main>
  )
}

export default App
