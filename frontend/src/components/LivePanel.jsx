import React, { useEffect, useState } from 'react';
import { CloudRain, ThermometerSun, Wind, ServerCrash } from 'lucide-react';

const LivePanel = () => {
  const [data, setData] = useState({ temp: 28, rain: 0, aqi: 45, platform: 'Operational' });

  // Simulate real-time polling updates
  useEffect(() => {
    const interval = setInterval(() => {
       setData(prev => ({
         ...prev,
         temp: prev.temp + (Math.random() * 2 - 1),
         aqi: prev.aqi + (Math.random() * 5 - 2.5)
       }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass p-6 rounded-2xl w-full mt-6">
      <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-6 flex items-center">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mr-2"></span>
        Live Risk Telemetry
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-dark-900/40 border border-white/5 p-4 rounded-xl flex items-center space-x-4">
          <ThermometerSun className="text-amber-400" size={28} />
          <div>
            <p className="text-xs text-slate-500">Temperature</p>
            <p className="text-xl font-bold">{data.temp.toFixed(1)}°C</p>
          </div>
        </div>

        <div className="bg-dark-900/40 border border-white/5 p-4 rounded-xl flex items-center space-x-4">
          <CloudRain className="text-brand-400" size={28} />
          <div>
            <p className="text-xs text-slate-500">Rainfall</p>
            <p className="text-xl font-bold">{data.rain} <span className="text-sm font-normal text-slate-400">mm/hr</span></p>
          </div>
        </div>

        <div className="bg-dark-900/40 border border-white/5 p-4 rounded-xl flex items-center space-x-4">
          <Wind className={data.aqi > 100 ? "text-rose-400" : "text-emerald-400"} size={28} />
          <div>
            <p className="text-xs text-slate-500">AQI Index</p>
            <p className="text-xl font-bold">{Math.max(0, data.aqi).toFixed(0)}</p>
          </div>
        </div>

        <div className="bg-dark-900/40 border border-white/5 p-4 rounded-xl flex items-center space-x-4">
          <ServerCrash className="text-slate-400" size={28} />
          <div>
            <p className="text-xs text-slate-500">Platform Status</p>
            <p className="text-lg font-bold text-emerald-400">{data.platform}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LivePanel;
