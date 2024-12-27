import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import EnergyAuditDashboard from './EnergyAuditDashboard';

function App() {
  const handleLogin = () => {
    console.log('User logged in successfully!');
  };

  return (
    <Router>
      <Routes>
        {/* Default route to the Login page */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        
        {/* Route to the Energy Audit Dashboard */}
        <Route path="/dashboard" element={<EnergyAuditDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
