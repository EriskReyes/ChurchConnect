import { useState } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, SearchInput, Field, Input, Textarea, Select, Modal, IconButton, Menu } from '../components/ui';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';

const PRAYER_TONE = { Health: "danger", Guidance: "primary", Praise: "sage", Outreach: "warn", Youth: "primary" };

function Ministries({ role }) {
  const canAdd = role !== "Member" && role !== "Treasurer";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", justifyContent: "flex-end" }}>{canAdd && <Button icon={Icon.Plus}>New ministry</Button>}</div>
      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "var(--gap)" }}>
        {DB.ministries.map(m => (
          <Card key={m.id} hover pad={false} style={{ overflow: "hidden" }}>
            <div style={{ height: 8, background: m.color }} />
            <div style={{ padding: "var(--pad-card)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "color-mix(in srgb," + m.color + " 14%, var(--surface))", color: m.color, display: "grid", placeItems: "center" }}><Icon.Hands size={24} /></div>
                <Menu trigger={<IconButton icon={Icon.Dots} />} items={[{ label: "View team", icon: Icon.Users }, { label: "Edit", icon: Icon.Edit }]} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 16 }}>{m.name}</h3>
              <p className="muted" style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5, minHeight: 38 }}>{m.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                <Avatar name={m.lead} size={30} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 600 }}>{m.lead}</div><div className="faint" style={{ fontSize: 11.5 }}>Ministry Lead</div></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
                <Badge tone="primary"><Icon.Users size={12} /> {m.members} members</Badge>
                <Badge tone="sage"><Icon.Clock size={12} /> {m.meeting}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Prayer() {
  const [prayers, setPrayers] = useState(DB.prayers.map(p => ({ ...p, prayed: false })));
  const [filter, setFilter] = useState("All");
  const [compose, setCompose] = useState(false);
  const cats = ["All", ...new Set(DB.prayers.map(p => p.category))];
  const pray = id => setPrayers(ps => ps.map(p => p.id === id ? { ...p, prayers: p.prayed ? p.prayers - 1 : p.prayers + 1, prayed: !p.prayed } : p));
  const list = prayers.filter(p => filter === "All" || p.category === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <Card className="fade-up" style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "space-between", flexWrap: "wrap", background: "linear-gradient(120deg,var(--primary-soft),var(--surface))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: "var(--surface)", color: "var(--primary)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)" }}><Icon.Heart size={24} /></div>
          <div><h3 style={{ fontSize: 17, fontWeight: 700 }}>Prayer Wall</h3><p className="muted" style={{ fontSize: 13, marginTop: 2 }}>Share a request — the community will lift you up.</p></div>
        </div>
        <Button icon={Icon.Plus} onClick={() => setCompose(true)}>Share a request</Button>
      </Card>

      <div className="fade-up" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {cats.map(c => <button key={c} onClick={() => setFilter(c)} style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid " + (filter === c ? "transparent" : "var(--border-strong)"), background: filter === c ? "var(--primary)" : "var(--surface)", color: filter === c ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>{c}</button>)}
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "var(--gap)" }}>
        {list.map(p => (
          <Card key={p.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
              <Avatar name={p.by === "Anonymous" ? "A ?" : p.by} size={38} />
              <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.by}</div><div className="faint" style={{ fontSize: 12 }}>{p.time}</div></div>
              <Badge tone={PRAYER_TONE[p.category] || "neutral"}>{p.category}</Badge>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--text)" }}>{p.text}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <button onClick={() => pray(p.id)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 999, border: "1px solid " + (p.prayed ? "transparent" : "var(--border-strong)"), background: p.prayed ? "var(--primary)" : "var(--surface-2)", color: p.prayed ? "#fff" : "var(--text)", fontSize: 13, fontWeight: 600 }}><Icon.Heart size={15} />{p.prayed ? "Praying" : "Pray"} · {p.prayers}</button>
              {p.answered && <Badge tone="sage" dot>Answered</Badge>}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={compose} onClose={() => setCompose(false)} title="Share a prayer request" width={500}
        footer={<><Button variant="outline" onClick={() => setCompose(false)}>Cancel</Button><Button icon={Icon.Heart} onClick={() => setCompose(false)}>Post to wall</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Your request"><Textarea placeholder="What would you like the community to pray for?" style={{ minHeight: 120 }} /></Field>
          <Field label="Category"><Select options={["Health", "Guidance", "Praise", "Outreach", "Youth", "Family"]} /></Field>
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 500 }}><input type="checkbox" style={{ accentColor: "var(--primary)" }} /> Post anonymously</label>
        </div>
      </Modal>
    </div>
  );
}

export default function Connect({ role, onNav }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState("ministries");
  const tabs = [
    { value: "ministries", label: t('connect.ministries'), icon: Icon.Hands },
    { value: "prayer", label: t('connect.prayer'), icon: Icon.Heart },
    { value: "community", label: t('connect.community'), icon: Icon.Sparkle },
    { value: "chat", label: t('connect.chat'), icon: Icon.Chat },
    { value: "documents", label: t('connect.documents'), icon: Icon.Doc },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 4, overflowX: "auto" }}>
        {tabs.map(t => {
          const on = tab === t.value;
          return (
            <button key={t.value} onClick={() => setTab(t.value)}
              style={{
                padding: "11px 16px", fontSize: 14, fontWeight: 600, border: "none", background: "none",
                color: on ? "var(--primary)" : "var(--text-muted)", position: "relative", marginBottom: -1, whiteSpace: "nowrap",
              }}>{t.label}
              <span style={{ position: "absolute", left: 12, right: 12, bottom: 0, height: 2.5, borderRadius: 3, background: on ? "var(--primary)" : "transparent" }} />
            </button>
          );
        })}
      </div>

      {tab === "ministries" && <Ministries role={role} />}
      {tab === "prayer" && <Prayer />}
      {tab === "community" && <Card style={{ padding: 40, textAlign: "center" }}><p className="muted">Community posts coming soon...</p></Card>}
      {tab === "chat" && <Card style={{ padding: 40, textAlign: "center" }}><p className="muted">Chat coming soon...</p></Card>}
      {tab === "documents" && (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {DB.documents.map(d => (
            <Card key={d.id} hover style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--surface-3)", color: "var(--primary)", display: "grid", placeItems: "center" }}><Icon.Doc size={20} /></div>
                <div>
                  <h4 style={{ fontWeight: 600 }}>{d.name}</h4>
                  <p className="muted" style={{ fontSize: 12, marginTop: 2 }}>{d.size} · by {d.by}</p>
                </div>
              </div>
              <Button size="sm" icon={Icon.Download} variant="ghost">Download</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
