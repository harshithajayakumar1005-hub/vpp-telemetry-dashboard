import React, { useState, useEffect } from 'react';
import './App.css';

// Define the interface for Telemetry Data structure
interface TelemetryData {
  load: number;
  solar: number;
  soc: number;
  time?: string;
}

// Fallback to local server if REACT_APP_API_URL is not set
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    load: 0,
    solar: 0,
    soc: 0,
  });

  const [history, setHistory] = useState<TelemetryData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/api/telemetry`)
        .then((res) => res.json())
        .then((data: TelemetryData) => {
          const currentTime = new Date().toLocaleTimeString();
          const newData = { ...data, time: currentTime };

          setTelemetry(newData);
          setHistory((prev) => [...prev.slice(-14), newData]);
        })
        .catch((err) => console.error('Error fetching telemetry:', err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App" style={{ backgroundColor: '#0f172a', color: '#ffffff', minHeight: '100vh', padding: '20px' }}>
      <h1>⚡ VPP Real-Time Telemetry & Monitoring Dashboard</h1>

      {/* Low SOC Warning Alert */}
      {telemetry.soc <= 0 && (
        <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '10px 15px', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ Warning: Battery SOC is low ({telemetry.soc}%)! Consider reducing load or charging.
        </div>
      )}

      {/* Metrics Cards Display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>🔌 Load Power</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f43f5e' }}>{telemetry.load} kW</p>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>🌞 Solar Generation</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#eab308' }}>{telemetry.solar} kW</p>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>🔋 Battery SOC</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>{telemetry.soc} %</p>
        </div>
      </div>

      {/* History Log Section */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px' }}>
        <h3>📊 Real-Time Telemetry Log (Last 15 readings)</h3>
        <ul style={{ listStyleType: 'none', paddingLeft: 0, maxHeight: '200px', overflowY: 'auto' }}>
          {history.map((item, index) => (
            <li key={index} style={{ borderBottom: '1px solid #334155', padding: '8px 0', fontSize: '0.9rem' }}>
              <strong>[{item.time}]</strong> Load: {item.load} kW | Solar: {item.solar} kW | SOC: {item.soc}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;