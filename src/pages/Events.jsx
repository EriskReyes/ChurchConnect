import { useState, useEffect } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, Progress, Segmented, Modal, Field, Input, Select, Textarea, SearchInput, Menu, IconButton } from '../components/ui';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';

const STATUS_TONE = { Upcoming: "primary", Planning: "warn", Past: "neutral" }; // Colores por estado

// Normaliza cualquier formato de fecha (ISO o simple) y la formatea bonito
const fmtDate = d => {
  const clean = d ? d.split("T")[0] : null; // Toma solo "2026-06-14" sin la parte de hora
  if (!clean) return "No date"; // Si no hay fecha, muestra texto seguro
  return new Date(clean + "T00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); // Formatea como "Sun, Jun 14"
};

function EventRow({ e, onOpen }) {
  const clean = e.date ? e.date.split("T")[0] : null; // Limpia el ISO string antes de parsear
  const day = clean ? new Date(clean + "T00:00") : null; // Crea Date solo si hay fecha limpia
  const dateNum = day && !isNaN(day.getDate()) ? day.getDate() : "?"; // Numero del dia o "?" si falla

  return (
      <Card hover onClick={() => onOpen(e)} style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <div style={{ width: 84, flexShrink: 0, background: "var(--primary-soft)", color: "var(--on-primary-soft)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "14px 0" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase" }}>
              {day ? day.toLocaleDateString("en-US", { month: "short" }) : "—"} {/* Mes abreviado o guion */}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-head)", lineHeight: 1 }}>{dateNum}</div>
            <div style={{ fontSize: 11, opacity: .8, marginTop: 2 }}>
              {day ? day.toLocaleDateString("en-US", { weekday: "short" }) : "—"} {/* Dia de semana o guion */}
            </div>
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
  const start = new Date(2026, 5, 1); // Primer dia de junio 2026
  const startDow = start.getDay(); // Dia de semana donde empieza el mes
  const days = 30; // Dias de junio
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null); // Celdas vacias al inicio
  for (let d = 1; d <= days; d++) cells.push(d); // Celdas con numero de dia

  const evByDay = {}; // Mapa de dia → eventos
  DB.events.forEach(e => {
    const clean = e.date ? e.date.split("T")[0] : null; // Normaliza la fecha del evento
    const dt = clean ? new Date(clean + "T00:00") : null; // Parsea solo si hay fecha limpia
    if (dt && dt.getMonth() === 5) (evByDay[dt.getDate()] ||= []).push(e); // Agrupa por dia si es junio
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
            const evs = d ? (evByDay[d] || []) : []; // Eventos de ese dia
            const isToday = d === 9; // Hoy es 9 de junio 2026
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
  const [deleting, setDeleting] = useState(false); // Estado de carga al borrar

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres borrar este evento?")) return; // Confirmacion antes de borrar

    setDeleting(true); // Activa estado de carga
    try {
      const token = localStorage.getItem("authToken"); // Obtiene token de sesion
      const response = await fetch(`http://localhost:5000/api/events/${event.id || event._id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {} // Incluye token si existe
      });

      if (response.ok) {
        onDelete(); // Notifica al padre que se borro
        onClose(); // Cierra el modal
      }
    } catch (err) {
      alert("Error al borrar evento: " + err.message); // Muestra error al usuario
    } finally {
      setDeleting(false); // Desactiva estado de carga
    }
  };

  if (!event) return null; // No renderiza si no hay evento seleccionado
  return (
      <Modal open={!!event} onClose={onClose} title={event.title} width={560}
             footer={
               <>
                 <Button variant="outline" onClick={onClose}>Close</Button>
                 <Button icon={Icon.Pencil} onClick={onEdit}>Edit</Button>
                 <Button icon={Icon.Trash} variant="danger" onClick={handleDelete} disabled={deleting}>
                   {deleting ? "Borrando..." : "Delete"}
                 </Button>
               </>
             }>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
          <Badge tone={STATUS_TONE[event.status]} dot>{event.status}</Badge>
          <Badge tone="primary">{event.ministry}</Badge>
          {event.recurring && <Badge tone="sage">Recurring weekly</Badge>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          {[
            [Icon.Calendar, "Date", fmtDate(event.date)], // Usa fmtDate con el fix aplicado
            [Icon.Clock, "Time", event.time],
            [Icon.Pin, "Location", event.location],
            [Icon.Cross, "Led by", event.lead]
          ].map(([Ic, l, v]) => (
              <div key={l} style={{ display: "flex", gap: 11, alignItems: "center" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--surface-3)", color: "var(--primary)", display: "grid", placeItems: "center" }}><Ic size={18} /></div>
                <div>
                  <div className="faint" style={{ fontSize: 11.5 }}>{l}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div>
                </div>
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

function NewEventModal({ open, onClose, onEventCreated }) {
  const [title, setTitle] = useState(""); // Campo titulo del evento
  const [date, setDate] = useState("2026-06-14"); // Campo fecha con valor por defecto
  const [time, setTime] = useState("10:00"); // Campo hora con valor por defecto
  const [location, setLocation] = useState(""); // Campo ubicacion
  const [ministry, setMinistry] = useState(DB.ministries[0]?.name || ""); // Ministerio seleccionado
  const [capacity, setCapacity] = useState("100"); // Capacidad maxima
  const [description, setDescription] = useState(""); // Descripcion del evento
  const [recurring, setRecurring] = useState(false); // Si es evento recurrente semanal
  const [loading, setLoading] = useState(false); // Estado de carga al crear
  const [error, setError] = useState(null); // Mensaje de error si falla

  const handleSubmit = async () => {
    if (!title || !date || !time || !location || !ministry || !capacity) {
      setError("Please fill all required fields"); // Valida campos obligatorios
      return;
    }

    setLoading(true); // Activa spinner
    setError(null); // Limpia error previo

    try {
      const token = localStorage.getItem("authToken"); // Lee token de sesion
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "" // Adjunta token al header
        },
        body: JSON.stringify({
          title,
          date, // Ya viene en formato "YYYY-MM-DD" del input type="date"
          time,
          location,
          ministry,
          capacity: parseInt(capacity), // Convierte string a numero
          description,
          recurring,
          attendees: 0, // Empieza sin asistentes
          status: "Upcoming", // Estado inicial siempre Upcoming
          lead: "Church Admin" // Lider por defecto
        })
      });

      if (!response.ok) throw new Error("Failed to create event"); // Lanza error si falla

      const newEvent = await response.json(); // Obtiene el evento creado con su _id de MongoDB
      onEventCreated(newEvent); // Notifica al padre para actualizar la lista

      // Limpia el formulario
      setTitle("");
      setLocation("");
      setDescription("");
      setRecurring(false);
      onClose(); // Cierra el modal
    } catch (err) {
      setError(err.message || "Error creating event"); // Muestra error al usuario
    } finally {
      setLoading(false); // Desactiva spinner siempre
    }
  };

  return (
      <Modal open={open} onClose={onClose} title="Create event" width={560}
             footer={
               <>
                 <Button variant="outline" onClick={onClose}>Cancel</Button>
                 <Button icon={Icon.Check} onClick={handleSubmit} disabled={loading}>
                   {loading ? "Creating..." : "Create event"}
                 </Button>
               </>
             }>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
              <div style={{ color: "var(--warn)", fontSize: 13, padding: "8px 12px", background: "var(--warn-soft)", borderRadius: 8 }}>{error}</div>
          )}
          <Field label="Event title">
            <Input placeholder="e.g. Sunday Worship Service" value={title} onChange={e => setTitle(e.target.value)} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
            <Field label="Time"><Input type="time" value={time} onChange={e => setTime(e.target.value)} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Location"><Input placeholder="Main Sanctuary" value={location} onChange={e => setLocation(e.target.value)} /></Field>
            <Field label="Ministry">
              <Select value={ministry} onChange={e => setMinistry(e.target.value)} options={["Worship", "Youth", "Outreach", "Children", "Hospitality", "Discipleship"]} />
            </Field>
          </div>
          <Field label="Capacity">
            <Input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} />
          </Field>
          <Field label="Description">
            <Textarea placeholder="Share details about this gathering…" value={description} onChange={e => setDescription(e.target.value)} />
          </Field>
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 500 }}>
            <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} style={{ accentColor: "var(--primary)" }} />
            Repeat weekly
          </label>
        </div>
      </Modal>
  );
}

function EditEventModal({ open, onClose, onEventUpdated, event }) {
  const [title, setTitle] = useState(event?.title || ""); // Pre-rellena con datos del evento
  const [date, setDate] = useState(event?.date ? event.date.split("T")[0] : ""); // Normaliza fecha para el input
  const [time, setTime] = useState(event?.time || ""); // Pre-rellena hora
  const [location, setLocation] = useState(event?.location || ""); // Pre-rellena ubicacion
  const [ministry, setMinistry] = useState(event?.ministry || ""); // Pre-rellena ministerio
  const [capacity, setCapacity] = useState(event?.capacity?.toString() || ""); // Pre-rellena capacidad
  const [description, setDescription] = useState(event?.description || ""); // Pre-rellena descripcion
  const [recurring, setRecurring] = useState(event?.recurring || false); // Pre-rellena recurrencia
  const [loading, setLoading] = useState(false); // Estado de carga al guardar
  const [error, setError] = useState(null); // Mensaje de error si falla

  const handleSubmit = async () => {
    if (!title || !date || !time || !location || !ministry || !capacity) {
      setError("Please fill all required fields"); // Valida campos obligatorios
      return;
    }

    setLoading(true); // Activa spinner
    setError(null); // Limpia error previo

    try {
      const token = localStorage.getItem("authToken"); // Lee token de sesion
      const response = await fetch(`http://localhost:5000/api/events/${event.id || event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "" // Adjunta token al header
        },
        body: JSON.stringify({
          title,
          date, // Ya viene limpio del split("T")[0] aplicado en useState
          time,
          location,
          ministry,
          capacity: parseInt(capacity), // Convierte string a numero
          description,
          recurring
        })
      });

      if (!response.ok) throw new Error("Failed to update event"); // Lanza error si falla

      const updatedEvent = await response.json(); // Obtiene el evento actualizado
      onEventUpdated(updatedEvent); // Notifica al padre con los nuevos datos
      onClose(); // Cierra el modal
    } catch (err) {
      setError(err.message || "Error updating event"); // Muestra error al usuario
    } finally {
      setLoading(false); // Desactiva spinner siempre
    }
  };

  return (
      <Modal open={open} onClose={onClose} title="Edit event" width={560}
             footer={
               <>
                 <Button variant="outline" onClick={onClose}>Cancel</Button>
                 <Button icon={Icon.Check} onClick={handleSubmit} disabled={loading}>
                   {loading ? "Saving..." : "Save"}
                 </Button>
               </>
             }>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
              <div style={{ color: "var(--warn)", fontSize: 13, padding: "8px 12px", background: "var(--warn-soft)", borderRadius: 8 }}>{error}</div>
          )}
          <Field label="Event title">
            <Input placeholder="e.g. Sunday Worship Service" value={title} onChange={e => setTitle(e.target.value)} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Date"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
            <Field label="Time"><Input type="time" value={time} onChange={e => setTime(e.target.value)} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Location"><Input placeholder="Main Sanctuary" value={location} onChange={e => setLocation(e.target.value)} /></Field>
            <Field label="Ministry">
              <Select value={ministry} onChange={e => setMinistry(e.target.value)} options={["Worship", "Youth", "Outreach", "Children", "Hospitality", "Discipleship"]} />
            </Field>
          </div>
          <Field label="Capacity">
            <Input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} />
          </Field>
          <Field label="Description">
            <Textarea placeholder="Share details about this gathering…" value={description} onChange={e => setDescription(e.target.value)} />
          </Field>
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 500 }}>
            <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} style={{ accentColor: "var(--primary)" }} />
            Repeat weekly
          </label>
        </div>
      </Modal>
  );
}

export default function Events({ role }) {
  const { t } = useTranslation(); // Hook de traduccion
  const [view, setView] = useState("list"); // Vista activa: list o calendar
  const [filter, setFilter] = useState("All"); // Filtro de ministerio activo
  const [q, setQ] = useState(""); // Texto de busqueda
  const [open, setOpen] = useState(null); // Evento abierto en el modal de detalle
  const [creating, setCreating] = useState(false); // Controla si el modal de crear esta abierto
  const [editing, setEditing] = useState(false); // Controla si el modal de editar esta abierto
  const [events, setEvents] = useState(DB.events); // Lista de eventos (empieza con datos locales)
  const [loading, setLoading] = useState(false); // Estado de carga al fetchar eventos

  useEffect(() => {
    fetchEvents(); // Carga eventos del backend al montar el componente
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true); // Activa spinner de carga
      const token = localStorage.getItem("authToken"); // Lee token de sesion
      const response = await fetch("http://localhost:5000/api/events", {
        headers: token ? { "Authorization": `Bearer ${token}` } : {} // Incluye token si existe
      });
      if (response.ok) {
        const data = await response.json(); // Parsea la respuesta JSON
        setEvents(data); // Actualiza la lista con datos del backend
      } else {
        setEvents(DB.events); // Fallback a datos locales si falla el fetch
      }
    } catch (err) {
      console.error("Error fetching events:", err); // Log del error en consola
      setEvents(DB.events); // Fallback a datos locales si hay error de red
    } finally {
      setLoading(false); // Desactiva spinner siempre
    }
  };

  const handleEventCreated = (newEvent) => {
    setEvents([...events, newEvent]); // Agrega el nuevo evento a la lista sin re-fetch
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id || e._id === updatedEvent._id ? updatedEvent : e)); // Reemplaza el evento editado en la lista
    setOpen(updatedEvent); // Actualiza el modal de detalle con los nuevos datos
    setEditing(false); // Cierra el modal de edicion
  };

  const handleEventDeleted = () => {
    setOpen(null); // Cierra el modal de detalle
    fetchEvents(); // Re-fetcha la lista actualizada del backend
  };

  const ministries = ["All", ...new Set(events.map(e => e.ministry))]; // Lista unica de ministerios para el filtro
  let list = events.filter(e =>
      (filter === "All" || e.ministry === filter) && // Filtra por ministerio
      e.title.toLowerCase().includes(q.toLowerCase()) // Filtra por texto de busqueda
  );

  const canEdit = role !== "Member"; // Solo admin y lider pueden editar

  return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
        <div className="fade-up" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
          <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: "list", label: "List", icon: Icon.Filter },
                { value: "calendar", label: "Calendar", icon: Icon.Calendar }
              ]}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <SearchInput value={q} onChange={setQ} placeholder="Search events…" style={{ width: 200 }} />
            {canEdit && <Button icon={Icon.Plus} onClick={() => setCreating(true)}>New event</Button>}
          </div>
        </div>

        {view === "list" && (
            <div className="fade-up" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ministries.map(m => (
                  <button
                      key={m}
                      onClick={() => setFilter(m)}
                      style={{
                        padding: "7px 14px",
                        borderRadius: 999,
                        border: "1px solid " + (filter === m ? "transparent" : "var(--border-strong)"),
                        background: filter === m ? "var(--primary)" : "var(--surface)",
                        color: filter === m ? "#fff" : "var(--text-muted)",
                        fontSize: 13,
                        fontWeight: 600
                      }}
                  >
                    {m}
                  </button>
              ))}
            </div>
        )}

        {view === "list"
            ? <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {list.map((e, i) => <EventRow key={e.id || e._id || i} e={e} onOpen={setOpen} />)}
            </div>
            : <div className="fade-up"><CalendarView onOpen={setOpen} /></div>
        }

        <EventModal event={open} onClose={() => setOpen(null)} onDelete={handleEventDeleted} onEdit={() => setEditing(true)} />
        <NewEventModal open={creating} onClose={() => setCreating(false)} onEventCreated={handleEventCreated} />
        <EditEventModal open={editing} onClose={() => setEditing(false)} onEventUpdated={handleEventUpdated} event={open} />
      </div>
  );
}