import { useState, useEffect } from 'react';
import { Shield, CloudRain, Calendar, DollarSign, MapPin, FileText, History, RefreshCw } from 'lucide-react';
import { fetchUserPolicies } from '../lib/api';

export default function Policies({ user }) {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchUserPolicies(user.id);
      setPolicies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) load();
  }, [user?.id]);

  const activePolicies = policies.filter(p => p.active_status);
  const inactivePolicies = policies.filter(p => !p.active_status);

  // If no policies from backend, mock one for UI matching
  const displayActive = activePolicies.length > 0 ? activePolicies[0] : { id: 9921, weekly_premium: 24.50, coverage_hours: 40 };

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-500">
      
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">Active Policies</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time parametric protection for your assets.</p>
        </div>
        <button onClick={load} className="p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:block">
          <RefreshCw size={18} className="text-gray-500" />
        </button>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <RefreshCw className="animate-spin text-amber-500" size={24} />
        </div>
      ) : (
        <>
          {/* ── Active Policy Card ───────────────────────────────── */}
          <div className="card space-y-6">
             <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-600/20">
                     <Shield size={24} />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-dark mb-1">Income Shield Plus</h2>
                     <p className="text-[10px] uppercase font-bold tracking-wider text-amber-700">Policy ID: ARK-{displayActive.id}-X</p>
                  </div>
                </div>
                <span className="badge badge-active">ACTIVE</span>
             </div>

             {/* Progress Bar */}
             <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                   <span className="text-dark">Coverage Period Progress</span>
                   <span className="text-dark">65% Complete</span>
                </div>
                <div className="progress-bar">
                   <div className="progress-bar-fill w-[65%]" style={{ background: 'linear-gradient(90deg, #A86B00 0%, #D4920B 100%)' }}></div>
                </div>
             </div>

             {/* Grid of details */}
             <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4">
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                     <CloudRain size={12} className="text-amber-700" /> Rain Threshold
                   </p>
                   <p className="text-lg font-bold text-dark mt-2">5mm/hr</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                     <Calendar size={12} className="text-amber-700" /> Expiration Date
                   </p>
                   <p className="text-lg font-bold text-dark mt-2">Oct 24, 2024</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                     <DollarSign size={12} className="text-amber-700" /> Max Payout
                   </p>
                   <p className="text-lg font-bold text-dark mt-2">₹{(displayActive.weekly_premium * 500).toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                     <MapPin size={12} className="text-amber-700" /> Coverage Area
                   </p>
                   <p className="text-lg font-bold text-dark mt-2">{user?.city || 'Western Highlands'}</p>
                </div>
             </div>

             <button className="btn-primary w-full flex justify-center items-center gap-2">
               <FileText size={16} /> View Policy Document
             </button>
          </div>

          {/* ── Inactive/Expired ─────────────────────────────────── */}
          <div>
            <h2 className="text-xl font-bold tracking-tight mb-4">Inactive/Expired</h2>
            
            <div className="space-y-3">
               <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                       <History size={18} />
                     </div>
                     <div>
                        <p className="font-bold text-dark text-sm">Wind Velocity Guard</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-1">Expired Aug 12, 2023</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Claimed</span>
                     <span className="text-gray-400">&gt;</span>
                  </div>
               </div>

               <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                       <History size={18} />
                     </div>
                     <div>
                        <p className="font-bold text-dark text-sm">Drought Relief Core</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-1">Expired Jan 05, 2023</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Expired</span>
                     <span className="text-gray-400">&gt;</span>
                  </div>
               </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
