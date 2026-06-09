import { useState, useEffect } from 'react'; // Hooks für Zustand und Effekte
import { Icon } from '../components/icons'; // Icons des Projekts
import { Card, Badge, Button, Avatar, Progress, Segmented, Modal, Field, Input, Select, Textarea, SearchInput, IconButton } from '../components/ui'; // UI-Komponenten
import DB from '../data'; // Hartcodierte Daten als Fallback
import { useTranslation } from '../hooks/useTranslation'; // Übersetzungen

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Backend-URL aus der .env-Datei

const STATUS_TONE = { Upcoming: "primary", Planning: "warn", Past: "neutral" }; // Farben nach Status
const fmtDate = d => new Date(d + "T00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); // Datum formatieren

// --- Ereigniszeile in der Liste ---
function EventRow({ e, onOpen }) {
  const day = new Date((e.date || "2026-06-01") + "T00:00"); // String in Date umwandeln
  return (
      <Card hover onClick={() => onOpen(e)} style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <div style={{ width: 84, flexShrink: 0, background: "var(--primary-soft)", color: "var(--on-primary-soft)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "14px 0" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase" }}>{day.toLocaleDateString("en-US", { month: "short" })}</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-head)", lineHeight: 1 }}>{day.getDate() || "1"}</div>
            <div style={{ fontSize: 11, opacity: .8, marginTop: 2 }}>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{e.title}</h3>
              <Badge tone={STATUS_TONE[e.status]} dot>{e.status}</Badge>
              {e.recurring && <Badge tone="sage"><Icon.Clock size={12} /> Recurring</Badge>}
            </div>
            <div className="muted" style={{ fontSize: 13, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}><Icon.Clock size={14} />{e.time}</span>
              <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}><Icon.Pin size={14} />{e.location}</span>
              <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}><Icon.Hands size={14} />{e.ministry}</span>
            </div>
          </div>
          <div style={{ width: 180, flexShrink: 0, padding: "16px 20px", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 7 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
              <span className="muted">Registered</span>
              <span style={{ fontWeight: 700 }}>{e.attendees || 0}/{e.capacity || 100}</span>
            </div>
            <Progress value={((e.attendees || 0) / (e.capacity || 100)) * 100} tone={(e.attendees || 0) / (e.capacity || 100) > 0.85 ? "warn" : "primary"} height={7} />
            <div className="faint" style={{ fontSize: 11.5 }}>Led by {e.lead || 'TBD'}</div>
          </div>
        </div>
      </Card>
  );
}

// --- Kalenderansicht ---
function CalendarView({ events, onOpen }) {
  const start = new Date(2026, 5, 1); // Erster Tag im Juni 2026
  const startDow = start.getDay();    // Wochentag des Monatsbeginns
  const days = 30;                    // Anzahl Tage im Juni
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null); // Leere Zellen am Anfang
  for (let d = 1; d <= days; d++) cells.push(d);        // Tage des Monats
  const evByDay = {};                 // Ereignisse nach Tag gruppieren
  events.forEach(e => {
    const dt = new Date(e.date + "T00:00");
    if (dt.getMonth() === 5) (evByDay[dt.getDate()] ||= []).push(e); // Nur Juni
  });
  return (
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>June 2026</h3>
          <div style={{ display: "flex", gap: 6 }}>
            <IconButton icon={Icon.Chevron} size={16} style={{ transform: "rotate(180deg)" }} />
            <Button variant="outline" size="sm">Today</Button>
            <IconButton icon={Icon.Chevron} size={16} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="faint" style={{ textAlign: "center", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", paddingBottom: 4 }}>{d}</div>
          ))}
          {cells.map((d, i) => {
            const evs = d ? (evByDay[d] || []) : []; // Ereignisse des Tages
            const isToday = d === 4;                  // Heute ist der 4. Juni 2026
            return (
                <div key={i} style={{ minHeight: 92, borderRadius: 12, border: "1px solid var(--border)", background: d ? "var(--surface-2)" : "transparent", padding: 7, opacity: d ? 1 : 0 }}>
                  {d && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
                    <span style={{ width: 22, height: 22, display: "grid", placeItems: "center", borderRadius: 7, fontSize: 12, fontWeight: 700, background: isToday ? "var(--primary)" : "transparent", color: isToday ? "#fff" : "var(--text-muted)" }}>{d}</span>
                  </div>}
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {evs.slice(0, 2).map(e => (
                        <button key={e._id || e.id} onClick={() => onOpen(e)} style={{ textAlign: "left", border: "none", background: "var(--primary-soft)", color: "var(--on-primary-soft)", borderRadius: 6, padding: "3px 6px", fontSize: 10.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.time.replace(":00", "")} {e.title}</button>
                    ))}
                    {evs.length > 2 && <span className="faint" style={{ fontSize: 10.5, paddingLeft: 4 }}>+{evs.length - 2} more</span>}
                  </div>
                </div>
            );
          })}
        </div>
      </Card>
  );
}

// --- Detailansicht eines Ereignisses ---
function EventModal({ event, onClose }) {
  if (!event) return null;
  return (
      <Modal open={!!event} onClose={onClose} title={event.title} width={560}
             footer={<><Button variant="outline" onClick={onClose}>Close</Button><Button icon={Icon.Check}>Register attendees</Button></>}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
          <Badge tone={STATUS_TONE[event.status]} dot>{event.status}</Badge>
          <Badge tone="primary">{event.ministry}</Badge>
          {event.recurring && <Badge tone="sage">Recurring weekly</Badge>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          {[[Icon.Calendar, "Date", fmtDate(event.date)], [Icon.Clock, "Time", event.time], [Icon.Pin, "Location", event.location], [Icon.Cross, "Led by", event.lead]].map(([Ic, l, v]) => (
              <div key={l} style={{ display: "flex", gap: 11, alignItems: "center" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--surface-3)", color: "var(--primary)", display: "grid", placeItems: "center" }}><Ic size={18} /></div>
                <div><div className="faint" style={{ fontSize: 11.5 }}>{l}</div><div style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div></div>
              </div>
          ))}
        </div>
        <div style={{ background: "var(--surface-2)", borderRadius: 14, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>Registration</span>
            <span className="muted" style={{ fontSize: 13 }}>{event.attendees} of {event.capacity} spots</span>
          </div>
          <Progress value={(event.attendees / event.capacity) * 100} />
          <div style={{ display: "flex", marginTop: 14, alignItems: "center" }}>
            {DB.members.slice(0, 6).map((m, i) => (
                <div key={m.id} style={{ marginLeft: i ? -10 : 0 }}><Avatar name={m.name} size={32} ring /></div>
            ))}
            <span className="muted" style={{ fontSize: 12.5, marginLeft: 12 }}>+{event.attendees - 6} others attending</span>
          </div>
        </div>
      </Modal>
  );
}

// --- Modal: Neues Ereignis erstellen ---
function NewEventModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',                           // Titel des Ereignisses
    date: '2026-06-14',                 // Datum
    time: '10:00',                       // Uhrzeit
    location: '',                        // Ort
    ministry: DB.ministries[0].name,    // Erstes Ministerium als Standard
    capacity: 100,                       // Maximale Kapazitat
    description: '',                     // Beschreibung
    recurring: false                     // Wochentlich wiederholen
  });
  const [loading, setLoading] = useState(false); // Ladezustand
  const [error, setError] = useState('');         // Fehlermeldung

  const set = (key, val) => setForm(f => ({ ...f, [key]: val })); // Einzelnes Feld aktualisieren

  const handleCreate = async () => {
    const token = localStorage.getItem('token'); // JWT-Token aus dem Speicher holen
    if (!token) {
      setError('❌ Not authenticated. Please log in first and try again.');
      console.warn('No token found in localStorage. User needs to login.');
      return;
    }

    if (!form.title || !form.date || !form.location || !form.ministry) { // Pflichtfelder prufen
      setError('Bitte alle Pflichtfelder ausfullen.');
      return;
    }

    setLoading(true); // Laden aktivieren
    setError('');      // Vorherigen Fehler loschen
    try {
      const res = await fetch(API + '/api/events', { // POST-Anfrage an das Backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // JSON senden
          'Authorization': 'Bearer ' + token   // Auth-Header mit Token
        },
        body: JSON.stringify({
          title: form.title,               // Titel
          date: form.date,                 // Datum
          time: form.time,                 // Uhrzeit
          location: form.location,         // Ort
          ministry: form.ministry,         // Ministerium
          capacity: Number(form.capacity), // Kapazitat als Zahl
          description: form.description,   // Beschreibung
          recurring: form.recurring,       // Wiederholung
          status: 'Upcoming',              // Standardstatus
          attendees: 0,                    // Startet bei 0
          lead: 'TBD'                      // Standardleiter
        })
      });
      if (!res.ok) throw new Error('Ereignis konnte nicht erstellt werden'); // Serverfehler
      const newEvent = await res.json(); // Erstelltes Ereignis mit MongoDB _id
      onCreated(newEvent); // Elternkomponente benachrichtigen
      onClose();           // Modal schliessen
      setForm({ title: '', date: '2026-06-14', time: '10:00', location: '', ministry: DB.ministries[0].name, capacity: 100, description: '', recurring: false }); // Formular zurucksetzen
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten'); // Fehler anzeigen
    } finally {
      setLoading(false); // Laden deaktivieren
    }
  };

  return (
      <Modal open={open} onClose={onClose} title="Create event" width={560}
             footer={<>
               <Button variant="outline" onClick={onClose}>Cancel</Button>
               <Button icon={Icon.Check} onClick={handleCreate} disabled={loading}>
                 {loading ? 'Creating...' : 'Create event'}
               </Button>
             </>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--error-soft, #fee)', color: 'var(--error, #c00)', fontSize: 13 }}>{error}</div>}
          <Field label="Event title *"><Input placeholder="e.g. Sunday Worship Service" value={form.title} onChange={e => set('title', e.target.value)} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Date *"><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></Field>
            <Field label="Time"><Input type="time" value={form.time} onChange={e => set('time', e.target.value)} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Location *"><Input placeholder="Main Sanctuary" value={form.location} onChange={e => set('location', e.target.value)} /></Field>
            <Field label="Ministry *"><Select options={['', ...DB.ministries.map(m => m.name)]} value={form.ministry} onChange={e => set('ministry', e.target.value)} /></Field>
          </div>
          <Field label="Capacity"><Input type="number" value={form.capacity} onChange={e => set('capacity', e.target.value)} /></Field>
          <Field label="Description"><Textarea placeholder="Share details about this gathering..." value={form.description} onChange={e => set('description', e.target.value)} /></Field>
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 500 }}>
            <input type="checkbox" checked={form.recurring} onChange={e => set('recurring', e.target.checked)} style={{ accentColor: "var(--primary)" }} />
            Repeat weekly
          </label>
        </div>
      </Modal>
  );
}

// --- Hauptseite: Ereignisse ---
export default function Events({ role }) {
  const { t } = useTranslation();
  const [view, setView] = useState("list");          // Ansicht: Liste oder Kalender
  const [filter, setFilter] = useState("All");       // Ministeriumsfilter
  const [q, setQ] = useState("");                    // Suchbegriff
  const [open, setOpen] = useState(null);            // Geoffnetes Ereignis im Modal
  const [creating, setCreating] = useState(false);   // Erstellungsmodal geoffnet
  const [events, setEvents] = useState(DB.events);  // Ereignisse — startet mit lokalen Daten
  const [loadingEvents, setLoadingEvents] = useState(true); // Ereignisse werden geladen
  const [authError, setAuthError] = useState("");     // Auth error message

  // Ereignisse beim Laden der Komponente vom Backend holen
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token'); // JWT-Token holen
        const res = await fetch(API + '/api/events', { // GET-Anfrage an das Backend
          headers: { 'Authorization': 'Bearer ' + token } // Auth-Header
        });
        if (!res.ok) throw new Error('Laden fehlgeschlagen'); // Serverfehler
        const data = await res.json(); // Array von Ereignissen
        if (data.length > 0) setEvents(data); // Nur ersetzen wenn echte Daten vorhanden
      } catch {
        // Bei Fehler bleiben die hartcodierten Daten erhalten
      } finally {
        setLoadingEvents(false); // Laden beenden
      }
    };
    fetchEvents(); // Beim Mounten ausfuhren
  }, []); // Nur einmal ausfuhren

  // Neues Ereignis zur Liste hinzufugen ohne neu zu laden
  const handleCreated = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]); // Am Anfang der Liste einfugen
  };

  const ministries = ["All", ...new Set(events.map(e => e.ministry))]; // Eindeutige Ministerien fur Filter
  const list = events.filter(e =>  // Nach Ministerium und Suchbegriff filtern
      (filter === "All" || e.ministry === filter) &&
      e.title.toLowerCase().includes(q.toLowerCase())
  );

  const canEdit = role !== "Member"; // Nur Admins und Leiter durfen erstellen

  return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
        <div className="fade-up" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
          <Segmented value={view} onChange={setView} options={[{ value: "list", label: "List", icon: Icon.Filter }, { value: "calendar", label: "Calendar", icon: Icon.Calendar }]} />
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <SearchInput value={q} onChange={setQ} placeholder="Search events..." style={{ width: 200 }} />
            {canEdit && <Button icon={Icon.Plus} onClick={() => setCreating(true)}>New event</Button>}
          </div>
        </div>

        {view === "list" && (
            <div className="fade-up" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ministries.map(m => (
                  <button key={m} onClick={() => setFilter(m)} style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid " + (filter === m ? "transparent" : "var(--border-strong)"), background: filter === m ? "var(--primary)" : "var(--surface)", color: filter === m ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>{m}</button>
              ))}
            </div>
        )}

        {loadingEvents && <div className="muted" style={{ fontSize: 13, padding: '8px 0' }}>Ereignisse werden geladen...</div>}

        {view === "list"
            ? <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>{list.map(e => <EventRow key={e._id || e.id} e={e} onOpen={setOpen} />)}</div>
            : <div className="fade-up"><CalendarView events={events} onOpen={setOpen} /></div>}

        <EventModal event={open} onClose={() => setOpen(null)} />
        <NewEventModal open={creating} onClose={() => setCreating(false)} onCreated={handleCreated} />
      </div>
  );
}