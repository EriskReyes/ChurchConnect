import { useState } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, SearchInput } from '../components/ui';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';

const SERIES_GRAD = {
  "Anchored": "linear-gradient(135deg,#3B5BA5,#1F4E5F)",
  "On Mission": "linear-gradient(135deg,#6E9B7E,#4A7C59)",
  "Stewardship": "linear-gradient(135deg,#B5742E,#8a5520)",
};

function SermonArt({ s, h = 150, big }) {
  return (
    <div style={{ height: h, borderRadius: big ? "var(--r-lg)" : "var(--r-md)", background: SERIES_GRAD[s.series] || "linear-gradient(135deg,#7A4E9E,#5a3578)", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: big ? 24 : 14 }}>
      <div style={{ position: "absolute", right: -20, top: -20, opacity: .16 }}><Icon.Cross size={big ? 180 : 110} sw={1} /></div>
      <div style={{ position: "relative" }}>
        <Badge style={{ background: "rgba(255,255,255,.22)", color: "#fff" }}>{s.series}</Badge>
      </div>
      <div style={{ position: "absolute", top: big ? 24 : 12, right: big ? 24 : 12 }}>
        <div style={{ width: big ? 56 : 42, height: big ? 56 : 42, borderRadius: "50%", background: "rgba(255,255,255,.9)", display: "grid", placeItems: "center", color: "var(--primary)" }}><Icon.Play size={big ? 24 : 18} /></div>
      </div>
    </div>
  );
}

export default function Sermons() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  let list = DB.sermons.filter(s => s.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <SearchInput value={q} onChange={setQ} placeholder={t('sermons.search')} style={{ maxWidth: 300 }} />
        <Button icon={Icon.Mic}>Record sermon</Button>
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "var(--gap)" }}>
        {list.map(s => (
          <Card key={s.id} hover pad={false} style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 12, paddingBottom: 0 }}><SermonArt s={s} /></div>
            <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.3 }}>{s.title}</h3>
              <div className="muted" style={{ fontSize: 12.5, display: "flex", alignItems: "center", gap: 7 }}><Icon.Book size={14} />{s.scripture}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 2 }}>
                <Avatar name={s.speaker.replace("Pastor ", "")} size={26} />
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{s.speaker.replace("Pastor ", "")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <span className="faint" style={{ fontSize: 12, display: "flex", gap: 12 }}>
                  <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Icon.Clock size={13} />{s.duration}</span>
                  <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Icon.Play size={12} />{s.plays}</span>
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
