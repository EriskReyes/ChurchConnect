import { useState, useEffect, Component } from 'react';
import { Icon } from './components/icons';
import { Card, Button } from './components/ui';
import { Sidebar, Topbar, canAccess } from './components/shell';
import { AuthScreen } from './components/auth';
import { useTweaks, TweaksPanel, TweakSection, TweakColor, TweakToggle, TweakRadio } from './components/tweaks-panel';
import { useTranslation } from './hooks/useTranslation';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Members from './pages/Members';
import Donations from './pages/Donations';
import Sermons from './pages/Sermons';
import Settings from './pages/Settings';
import Connect from './pages/Connect';
import Reports from './pages/Reports';
import ChatPage from './pages/ChatPage';
import Gallery from './pages/Gallery';
import Flyers from './pages/Flyers';
import Staff from './pages/Staff';
import AdminPendingUsers from './pages/AdminPendingUsers';

const TWEAK_DEFAULTS = {
  "primaryColor": "#3B5BA5",
  "dark": false,
  "sidebar": "expanded",
  "density": "regular"
};

const PALETTES = ["#3B5BA5", "#4A7C59", "#7A4E9E", "#B5742E", "#1F4E5F", "#2A6FA8"];

const PAGES = {
  dashboard: Dashboard,
  events: Events,
  members: Members,
  donations: Donations,
  sermons: Sermons,
  settings: Settings,
  chat: ChatPage,
  community: Connect,
  prayer: Connect,
  ministries: Connect,
  documents: Connect,
  gallery: Gallery,
  flyers: Flyers,
  staff: Staff,
  reports: Reports,
  "pending-approvals": AdminPendingUsers,
};

function Placeholder({ page, onNav }) {
  const meta = {
    staff: { icon: Icon.Cross, title: "Staff & Leadership", text: "Pastoral and administrative team directory with roles, contact cards, and on-call schedules." },
    flyers: { icon: Icon.Megaphone, title: "Flyers", text: "Design and share event flyers and announcements across the congregation." },
    gallery: { icon: Icon.Image, title: "Gallery", text: "Browse photos from services, retreats, baptisms, and community life." },
    reports: { icon: Icon.Chart, title: "Reports", text: "Deep analytics across attendance, giving, growth, and ministry health." },
  }[page] || { icon: Icon.Sparkle, title: "Coming soon", text: "This section is part of the full ChurchConnect build." };
  return (
    <div className="fade-up" style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
      <Card style={{ maxWidth: 460, textAlign: "center", padding: 40 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: "var(--primary-soft)", color: "var(--primary)", display: "grid", placeItems: "center", margin: "0 auto 18px" }}><meta.icon size={32} /></div>
        <h2 style={{ fontSize: 21, fontWeight: 700 }}>{meta.title}</h2>
        <p className="muted" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>{meta.text}</p>
        <div style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "center" }}>
          <Button onClick={() => onNav("dashboard")} icon={Icon.Home}>Back to dashboard</Button>
        </div>
      </Card>
    </div>
  );
}

function App() {
  useTranslation(); // Forces re-render when language changes
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [authed, setAuthed] = useState(!!localStorage.getItem('authToken'));
  const [role, setRole] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : "Admin";
  });
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(t.sidebar === "icons");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { setCollapsed(t.sidebar === "icons"); }, [t.sidebar]);

  useEffect(() => {
    if (!canAccess(role, page) && page !== "settings") setPage("dashboard");
  }, [role]);

  // Poll pending count for Admin badge
  useEffect(() => {
    if (role !== 'Admin' && role !== 'Pastor') return;
    const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const fetchCount = () => {
      fetch(`${API}/api/admin/pending-count`)
        .then(r => r.ok ? r.json() : { count: 0 })
        .then(d => setPendingCount(d.count || 0))
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [role, authed]);

  const theme = t.dark ? "dark" : "light";
  const rootStyle = { "--primary": t.primaryColor };

  const nav = (k) => { setPage(k); document.querySelector(".main-scroll")?.scrollTo({ top: 0 }); };

  if (!authed) {
    return (
      <div data-theme={theme} data-density={t.density} style={rootStyle}>
        <AuthScreen onEnter={(user) => {
          setAuthed(true);
          setRole(user.role || "Member");
        }} />
        <Tweaks t={t} setTweak={setTweak} />
      </div>
    );
  }

  const PageComp = PAGES[page];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthed(false);
  };

  const handleSidebarNav = (key) => {
    nav(key);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="app-shell" data-theme={theme} data-density={t.density} style={rootStyle}>
      {!isMobile && <Sidebar active={page} onNav={handleSidebarNav} collapsed={collapsed} role={role} onLogout={handleLogout} pendingCount={pendingCount} />}
      {isMobile && sidebarOpen && (
        <>
          <div className="sidebar-backdrop active" onClick={() => setSidebarOpen(false)} />
          <Sidebar active={page} onNav={handleSidebarNav} collapsed={collapsed} role={role} onLogout={handleLogout} className="mobile-open" pendingCount={pendingCount} />
        </>
      )}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        <Topbar page={page} role={role} onRole={setRole} onToggleSidebar={isMobile ? () => setSidebarOpen(s => !s) : () => setCollapsed(c => !c)} dark={t.dark} onToggleDark={() => setTweak("dark", !t.dark)} onLogout={handleLogout} isMobile={isMobile} />
        <main className="main-scroll scroll-y" style={{ flex: 1, padding: "26px 28px 60px" }}>
          <div style={{ maxWidth: 1320, margin: "0 auto" }} key={page}>
            {PageComp ? <PageComp role={role} onNav={nav} /> : <Placeholder page={page} onNav={nav} />}
          </div>
        </main>
      </div>
      <Tweaks t={t} setTweak={setTweak} />
    </div>
  );
}

function Tweaks({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Theme" />
      <TweakColor label="Primary color" value={t.primaryColor} options={PALETTES} onChange={v => setTweak("primaryColor", v)} />
      <TweakToggle label="Dark mode" value={t.dark} onChange={v => setTweak("dark", v)} />
      <TweakSection label="Layout" />
      <TweakRadio label="Sidebar" value={t.sidebar} options={[{ value: "expanded", label: "Expanded" }, { value: "icons", label: "Icons" }]} onChange={v => setTweak("sidebar", v)} />
      <TweakRadio label="Density" value={t.density} options={[{ value: "compact", label: "Compact" }, { value: "regular", label: "Regular" }, { value: "comfy", label: "Comfy" }]} onChange={v => setTweak("density", v)} />
    </TweaksPanel>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ width: "100%", height: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "20px", textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24, maxWidth: 400 }}>
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.href = '/'}>Go to home</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;
