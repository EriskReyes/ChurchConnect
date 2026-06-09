import { useState, useEffect } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Modal, Segmented, IconButton, Input, Field } from '../components/ui';
import { useTranslation } from '../hooks/useTranslation.js';

const BAPTISM_STATUS_TONE = { Completed: "sage", Scheduled: "primary", Postponed: "neutral" };

function NewBaptismModal({ open, onClose, onBaptismCreated }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [age, setAge] = useState('');
  const [ministry, setMinistry] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [status, setStatus] = useState('Scheduled');
  const [testimony, setTestimony] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !date) {
      setError('Please fill all required fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/baptisms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, date, age: parseInt(age) || 0, ministry, sponsor, status, testimony })
      });
      if (!response.ok) throw new Error('Failed to create baptism');
      const newBaptism = await response.json();
      onBaptismCreated(newBaptism);
      setName('');
      setDate('');
      setAge('');
      setMinistry('');
      setSponsor('');
      setStatus('Scheduled');
      setTestimony('');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Baptism" width={480}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit} disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button></>}>
      {error && <div style={{ padding: 12, marginBottom: 16, background: 'var(--error-soft)', color: 'var(--on-error-soft)', borderRadius: 8, fontSize: 13 }}>{error}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Name *">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Candidate name" />
        </Field>
        <Field label="Date *">
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </Field>
        <Field label="Age">
          <Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" />
        </Field>
        <Field label="Ministry">
          <Input value={ministry} onChange={e => setMinistry(e.target.value)} placeholder="Ministry" />
        </Field>
        <Field label="Sponsor">
          <Input value={sponsor} onChange={e => setSponsor(e.target.value)} placeholder="Sponsor/Mentor" />
        </Field>
        <Field label="Status">
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid var(--border)', width: '100%' }}>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Postponed</option>
          </select>
        </Field>
        <Field label="Testimony">
          <textarea value={testimony} onChange={e => setTestimony(e.target.value)} placeholder="Baptism testimony" style={{ padding: 8, borderRadius: 6, border: '1px solid var(--border)', width: '100%', minHeight: 80, fontFamily: 'inherit' }} />
        </Field>
      </div>
    </Modal>
  );
}

function BaptismDetailModal({ baptism, onClose, onDelete, role }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this baptism record?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/baptisms/${baptism.id || baptism._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete');
      onDelete();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!baptism) return null;

  return (
    <Modal open={!!baptism} onClose={onClose} title={`${baptism.name}`} width={480}
      footer={<><Button variant="outline" onClick={onClose}>Close</Button>{role && role !== 'Member' && <Button variant="outline" onClick={handleDelete} disabled={loading} style={{ color: 'var(--error)' }}>Delete</Button></>}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        <Badge tone={BAPTISM_STATUS_TONE[baptism.status]} dot>{baptism.status}</Badge>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {[[Icon.Calendar, "Date", new Date(baptism.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })], [Icon.Users, "Age", baptism.age || '-'], [Icon.Shield, "Ministry", baptism.ministry || '-'], [Icon.User, "Sponsor", baptism.sponsor || '-']].map(([Ic, l, v]) => (
          <div key={l} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ color: "var(--text-faint)" }}><Ic size={18} /></div>
            <div className="muted" style={{ fontSize: 13, width: 80 }}>{l}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
        {baptism.testimony && <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Testimony</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{baptism.testimony}</div>
        </div>}
      </div>
    </Modal>
  );
}

export default function Baptisms({ role }) {
  const { t } = useTranslation();
  const [baptisms, setBaptisms] = useState([]);
  const [view, setView] = useState("list");
  const [selectedBaptism, setSelectedBaptism] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    fetchBaptisms();
  }, []);

  const fetchBaptisms = async () => {
    try {
      const response = await fetch('/api/baptisms');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setBaptisms(data);
    } catch (err) {
      console.error('Error fetching baptisms:', err);
    }
  };

  const handleBaptismCreated = (newBaptism) => {
    setBaptisms([...baptisms, newBaptism]);
  };

  const handleBaptismDeleted = () => {
    setSelectedBaptism(null);
    fetchBaptisms();
  };

  const handlePrevMonth = () => setCurrentMonth(m => m === 0 ? 11 : m - 1);
  const handleNextMonth = () => setCurrentMonth(m => m === 11 ? 0 : m + 1);

  const baptismByDay = {};
  baptisms.forEach(b => {
    const dt = new Date(b.date);
    if (dt.getMonth() === currentMonth) {
      (baptismByDay[dt.getDate()] ||= []).push(b);
    }
  });

  const monthName = new Date(2026, currentMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const calendarGrid = () => {
    const start = new Date(2026, currentMonth, 1);
    const startDow = start.getDay();
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][currentMonth];
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <Segmented value={view} onChange={setView} options={[
          { value: "calendar", label: "Calendar", icon: Icon.Calendar },
          { value: "list", label: "List", icon: Icon.List },
        ]} />
        {view === "calendar" && <div style={{ display: "flex", gap: 6 }}>
          <IconButton icon={Icon.Chevron} size={16} onClick={handlePrevMonth} style={{ transform: "rotate(180deg)" }} />
          <Button variant="outline" size="sm">Today</Button>
          <IconButton icon={Icon.Chevron} size={16} onClick={handleNextMonth} />
        </div>}
        {role && role !== "Member" && <Button icon={Icon.Plus} onClick={() => setShowNewModal(true)}>{t('baptisms.addBaptism')}</Button>}
      </div>

      {view === "calendar" && (
        <div className="fade-up">
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{monthName}</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8 }}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="faint" style={{ textAlign: "center", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", paddingBottom: 4 }}>
                  {d}
                </div>
              ))}
              {calendarGrid().map((d, i) => {
                const baps = d ? (baptismByDay[d] || []) : [];
                return (
                  <div key={i} style={{ minHeight: 100, borderRadius: 12, border: "1px solid var(--border)", background: d ? "var(--surface-2)" : "transparent", padding: 7, opacity: d ? 1 : 0 }}>
                    {d && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
                      <span style={{ width: 22, height: 22, display: "grid", placeItems: "center", borderRadius: 7, fontSize: 12, fontWeight: 700, background: baps.length > 0 ? "var(--primary)" : "transparent", color: baps.length > 0 ? "#fff" : "var(--text-muted)" }}>
                        {d}
                      </span>
                    </div>}
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {baps.slice(0, 2).map(b => (
                        <button key={b.id || b._id} onClick={() => setSelectedBaptism(b)} style={{ textAlign: "left", border: "none", background: "var(--primary-soft)", color: "var(--on-primary-soft)", borderRadius: 6, padding: "3px 6px", fontSize: 9.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer" }}>
                          {b.name}
                        </button>
                      ))}
                      {baps.length > 2 && <span className="faint" style={{ fontSize: 10.5, paddingLeft: 4 }}>+{baps.length - 2}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {view === "list" && (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
          {baptisms.length === 0 ? (
            <Card style={{ textAlign: "center", padding: 40 }}>
              <div className="muted" style={{ fontSize: 14 }}>No baptism records yet</div>
            </Card>
          ) : (
            baptisms.map(b => (
              <Card key={b.id || b._id} hover onClick={() => setSelectedBaptism(b)} style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  <div style={{ width: 84, flexShrink: 0, background: "var(--primary-soft)", color: "var(--on-primary-soft)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "14px 0" }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase" }}>{new Date(b.date).toLocaleDateString("en-US", { month: "short" })}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-head)", lineHeight: 1 }}>{new Date(b.date).getDate()}</div>
                    <div style={{ fontSize: 11, opacity: .8, marginTop: 2 }}>{new Date(b.date).toLocaleDateString("en-US", { weekday: "short" })}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>{b.name}</h3>
                      <Badge tone={BAPTISM_STATUS_TONE[b.status]} dot>{b.status}</Badge>
                    </div>
                    <div className="muted" style={{ fontSize: 13, display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {b.age && <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>Age {b.age}</span>}
                      {b.ministry && <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>{b.ministry}</span>}
                      {b.sponsor && <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>Sponsor: {b.sponsor}</span>}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <NewBaptismModal open={showNewModal} onClose={() => setShowNewModal(false)} onBaptismCreated={handleBaptismCreated} />
      <BaptismDetailModal baptism={selectedBaptism} onClose={() => setSelectedBaptism(null)} onDelete={handleBaptismDeleted} role={role} />
    </div>
  );
}
