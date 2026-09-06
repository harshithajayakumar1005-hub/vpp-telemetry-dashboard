import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface TelemetryData {
  load: number;
  solar: number;
  soc: number;
  timestamp?: string;
}

function App() {
  const [currentData, setCurrentData] = useState<TelemetryData>({ load: 0, solar: 0, soc: 0 });
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [manualOverride, setManualOverride] = useState<boolean>(false);
  const [generatorStatus, setGeneratorStatus] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://vpp-telemetry-dashboard.onrender.com/api/telemetry');
        const data = await response.json();
        const timeStr = new Date().toLocaleTimeString();
        const newRecord = { ...data, timestamp: timeStr };
        
        setCurrentData(data);
        setHistory(prev => [...prev.slice(-14), newRecord]);

        // Dynamic Alert Generation logic
        if (data.soc < 20) {
          setAlerts(prev => [`Warning: Battery SOC is critically low at ${data.soc}%!`, ...prev.slice(0, 4)]);
        } else if (data.load > data.solar + 50) {
          setAlerts(prev => [`Alert: High load demand exceeding solar generation!`, ...prev.slice(0, 4)]);
        }
      } catch (error) {
        console.error("Error fetching telemetry data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Theme Styles
  const themeStyles = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#0f172a',
    subText: isDarkMode ? '#94a3b8' : '#64748b',
    border: isDarkMode ? '#334155' : '#cbd5e1'
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: themeStyles.bg, color: themeStyles.text, minHeight: '100vh', transition: 'all 0.3s ease' }}>
      
      {/* Header & Theme Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h1>⚡ GridMind: Virtual Power Plant Dashboard</h1>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{ padding: '10px 18px', backgroundColor: isDarkMode ? '#3b82f6' : '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Cards Section */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <div style={{ background: themeStyles.cardBg, padding: '20px', borderRadius: '8px', flex: 1, minWidth: '220px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: themeStyles.subText }}>🔌 Load Power</h3>
          <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#f43f5e', margin: 0 }}>{currentData.load} kW</p>
        </div>
        <div style={{ background: themeStyles.cardBg, padding: '20px', borderRadius: '8px', flex: 1, minWidth: '220px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: themeStyles.subText }}>☀️ Solar Generation</h3>
          <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#fbbf24', margin: 0 }}>{currentData.solar} kW</p>
        </div>
        <div style={{ background: themeStyles.cardBg, padding: '20px', borderRadius: '8px', flex: 1, minWidth: '220px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: themeStyles.subText }}>🔋 Battery SOC</h3>
          <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#34d399', margin: 0 }}>{currentData.soc} %</p>
        </div>
      </div>

      {/* Control Switches & Alerts Section */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
        
        {/* Manual Control Switches */}
        <div style={{ background: themeStyles.cardBg, padding: '20px', borderRadius: '8px', flex: 1, minWidth: '300px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>🎛️ Manual Control Switches</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span>Manual Override Mode:</span>
            <button 
              onClick={() => setManualOverride(!manualOverride)}
              style={{ padding: '6px 14px', backgroundColor: manualOverride ? '#10b981' : '#64748b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {manualOverride ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Backup Generator:</span>
            <button 
              disabled={!manualOverride}
              onClick={() => setGeneratorStatus(!generatorStatus)}
              style={{ padding: '6px 14px', backgroundColor: !manualOverride ? '#334155' : (generatorStatus ? '#ef4444' : '#3b82f6'), color: '#fff', border: 'none', borderRadius: '4px', cursor: manualOverride ? 'pointer' : 'not-allowed' }}
            >
              {generatorStatus ? 'STOP GEN' : 'START GEN'}
            </button>
          </div>
        </div>

        {/* Real-time Alerts Panel */}
        <div style={{ background: themeStyles.cardBg, padding: '20px', borderRadius: '8px', flex: 1, minWidth: '300px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>🚨 Live System Alerts</h3>
          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
            {alerts.length === 0 ? (
              <p style={{ color: '#10b981', margin: 0 }}>System operating normally. No active alerts.</p>
            ) : (
              alerts.map((alert, idx) => (
                <p key={idx} style={{ color: '#f87171', margin: '4px 0', fontSize: '14px' }}>⚠️ {alert}</p>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Live Chart Section */}
      <div style={{ background: themeStyles.cardBg, padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>📈 Live Telemetry Charts (Load vs Solar vs SOC)</h3>
        <div style={{ width: '100%', height: '300px', marginTop: '20px' }}>
          <ResponsiveContainer>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke={themeStyles.border} />
              <XAxis dataKey="timestamp" stroke={themeStyles.subText} />
              <YAxis stroke={themeStyles.subText} />
              <Tooltip contentStyle={{ backgroundColor: themeStyles.cardBg, borderColor: themeStyles.border, color: themeStyles.text }} />
              <Legend />
              <Line type="monotone" dataKey="load" stroke="#f43f5e" name="Load (kW)" strokeWidth={2} />
              <Line type="monotone" dataKey="solar" stroke="#fbbf24" name="Solar (kW)" strokeWidth={2} />
              <Line type="monotone" dataKey="soc" stroke="#34d399" name="SOC (%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default App;