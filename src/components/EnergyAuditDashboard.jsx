import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

function EnergyAuditDashboard() {
  
  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      { label: 'Power', data: [25, 20, 18, 12], backgroundColor: '#FFD700' },
      { label: 'Humidity', data: [10, 18, 12, 15], backgroundColor: '#DC143C' },
      { label: 'Temperature', data: [12, 15, 20, 10], backgroundColor: '#4169E1' },
    ],
  };

  // Line Chart
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    datasets: [
      {
        label: 'Power',
        data: [10, 15, 25, 20, 30, 18, 24, 15, 10, 12, 14],
        borderColor: '#1E90FF',
        //backgroundColor: 'rgba(30, 144, 255, 0.2)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Temperature',
        data: [28, 29, 25, 20, 30, 28, 24, 27, 30, 31, 24],
        borderColor: '#DC253C',
        //backgroundColor: 'rgba(220, 20, 60, 0.2)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Humidity',
        data: [10, 1, 45, 23, 80, 16, 27, 19, 60, 56, 36],
        borderColor: '#0000FF',
        //backgroundColor: 'rgba(0, 255, 0, 0.2)',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  


  return (
    <div className="min-h-screen bg-gray-100 font-sans p-5">

      {/* Dashboard Header */}

      <div className="bg-red-500 py-4 text-center">
        <h1 className="text-3xl font-bold text-green-400">Room-Level Energy and Environmental Conditions Monitoring Device</h1>
      </div>


      {/* Main Content */}

      <div className="flex flex-wrap justify-between mt-8">
        {/* Bar Chart Section */}
        <div className="w-full md:w-1/2 p-4">
          <h3 className="text-xl font-semibold text-center mb-4">This Month's Energy Report</h3>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Bar data={barData} />
          </div>
        </div>


        {/* Metrics Section */}
        
        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center space-y-4">
        <h2 className="text-green-900 text-3xl text-center">
            <span className="font-bold">Real Time Observation</span> 
          </h2>
          <h2 className="text-gray-800 text-2xl text-center">
            <span className="font-bold">2.6KW</span> Power
          </h2>
          <h2 className="text-gray-800 text-2xl text-center">
            <span className="font-bold">310 LUX</span> Light Intensity
          </h2>
          <h2 className="text-gray-800 text-2xl text-center">
            <span className="font-bold">43%</span> Humidity
          </h2>
          <h2 className="text-gray-800 text-2xl text-center">
            <span className="font-bold">24°C</span> Temperature
          </h2>
        </div>
      </div>
      

      {/* Line Chart Section */}

      <div className="mt-8 p-4">
        <h3 className="text-xl font-semibold text-center mb-4">Annual Energy Report</h3>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}

export default EnergyAuditDashboard;