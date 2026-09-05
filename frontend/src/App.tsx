import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TelemetryData {
  time: string;
  load: number;
  solar: number;
  soc: number;
}

function App() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    time: '',
    load: 0,
    solar: 0,
    soc: 0,
  });

  const [history, setHistory] = useState<TelemetryData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:8000/api/telemetry')
        .then((res) => res.json())
        .then((data) => {
          const currentTime = new Date().toLocaleTimeString();
          const newData = { ...data, time: currentTime };

          setTelemetry(newData);
          setHistory((prev) => [...prev.slice(-14), newData]);
        })
        .catch((err) => console.error(err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h2>⚡ VPP Real-Time Telemetry & Monitoring Dashboard</h2>

      {/* Low Battery Alert Banner */}
      {telemetry.soc < 30 && (
        <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ Warning: Battery SOC is low ({telemetry.soc}%)! Consider reducing load or charging.
        </div>
      )}

      {/* Metrics Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', flex: 1, textAlign: 'center' }}>
          <h3>🔌 Load Power</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f87171' }}>{telemetry.load} kW</p>
        </div>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', flex: 1, textAlign: 'center' }}>
          <h3>☀️ Solar Generation</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#facc15' }}>{telemetry.solar} kW</p>
        </div>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', flex: 1, textAlign: 'center' }}>
          <h3>🔋 Battery SOC</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: telemetry.soc < 30 ? '#ef4444' : '#4ade80' }}>
            {telemetry.soc} %
          </p>
        </div>
      </div>

      {/* Real-time Line Chart */}
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ marginBottom: '20px' }}>📈 Real-Time Power & SOC Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
            <Legend />
            <Line type="monotone" dataKey="load" name="Load (kW)" stroke="#f87171" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="solar" name="Solar (kW)" stroke="#facc15" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="soc" name="Battery SOC (%)" stroke="#4ade80" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;