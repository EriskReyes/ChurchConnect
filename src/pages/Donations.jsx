import { useState } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, Stat, Progress, Modal, Field, Input, Select, SearchInput } from '../components/ui';
import { BarChart } from '../components/charts';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';

export default function Donations({ role }) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [recording, setRecording] = useState(false);

  const fmt = n => "$" + n.toLocaleString();
  const fmtK = n => n >= 1000 ? "$" + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : "$" + n;
  const ytd = DB.funds.reduce((s, f) => s + f.raised, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "var(--gap)" }}>
        <Stat icon={Icon.Gift} label={t('donations.thisMonth')} value="$38.2k" delta="+12%" tint="primary" />
        <Stat icon={Icon.Clock} label={t('donations.recurringGivers')} value="312" delta="+9" tint="sage" />
        <Stat icon={Icon.Heart} label={t('donations.averageGift')} value="$184" tint="warn" />
        <Stat icon={Icon.Chart} label={t('donations.ytdTotal')} value={fmtK(ytd)} delta="across 4 funds" tint="primary" />
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "var(--gap)" }}>
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{t('donations.givingTrend')}</h3>
          <BarChart data={DB.givingTrend} color="var(--primary)" fmt={v => "$" + (v / 1000).toFixed(1) + "k"} />
        </Card>
      </div>

      <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Funds</h3>
          {role !== "Member" && <Button size="sm" icon={Icon.Plus} onClick={() => setRecording(true)}>Record gift</Button>}
        </div>
        {DB.funds.map(f => (
          <Card key={f.name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h4 style={{ fontWeight: 600 }}>{f.name}</h4>
              <span className="muted" style={{ fontSize: 13 }}>{fmt(f.raised)} of {fmt(f.goal)}</span>
            </div>
            <Progress value={(f.raised / f.goal) * 100} tone={f.tone} height={8} />
          </Card>
        ))}
      </div>

      <Modal open={recording} onClose={() => setRecording(false)} title="Record a gift" width={500}
        footer={<><Button variant="outline" onClick={() => setRecording(false)}>Cancel</Button><Button icon={Icon.Check} onClick={() => setRecording(false)}>Record gift</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Amount">
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "var(--text-muted)" }}>$</span>
              <Input type="number" placeholder="0.00" style={{ paddingLeft: 28, fontSize: 18, fontWeight: 700 }} />
            </div>
          </Field>
          <Field label="Donor"><Select options={["Anonymous", ...DB.members.map(m => m.name)]} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Fund"><Select options={DB.funds.map(f => f.name)} /></Field>
            <Field label="Method"><Select options={["Card", "Bank", "Cash", "Check"]} /></Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
