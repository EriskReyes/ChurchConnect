import { useState } from 'react';
import { Icon } from './icons';
import { Badge, Avatar, Progress } from './ui';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const STATUS_TONE = { Upcoming: "primary", Planning: "warn", Past: "neutral", Cancelled: "danger" };
const fmtDate = d => {
  if (!d) return '—';
  const date = new Date(d.includes('T') ? d : d + 'T00:00');
  return isNaN(date) ? '—' : date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
};

export default function EventDetail({ event, onAttendeesUpdated }) {
  const [localEvent, setLocalEvent] = useState(event);
  const [loading, setLoading] = useState(false);

  if (!localEvent) return null;

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser.id || currentUser._id;

  const attendeeIds = (localEvent.attendeesList || []).map(a => a._id || a);
  const isRegistered = attendeeIds.includes(userId);
  const pct = Math.round(((localEvent.attendees || 0) / (localEvent.capacity || 100)) * 100);
  const spotsLeft = (localEvent.capacity || 100) - (localEvent.attendees || 0);
  const isFull = spotsLeft <= 0 && !isRegistered;

  const handleToggle = async () => {
    if (loading || isFull || !userId) return;
    setLoading(true);
    try {
      const eventId = localEvent._id || localEvent.id;

      let res;
      if (isRegistered) {
        res = await fetch(`${API}/api/events/${eventId}/register/${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        res = await fetch(`${API}/api/events/${eventId}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
      }

      const data = await res.json();
      if (!res.ok) { console.error('Register error:', data.message); return; }

      const updated = data.event || {
        ...localEvent,
        attendees: isRegistered ? Math.max(0, (localEvent.attendees || 1) - 1) : (localEvent.attendees || 0) + 1,
        attendeesList: isRegistered
          ? attendeeIds.filter(id => String(id) !== String(userId))
          : [...attendeeIds, userId]
      };

      setLocalEvent(updated);
      if (onAttendeesUpdated) onAttendeesUpdated(updated);
    } catch (e) { console.error('Register fetch error:', e); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Badge tone={STATUS_TONE[localEvent.status] || "primary"} dot>{localEvent.status}</Badge>
        {localEvent.ministry && <Badge tone="primary">{localEvent.ministry}</Badge>}
        {localEvent.recurring && <Badge tone="sage">Recurring</Badge>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          [Icon.Calendar, "Date",     fmtDate(localEvent.date)],
          [Icon.Clock,    "Time",     localEvent.time || '—'],
          [Icon.Pin,      "Location", localEvent.location || '—'],
          [Icon.Cross,    "Led by",   localEvent.lead || '—'],
        ].map(([Ic, label, value]) => (
          <div key={label} style={{ display: "flex", gap: 11, alignItems: "center" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--surface-3)", color: "var(--primary)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Ic size={18} />
            </div>
            <div>
              <div className="faint" style={{ fontSize: 11.5 }}>{label}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {localEvent.description && (
        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-muted)" }}>{localEvent.description}</p>
      )}

      <div style={{ background: "var(--surface-2)", borderRadius: 14, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700 }}>Asistentes</span>
          <span className="muted" style={{ fontSize: 13 }}>
            {localEvent.attendees || 0} / {localEvent.capacity || 100}
          </span>
        </div>
        <Progress value={pct} tone={pct > 85 ? "warn" : "primary"} />

        {(localEvent.attendeesList || []).length > 0 && (
          <div style={{ display: "flex", alignItems: "center", marginTop: 14 }}>
            {localEvent.attendeesList.slice(0, 8).map((a, i) => (
              <div key={a._id || i} style={{ marginLeft: i ? -8 : 0 }}>
                <Avatar name={a.name || '?'} src={a.avatar} size={32} ring />
              </div>
            ))}
            {localEvent.attendees > 8 && (
              <span className="muted" style={{ fontSize: 12, marginLeft: 10 }}>+{localEvent.attendees - 8} más</span>
            )}
          </div>
        )}

        <button
          onClick={handleToggle}
          disabled={loading || isFull}
          style={{
            marginTop: 14, width: "100%", padding: "11px", fontSize: 14, fontWeight: 700,
            borderRadius: "var(--r-md)", border: isRegistered ? "2px solid var(--primary)" : "none",
            background: isRegistered ? "transparent" : isFull ? "var(--surface-3)" : "var(--primary)",
            color: isRegistered ? "var(--primary)" : isFull ? "var(--text-muted)" : "#fff",
            cursor: loading || isFull ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s"
          }}
        >
          {loading ? (
            "..."
          ) : isFull ? (
            "Evento lleno"
          ) : isRegistered ? (
            <><Icon.Check size={16} /> Registrado — clic para cancelar</>
          ) : (
            <><Icon.Plus size={16} /> Registrarme</>
          )}
        </button>
      </div>
    </div>
  );
}
