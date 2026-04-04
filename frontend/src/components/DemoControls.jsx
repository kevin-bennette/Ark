import React, { useState } from 'react';
import { simulateTrigger } from '../lib/api';
import { Zap, Loader2 } from 'lucide-react';

const DemoControls = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSimulate = async () => {
    setLoading(true);
    setStatus('Executing 15-minute background tick...');
    try {
      await simulateTrigger("Mumbai"); // Force local triggers
      setStatus('Engine executed. Zero-Touch claims processed if thresholds breached.');
    } catch (err) {
      setStatus('Simulation skipped - backend offline.');
    }
    setLoading(false);
  };

  return (
    <div className="glass p-6 rounded-2xl md:col-span-1 mt-6 border-brand-500/20 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <h2 className="text-sm uppercase tracking-wider text-brand-400 font-semibold mb-2 flex items-center">
        <Zap size={16} className="mr-2" />
        Demo Controls
      </h2>
      <p className="text-xs text-slate-400 mb-6">Force the Celery engine to execute the risk evaluation logic immediately.</p>
      
      <button 
        onClick={handleSimulate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-brand-500/20 flex justify-center items-center"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : "Simulate Next Tick"}
      </button>

      {status && (
        <div className="mt-4 p-3 bg-dark-900/60 rounded-lg border border-white/5 text-xs text-emerald-400 text-center">
          {status}
        </div>
      )}
    </div>
  );
};

export default DemoControls;
