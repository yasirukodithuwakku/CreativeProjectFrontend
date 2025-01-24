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
  const [monthlyAveragesOfEachMonth, setMonthlyAveragesOfEachMonth] = useState(
    []
  );
  const [weeklyAverageOfEachMonth, setWeeklyAverageOfEachMonth] = useState([]);
  const [weeklyAverageOfPowerData, setWeeklyAverageOfPowerData] = useState([]);
  const [monthlyAverageOfPowerData, setMonthlyAverageOfPowerData] = useState(
    []
  );

  // state for popup
  const [showPopup, setShowPopup] = useState(false);

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
        setWeeklyAverageOfEachMonth(response.data.weeklyAverages);
        setWeeklyAverageOfPowerData(response.data.powerWeeklyAverages);
        setMonthlyAverageOfPowerData(
          response.data.powerMonthlyAveragesOfEachMonth
        );
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
      {
        label: "Power",
        data: [
          weeklyAverageOfPowerData?.week1?.Power / 100 || 0,
          weeklyAverageOfPowerData?.week2?.Power / 100 || 0,
          weeklyAverageOfPowerData?.week3?.Power / 100 || 0,
          weeklyAverageOfPowerData?.week4?.Power / 100 || 0,
        ],
        backgroundColor: "#FFD700",
      },
      {
        label: "Humidity",
        data: [
          weeklyAverageOfEachMonth?.week1?.Humidity || 0,
          weeklyAverageOfEachMonth?.week2?.Humidity || 0,
          weeklyAverageOfEachMonth?.week3?.Humidity || 0,
          weeklyAverageOfEachMonth?.week4?.Humidity || 0,
        ],
        backgroundColor: "#DC143C",
      },
      {
        label: "Temperature",
        data: [
          weeklyAverageOfEachMonth?.week1?.Temperature || 0,
          weeklyAverageOfEachMonth?.week2?.Temperature || 0,
          weeklyAverageOfEachMonth?.week3?.Temperature || 0,
          weeklyAverageOfEachMonth?.week4?.Temperature || 0,
        ],
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
        data:
          monthlyAverageOfPowerData &&
          typeof monthlyAverageOfPowerData === "object"
            ? Object.values(monthlyAverageOfPowerData).map(
                (item) => item.Power / 100
              )
            : [],
        borderColor: "#1E90FF",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Temperature",
        data:
          monthlyAveragesOfEachMonth &&
          typeof monthlyAveragesOfEachMonth === "object"
            ? Object.values(monthlyAveragesOfEachMonth).map(
                (item) => item.Temperature
              )
            : [],
        borderColor: "#DC253C",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Humidity",
        data:
          monthlyAveragesOfEachMonth &&
          typeof monthlyAveragesOfEachMonth === "object"
            ? Object.values(monthlyAveragesOfEachMonth).map(
                (item) => item.Humidity
              )
            : [],
        borderColor: "#0000FF",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 font-sans p-5">
      <div className="bg-gradient-to-r from-slate-500 to-slate-700 py-4 text-center rounded-md shadow-lg">
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
              className="border border-gray-300 rounded-md p-2 mr-2 shadow-sm"
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
              className="border border-gray-300 rounded-md p-2 shadow-sm"
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
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Bar data={barData} />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-center mb-4 relative">
            <div className="absolute top-2 right-2 rounded-full bg-green-600 w-4 h-4"></div>
            <div className="absolute top-2 right-2 rounded-full bg-green-600 w-4 h-4 animate-ping"></div>
            Real Time Metrics
          </h3>
          <div className="grid grid-cols-2 items-center justify-center gap-4">
            <div className="flex flex-col items-center bg-sky-100 rounded-xl py-5 shadow-md">
              <h4 className="text-lg font-semibold">Temperature</h4>
              <p className="text-4xl font-semibold text-blue-500">
                {temperature[0]?.toFixed(2)}°C
              </p>
            </div>
            <div className="flex flex-col items-center bg-red-100 rounded-xl py-5 shadow-md">
              <h4 className="text-lg font-semibold">Humidity</h4>
              <p className="text-4xl font-semibold text-red-500">
                {humidity[0]?.toFixed(2)}%
              </p>
            </div>
            <div className="flex flex-col items-center bg-yellow-100 rounded-xl py-5 shadow-md">
              <h4 className="text-lg font-semibold">Light Intensity</h4>
              <p className="text-4xl font-semibold text-yellow-500">
                {lightIntensity[0]?.toFixed(2)} LUX
              </p>
            </div>
            <div className="flex flex-col items-center bg-green-100 rounded-xl py-5 shadow-md">
              <h4 className="text-lg font-semibold">Power</h4>
              <p className="text-4xl font-semibold text-green-500">
                {power[0]?.toFixed(2)} W
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 text-center">
            <h3 className="text-lg font-semibold">
              Last Updated:{" "}
              <span className="font-bold text-blue-600">
                {new Date(environmentalData[0]?.Timestamp).toLocaleString()}
              </span>
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4">
        <h3 className="text-xl font-semibold text-center mb-4">
          Annual Energy Report
        </h3>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <Line data={lineData} />
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <button
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg"
          onClick={() => setShowPopup(true)}
        >
          Guidelines
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">
              Guidelines and Suggestions
            </h2>
            <ul className="list-disc pl-5">
              <li>Ensure the temperature remains within the optimal range.</li>
              <li>Maintain humidity levels to prevent mold growth.</li>
              <li>Monitor light intensity to save energy.</li>
              <li>Regularly check power consumption to identify anomalies.</li>
            </ul>
            <button
              className="mt-4 bg-red-500 text-white p-2 rounded"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnergyAuditDashboard;
