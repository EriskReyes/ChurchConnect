import { useState, useRef } from 'react';
import { compressIfImage, readAsDataURL } from '../utils/imageCompression';
import { Icon } from '../components/icons';
import { Card, Button, Modal, Field, Input, Select, Textarea } from '../components/ui';
import DB from '../data';

const FLYER_TYPES = ["Service", "Event", "Announcement", "Volunteer", "Donation", "Ministry", "Class", "Special Event", "Prayer", "Conference"];

function FlyerDetailModal({ open, onClose, flyer, onDelete, onEdit, role }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres borrar este flyer?")) return;
    setDeleting(true);
    try {
      // Simular eliminación
      setTimeout(() => {
        onDelete();
        setDeleting(false);
      }, 300);
    } catch (err) {
      alert("Error al borrar flyer: " + err.message);
      setDeleting(false);
    }
  };

  return (
    <Modal open={!!flyer} onClose={onClose} title="Flyer" width={500}
      footer={<><Button variant="outline" onClick={onClose}>Cerrar</Button>{role !== "Member" && <><Button icon={Icon.Pencil} onClick={onEdit}>Editar</Button><Button icon={Icon.Trash} variant="danger" onClick={handleDelete} disabled={deleting}>{deleting ? "Borrando..." : "Delete"}</Button></>}</>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {flyer?.image && (
          <img src={flyer.image} alt={flyer.title} style={{ width: "100%", height: 250, borderRadius: 12, objectFit: "cover", display: "block" }} onError={(e) => { e.target.style.display = "none"; }} />
        )}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: 0.5 }}>{flyer?.type}</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", margin: "6px 0 4px 0" }}>{flyer?.title}</h2>
          <div className="muted" style={{ fontSize: 13 }}>Por {flyer?.createdBy}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {flyer?.date && <div><div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Fecha</div><div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{flyer.date}</div></div>}
          {flyer?.time && <div><div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Hora</div><div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{flyer.time}</div></div>}
          {flyer?.location && <div><div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Ubicación</div><div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{flyer.location}</div></div>}
          {flyer?.ministry && <div><div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Ministerio</div><div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{flyer.ministry}</div></div>}
          {flyer?.goal && <div><div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Meta</div><div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{flyer.goal}</div></div>}
          {flyer?.progress !== undefined && <div><div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Progreso</div><div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{flyer.progress}%</div></div>}
        </div>
        {flyer?.tags && flyer.tags.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {flyer.tags.map(tag => (
              <span key={tag} style={{ fontSize: 12, padding: "4px 10px", background: "var(--primary-soft)", color: "var(--primary)", borderRadius: 16, fontWeight: 500 }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

function EditFlyerModal({ open, onClose, onFlyerSaved, flyer }) {
  const [title, setTitle] = useState(flyer?.title || "");
  const [type, setType] = useState(flyer?.type || "Event");
  const [date, setDate] = useState(flyer?.date || "");
  const [time, setTime] = useState(flyer?.time || "");
  const [location, setLocation] = useState(flyer?.location || "");
  const [ministry, setMinistry] = useState(flyer?.ministry || "");
  const [goal, setGoal] = useState(flyer?.goal || "");
  const [image, setImage] = useState(flyer?.image || null);
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressIfImage(file);
    const url = await readAsDataURL(compressed);
    setImage(url);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("El título es requerido");
      return;
    }

    setLoading(true);
    try {
      const updatedFlyer = {
        ...flyer,
        title,
        type,
        date: date || undefined,
        time: time || undefined,
        location: location || undefined,
        ministry,
        goal: goal || undefined,
        image: image || flyer?.image
      };
      onFlyerSaved(updatedFlyer);
      onClose();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={flyer ? "Editar Flyer" : "Nuevo Flyer"} width={560}
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button icon={Icon.Check} onClick={handleSubmit} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Título"><Input placeholder="Título del flyer" value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="Tipo"><Select value={type} onChange={e => setType(e.target.value)} options={FLYER_TYPES} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Fecha"><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
          <Field label="Hora"><Input type="time" value={time} onChange={e => setTime(e.target.value)} /></Field>
        </div>
        <Field label="Ubicación"><Input placeholder="Ej: Main Sanctuary" value={location} onChange={e => setLocation(e.target.value)} /></Field>
        <Field label="Ministerio"><Input placeholder="Ej: Worship" value={ministry} onChange={e => setMinistry(e.target.value)} /></Field>
        {type === "Donation" && <Field label="Meta"><Input placeholder="Ej: $150,000" value={goal} onChange={e => setGoal(e.target.value)} /></Field>}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>Imagen</label>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {image && <div style={{ width: 80, height: 80, borderRadius: 8, backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center", border: "1px solid var(--border)" }} />}
            <Button variant="outline" size="sm" icon={Icon.Image} onClick={() => imageInputRef.current?.click()}>Subir Imagen</Button>
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function Flyers({ role }) {
  const [flyers, setFlyers] = useState(DB.flyers);
  const [selectedFlyer, setSelectedFlyer] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFlyerSaved = (updatedFlyer) => {
    if (selectedFlyer) {
      setFlyers(flyers.map(f => f.id === updatedFlyer.id ? updatedFlyer : f));
      setSelectedFlyer(updatedFlyer);
    } else {
      const newFlyer = {
        ...updatedFlyer,
        id: Math.max(...flyers.map(f => f.id), 0) + 1,
        created: new Date().toISOString().split('T')[0],
        createdBy: "You"
      };
      setFlyers([newFlyer, ...flyers]);
    }
  };

  const handleFlyerDeleted = () => {
    setFlyers(flyers.filter(f => f.id !== selectedFlyer.id));
    setSelectedFlyer(null);
  };

  let filtered = flyers.filter(f => {
    const matchesType = filterType === "All" || f.type === filterType;
    const matchesSearch = (f.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (f.ministry || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const typeStats = FLYER_TYPES.map(t => ({
    type: t,
    count: flyers.filter(f => f.type === t).length
  })).filter(s => s.count > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, minWidth: 0 }}>
          <Icon.Search size={16} style={{ color: "var(--text-muted)" }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar flyers..."
            style={{
              flex: 1,
              padding: "10px 14px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--surface)",
              color: "var(--text)",
              fontSize: 13,
              outline: "none"
            }}
            onFocus={e => e.target.style.borderColor = "var(--primary)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
        </div>
        {role !== "Member" && <Button icon={Icon.Plus} onClick={() => { setSelectedFlyer(null); setCreating(true); }}>Nuevo Flyer</Button>}
      </div>

      <div className="fade-up" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
        <button onClick={() => setFilterType("All")} style={{
          padding: "8px 16px", fontSize: 13, fontWeight: 600, border: "1px solid var(--border)", borderRadius: 20,
          background: filterType === "All" ? "var(--primary)" : "var(--surface)",
          color: filterType === "All" ? "#fff" : "var(--text)", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s"
        }}>
          Todos ({flyers.length})
        </button>
        {typeStats.map(stat => (
          <button key={stat.type} onClick={() => setFilterType(stat.type)} style={{
            padding: "8px 16px", fontSize: 13, fontWeight: 600, border: "1px solid var(--border)", borderRadius: 20,
            background: filterType === stat.type ? "var(--primary)" : "var(--surface)",
            color: filterType === stat.type ? "#fff" : "var(--text)", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s"
          }}>
            {stat.type} ({stat.count})
          </button>
        ))}
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--gap)" }}>
        {filtered.map(f => (
          <Card key={f.id} hover onClick={() => setSelectedFlyer(f)} style={{ cursor: "pointer", overflow: "hidden" }}>
            {f.image && <img src={f.image} alt={f.title} style={{ width: "100%", height: 140, objectFit: "cover", marginBottom: 12, display: "block" }} onError={(e) => { e.target.style.display = "none"; }} />}
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: 0.5 }}>{f.type}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: "6px 0 8px 0", lineHeight: 1.3 }}>{f.title}</h3>
            <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
              {f.date && <div>📅 {f.date}</div>}
              {f.ministry && <div>🏢 {f.ministry}</div>}
            </div>
            {f.progress !== undefined && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>Progreso</span>
                  <span style={{ color: "var(--primary)", fontWeight: 600 }}>{f.progress}%</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${f.progress}%`, height: "100%", background: "var(--primary)", transition: "width 0.3s" }} />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No hay flyers</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Crea uno para comenzar</div>
        </div>
      )}

      <FlyerDetailModal flyer={selectedFlyer} open={!!selectedFlyer} onClose={() => setSelectedFlyer(null)} onDelete={handleFlyerDeleted} onEdit={() => setEditing(true)} role={role} />
      <EditFlyerModal open={creating || editing} onClose={() => { setCreating(false); setEditing(false); }} onFlyerSaved={handleFlyerSaved} flyer={editing ? selectedFlyer : null} />
    </div>
  );
}
