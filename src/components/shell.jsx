import { useState, useEffect } from 'react';
import { Icon } from './icons';
import { Avatar, IconButton, Badge, Menu, SearchInput } from './ui';
import { useTranslation } from '../hooks/useTranslation';

const NAV = [
  { section: "Overview", items: [
    { key: "dashboard", label: "Dashboard", icon: Icon.Home },
  ]},
  { section: "People", items: [
    { key: "events", label: "Events", icon: Icon.Calendar },
    { key: "members", label: "Members", icon: Icon.Users },
    { key: "staff", label: "Staff", icon: Icon.Cross },
    { key: "ministries", label: "Ministries", icon: Icon.Hands },
  ]},
  { section: "Resources", items: [
    { key: "sermons", label: "Sermons", icon: Icon.Mic },
    { key: "documents", label: "Documents", icon: Icon.Doc },
    { key: "flyers", label: "Flyers", icon: Icon.Megaphone },
    { key: "gallery", label: "Gallery", icon: Icon.Image },
  ]},
  { section: "Giving", items: [
    { key: "donations", label: "Donations", icon: Icon.Gift },
    { key: "reports", label: "Reports", icon: Icon.Chart },
  ]},
  { section: "Connect", items: [
    { key: "prayer", label: "Prayer Requests", icon: Icon.Heart },
    { key: "community", label: "Community", icon: Icon.Sparkle },
    { key: "chat", label: "Chat", icon: Icon.Chat },
  ]},
  { section: "System", items: [
    { key: "settings", label: "Settings", icon: Icon.Settings },
  ]},
];

const ROLES = {
  "Admin": { color: "#3B5BA5", desc: "Full system access" },
  "Pastor": { color: "#7A4E9E", desc: "Pastoral oversight" },
  "Treasurer": { color: "#4A7C59", desc: "Finance & giving" },
  "Ministry Leader": { color: "#B5742E", desc: "Team & events" },
  "Staff": { color: "#2A6FA8", desc: "Staff access" },
  "Member": { color: "#1F4E5F", desc: "Community access" },
  "Visitor": { color: "#888", desc: "Guest access" },
};

const ACCESS = {
  "Admin": "*",
  "Pastor": "*",
  "Treasurer": ["dashboard", "members", "donations", "reports", "documents", "chat", "settings"],
  "Ministry Leader": ["dashboard", "events", "members", "staff", "ministries", "sermons", "documents", "flyers", "gallery", "prayer", "community", "chat", "settings"],
  "Staff": ["dashboard", "events", "members", "staff", "ministries", "sermons", "documents", "flyers", "gallery", "prayer", "community", "chat", "settings"],
  "Member": ["dashboard", "events", "sermons", "flyers", "gallery", "prayer", "community", "chat", "settings"],
  "Visitor": ["dashboard", "events", "sermons", "prayer", "community", "settings"],
};

export function canAccess(role, key) {
  const a = ACCESS[role] ?? ACCESS["Member"];
  return a === "*" || (Array.isArray(a) && a.includes(key));
}

export function Sidebar({ active, onNav, collapsed, role, onLogout, className }) {
  const { t } = useTranslation();
  const isMobileSmall = typeof window !== 'undefined' && window.innerWidth < 480;
  const W = collapsed ? 76 : (isMobileSmall ? 220 : 256);

  const navWithTranslations = NAV.map(grp => ({
    ...grp,
    sectionKey: grp.section.toLowerCase().replace(/\s+/g, '_'),
    items: grp.items.map(it => ({
      ...it,
      translatedLabel: t(`sidebar.${it.key.toLowerCase()}`) || it.label
    }))
  }));

  return (
    <aside className={className} style={{
      width: W, flexShrink: 0, height: "100%", background: "var(--surface)",
      borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column",
      transition: "width .28s cubic-bezier(.16,.84,.44,1)", zIndex: 20,
    }}>
      <div style={{ height: 70, display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "0" : "0 22px", justifyContent: collapsed ? "center" : "flex-start", flexShrink: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(140deg, var(--primary), color-mix(in srgb, var(--primary) 60%, var(--accent)))", display: "grid", placeItems: "center", color: "#fff", boxShadow: "var(--shadow-sm)", flexShrink: 0 }}>
          <Icon.Cross size={20} sw={2} />
        </div>
        {!collapsed && <div style={{ overflow: "hidden" }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 17, lineHeight: 1, whiteSpace: "nowrap" }}>ChurchConnect</div>
          <div className="faint" style={{ fontSize: 11, marginTop: 3, whiteSpace: "nowrap" }}>Grace Community</div>
        </div>}
      </div>

      <nav className="scroll-y" style={{ flex: 1, padding: collapsed ? "8px 12px" : "8px 14px" }}>
        {navWithTranslations.map(grp => {
          const items = grp.items.filter(it => canAccess(role, it.key));
          if (!items.length) return null;
          const sectionName = t(`sidebar.${grp.sectionKey}`) || grp.section;
          return (
            <div key={grp.section} style={{ marginBottom: 18 }}>
              {!collapsed && <div className="faint" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 10px 8px" }}>{sectionName}</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {items.map(it => {
                  const on = active === it.key;
                  return (
                    <button key={it.key} onClick={() => onNav(it.key)} title={collapsed ? it.translatedLabel : undefined}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "11px" : "10px 11px",
                        justifyContent: collapsed ? "center" : "flex-start", borderRadius: 11, border: "none",
                        background: on ? "var(--primary-soft)" : "transparent",
                        color: on ? "var(--on-primary-soft)" : "var(--text-muted)",
                        fontWeight: on ? 700 : 500, fontSize: 14, position: "relative", transition: "all .15s ease", width: "100%", textAlign: "left",
                      }}
                      onMouseEnter={e => { if (!on) e.currentTarget.style.background = "var(--surface-3)"; }}
                      onMouseLeave={e => { if (!on) e.currentTarget.style.background = "transparent"; }}>
                      {on && !collapsed && <span style={{ position: "absolute", left: -14, top: "50%", transform: "translateY(-50%)", width: 3.5, height: 22, borderRadius: 3, background: "var(--primary)" }} />}
                      <it.icon size={20} />{!collapsed && it.translatedLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

const PAGE_TITLES = {
  dashboard: ["Dashboard", "Welcome back — here's your community at a glance"],
  events: ["Events", "Plan, schedule, and track gatherings"],
  members: ["Members", "Your congregation directory"],
  staff: ["Staff & Leadership", "Pastoral and administrative team"],
  ministries: ["Ministries", "Teams serving across the church"],
  sermons: ["Sermons", "Messages, series, and recordings"],
  documents: ["Documents", "Shared files and resources"],
  flyers: ["Flyers", "Announcements and promotional material"],
  gallery: ["Gallery", "Photos from church life"],
  donations: ["Donations & Giving", "Tithes, offerings, and funds"],
  reports: ["Reports", "Insights across the church"],
  prayer: ["Prayer Requests", "Lifting one another up"],
  community: ["Community", "Posts and announcements"],
  chat: ["Chat", "Messages and team conversations"],
  settings: ["Settings", "Manage your account and church"],
};

export function Topbar({ page, role, onRole, onToggleSidebar, dark, onToggleDark, onLogout, isMobile }) {
  const { t } = useTranslation();
  const [title, sub] = PAGE_TITLES[page] || ["", ""];
  const rc = ROLES[role]?.color || '#3B5BA5';
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name || "User");
    }
  }, []);

  const notifications = [
    { id: 1, type: "member", icon: "👤", title: "Nuevo miembro", message: "Samuel Ortiz se unió a la congregación", time: "Hace 2h" },
    { id: 2, type: "event", icon: "📅", title: "Evento próximo", message: "Retiro de verano comienza en 3 días", time: "Hace 5h" },
    { id: 3, type: "donation", icon: "💝", title: "Donación reciente", message: "David Okafor donó $1,000 al fondo de construcción", time: "Hace 1h" },
    { id: 4, type: "event", icon: "📅", title: "Eventos esta semana", message: "Bible Study mañana a las 7:00 PM", time: "Hace 4h" },
    { id: 5, type: "member", icon: "👤", title: "Nuevo miembro", message: "Grace Lin completó su perfil", time: "Hace 1d" },
  ];
  return (
    <header style={{ height: 70, flexShrink: 0, display: "flex", alignItems: "center", gap: 16, padding: "0 28px", borderBottom: "1px solid var(--border)", background: "color-mix(in srgb, var(--surface) 70%, transparent)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 15 }}>
      {isMobile && <IconButton icon={Icon.Menu} onClick={onToggleSidebar} title="Menu" />}
      {!isMobile && <IconButton icon={Icon.Filter} onClick={onToggleSidebar} title={t('topbar.search')} />}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <h1 style={{ fontSize: isMobile ? 15 : 19, fontWeight: 700, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>{title}</h1>
        <div className="muted" style={{ fontSize: isMobile ? 11 : 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {!isMobile && <SearchInput style={{ width: 210 }} placeholder={t('topbar.search')} />}
        <IconButton icon={dark ? Icon.Sun : Icon.Moon} onClick={onToggleDark} title={t('topbar.darkMode')} />

        <div style={{ position: "relative" }}>
          <button onClick={() => setShowNotifications(!showNotifications)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: "var(--text-muted)", transition: "all 0.2s", position: "relative" }} onMouseEnter={e => e.currentTarget.style.color = "var(--text)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
            <Icon.Bell size={20} />
            {notifications.length > 0 && <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--warn)", animation: "pulse 2s infinite" }} />}
          </button>

          {showNotifications && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 360, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 100, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "var(--text)" }}>Notificaciones</h3>
              </div>

              <div style={{ maxHeight: 400, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No hay notificaciones</div>
                ) : notifications.map(notif => (
                  <button key={notif.id} onClick={() => setShowNotifications(false)} style={{ padding: 12, borderBottom: "1px solid var(--border)", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{notif.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{notif.title}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4, lineHeight: 1.4 }}>{notif.message}</div>
                        <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{notif.time}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ padding: 12, borderTop: "1px solid var(--border)", textAlign: "center" }}>
                <button style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)", background: "transparent", border: "none", cursor: "pointer", padding: 0 }} onClick={() => setShowNotifications(false)}>Ver todas</button>
              </div>
            </div>
          )}
        </div>

        <Menu align="right" trigger={
          <button style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 8px 5px 6px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface-2)" }}>
            <Avatar name={userName} size={isMobile ? 28 : 32} />
            {!isMobile && <div style={{ textAlign: "left", lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{userName}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: 9, background: rc }} />
                <span className="faint" style={{ fontSize: 11 }}>{role}</span>
              </div>
            </div>}
            {!isMobile && <Icon.ChevronDown size={15} style={{ color: "var(--text-faint)" }} />}
          </button>
        } items={[
          { label: t('topbar.switchRole'), icon: Icon.Eye },
          { divider: true },
          ...Object.keys(ROLES).map(r => ({ label: r, icon: r === role ? Icon.Check : Icon.Users, onClick: () => onRole(r) })),
          { divider: true },
          { label: t('topbar.logout'), icon: Icon.Logout, danger: true, onClick: onLogout },
        ]} />
      </div>
    </header>
  );
}

export { NAV, ROLES, ACCESS };
