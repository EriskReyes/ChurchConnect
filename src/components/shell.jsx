import { useState } from 'react';
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
  "Member": { color: "#1F4E5F", desc: "Community access" },
};

const ACCESS = {
  "Admin": "*",
  "Pastor": "*",
  "Treasurer": ["dashboard", "members", "donations", "reports", "documents", "chat", "settings"],
  "Ministry Leader": ["dashboard", "events", "members", "staff", "ministries", "sermons", "documents", "flyers", "gallery", "prayer", "community", "chat", "settings"],
  "Member": ["dashboard", "events", "sermons", "flyers", "gallery", "prayer", "community", "chat", "settings"],
};

export function canAccess(role, key) {
  const a = ACCESS[role];
  return a === "*" || a.includes(key);
}

export function Sidebar({ active, onNav, collapsed, role, onLogout }) {
  const { t } = useTranslation();
  const W = collapsed ? 76 : 256;

  const navWithTranslations = NAV.map(grp => ({
    ...grp,
    sectionKey: grp.section.toLowerCase().replace(/\s+/g, '_'),
    items: grp.items.map(it => ({
      ...it,
      translatedLabel: t(`sidebar.${it.key.toLowerCase()}`) || it.label
    }))
  }));

  return (
    <aside style={{
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

export function Topbar({ page, role, onRole, onToggleSidebar, dark, onToggleDark, onLogout }) {
  const { t } = useTranslation();
  const [title, sub] = PAGE_TITLES[page] || ["", ""];
  const rc = ROLES[role].color;
  return (
    <header style={{ height: 70, flexShrink: 0, display: "flex", alignItems: "center", gap: 16, padding: "0 28px", borderBottom: "1px solid var(--border)", background: "color-mix(in srgb, var(--surface) 70%, transparent)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 15 }}>
      <IconButton icon={Icon.Filter} onClick={onToggleSidebar} title={t('topbar.search')} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h1>
        <div className="muted" style={{ fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <SearchInput style={{ width: 210 }} placeholder={t('topbar.search')} />
        <IconButton icon={dark ? Icon.Sun : Icon.Moon} onClick={onToggleDark} title={t('topbar.darkMode')} />
        <IconButton icon={Icon.Bell} badge title={t('topbar.notifications')} />

        <Menu align="right" trigger={
          <button style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 8px 5px 6px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface-2)" }}>
            <Avatar name="James Whitfield" size={32} />
            <div style={{ textAlign: "left", lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Pastor James</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: 9, background: rc }} />
                <span className="faint" style={{ fontSize: 11 }}>{role}</span>
              </div>
            </div>
            <Icon.ChevronDown size={15} style={{ color: "var(--text-faint)" }} />
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
