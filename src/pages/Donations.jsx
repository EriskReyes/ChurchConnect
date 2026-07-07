import { useState, useEffect } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, Stat, Progress, Modal, Field, Input, Select, SearchInput } from '../components/ui';
import { BarChart } from '../components/charts';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Donations({ role }) {
  const { t } = useTranslation();
  const [donations, setDonations] = useState(DB.donations);
  const [recording, setRecording] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [donor, setDonor] = useState("Anonymous");
  const [fund, setFund] = useState("General Tithe");
  const [method, setMethod] = useState("Card");
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch(`${API}/api/donations`);
      if (response.ok) setDonations(await response.json());
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  const handleSaveDonation = async () => {
    if (!amount) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        donor,
        fund,
        amount: parseFloat(amount),
        method,
        recurring,
        date: new Date().toISOString().split('T')[0]
      };

      if (editing && selected) {
        const response = await fetch(`${API}/api/donations/${selected.id || selected._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const updated = await response.json();
          setDonations(donations.map(d => d.id === updated.id || d._id === updated._id ? updated : d));
          setEditing(false);
          setSelected(null);
        }
      } else {
        const response = await fetch(`${API}/api/donations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const newDonation = await response.json();
          setDonations([...donations, newDonation]);
        }
      }

      setAmount("");
      setDonor("Anonymous");
      setFund("General Tithe");
      setMethod("Card");
      setRecurring(false);
      setRecording(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonation = async (donation) => {
    if (!confirm("Delete this donation?")) return;
    try {
      const response = await fetch(`${API}/api/donations/${donation.id || donation._id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setDonations(donations.filter(d => d.id !== donation.id && d._id !== donation._id));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

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
          {role !== "Member" && <Button size="sm" icon={Icon.Plus} onClick={() => { setRecording(true); setEditing(false); }}>Record gift</Button>}
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

      <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Donations</h3>
        {donations.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 40 }}>
            <p className="muted">No donations recorded yet</p>
          </Card>
        ) : (
          donations.slice(0, 10).map(d => (
            <Card key={d.id || d._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                <Avatar name={d.donor || "Anonymous"} size={40} />
                <div>
                  <h4 style={{ fontWeight: 600 }}>{d.donor || "Anonymous"}</h4>
                  <p className="muted" style={{ fontSize: 12, marginTop: 2 }}>{d.fund} · {d.method} · {d.date}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>${d.amount}</div>
                {d.recurring && <Badge tone="sage">Recurring</Badge>}
                {role !== "Member" && <>
                  <Button size="sm" icon={Icon.Pencil} variant="ghost" onClick={() => { setSelected(d); setEditing(true); setAmount(d.amount.toString()); setDonor(d.donor); setFund(d.fund); setMethod(d.method); setRecurring(d.recurring); setRecording(true); }}>Edit</Button>
                  <Button size="sm" icon={Icon.Trash} variant="ghost" onClick={() => handleDeleteDonation(d)}>Delete</Button>
                </>}
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal open={recording} onClose={() => { setRecording(false); setEditing(false); }} title={editing ? "Edit Donation" : "Record a gift"} width={500}
        footer={<><Button variant="outline" onClick={() => { setRecording(false); setEditing(false); }}>Cancel</Button><Button icon={Icon.Check} onClick={handleSaveDonation} disabled={loading}>{loading ? "Saving..." : editing ? "Update" : "Record"}</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Amount *">
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "var(--text-muted)" }}>$</span>
              <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingLeft: 28, fontSize: 18, fontWeight: 700 }} />
            </div>
          </Field>
          <Field label="Donor"><Select value={donor} onChange={e => setDonor(e.target.value)} options={["Anonymous", ...DB.members.map(m => m.name)]} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Fund"><Select value={fund} onChange={e => setFund(e.target.value)} options={DB.funds.map(f => f.name)} /></Field>
            <Field label="Method"><Select value={method} onChange={e => setMethod(e.target.value)} options={["Card", "Bank", "Cash", "Check"]} /></Field>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 500 }}><input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} style={{ accentColor: "var(--primary)" }} /> Recurring donation</label>
        </div>
      </Modal>
    </div>
  );
}
