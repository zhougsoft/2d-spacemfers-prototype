import { useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import { LineDivider } from './components/Shared'
import PlayerDashboard from './components/PlayerDashboard'

const App = () => {
  const [activeTab, setActiveTab] = useState('admin')

  return (
    <main style={{ padding: '1rem 2rem' }}>
      <header>
        <button onClick={() => setActiveTab('admin')}>admin</button>
        <LineDivider />
        <button onClick={() => setActiveTab('travel')}>player</button>
      </header>
      {activeTab === 'admin' ? <AdminDashboard /> : <PlayerDashboard />}
    </main>
  )
}

export default App
