import { useState, useEffect } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, Stat, Modal, Field, Input, SearchInput, Select, Textarea } from '../components/ui';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';

function NewMemberModal({ open, onClose, onMemberCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Member");
  const [ministry, setMinistry] = useState("Worship");
  const [status, setStatus] = useState("New");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!name || !email || !phone || !role || !ministry) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          role,
          ministry,
          status,
          joined: new Date().toISOString().split('T')[0],
          giving: 0,
          group: "New Member"
        })
      });

      if (!response.ok) throw new Error("Failed to create member");

      const newMember = await response.json();
      onMemberCreated(newMember);

      setName("");
      setEmail("");
      setPhone("");
      setRole("Member");
      setMinistry("Worship");
      setStatus("New");
      onClose();
    } catch (err) {
      setError(err.message || "Error creating member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add member" width={560}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button icon={Icon.Check} onClick={handleSubmit} disabled={loading}>{loading ? "Creating..." : "Add member"}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && <div style={{ color: "var(--warn)", fontSize: 13, padding: "8px 12px", background: "var(--warn-soft)", borderRadius: 8 }}>{error}</div>}
        <Field label="Full name"><Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} /></Field>
        <Field label="Email"><Input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Phone"><Input placeholder="(503) 555-0100" value={phone} onChange={e => setPhone(e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Role"><Select value={role} onChange={e => setRole(e.target.value)} options={["Member", "Ministry Leader", "Staff", "Pastor", "Admin"]} /></Field>
          <Field label="Ministry"><Select value={ministry} onChange={e => setMinistry(e.target.value)} options={["Worship", "Youth", "Outreach", "Children", "Hospitality", "Discipleship"]} /></Field>
        </div>
        <Field label="Status"><Select value={status} onChange={e => setStatus(e.target.value)} options={["New", "Active", "Inactive"]} /></Field>
      </div>
    </Modal>
  );
}

function EditMemberModal({ open, onClose, onMemberUpdated, member }) {
  const [name, setName] = useState(member?.name || "");
  const [email, setEmail] = useState(member?.email || "");
  const [phone, setPhone] = useState(member?.phone || "");
  const [role, setRole] = useState(member?.role || "Member");
  const [ministry, setMinistry] = useState(member?.ministry || "Worship");
  const [status, setStatus] = useState(member?.status || "New");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!name || !email || !phone || !role || !ministry) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/members/${member.id || member._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          role,
          ministry,
          status
        })
      });

      if (!response.ok) throw new Error("Failed to update member");

      const updatedMember = await response.json();
      onMemberUpdated(updatedMember);
      onClose();
    } catch (err) {
      setError(err.message || "Error updating member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit member" width={560}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button icon={Icon.Check} onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save"}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && <div style={{ color: "var(--warn)", fontSize: 13, padding: "8px 12px", background: "var(--warn-soft)", borderRadius: 8 }}>{error}</div>}
        <Field label="Full name"><Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} /></Field>
        <Field label="Email"><Input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Phone"><Input placeholder="(503) 555-0100" value={phone} onChange={e => setPhone(e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Role"><Select value={role} onChange={e => setRole(e.target.value)} options={["Member", "Ministry Leader", "Staff", "Pastor", "Admin"]} /></Field>
          <Field label="Ministry"><Select value={ministry} onChange={e => setMinistry(e.target.value)} options={["Worship", "Youth", "Outreach", "Children", "Hospitality", "Discipleship"]} /></Field>
        </div>
        <Field label="Status"><Select value={status} onChange={e => setStatus(e.target.value)} options={["New", "Active", "Inactive"]} /></Field>
      </div>
    </Modal>
  );
}

export default function Members({ role }) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [members, setMembers] = useState(DB.members);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedAvatar, setExpandedAvatar] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/members", {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        setMembers(DB.members);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setMembers(DB.members);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberCreated = (newMember) => {
    setMembers([...members, newMember]);
  };

  const handleMemberUpdated = (updatedMember) => {
    setMembers(members.map(m => m.id === updatedMember.id || m._id === updatedMember._id ? updatedMember : m));
    setSelected(updatedMember);
    setEditing(false);
  };

  const handleMemberDeleted = () => {
    setSelected(null);
    fetchMembers();
  };

  let list = members.filter(m => (m.name || '').toLowerCase().includes(q.toLowerCase()) || (m.email || '').includes(q));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <SearchInput value={q} onChange={setQ} placeholder={t('members.search')} style={{ maxWidth: 300 }} />
        {role !== "Member" && <Button icon={Icon.Plus} onClick={() => setCreating(true)}>{t('members.addMember')}</Button>}
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "var(--gap)" }}>
        {list.map(m => (
          <Card key={m.id || m._id} hover onClick={() => setSelected(m)} style={{ textAlign: "center" }}>
            <Avatar name={m.name} size={66} ring src={m.avatar} style={{ margin: "12px auto" }} />
            <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "var(--text)" }}>{m.name}</h3>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{m.email}</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{m.role}</div>
            <Badge tone="primary" style={{ marginTop: 10 }}>{m.ministry}</Badge>
          </Card>
        ))}
      </div>

      {selected && (
        <MemberDetailModal member={selected} onClose={() => setSelected(null)} onDelete={handleMemberDeleted} onEdit={() => setEditing(true)} role={role} onExpandAvatar={() => setExpandedAvatar(selected)} />
      )}

      <NewMemberModal open={creating} onClose={() => setCreating(false)} onMemberCreated={handleMemberCreated} />
      <EditMemberModal open={editing} onClose={() => setEditing(false)} onMemberUpdated={handleMemberUpdated} member={selected} />

      {expandedAvatar && (
        <div onClick={() => setExpandedAvatar(null)} style={{ position: "fixed", inset: 0, zIndex: 101, background: "rgba(13,20,33,.8)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 24, cursor: "pointer" }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 500, cursor: "default" }}>
            <img src={expandedAvatar.avatar} alt={expandedAvatar.name} style={{ width: "100%", height: "auto", borderRadius: 16, maxHeight: "80vh", objectFit: "contain" }} />
            <div style={{ marginTop: 20, textAlign: "center", color: "#fff" }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px 0" }}>{expandedAvatar.name}</h2>
              <p style={{ fontSize: 14, opacity: 0.8, margin: 0 }}>{expandedAvatar.role} • {expandedAvatar.ministry}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MemberDetailModal({ member, onClose, onDelete, onEdit, role, onExpandAvatar }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres borrar este miembro?")) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/members/${member.id || member._id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });

      if (response.ok) {
        onDelete();
      }
    } catch (err) {
      alert("Error al borrar miembro: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal open={!!member} onClose={onClose} title="Member profile" width={480}
      footer={<><Button variant="outline" icon={Icon.Mail}>Message</Button>{role !== "Member" && <><Button icon={Icon.Pencil} onClick={onEdit}>Edit</Button><Button icon={Icon.Trash} variant="danger" onClick={handleDelete} disabled={deleting}>{deleting ? "Borrando..." : "Delete"}</Button></> }</>}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 20 }}>
        <div onClick={onExpandAvatar} style={{ cursor: "pointer", position: "relative" }}>
          <Avatar name={member.name} size={84} ring src={member.avatar} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(0,0,0,0)", borderRadius: "50%", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.3)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0)"}>
            <Icon.Eye size={20} style={{ color: "#fff", opacity: 0 }} />
          </div>
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginTop: 14, color: "var(--text)" }}>{member.name}</h3>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Badge tone="primary">{member.role}</Badge>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[[Icon.Mail, "Email", member.email], [Icon.Phone, "Phone", member.phone], [Icon.Hands, "Ministry", member.ministry]].map(([Ic, l, v]) => (
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
