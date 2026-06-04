import { useState } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, Stat, Modal, Field, Input, SearchInput } from '../components/ui';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';

const STATUS_TONE = { Active: "sage", New: "primary", Inactive: "neutral" };

export default function Members({ role }) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  let list = DB.members.filter(m => m.name.toLowerCase().includes(q.toLowerCase()) || m.email.includes(q));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <SearchInput value={q} onChange={setQ} placeholder={t('members.search')} style={{ maxWidth: 300 }} />
        {role !== "Member" && <Button icon={Icon.Plus}>{t('members.addMember')}</Button>}
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "var(--gap)" }}>
        {list.map(m => (
          <Card key={m.id} hover onClick={() => setSelected(m)} style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", height: 0 }}>
              <Badge tone={STATUS_TONE[m.status]} dot>{m.status}</Badge>
            </div>
            <Avatar name={m.name} size={66} ring style={{ margin: "12px auto" }} />
            <h3 style={{ fontSize: 15.5, fontWeight: 700 }}>{m.name}</h3>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{m.role}</div>
            <Badge tone="primary" style={{ marginTop: 10 }}>{m.ministry}</Badge>
          </Card>
        ))}
      </div>

      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title="Member profile" width={480}
          footer={<><Button variant="outline" icon={Icon.Mail}>Message</Button><Button icon={Icon.Edit}>Edit profile</Button></>}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 20 }}>
            <Avatar name={selected.name} size={84} ring />
            <h3 style={{ fontSize: 20, fontWeight: 700, marginTop: 14 }}>{selected.name}</h3>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Badge tone="primary">{selected.role}</Badge>
              <Badge tone={STATUS_TONE[selected.status]} dot>{selected.status}</Badge>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[[Icon.Mail, "Email", selected.email], [Icon.Phone, "Phone", selected.phone], [Icon.Hands, "Ministry", selected.ministry]].map(([Ic, l, v]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ color: "var(--text-faint)" }}><Ic size={18} /></div>
                <div className="muted" style={{ fontSize: 13, width: 110 }}>{l}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
