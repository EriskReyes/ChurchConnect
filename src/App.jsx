import { useState, useEffect } from 'react';
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
  chat: Connect,
  community: Connect,
  prayer: Connect,
  ministries: Connect,
  documents: Connect,
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
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState("Admin");
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(t.sidebar === "icons");

  useEffect(() => { setCollapsed(t.sidebar === "icons"); }, [t.sidebar]);

  useEffect(() => {
    if (!canAccess(role, page) && page !== "settings") setPage("dashboard");
  }, [role]);

  const theme = t.dark ? "dark" : "light";
  const rootStyle = { "--primary": t.primaryColor };

  const nav = (k) => { setPage(k); document.querySelector(".main-scroll")?.scrollTo({ top: 0 }); };

  if (!authed) {
    return (
      <div data-theme={theme} data-density={t.density} style={rootStyle}>
        <AuthScreen onEnter={() => setAuthed(true)} />
        <Tweaks t={t} setTweak={setTweak} />
      </div>
    );
  }

  const PageComp = PAGES[page];

  return (
    <div className="app-shell" data-theme={theme} data-density={t.density} style={rootStyle}>
      <Sidebar active={page} onNav={nav} collapsed={collapsed} role={role} onLogout={() => setAuthed(false)} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        <Topbar page={page} role={role} onRole={setRole} onToggleSidebar={() => setCollapsed(c => !c)} dark={t.dark} onToggleDark={() => setTweak("dark", !t.dark)} onLogout={() => setAuthed(false)} />
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

export default App;
