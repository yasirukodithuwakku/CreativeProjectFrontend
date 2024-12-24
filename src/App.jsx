import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import EnergyAuditDashboard from '../src/components/EnergyAuditDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <EnergyAuditDashboard/>
      )
}

export default App
