import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import EnergyAuditDashboard from "./components/EnergyAuditDashboard";

function App() {
  const handleLogin = () => {
    console.log("User logged in successfully!");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route to the Login page */}
        <Route path="/" element={<Login />} />

        {/* Route to the Energy Audit Dashboard */}
        <Route path="/dashboard" element={<EnergyAuditDashboard />} />
      </Routes>
    </BrowserRouter>
  );}

export default App