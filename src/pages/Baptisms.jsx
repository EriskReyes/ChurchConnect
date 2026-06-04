import { useState } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, Modal, Segmented, IconButton } from '../components/ui';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation.js';

const STATUS_TONE = { Baptized: "sage", "New believer": "primary", "Not yet": "neutral" };
const BAPTISM_STATUS_TONE = { Confirmed: "sage", Scheduled: "primary", Pending: "neutral" };
const fmtDate = d => new Date(d + "T00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

function BaptismCalendar({ selectedBaptism, onSelectBaptism, month = 5 }) {
  const start = new Date(2026, month, 1);
  const startDow = start.getDay();
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const baptismByDay = {};
  DB.baptisms.forEach(b => {
    const dt = new Date(b.date + "T00:00");
    if (dt.getMonth() === month) {
      (baptismByDay[dt.getDate()] ||= []).push(b);
    }
  });

  const monthName = new Date(2026, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
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
        {cells.map((d, i) => {
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
                  <button key={b.id} onClick={() => onSelectBaptism(b)} style={{ textAlign: "left", border: "none", background: "var(--primary-soft)", color: "var(--on-primary-soft)", borderRadius: 6, padding: "3px 6px", fontSize: 9.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer" }}>
                    {b.memberName}
                  </button>
                ))}
                {baps.length > 2 && <span className="faint" style={{ fontSize: 10.5, paddingLeft: 4 }}>+{baps.length - 2}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function BaptismModal({ baptism, onClose }) {
  if (!baptism) return null;
  return (
    <Modal open={!!baptism} onClose={onClose} title={`Baptism: ${baptism.memberName}`} width={480}
      footer={<><Button variant="outline" onClick={onClose}>Close</Button><Button icon={Icon.Check}>Confirm attendance</Button></>}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        <Badge tone={BAPTISM_STATUS_TONE[baptism.status]} dot>{baptism.status}</Badge>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {[[Icon.Calendar, "Date", fmtDate(baptism.date)], [Icon.Clock, "Time", baptism.time], [Icon.Pin, "Location", baptism.location], [Icon.Cross, "Pastor", baptism.pastor]].map(([Ic, l, v]) => (
          <div key={l} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ color: "var(--text-faint)" }}><Ic size={18} /></div>
            <div className="muted" style={{ fontSize: 13, width: 80 }}>{l}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
          <span className="muted">Confirmations</span>
          <span style={{ fontWeight: 700 }}>{baptism.registrations}/{baptism.capacity}</span>
        </div>
      </div>
    </Modal>
  );
}

export default function Baptisms({ role }) {
  const { t } = useTranslation();
  const [view, setView] = useState("calendar");
  const [selectedBaptism, setSelectedBaptism] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(5);

  const handlePrevMonth = () => setCurrentMonth(m => m === 0 ? 11 : m - 1);
  const handleNextMonth = () => setCurrentMonth(m => m === 11 ? 0 : m + 1);

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
        {role !== "Member" && <Button icon={Icon.Plus}>{t('baptisms.addBaptism')}</Button>}
      </div>

      {view === "calendar" && (
        <div className="fade-up">
          <BaptismCalendar selectedBaptism={selectedBaptism} onSelectBaptism={setSelectedBaptism} month={currentMonth} />
        </div>
      )}

      {view === "list" && (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
          {DB.baptisms.length === 0 ? (
            <Card style={{ textAlign: "center", padding: 40 }}>
              <div className="muted" style={{ fontSize: 14 }}>{t('baptisms.search')}</div>
            </Card>
          ) : (
            DB.baptisms.map(b => (
              <Card key={b.id} hover onClick={() => setSelectedBaptism(b)} style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  <div style={{ width: 84, flexShrink: 0, background: "var(--primary-soft)", color: "var(--on-primary-soft)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "14px 0" }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase" }}>{new Date(b.date + "T00:00").toLocaleDateString("en-US", { month: "short" })}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-head)", lineHeight: 1 }}>{new Date(b.date + "T00:00").getDate()}</div>
                    <div style={{ fontSize: 11, opacity: .8, marginTop: 2 }}>{new Date(b.date + "T00:00").toLocaleDateString("en-US", { weekday: "short" })}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>{b.memberName}</h3>
                      <Badge tone={BAPTISM_STATUS_TONE[b.status]} dot>{b.status}</Badge>
                    </div>
                    <div className="muted" style={{ fontSize: 13, display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}><Icon.Clock size={14} />{b.time}</span>
                      <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}><Icon.Pin size={14} />{b.location}</span>
                      <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}><Icon.Cross size={14} />{b.pastor}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <BaptismModal baptism={selectedBaptism} onClose={() => setSelectedBaptism(null)} />
    </div>
  );
}
