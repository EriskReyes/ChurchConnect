import { useState, useEffect } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, Modal, Field, Input, SearchInput, Select } from '../components/ui';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';

function NewStaffModal({ open, onClose, onStaffCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("Pastor");
  const [department, setDepartment] = useState("Pastoral");
  const [schedule, setSchedule] = useState("Full-time");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!name || !email || !phone || !position || !department) {
      setError("Please complete all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          role: "Staff",
          ministry: department,
          position,
          schedule,
          status,
          joined: new Date().toISOString().split('T')[0],
          giving: 0,
          group: "Staff"
        })
      });

      if (!response.ok) throw new Error("Failed to create staff");

      const newStaff = await response.json();
      onStaffCreated(newStaff);

      setName("");
      setEmail("");
      setPhone("");
      setPosition("Pastor");
      setDepartment("Pastoral");
      setSchedule("Full-time");
      setStatus("Active");
      onClose();
    } catch (err) {
      setError(err.message || "Error creating staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add staff member" width={560}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button icon={Icon.Check} onClick={handleSubmit} disabled={loading}>{loading ? "Creating..." : "Add staff"}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && <div style={{ color: "var(--warn)", fontSize: 13, padding: "8px 12px", background: "var(--warn-soft)", borderRadius: 8 }}>{error}</div>}
        <Field label="Full name"><Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} /></Field>
        <Field label="Email"><Input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Phone"><Input placeholder="(503) 555-0100" value={phone} onChange={e => setPhone(e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Position"><Select value={position} onChange={e => setPosition(e.target.value)} options={["Pastor", "Minister", "Administrator", "Coordinator"]} /></Field>
          <Field label="Department"><Select value={department} onChange={e => setDepartment(e.target.value)} options={["Pastoral", "Administrative", "Worship", "Youth", "Children", "Outreach"]} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Schedule"><Select value={schedule} onChange={e => setSchedule(e.target.value)} options={["Full-time", "Part-time", "Volunteer"]} /></Field>
          <Field label="Status"><Select value={status} onChange={e => setStatus(e.target.value)} options={["Active", "On Leave", "Retired"]} /></Field>
        </div>
      </div>
    </Modal>
  );
}

function EditStaffModal({ open, onClose, onStaffUpdated, staff }) {
  const [name, setName] = useState(staff?.name || "");
  const [email, setEmail] = useState(staff?.email || "");
  const [phone, setPhone] = useState(staff?.phone || "");
  const [position, setPosition] = useState(staff?.position || "Pastor");
  const [department, setDepartment] = useState(staff?.ministry || "Pastoral");
  const [schedule, setSchedule] = useState(staff?.schedule || "Full-time");
  const [status, setStatus] = useState(staff?.status || "Active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!name || !email || !phone || !position || !department) {
      setError("Please complete all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/members/${staff.id || staff._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          role: "Staff",
          ministry: department,
          position,
          schedule,
          status
        })
      });

      if (!response.ok) throw new Error("Failed to update staff");

      const updatedStaff = await response.json();
      onStaffUpdated(updatedStaff);
      onClose();
    } catch (err) {
      setError(err.message || "Error updating staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit staff member" width={560}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button icon={Icon.Check} onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save"}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && <div style={{ color: "var(--warn)", fontSize: 13, padding: "8px 12px", background: "var(--warn-soft)", borderRadius: 8 }}>{error}</div>}
        <Field label="Full name"><Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} /></Field>
        <Field label="Email"><Input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Phone"><Input placeholder="(503) 555-0100" value={phone} onChange={e => setPhone(e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Position"><Select value={position} onChange={e => setPosition(e.target.value)} options={["Pastor", "Minister", "Administrator", "Coordinator"]} /></Field>
          <Field label="Department"><Select value={department} onChange={e => setDepartment(e.target.value)} options={["Pastoral", "Administrative", "Worship", "Youth", "Children", "Outreach"]} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Schedule"><Select value={schedule} onChange={e => setSchedule(e.target.value)} options={["Full-time", "Part-time", "Volunteer"]} /></Field>
          <Field label="Status"><Select value={status} onChange={e => setStatus(e.target.value)} options={["Active", "On Leave", "Retired"]} /></Field>
        </div>
      </div>
    </Modal>
  );
}

const STAFF_ROLES = ["Staff", "Pastor", "Ministry Leader", "Treasurer"];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const STAFF_FALLBACK = DB.members.filter(m => STAFF_ROLES.includes(m.role));

export default function Staff({ role }) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [staff, setStaff] = useState(STAFF_FALLBACK);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedAvatar, setExpandedAvatar] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/members/staff`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const data = await response.json();
        setStaff(data.length > 0 ? data : STAFF_FALLBACK);
      } else {
        setStaff(STAFF_FALLBACK);
      }
    } catch (err) {
      console.error("Error fetching staff:", err);
      setStaff(STAFF_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  const handleStaffCreated = (newStaff) => {
    setStaff([...staff, newStaff]);
  };

  const handleStaffUpdated = (updatedStaff) => {
    setStaff(staff.map(s => s.id === updatedStaff.id || s._id === updatedStaff._id ? updatedStaff : s));
    setSelected(updatedStaff);
    setEditing(false);
  };

  const handleStaffDeleted = () => {
    setSelected(null);
    fetchStaff();
  };

  let list = staff.filter(s => (s.name || '').toLowerCase().includes(q.toLowerCase()) || (s.email || '').includes(q));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <SearchInput value={q} onChange={setQ} placeholder="Search staff..." style={{ maxWidth: 300 }} />
        {role !== "Member" && <Button icon={Icon.Plus} onClick={() => setCreating(true)}>Add staff</Button>}
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "var(--gap)" }}>
        {list.map(s => (
          <Card key={s.id || s._id} hover onClick={() => setSelected(s)} style={{ textAlign: "center" }}>
            <Avatar name={s.name} size={66} ring src={s.avatar} style={{ margin: "12px auto" }} />
            <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "var(--text)" }}>{s.name}</h3>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{s.email}</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{s.role}</div>
            <Badge tone="primary" style={{ marginTop: 10 }}>{s.ministry}</Badge>
          </Card>
        ))}
      </div>

      {selected && (
        <StaffDetailModal staff={selected} onClose={() => setSelected(null)} onDelete={handleStaffDeleted} onEdit={() => setEditing(true)} role={role} onExpandAvatar={() => setExpandedAvatar(selected)} />
      )}

      <NewStaffModal open={creating} onClose={() => setCreating(false)} onStaffCreated={handleStaffCreated} />
      <EditStaffModal open={editing} onClose={() => setEditing(false)} onStaffUpdated={handleStaffUpdated} staff={selected} />

      {expandedAvatar && (
        <div onClick={() => setExpandedAvatar(null)} style={{ position: "fixed", inset: 0, zIndex: 101, background: "rgba(13,20,33,.85)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 24, cursor: "pointer" }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 480, width: "100%", cursor: "default", position: "relative" }}>
            <button onClick={() => setExpandedAvatar(null)} style={{ position: "absolute", top: -16, right: -16, zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 20, display: "grid", placeItems: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}>×</button>
            {expandedAvatar.avatar ? (
              <img src={expandedAvatar.avatar} alt={expandedAvatar.name} style={{ width: "100%", height: "auto", borderRadius: 20, maxHeight: "70vh", objectFit: "contain", display: "block" }} />
            ) : (
              <div style={{ width: "100%", aspectRatio: "1", borderRadius: 20, background: "var(--surface-2)", display: "grid", placeItems: "center" }}>
                <Avatar name={expandedAvatar.name} size={180} />
              </div>
            )}
            <div style={{ marginTop: 20, textAlign: "center", color: "#fff" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px 0" }}>{expandedAvatar.name}</h2>
              <p style={{ fontSize: 14, opacity: 0.75, margin: 0 }}>{expandedAvatar.role} • {expandedAvatar.ministry}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StaffDetailModal({ staff, onClose, onDelete, onEdit, role, onExpandAvatar }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/members/${staff.id || staff._id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });

      if (response.ok) {
        onDelete();
      }
    } catch (err) {
      alert("Error deleting staff member: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal open={!!staff} onClose={onClose} title="Staff profile" width={480}
      footer={<><Button variant="outline" icon={Icon.Mail}>Message</Button>{role !== "Member" && <><Button icon={Icon.Edit} onClick={onEdit}>Edit</Button><Button icon={Icon.Trash} variant="danger" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button></> }</>}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 20 }}>
        <div onClick={onExpandAvatar} style={{ cursor: "pointer", position: "relative" }}>
          <Avatar name={staff.name} size={120} ring src={staff.avatar} />
          <div className="avatar-hover-overlay" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(0,0,0,0)", borderRadius: "50%", transition: "background 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.35)"; e.currentTarget.querySelector("svg").style.opacity = "1"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0)"; e.currentTarget.querySelector("svg").style.opacity = "0"; }}>
            <Icon.Eye size={22} style={{ color: "#fff", opacity: 0, transition: "opacity 0.2s" }} />
          </div>
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginTop: 14, color: "var(--text)" }}>{staff.name}</h3>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Badge tone="primary">{staff.role}</Badge>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[[Icon.Mail, "Email", staff.email], [Icon.Phone, "Phone", staff.phone], [Icon.Hands, "Department", staff.ministry], [Icon.Tag, "Position", staff.position], [Icon.Clock, "Schedule", staff.schedule]].map(([Ic, l, v]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ color: "var(--text-faint)" }}><Ic size={18} /></div>
            <div className="muted" style={{ fontSize: 13, width: 110 }}>{l}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
