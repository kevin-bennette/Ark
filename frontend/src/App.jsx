import { useState, useEffect } from 'react';
import { LayoutDashboard, Shield, FileText, Headphones, Bell, Settings, Menu, X } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Policies from './components/Policies';
import Claims from './components/Claims';
import Support from './components/Support';
import { getToken, clearToken } from './lib/api';

const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',        icon: LayoutDashboard },
  { id: 'policies',  label: 'Policies',        icon: Shield },
  { id: 'claims',    label: 'Claims',          icon: FileText },
  { id: 'analytics', label: 'Risk Analytics',  icon: null },
  { id: 'support',   label: 'Support',         icon: Headphones },
];

const MOBILE_TABS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'policies', label: 'Policies',  icon: Shield },
  { id: 'claims',   label: 'Claims',    icon: FileText },
  { id: 'support',  label: 'Support',   icon: Headphones },
];

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ark_user');
    if (stored && getToken()) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('ark_user', JSON.stringify(userData));
    setActiveTab('overview');
  };

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('ark_user');
    setUser(null);
  };

  const renderContent = () => {
    if (!user) {
      return <Landing onLogin={handleLogin} />;
    }
    switch (activeTab) {
      case 'overview':  return <Dashboard user={user} />;
      case 'policies':  return <Policies user={user} />;
      case 'claims':    return <Claims user={user} />;
      case 'support':   return <Support />;
      case 'analytics': return <Dashboard user={user} />;
      default:          return <Dashboard user={user} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        {/* ── Desktop Top Nav ────────────────────────────── */}
        <header className={`z-50 ${user ? 'bg-white border-b sticky top-0' : 'absolute top-0 w-full bg-transparent border-none'}`} style={{ borderColor: 'var(--gray-200)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--amber)' }}>
                <Shield size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--amber)' }}>Ark</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--dark)' }}>Parametric</span>
            </div>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ id, label }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`nav-link ${activeTab === id ? 'active' : ''}`}>
                  {label}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block">
                <Bell size={18} style={{ color: 'var(--gray-500)' }} />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block">
                <Settings size={18} style={{ color: 'var(--gray-500)' }} />
              </button>
              <button onClick={user ? handleLogout : () => document.getElementById('calc-form')?.scrollIntoView()}
                className="hidden md:block text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90"
                style={{ background: 'var(--amber)', color: '#FFF' }}>
                {user ? 'Account' : 'Account'}
              </button>
              {/* Mobile hamburger */}
              <button onClick={() => setMobileMenuOpen(o => !o)} className="md:hidden p-2">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-1" style={{ borderColor: 'var(--gray-200)' }}>
              {NAV_ITEMS.map(({ id, label }) => (
                <button key={id} onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
                  className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${activeTab === id ? 'text-amber' : ''}`}
                  style={{ color: activeTab === id ? 'var(--amber)' : 'var(--gray-600)' }}>
                  {label}
                </button>
              ))}
              <button onClick={handleLogout} className="text-left py-2 px-3 rounded-lg text-sm font-medium text-red-500">
                Sign Out
              </button>
            </div>
          )}
        </header>

        {/* ── Page Content ───────────────────────────────── */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 md:py-8">
          {renderContent()}
        </main>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer className="border-t py-6 px-4 md:px-8 hidden md:block" style={{ borderColor: 'var(--gray-200)' }}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: 'var(--amber)' }}>Ark</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--dark)' }}>Parametric</span>
            </div>
            <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--gray-400)' }}>
              <span>© 2024 Ark Parametric. The Solar Sentinel Authority</span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--gray-500)' }}>
              {['Privacy Policy', 'Terms of Service', 'Security', 'API Documentation'].map(l => (
                <a key={l} href="#" className="hover:underline">{l}</a>
              ))}
            </div>
          </div>
        </footer>

        {/* ── Mobile Bottom Nav ──────────────────────────── */}
        <div className="bottom-nav md:hidden">
          {MOBILE_TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`bottom-nav-item ${activeTab === id ? 'active' : ''}`}>
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
