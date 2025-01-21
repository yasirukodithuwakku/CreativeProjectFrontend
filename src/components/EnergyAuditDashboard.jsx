import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import React, { useEffect, useState } from "react";
import "../js/dashboard.js";
import { db } from "../config/firebase.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import axios from "axios";
function EnergyAuditDashboard() {
  // real time data variables
  const [environmentalData, setEnvironmentalData] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [temperature, setTemperature] = useState([]);
  const [lightIntensity, setLightIntensity] = useState([]);
  const [power, setPower] = useState([]);

  //select year and month
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(12);

  //annual report's data
  const [annualReport, setAnnualReport] = useState([]);
  const [monthlyAveragesOfEachMonth, setMonthlyAveragesOfEachMonth] = useState( [] );
  useEffect(() => {
    const annualEnergyReport = async () => {
      try {
        console.log("Year:", year, "Month:", month);
        const response = await axios.get("http://localhost:3000/events", {
          params: { year, month },
        });
        console.log(response.data);
        setAnnualReport(response.data);        
        setMonthlyAveragesOfEachMonth(response.data.monthlyAveragesOfEachMonth);
        console.log(monthlyAveragesOfEachMonth);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log(error.response.data);
      }
    };

    annualEnergyReport();
  }, [year, month]);

  useEffect(() => {
    async function fetchRealTimeEnvData() {
      try {
        // reference to collection
        const environmentalDataCollection = collection(db, "collection1");
        const powerDataCollection = collection(db, "Every2Seconds");

        // latest document
        const latestEnvDocQuery = query(
          environmentalDataCollection,
          orderBy("Timestamp", "desc"),
          limit(1)
        );

        const latestPowerDocQuery = query(
          powerDataCollection,
          orderBy("Timestamp", "desc"),
          limit(1)
        );

        // Set up a real-time listener for environmental data
        const unsubscribeEnv = onSnapshot(latestEnvDocQuery, (snapshot) => {
          if (snapshot.docChanges().length > 0) {
            if (snapshot.empty) {
              console.log("No matching documents.");
            } else {
              const envList = snapshot.docs
                .filter((doc) => doc.exists) // Filter out deleted documents
                .map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
              setEnvironmentalData(envList);
              setHumidity(envList.map((user) => user.Humidity));
              setTemperature(envList.map((user) => user.Temperature));
              setLightIntensity(envList.map((user) => user.Light));
              // console.log("Fetched environmental document:", envList);
            }
          }
        });

        // Set up a real-time listener for power data
        const unsubscribePower = onSnapshot(latestPowerDocQuery, (snapshot) => {
          if (snapshot.empty) {
            console.log("No matching documents.");
          } else {
            const powerList = snapshot.docs
              .filter((doc) => doc.exists) // Filter out deleted documents
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
            setPower(powerList.map((user) => user.Power));
            // console.log("Fetched power document:", powerList);
          }
        });

        // Clean the listeners on component unmount
        return () => {
          unsubscribeEnv();
          unsubscribePower();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchRealTimeEnvData();
  }, [humidity, temperature, lightIntensity]);

  const barData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      { label: "Power", data: [25, 20, 18, 12], backgroundColor: "#FFD700" },
      { label: "Humidity", data: [10, 18, 12, 15], backgroundColor: "#DC143C" },
      {
        label: "Temperature",
        data: [12, 15, 20, 10],
        backgroundColor: "#4169E1",
      },
    ],
  };

  // Line Chart
  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
    ],
    datasets: [
      {
        label: "Power",
        data: [10, 15, 25, 20, 30, 18, 24, 15, 10, 12, 14],
        borderColor: "#1E90FF",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Temperature",
        data: [28, 29, 25, 20, 30, 28, 24, 27, 30, 31, 24],
        borderColor: "#DC253C",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Humidity",
        data: [10, 1, 45, 23, 80, 16, 27, 19, 60, 56, 36],
        borderColor: "#0000FF",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-5">
      <div className="bg-slate-400 py-4 text-center rounded-md">
        <h1 className="text-3xl font-bold text-white">
          Room-Level Energy and Environmental Conditions Monitoring Device
        </h1>
      </div>

      <div className="flex flex-wrap justify-between mt-8">
        <div className="w-full md:w-1/2 p-4">
          <h3 className="text-xl font-semibold text-center mb-4">
            Energy Usage Report : {month}, {year}
          </h3>
          <div className="flex justify-center mb-4">
            <select
              className="border border-gray-300 rounded-md p-2 mr-2"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
            <select
              className="border border-gray-300 rounded-md p-2"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Bar data={barData} />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center ">
          <h3 className="text-xl font-semibold text-center mb-4 relative">
            <div className="absolute top-2 right-2 rounded-full bg-blue-600 w-4 h-4"></div>
            Real Time Metrics
          </h3>
          <div className="div grid grid-cols-2 items-center justify-center gap-4  ">
            <div className="flex flex-col items-center bg-sky-100  rounded-xl py-5 relative">
              <h4 className="text-lg font-semibold">Temperature</h4>
              <p className="text-4xl font-semibold text-blue-500 ">
                {temperature[0]?.toFixed(2)}°C
                {/* 20.5°C */}
              </p>
            </div>
            <div className="flex flex-col items-center bg-red-100 rounded-xl py-5 relative">
              <h4 className="text-lg font-semibold">Humidity</h4>
              <p className="text-4xl font-semibold text-red-500">
                {humidity[0]?.toFixed(2)}%{/* 75.7% */}
              </p>
            </div>
            <div className="flex flex-col items-center bg-yellow-100 rounded-xl py-5 relative">
              <h4 className="text-lg font-semibold">Light Intensity</h4>
              <p className="text-4xl font-semibold text-yellow-500">
                {lightIntensity[0]?.toFixed(2)} LUX
                {/* 7.5 LUX */}
              </p>
            </div>
            <div className="flex flex-col items-center bg-green-100 rounded-xl py-5 relative">
              <h4 className="text-lg font-semibold">Power</h4>
              <p className="text-4xl font-semibold text-green-500">
                {power[0]?.toFixed(2)} W{/* 25.5 W */}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart Section */}

      <div className="mt-8 p-4">
        <h3 className="text-xl font-semibold text-center mb-4">
          Annual Energy Report
        </h3>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}

export default EnergyAuditDashboard;
