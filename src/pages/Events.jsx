import { useState, useEffect } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, Progress, Segmented, Modal, Field, Input, Select, Textarea, SearchInput, Menu, IconButton } from '../components/ui';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';

const STATUS_TONE = { Upcoming: "primary", Planning: "warn", Past: "neutral" };
const fmtDate = d => new Date(d + "T00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

function EventRow({ e, onOpen }) {
  const day = e.date ? new Date(e.date + "T00:00") : new Date();
  const dateNum = !isNaN(day.getDate()) ? day.getDate() : "?";
  return (
    <Card hover onClick={() => onOpen(e)} style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "stretch" }}>
        <div style={{ width: 84, flexShrink: 0, background: "var(--primary-soft)", color: "var(--on-primary-soft)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "14px 0" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase" }}>{day.toLocaleDateString("en-US", { month: "short" })}</div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-head)", lineHeight: 1 }}>{dateNum}</div>
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
            <span style={{ fontWeight: 700 }}>{e.attendees}/{e.capacity}</span>
          </div>
          <Progress value={(e.attendees / e.capacity) * 100} tone={e.attendees / e.capacity > 0.85 ? "warn" : "primary"} height={7} />
          <div className="faint" style={{ fontSize: 11.5 }}>Led by {e.lead}</div>
        </div>
      </div>
    </Card>
  );
}

function CalendarView({ onOpen }) {
  const start = new Date(2026, 5, 1);
  const startDow = start.getDay();
  const days = 30;
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  const evByDay = {};
  DB.events.forEach(e => { const dt = new Date(e.date + "T00:00"); if (dt.getMonth() === 5) (evByDay[dt.getDate()] ||= []).push(e); });
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
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="faint" style={{ textAlign: "center", fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", paddingBottom: 4 }}>{d}</div>)}
        {cells.map((d, i) => {
          const evs = d ? (evByDay[d] || []) : [];
          const isToday = d === 2;
          return (
            <div key={i} style={{ minHeight: 92, borderRadius: 12, border: "1px solid var(--border)", background: d ? "var(--surface-2)" : "transparent", padding: 7, opacity: d ? 1 : 0 }}>
              {d && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
                <span style={{ width: 22, height: 22, display: "grid", placeItems: "center", borderRadius: 7, fontSize: 12, fontWeight: 700, background: isToday ? "var(--primary)" : "transparent", color: isToday ? "#fff" : "var(--text-muted)" }}>{d}</span>
              </div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {evs.slice(0, 2).map(e => (
                  <button key={e.id} onClick={() => onOpen(e)} style={{ textAlign: "left", border: "none", background: "var(--primary-soft)", color: "var(--on-primary-soft)", borderRadius: 6, padding: "3px 6px", fontSize: 10.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.time.replace(":00", "")} {e.title}</button>
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

function EventModal({ event, onClose, onDelete, onEdit }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres borrar este evento?")) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/events/${event.id || event._id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });

      if (response.ok) {
        onDelete();
        onClose();
      }
    } catch (err) {
      alert("Error al borrar evento: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (!event) return null;
  return (
    <Modal open={!!event} onClose={onClose} title={event.title} width={560}
      footer={<><Button variant="outline" onClick={onClose}>Close</Button><Button icon={Icon.Pencil} onClick={onEdit}>Edit</Button><Button icon={Icon.Trash} variant="danger" onClick={handleDelete} disabled={deleting}>{deleting ? "Borrando..." : "Delete"}</Button></>}>
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
          {DB.members.slice(0, 6).map((m, i) => <div key={m.id} style={{ marginLeft: i ? -10 : 0 }}><Avatar name={m.name} size={32} ring /></div>)}
          <span className="muted" style={{ fontSize: 12.5, marginLeft: 12 }}>+{event.attendees - 6} others attending</span>
        </div>
      </div>
    </Modal>
  );
}

function NewEventModal({ open, onClose, onEventCreated }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-06-14");
  const [time, setTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [ministry, setMinistry] = useState(DB.ministries[0]?.name || "");
  const [capacity, setCapacity] = useState("100");
  const [description, setDescription] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!title || !date || !time || !location || !ministry || !capacity) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          title,
          date,
          time,
          location,
          ministry,
          capacity: parseInt(capacity),
          description,
          recurring,
          attendees: 0,
          status: "Upcoming",
          lead: "Church Admin"
        })
      });

      if (!response.ok) throw new Error("Failed to create event");

      const newEvent = await response.json();
      onEventCreated(newEvent);

      setTitle("");
      setLocation("");
      setDescription("");
      setRecurring(false);
      onClose();
    } catch (err) {
      setError(err.message || "Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create event" width={560}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button icon={Icon.Check} onClick={handleSubmit} disabled={loading}>{loading ? "Creating..." : "Create event"}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && <div style={{ color: "var(--warn)", fontSize: 13, padding: "8px 12px", background: "var(--warn-soft)", borderRadius: 8 }}>{error}</div>}
        <Field label="Event title"><Input placeholder="e.g. Sunday Worship Service" value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
          <Field label="Time"><Input type="time" value={time} onChange={e => setTime(e.target.value)} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Location"><Input placeholder="Main Sanctuary" value={location} onChange={e => setLocation(e.target.value)} /></Field>
          <Field label="Ministry"><Select value={ministry} onChange={e => setMinistry(e.target.value)} options={["Worship", "Youth", "Outreach", "Children", "Hospitality", "Discipleship"]} /></Field>
        </div>
        <Field label="Capacity"><Input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} /></Field>
        <Field label="Description"><Textarea placeholder="Share details about this gathering…" value={description} onChange={e => setDescription(e.target.value)} /></Field>
        <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 500 }}><input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} style={{ accentColor: "var(--primary)" }} /> Repeat weekly</label>
      </div>
    </Modal>
  );
}

function EditEventModal({ open, onClose, onEventUpdated, event }) {
  const [title, setTitle] = useState(event?.title || "");
  const [date, setDate] = useState(event?.date || "");
  const [time, setTime] = useState(event?.time || "");
  const [location, setLocation] = useState(event?.location || "");
  const [ministry, setMinistry] = useState(event?.ministry || "");
  const [capacity, setCapacity] = useState(event?.capacity?.toString() || "");
  const [description, setDescription] = useState(event?.description || "");
  const [recurring, setRecurring] = useState(event?.recurring || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!title || !date || !time || !location || !ministry || !capacity) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/events/${event.id || event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          title,
          date,
          time,
          location,
          ministry,
          capacity: parseInt(capacity),
          description,
          recurring
        })
      });

      if (!response.ok) throw new Error("Failed to update event");

      const updatedEvent = await response.json();
      onEventUpdated(updatedEvent);
      onClose();
    } catch (err) {
      setError(err.message || "Error updating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit event" width={560}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button icon={Icon.Check} onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save"}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && <div style={{ color: "var(--warn)", fontSize: 13, padding: "8px 12px", background: "var(--warn-soft)", borderRadius: 8 }}>{error}</div>}
        <Field label="Event title"><Input placeholder="e.g. Sunday Worship Service" value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
          <Field label="Time"><Input type="time" value={time} onChange={e => setTime(e.target.value)} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Location"><Input placeholder="Main Sanctuary" value={location} onChange={e => setLocation(e.target.value)} /></Field>
          <Field label="Ministry"><Select value={ministry} onChange={e => setMinistry(e.target.value)} options={["Worship", "Youth", "Outreach", "Children", "Hospitality", "Discipleship"]} /></Field>
        </div>
        <Field label="Capacity"><Input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} /></Field>
        <Field label="Description"><Textarea placeholder="Share details about this gathering…" value={description} onChange={e => setDescription(e.target.value)} /></Field>
        <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 500 }}><input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} style={{ accentColor: "var(--primary)" }} /> Repeat weekly</label>
      </div>
    </Modal>
  );
}

export default function Events({ role }) {
  const { t } = useTranslation();
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [events, setEvents] = useState(DB.events);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/events", {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        setEvents(DB.events);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents(DB.events);
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreated = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id || e._id === updatedEvent._id ? updatedEvent : e));
    setOpen(updatedEvent);
    setEditing(false);
  };

  const handleEventDeleted = () => {
    setOpen(null);
    fetchEvents();
  };

  const ministries = ["All", ...new Set(events.map(e => e.ministry))];
  let list = events.filter(e => (filter === "All" || e.ministry === filter) && e.title.toLowerCase().includes(q.toLowerCase()));

  const canEdit = role !== "Member";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
        <Segmented value={view} onChange={setView} options={[{ value: "list", label: "List", icon: Icon.Filter }, { value: "calendar", label: "Calendar", icon: Icon.Calendar }]} />
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <SearchInput value={q} onChange={setQ} placeholder="Search events…" style={{ width: 200 }} />
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

      {view === "list"
        ? <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>{list.map((e, i) => <EventRow key={e.id || e._id || i} e={e} onOpen={setOpen} />)}</div>
        : <div className="fade-up"><CalendarView onOpen={setOpen} /></div>}

      <EventModal event={open} onClose={() => setOpen(null)} onDelete={handleEventDeleted} onEdit={() => setEditing(true)} />
      <NewEventModal open={creating} onClose={() => setCreating(false)} onEventCreated={handleEventCreated} />
      <EditEventModal open={editing} onClose={() => setEditing(false)} onEventUpdated={handleEventUpdated} event={open} />
    </div>
  );
}
