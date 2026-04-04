import { useState, useEffect } from 'react';
import { Shield, ThermometerSun, Wind, CloudRain, Zap, Activity, CheckCircle2, Navigation2 } from 'lucide-react';
import { fetchUserPolicies, fetchClaims, simulateTrigger } from '../lib/api';

export default function Dashboard({ user }) {
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [telemetry, setTelemetry] = useState({ temp: 33.4, rain: 12.4, aqi: 142, humidity: 88, wind: 14 });

  useEffect(() => {
    if (!user?.id) return;
    fetchUserPolicies(user.id).then(setPolicies).catch(console.error);
    fetchClaims(user.id).then(setClaims).catch(console.error);

    // Mock telemetry updates
    const id = setInterval(() => setTelemetry(t => ({
      ...t, 
      temp: +(t.temp + (Math.random() * 0.4 - 0.2)).toFixed(1),
      rain: Math.max(0, +(t.rain + (Math.random() * 2 - 1)).toFixed(1)),
      aqi: Math.max(0, Math.round(t.aqi + (Math.random() * 10 - 5)))
    })), 3000);
    return () => clearInterval(id);
  }, [user?.id]);

  const handleSimulate = async () => {
    if (!user?.id) return;
    setSimulating(true);
    try {
      await simulateTrigger(user.city || 'Mumbai');
      // Wait a moment then fetch claims to show new one
      setTimeout(async () => {
        const updated = await fetchClaims(user.id);
        setClaims(updated);
        setSimulating(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setSimulating(false);
    }
  };

  const activePolicy = policies.find(p => p.active_status) || policies[0];
  const premium = activePolicy?.weekly_premium || 24.50;
  
  // Format dates for claims
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d) ? 'Just now' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-dark tracking-tight">Sentinel Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Monitoring environmental volatility for your gig economy stability.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* ── Left Column (Telemetry & Simulator) ──────────────── */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Telemetry Card */}
          <div className="card space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  Real-time Risk Telemetry
                  <div className="live-dot-green"></div>
                </h2>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Navigation2 size={12} /> Live station data: Sector 7G - Urban Corridor ({user?.city})
                </p>
              </div>
              <div className="flex gap-4 text-right hidden sm:flex">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider">RAINFALL (MM/HR)</p>
                  <p className="text-xl font-extrabold text-amber-600">{telemetry.rain.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider">AQI INDEX</p>
                  <p className="text-xl font-extrabold text-red-600">{telemetry.aqi}</p>
                </div>
              </div>
            </div>

            {/* Threshold chart placeholder */}
            <div className="h-32 flex items-end gap-1.5 relative pt-4 border-b border-gray-100">
              <div className="absolute top-4 left-0 right-0 border-t border-dashed border-red-400 h-0 hidden sm:block">
                 <span className="absolute right-0 -top-2.5 bg-red-100 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full">THRESHOLD EXCEEDED</span>
              </div>
              {[20, 35, 25, 45, 60, 80, 100, 75, 45, 30, 20, 15].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm transition-all duration-300" 
                     style={{ 
                       height: `${h}%`, 
                       backgroundColor: h > 70 ? 'var(--amber)' : h > 40 ? 'var(--amber-light)' : 'var(--amber-pale)' 
                     }}>
                </div>
              ))}
            </div>

            {/* Micro metrics grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ThermometerSun size={12} className="text-amber-600" /> Temperature
                </p>
                <p className="text-xl font-bold">{telemetry.temp}°C</p>
                <div className="mt-2 w-full h-1 bg-gray-200 rounded-full"><div className="h-full w-[85%] bg-amber-600 rounded-full"></div></div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CloudRain size={12} className="text-amber-700" /> Humidity
                </p>
                <p className="text-xl font-bold">{telemetry.humidity}%</p>
                <div className="mt-2 w-full h-1 bg-gray-200 rounded-full"><div className="h-full w-[88%] bg-amber-700 rounded-full"></div></div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Wind size={12} className="text-gray-500" /> Wind Speed
                </p>
                <p className="text-xl font-bold">{telemetry.wind} km/h</p>
                <div className="mt-2 w-full h-1 bg-gray-200 rounded-full"><div className="h-full w-[30%] bg-gray-500 rounded-full"></div></div>
              </div>
            </div>
          </div>

          {/* Topographic active risk banner */}
          <div className="rounded-2xl topo-pattern p-5 relative overflow-hidden border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
               <div className="bg-white rounded-xl p-4 shadow-sm min-w-[240px]">
                 <div className="flex items-center gap-2 text-sm font-bold mb-3">
                   <div className="live-dot"></div> Active Risk Corridor: Sector 7G
                 </div>
                 <div className="flex justify-between">
                   <div>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Current Status</p>
                     <p className="text-sm font-bold text-red-600">Critical Volatility</p>
                   </div>
                   <div>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Coverage Density</p>
                     <p className="text-sm font-bold">High (92%)</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Payout Simulator */}
          <div className="card bg-gray-50 border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-bold mb-2">Payout Simulator</h2>
              <p className="text-sm text-gray-500 max-w-sm">Estimate your parametric settlement based on the current weather trajectory. High volatility detected in your active zone.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center min-w-[200px]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Potential Payout</p>
              <p className="text-3xl font-extrabold text-dark mb-4">${(premium * 6).toFixed(2)}</p>
              <button 
                onClick={handleSimulate} 
                disabled={simulating}
                className="btn-primary w-full py-2 flex items-center justify-center gap-2 text-sm"
              >
                {simulating ? <Activity size={16} className="animate-spin" /> : <Zap size={16} />}
                Test Trigger Simulation
              </button>
            </div>
          </div>

        </div>

        {/* ── Right Column (Status & Claims) ────────────────────── */}
        <div className="space-y-6">

          {/* Risk Quotient Card */}
          <div className="card-dark relative overflow-hidden bg-gray-900">
            <div className="absolute -right-16 -top-16 opacity-10">
              <Activity size={240} className="text-amber-500" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Risk Quotient</p>
              <p className="text-4xl font-extrabold mb-4">8.4<span className="text-lg text-gray-500 font-medium">/10</span></p>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                Conditions are deteriorating. Your Gig Shield Max active status provides priority claim processing for this event.
              </p>
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
                <Shield size={14} /> Coverage Secured
              </div>
            </div>
          </div>

          {/* Active Coverage */}
          <div className="card bg-gray-50">
            <p className="section-label mb-3 border-b border-gray-200 pb-2">Active Coverage</p>
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex justify-between items-center shadow-sm">
               <div>
                 <p className="font-bold">Gig Shield Max</p>
                 <p className="text-xs text-gray-500">Policy: {activePolicy ? `#ARK-${activePolicy.id}` : 'Pending'}</p>
               </div>
               <span className="badge badge-premium">PREMIUM</span>
            </div>

            <p className="section-label mb-3">Settlement Triggers</p>
            <div className="space-y-3">
               <div className="flex items-center justify-between text-sm">
                 <span className="text-gray-600">Precipitation <span className="text-gray-400 font-mono text-xs mx-1">&gt;</span> 10mm/h</span>
                 <CheckCircle2 size={16} className="text-amber-600" />
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-gray-600">AQI <span className="text-gray-400 font-mono text-xs mx-1">&gt;</span> 150 (Unhealthy)</span>
                 <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300"></div>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-gray-600">Heat Index <span className="text-gray-400 font-mono text-xs mx-1">&gt;</span> 38°C</span>
                 <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300"></div>
               </div>
            </div>
          </div>

          {/* Claims Feed */}
          <div className="card bg-gray-50">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
               <p className="section-label">Claims Feed</p>
               <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase">Live Updates</span>
            </div>
            
            <div className="space-y-5 relative before:absolute before:inset-y-0 before:left-[3px] before:w-[2px] before:bg-gray-200">
               {claims.length === 0 ? (
                 <p className="text-sm text-gray-500 text-center py-4">No recent claim events.</p>
               ) : (
                 claims.slice(0, 3).map((claim, idx) => (
                   <div key={claim.id || idx} className="relative pl-4">
                     <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${idx === 0 ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-gray-300'}`}></div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{formatDate(claim.event_date)}</p>
                     <p className="text-sm font-bold text-dark">{claim.status === 'approved' ? 'Payout Disbursed' : 'Settlement Triggered'}</p>
                     <p className="text-xs text-gray-500 mb-1 capitalize">{(claim.trigger_type || 'Disruption').replace('_', ' ')} logic threshold met.</p>
                     <p className={`text-sm font-bold ${claim.status === 'approved' ? 'text-dark' : 'text-amber-600'}`}>
                       {claim.status === 'approved' ? `$${claim.loss_calculated?.toFixed(2)} Paid` : `+$${claim.loss_calculated?.toFixed(2)} Pending`}
                     </p>
                   </div>
                 ))
               )}
            </div>

            <button className="w-full text-center text-xs font-bold text-gray-500 uppercase mt-6 hover:text-dark transition-colors flex items-center justify-center gap-1">
              View All History <Navigation2 size={12} className="rotate-90" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
