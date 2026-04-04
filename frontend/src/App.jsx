import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import LivePanel from './components/LivePanel';
import DemoControls from './components/DemoControls';
import { fetchUser, fetchPolicies } from './lib/api';
import { CloudLightning } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app we'd have auth. Here we mock user_id = 1.
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchUser(1);
        setUser(userData);
        const policyData = await fetchPolicies(1);
        setPolicies(policyData);
      } catch (err) {
        console.error("Failed to load initial data. Ensure backend is running and DB is seeded.", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* Background aesthetics */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-dark-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(255,255,255,0))]"></div>
      
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center space-x-3 text-white">
          <div className="bg-brand-500/20 p-2 rounded-xl text-brand-400">
            <CloudLightning size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Ark</h1>
            <p className="text-xs text-brand-400/80 font-medium tracking-wide uppercase">Income Stabilization Engine</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500 animate-pulse">
            Connecting to Ark Core...
          </div>
        ) : (
          <>
            <Dashboard user={user} policies={policies} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <div className="md:col-span-3 w-full">
                <LivePanel />
              </div>
              <div className="md:col-span-1 w-full">
                <DemoControls />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
