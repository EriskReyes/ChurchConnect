import { useState, useEffect, useRef } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, SearchInput, Modal, Field, Input, Select, Textarea } from '../components/ui';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';

const SERIES_GRAD = {
  "Anchored": "linear-gradient(135deg,#3B5BA5,#1F4E5F)",
  "On Mission": "linear-gradient(135deg,#6E9B7E,#4A7C59)",
  "Stewardship": "linear-gradient(135deg,#B5742E,#8a5520)",
};

function SermonArt({ s, h = 150, big }) {
  return (
    <div style={{ height: h, borderRadius: big ? "var(--r-lg)" : "var(--r-md)", background: SERIES_GRAD[s.series] || "linear-gradient(135deg,#7A4E9E,#5a3578)", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: big ? 24 : 14 }}>
      <div style={{ position: "absolute", right: -20, top: -20, opacity: .16 }}><Icon.Cross size={big ? 180 : 110} sw={1} /></div>
      <div style={{ position: "relative" }}>
        <Badge style={{ background: "rgba(255,255,255,.22)", color: "#fff" }}>{s.series}</Badge>
      </div>
      <div style={{ position: "absolute", top: big ? 24 : 12, right: big ? 24 : 12 }}>
        <div style={{ width: big ? 56 : 42, height: big ? 56 : 42, borderRadius: "50%", background: "rgba(255,255,255,.9)", display: "grid", placeItems: "center", color: "var(--primary)" }}><Icon.Play size={big ? 24 : 18} /></div>
      </div>
    </div>
  );
}

function NewSermonModal({ open, onClose, onSermonCreated }) {
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("Pastor James Whitfield");
  const [series, setSeries] = useState("Anchored");
  const [scripture, setScripture] = useState("");
  const [duration, setDuration] = useState("30 min");
  const [audio, setAudio] = useState(null);
  const [audioName, setAudioName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioInputRef = useRef(null);

  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setError("Por favor selecciona un archivo de audio");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAudio(event.target?.result);
      setAudioName(file.name);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!title || !speaker || !series || !scripture) {
      setError("Completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/sermons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          title,
          speaker,
          series,
          scripture,
          duration,
          plays: 0,
          tags: [],
          audio: audio || null,
          audioName: audioName || null
        })
      });

      if (!response.ok) throw new Error("Failed to create sermon");

      const newSermon = await response.json();
      onSermonCreated(newSermon);
      setTitle("");
      setSpeaker("Pastor James Whitfield");
      setSeries("Anchored");
      setScripture("");
      setDuration("30 min");
      setAudio(null);
      setAudioName("");
      onClose();
    } catch (err) {
      setError(err.message || "Error creating sermon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nuevo Sermón" width={560}
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button icon={Icon.Check} onClick={handleSubmit} disabled={loading}>{loading ? "Creando..." : "Crear"}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && <div style={{ color: "var(--warn)", fontSize: 13, padding: "8px 12px", background: "var(--warn-soft)", borderRadius: 8 }}>{error}</div>}
        <Field label="Título"><Input placeholder="Título del sermón" value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="Predicador"><Input placeholder="Nombre del predicador" value={speaker} onChange={e => setSpeaker(e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Serie"><Select value={series} onChange={e => setSeries(e.target.value)} options={["Anchored", "On Mission", "Stewardship"]} /></Field>
          <Field label="Duración"><Input placeholder="30 min" value={duration} onChange={e => setDuration(e.target.value)} /></Field>
        </div>
        <Field label="Escritura"><Input placeholder="Ej: Romanos 5:1-5" value={scripture} onChange={e => setScripture(e.target.value)} /></Field>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>Archivo de Audio</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button variant="outline" size="sm" onClick={() => audioInputRef.current?.click()}>
              🎵 Subir Audio
            </Button>
            {audioName && <span style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>{audioName}</span>}
            <input ref={audioInputRef} type="file" accept="audio/*" onChange={handleAudioUpload} style={{ display: "none" }} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function EditSermonModal({ open, onClose, onSermonUpdated, sermon }) {
  const [title, setTitle] = useState(sermon?.title || "");
  const [speaker, setSpeaker] = useState(sermon?.speaker || "");
  const [series, setSeries] = useState(sermon?.series || "");
  const [scripture, setScripture] = useState(sermon?.scripture || "");
  const [duration, setDuration] = useState(sermon?.duration || "");
  const [audio, setAudio] = useState(sermon?.audio || null);
  const [audioName, setAudioName] = useState(sermon?.audioName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioInputRef = useRef(null);

  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setError("Por favor selecciona un archivo de audio");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAudio(event.target?.result);
      setAudioName(file.name);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!title || !speaker || !series || !scripture) {
      setError("Completa todos los campos requeridos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/sermons/${sermon.id || sermon._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          title,
          speaker,
          series,
          scripture,
          duration,
          audio,
          audioName
        })
      });

      if (!response.ok) throw new Error("Failed to update sermon");

      const updatedSermon = await response.json();
      onSermonUpdated(updatedSermon);
      onClose();
    } catch (err) {
      setError(err.message || "Error updating sermon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Sermón" width={560}
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button icon={Icon.Check} onClick={handleSubmit} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && <div style={{ color: "var(--warn)", fontSize: 13, padding: "8px 12px", background: "var(--warn-soft)", borderRadius: 8 }}>{error}</div>}
        <Field label="Título"><Input placeholder="Título del sermón" value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="Predicador"><Input placeholder="Nombre del predicador" value={speaker} onChange={e => setSpeaker(e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Serie"><Select value={series} onChange={e => setSeries(e.target.value)} options={["Anchored", "On Mission", "Stewardship"]} /></Field>
          <Field label="Duración"><Input placeholder="30 min" value={duration} onChange={e => setDuration(e.target.value)} /></Field>
        </div>
        <Field label="Escritura"><Input placeholder="Ej: Romanos 5:1-5" value={scripture} onChange={e => setScripture(e.target.value)} /></Field>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>Archivo de Audio</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button variant="outline" size="sm" onClick={() => audioInputRef.current?.click()}>
              🎵 {audioName ? "Cambiar" : "Subir"} Audio
            </Button>
            {audioName && <span style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>{audioName}</span>}
            <input ref={audioInputRef} type="file" accept="audio/*" onChange={handleAudioUpload} style={{ display: "none" }} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function SermonDetailModal({ sermon, onClose, onDelete, onEdit, role }) {
  const [deleting, setDeleting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleDelete = async () => {
    if (!confirm("¿Borrar este sermón?")) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/sermons/${sermon.id || sermon._id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });

      if (response.ok) onDelete();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Modal open={!!sermon} onClose={onClose} title={sermon?.title} width={560}
      footer={<>{role !== "Member" && <><Button icon={Icon.Pencil} onClick={onEdit}>Editar</Button><Button icon={Icon.Trash} variant="danger" onClick={handleDelete} disabled={deleting}>{deleting ? "Borrando..." : "Eliminar"}</Button></> }</>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {sermon?.audio && (
          <div style={{ padding: 20, background: "linear-gradient(135deg, var(--primary-soft), var(--surface-2))", borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>🎵 Escuchar Sermón</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <button onClick={togglePlay} style={{
                width: 56, height: 56, borderRadius: "50%", background: "var(--primary)", color: "#fff",
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                  {isPlaying ? "Reproduciendo..." : "Listo para escuchar"}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{sermon?.audioName || "Sermon.mp3"}</div>
              </div>
            </div>
            <audio
              ref={audioRef}
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              style={{ width: "100%", borderRadius: 6, marginTop: 12 }}>
              <source src={sermon.audio} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>Predicador</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{sermon?.speaker}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>Serie</div>
            <div style={{ fontSize: 13, color: "var(--text)" }}>{sermon?.series}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>Duración</div>
            <div style={{ fontSize: 13, color: "var(--text)" }}>{sermon?.duration}</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>Escritura</div>
          <div style={{ fontSize: 13, color: "var(--text)" }}>{sermon?.scripture}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Reproducciones</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)", marginTop: 4 }}>{sermon?.plays || 0}</div>
          </div>
          {sermon?.audioName && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Archivo de Audio</div>
              <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sermon.audioName}</div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default function Sermons({ role }) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [sermons, setSermons] = useState(DB.sermons);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/sermons", {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (response.ok) {
        setSermons(await response.json());
      } else {
        setSermons(DB.sermons);
      }
    } catch (err) {
      setSermons(DB.sermons);
    }
  };

  const handleSermonCreated = (newSermon) => {
    setSermons([...sermons, newSermon]);
  };

  const handleSermonUpdated = (updatedSermon) => {
    setSermons(sermons.map(s => s.id === updatedSermon.id || s._id === updatedSermon._id ? updatedSermon : s));
    setSelected(updatedSermon);
    setEditing(false);
  };

  const handleSermonDeleted = () => {
    setSelected(null);
    fetchSermons();
  };

  let list = sermons.filter(s => s.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <SearchInput value={q} onChange={setQ} placeholder={t('sermons.search')} style={{ maxWidth: 300 }} />
        {role !== "Member" && <Button icon={Icon.Plus} onClick={() => setCreating(true)}>Nuevo Sermón</Button>}
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "var(--gap)" }}>
        {list.map(s => (
          <Card key={s.id || s._id} hover pad={false} style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: 12, paddingBottom: 0, cursor: "pointer" }} onClick={() => setSelected(s)}><SermonArt s={s} /></div>
            <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.3, cursor: "pointer" }} onClick={() => setSelected(s)}>{s.title}</h3>
              <div className="muted" style={{ fontSize: 12.5, display: "flex", alignItems: "center", gap: 7 }}><Icon.Book size={14} />{s.scripture}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 2 }}>
                <Avatar name={s.speaker.replace("Pastor ", "")} size={26} />
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{s.speaker.replace("Pastor ", "")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <span className="faint" style={{ fontSize: 12, display: "flex", gap: 12 }}>
                  <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Icon.Clock size={13} />{s.duration}</span>
                  <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Icon.Play size={12} />{s.plays}</span>
                </span>
                {s.audio && (
                  <button onClick={() => setSelected(s)} style={{ background: "var(--primary)", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "0.9"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    🎵 Escuchar
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selected && <SermonDetailModal sermon={selected} onClose={() => setSelected(null)} onDelete={handleSermonDeleted} onEdit={() => setEditing(true)} role={role} />}
      <NewSermonModal open={creating} onClose={() => setCreating(false)} onSermonCreated={handleSermonCreated} />
      <EditSermonModal open={editing} onClose={() => setEditing(false)} onSermonUpdated={handleSermonUpdated} sermon={selected} />
    </div>
  );
}
