import { useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import PlayerDashboard from './components/PlayerDashboard'

const App = () => {
  const [activeTab, setActiveTab] = useState('admin')

  return (
    <main style={{ padding: '1rem 2rem' }}>
      <header>
        <button onClick={() => setActiveTab('admin')}>admin</button>
        <span>&nbsp;|&nbsp;</span>
        <button onClick={() => setActiveTab('travel')}>player</button>
      </header>
      {activeTab === 'admin' ? <AdminDashboard /> : <PlayerDashboard />}
    </main>
  )
}

export default App
