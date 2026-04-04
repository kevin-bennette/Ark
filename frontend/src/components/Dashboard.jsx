import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

const Dashboard = ({ policies, user }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Risk Profile Card */}
      <div className="glass p-6 rounded-2xl flex flex-col justify-between hover:border-brand-500/30 transition-colors">
        <div>
          <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-1">Worker Profile</h2>
          <div className="flex items-center space-x-3 mt-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-xl font-bold">
              {user?.name?.charAt(0) || 'G'}
            </div>
            <div>
              <p className="text-xl font-bold text-white">{user?.name || 'Gig Worker'}</p>
              <p className="text-sm text-slate-400">{user?.city || 'Mumbai'} • {user?.platform || 'Delivery'}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-500 mb-1">Risk Score</p>
            <p className="text-2xl font-semibold text-rose-400">{user?.risk_profile_score?.toFixed(2) || '1.0'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Avg Hourly</p>
            <p className="text-2xl font-semibold text-emerald-400">₹{user?.hourly_rate || '0'}</p>
          </div>
        </div>
      </div>

      {/* Active Policies */}
      <div className="glass p-6 rounded-2xl lg:col-span-2 hover:border-brand-500/30 transition-colors">
        <h2 className="text-sm uppercase tracking-wider text-slate-400 font-semibold mb-4">Active Coverages</h2>
        {policies?.length > 0 ? (
          <div className="space-y-4">
            {policies.map(p => (
              <div key={p.id} className="bg-dark-900/50 rounded-xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${p.active_status ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-500/20 text-slate-500'}`}>
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-white">Income Protection Policy #{p.id}</p>
                    <p className="text-xs text-slate-400">{p.coverage_hours} hrs coverage • Dynamic Trigger</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-brand-400">₹{p.weekly_premium}/wk</p>
                  <p className="text-xs text-slate-500 flex items-center justify-end space-x-1">
                    {p.active_status ? <><CheckCircle size={12} className="text-emerald-500"/> <span>Active</span></> : <span>Paused</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-xl">
            <Activity size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No active policies found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
