import { useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import { LineDivider } from './components/Shared'
import MapPrototype from './components/MapPrototype'

const App = () => {
  const [activeTab, setActiveTab] = useState('admin')

  return (
    <main style={{ padding: '1rem 2rem' }}>
      <header>
        <button onClick={() => setActiveTab('admin')}>admin</button>
        <LineDivider />
        <button onClick={() => setActiveTab('travel')}>travel prototype</button>
      </header>
      {activeTab === 'admin' ? <AdminDashboard /> : <MapPrototype />}
    </main>
  )
}

export default App
