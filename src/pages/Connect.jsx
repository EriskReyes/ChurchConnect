import { useState, useEffect } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Avatar, SearchInput, Field, Input, Textarea, Select, Modal, IconButton, Menu } from '../components/ui';
import DB from '../data';
import { useTranslation } from '../hooks/useTranslation';
import ChatPage from './ChatPage';

const PRAYER_TONE = { Health: "danger", Guidance: "primary", Praise: "sage", Outreach: "warn", Youth: "primary" };

function Ministries({ role, onMinistrySelect }) {
  const [ministries, setMinistries] = useState(DB.ministries);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [creating, setCreating] = useState(false);
  const [uploadingMinistryPhoto, setUploadingMinistryPhoto] = useState(false);
  const [ministryPhotoName, setMinistryPhotoName] = useState("");
  const [ministryPhotoUrl, setMinistryPhotoUrl] = useState("");
  const canAdd = role !== "Member" && role !== "Treasurer";

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/ministries", {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (response.ok) {
        setMinistries(await response.json());
      }
    } catch (err) {
      console.error("Error fetching ministries:", err);
    }
  };

  const handleMinistryDeleted = () => {
    setSelectedMinistry(null);
    fetchMinistries();
  };

  const handleMinistryPhotoUpload = async () => {
    if (!ministryPhotoName || !ministryPhotoUrl || !selectedMinistry) return;

    const photoData = {
      id: selectedMinistry.id || selectedMinistry._id,
      name: ministryPhotoName,
      url: ministryPhotoUrl,
      category: selectedMinistry.name,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: "You"
    };

    try {
      const token = localStorage.getItem("authToken");
      await fetch("http://localhost:5000/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(photoData)
      });
    } catch (err) {
      console.error("Error saving photo:", err);
    }

    setMinistryPhotoName("");
    setMinistryPhotoUrl("");
    setUploadingMinistryPhoto(false);
  };

  const handleMinistryPhotoFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setMinistryPhotoUrl(event.target.result);
      if (!ministryPhotoName) setMinistryPhotoName(file.name.replace(/\.[^/.]+$/, ""));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", justifyContent: "flex-end" }}>{canAdd && <Button icon={Icon.Plus} onClick={() => setCreating(true)}>New ministry</Button>}</div>
      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "var(--gap)" }}>
        {ministries.map(m => {
          const ministryColor = m.color || '#3B5BA5';
          return (
          <Card key={m.id || m._id} hover pad={false} style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => setSelectedMinistry(m)}>
            <div style={{ height: 8, background: ministryColor }} />
            <div style={{ padding: "var(--pad-card)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "color-mix(in srgb," + ministryColor + " 14%, var(--surface))", color: ministryColor, display: "grid", placeItems: "center" }}><Icon.Hands size={24} /></div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 16 }}>{m.name}</h3>
              <p className="muted" style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5, minHeight: 38 }}>{m.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                <Avatar name={m.lead} size={30} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 600 }}>{m.lead}</div><div className="faint" style={{ fontSize: 11.5 }}>Ministry Lead</div></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
                <Badge tone="primary"><Icon.Users size={12} /> {m.members} members</Badge>
                <Badge tone="sage"><Icon.Clock size={12} /> {m.meeting}</Badge>
              </div>
            </div>
          </Card>
          );
        })}
      </div>
      {selectedMinistry && (
        <>
          <MinistryDetailModal ministry={selectedMinistry} onClose={() => setSelectedMinistry(null)} onDelete={handleMinistryDeleted} role={role} onMinistryUpdated={(updated) => { setMinistries(ministries.map(m => m.id === updated.id || m._id === updated._id ? updated : m)); setSelectedMinistry(updated); }} onUploadPhoto={() => setUploadingMinistryPhoto(true)} />
          <Modal open={uploadingMinistryPhoto} onClose={() => setUploadingMinistryPhoto(false)} title={`Subir foto - ${selectedMinistry.name}`} width={500}
            footer={<><Button variant="outline" onClick={() => { setUploadingMinistryPhoto(false); setMinistryPhotoUrl(""); setMinistryPhotoName(""); }}>Cancelar</Button><Button icon={Icon.Plus} onClick={handleMinistryPhotoUpload} disabled={!ministryPhotoName}>Subir</Button></>}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Nombre de la foto *"><Input placeholder="Reunión del ministerio" value={ministryPhotoName} onChange={e => setMinistryPhotoName(e.target.value)} /></Field>
              <Field label="Selecciona la foto">
                <label style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, border: "2px dashed var(--border)", borderRadius: 11, cursor: "pointer", background: "var(--surface-2)", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                  <input type="file" accept="image/*" onChange={handleMinistryPhotoFileSelect} style={{ display: "none" }} />
                  <div style={{ textAlign: "center" }}>
                    <Icon.Image size={32} style={{ color: "var(--primary)", marginBottom: 8 }} />
                    <div style={{ fontWeight: 600 }}>Click para subir</div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>PNG, JPG, GIF</div>
                  </div>
                </label>
                {ministryPhotoUrl && <div style={{ fontSize: 12, padding: 8, background: "var(--accent-soft)", borderRadius: 8, color: "var(--accent)", marginTop: 8 }}>✓ Foto cargada</div>}
              </Field>
            </div>
          </Modal>
        </>
      )}
      <NewMinistryModal open={creating} onClose={() => setCreating(false)} onMinistryCreated={(m) => { setMinistries([...ministries, m]); setCreating(false); }} />
    </div>
  );
}

function MinistryDetailModal({ ministry, onClose, onDelete, role, onMinistryUpdated, onUploadPhoto }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(ministry.name);
  const [lead, setLead] = useState(ministry.lead);
  const [members, setMembers] = useState(ministry.members);
  const [desc, setDesc] = useState(ministry.desc);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this ministry?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/ministries/${ministry.id || ministry._id}`, {
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

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/ministries/${ministry.id || ministry._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ name, lead, members: parseInt(members) || 0, desc })
      });
      if (response.ok) {
        const updated = await response.json();
        onMinistryUpdated(updated);
        setEditing(false);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={!!ministry} onClose={onClose} title={editing ? "Edit Ministry" : ministry.name} width={500}
      footer={editing ? <><Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button><Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</Button></> : <><Button icon={Icon.Image} onClick={onUploadPhoto}>Upload photo</Button><Button icon={Icon.Pencil} onClick={() => setEditing(true)}>Edit</Button>{role !== "Member" && <Button icon={Icon.Trash} variant="danger" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>}</>}>
      {!editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div><strong>Lead:</strong> {ministry.lead}</div>
          <div><strong>Members:</strong> {ministry.members}</div>
          <div><strong>Meeting:</strong> {ministry.meeting}</div>
          <div><strong>Description:</strong> {ministry.desc}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Name"><Input value={name} onChange={e => setName(e.target.value)} /></Field>
          <Field label="Lead"><Input value={lead} onChange={e => setLead(e.target.value)} /></Field>
          <Field label="Members"><Input type="number" value={members} onChange={e => setMembers(e.target.value)} /></Field>
          <Field label="Description"><Textarea value={desc} onChange={e => setDesc(e.target.value)} style={{ minHeight: 80 }} /></Field>
        </div>
      )}
    </Modal>
  );
}

function NewMinistryModal({ open, onClose, onMinistryCreated }) {
  const [name, setName] = useState("");
  const [lead, setLead] = useState("");
  const [members, setMembers] = useState("0");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!name || !lead) {
      setError("Name and lead are required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/ministries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ name, lead, members: parseInt(members) || 0, desc, color: "#3B5BA5", meeting: "TBD" })
      });
      if (!response.ok) throw new Error("Failed to create ministry");
      const ministry = await response.json();
      onMinistryCreated(ministry);
      setName("");
      setLead("");
      setMembers("0");
      setDesc("");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Ministry" width={500}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit} disabled={loading}>{loading ? "Creating..." : "Create"}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && <div style={{ color: "var(--error)", fontSize: 13, padding: "8px 12px", background: "var(--error-soft)", borderRadius: 8 }}>{error}</div>}
        <Field label="Ministry Name *"><Input placeholder="e.g. Youth Ministry" value={name} onChange={e => setName(e.target.value)} /></Field>
        <Field label="Ministry Lead *"><Input placeholder="Pastor name" value={lead} onChange={e => setLead(e.target.value)} /></Field>
        <Field label="Members"><Input type="number" placeholder="0" value={members} onChange={e => setMembers(e.target.value)} /></Field>
        <Field label="Description"><Textarea placeholder="What this ministry does..." value={desc} onChange={e => setDesc(e.target.value)} style={{ minHeight: 80 }} /></Field>
      </div>
    </Modal>
  );
}

function Prayer() {
  const [prayers, setPrayers] = useState(DB.prayers.map(p => ({ ...p, prayed: false })));
  const [filter, setFilter] = useState("All");
  const [compose, setCompose] = useState(false);
  const cats = ["All", ...new Set(DB.prayers.map(p => p.category))];
  const pray = id => setPrayers(ps => ps.map(p => p.id === id ? { ...p, prayers: p.prayed ? p.prayers - 1 : p.prayers + 1, prayed: !p.prayed } : p));
  const list = prayers.filter(p => filter === "All" || p.category === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <Card className="fade-up" style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "space-between", flexWrap: "wrap", background: "linear-gradient(120deg,var(--primary-soft),var(--surface))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: "var(--surface)", color: "var(--primary)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)" }}><Icon.Heart size={24} /></div>
          <div><h3 style={{ fontSize: 17, fontWeight: 700 }}>Prayer Wall</h3><p className="muted" style={{ fontSize: 13, marginTop: 2 }}>Share a request — the community will lift you up.</p></div>
        </div>
        <Button icon={Icon.Plus} onClick={() => setCompose(true)}>Share a request</Button>
      </Card>

      <div className="fade-up" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {cats.map(c => <button key={c} onClick={() => setFilter(c)} style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid " + (filter === c ? "transparent" : "var(--border-strong)"), background: filter === c ? "var(--primary)" : "var(--surface)", color: filter === c ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>{c}</button>)}
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "var(--gap)" }}>
        {list.map(p => (
          <Card key={p.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
              <Avatar name={p.by === "Anonymous" ? "A ?" : p.by} size={38} />
              <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.by}</div><div className="faint" style={{ fontSize: 12 }}>{p.time}</div></div>
              <Badge tone={PRAYER_TONE[p.category] || "neutral"}>{p.category}</Badge>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--text)" }}>{p.text}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <button onClick={() => pray(p.id)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 999, border: "1px solid " + (p.prayed ? "transparent" : "var(--border-strong)"), background: p.prayed ? "var(--primary)" : "var(--surface-2)", color: p.prayed ? "#fff" : "var(--text)", fontSize: 13, fontWeight: 600 }}><Icon.Heart size={15} />{p.prayed ? "Praying" : "Pray"} · {p.prayers}</button>
              {p.answered && <Badge tone="sage" dot>Answered</Badge>}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={compose} onClose={() => setCompose(false)} title="Share a prayer request" width={500}
        footer={<><Button variant="outline" onClick={() => setCompose(false)}>Cancel</Button><Button icon={Icon.Heart} onClick={() => setCompose(false)}>Post to wall</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Your request"><Textarea placeholder="What would you like the community to pray for?" style={{ minHeight: 120 }} /></Field>
          <Field label="Category"><Select options={["Health", "Guidance", "Praise", "Outreach", "Youth", "Family"]} /></Field>
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 500 }}><input type="checkbox" style={{ accentColor: "var(--primary)" }} /> Post anonymously</label>
        </div>
      </Modal>
    </div>
  );
}

function Community({ role }) {
  const [posts, setPosts] = useState(DB.posts);
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddPost = async () => {
    if (!postText.trim()) return;
    setLoading(true);
    try {
      const newPost = {
        id: posts.length + 1,
        by: "You",
        role: role,
        time: "now",
        text: postText,
        likes: 0,
        comments: 0,
        pinned: false,
        img: false
      };
      setPosts([newPost, ...posts]);
      setPostText("");
    } catch (err) {
      console.error("Error posting:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      {role !== "Member" && (
        <Card className="fade-up" style={{ background: "var(--surface-2)", padding: 16 }}>
          <Textarea placeholder="Share something with the community..." value={postText} onChange={e => setPostText(e.target.value)} style={{ minHeight: 80, borderRadius: 11, border: "1px solid var(--border)", padding: 12, marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button onClick={handleAddPost} disabled={loading || !postText.trim()}>{loading ? "Posting..." : "Post"}</Button>
          </div>
        </Card>
      )}

      <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {posts.length === 0 ? (
          <Card style={{ textAlign: "center", padding: 40 }}>
            <p className="muted">No posts yet. Be the first to share!</p>
          </Card>
        ) : (
          posts.map(p => (
            <Card key={p.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <Avatar name={p.by} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.by} <span className="faint" style={{ fontSize: 12 }}>• {p.role}</span></div>
                  <div className="faint" style={{ fontSize: 12 }}>{p.time}</div>
                </div>
                {(role !== "Member" || p.by === "You") && <Button size="sm" icon={Icon.Trash} variant="ghost" onClick={() => handleDeletePost(p.id)}>Delete</Button>}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{p.text}</p>
              <div style={{ display: "flex", gap: 12, fontSize: 13, color: "var(--text-muted)" }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><Icon.Heart size={15} /> {p.likes} likes</button>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><Icon.Chat size={15} /> {p.comments} comments</button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function Chat({ role }) {
  const [selected, setSelected] = useState(DB.chats[0] || null);
  const [messages, setMessages] = useState(DB.chatThread);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const message = {
      from: "You",
      me: true,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 12, minHeight: "50vh" }}>
      <Card style={{ display: "flex", flexDirection: "column", overflow: "hidden", padding: 0 }}>
        <div style={{ padding: 16, borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: 16 }}>Messages</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {DB.chats.map(c => (
            <button key={c.id} onClick={() => setSelected(c)} style={{ width: "100%", padding: 12, borderLeft: selected?.id === c.id ? "3px solid var(--primary)" : "3px solid transparent", background: selected?.id === c.id ? "var(--surface-2)" : "transparent", border: "none", textAlign: "left", cursor: "pointer" }}>
              <div style={{ fontWeight: selected?.id === c.id ? 600 : 500, fontSize: 13.5 }}>{c.name}</div>
              <p className="muted" style={{ fontSize: 12, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last}</p>
            </button>
          ))}
        </div>
      </Card>
      <Card style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {selected ? (
          <>
            <div style={{ padding: 16, borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: 16 }}>{selected.name}</div>
            <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12, minHeight: 300 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.me ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "60%", padding: 12, borderRadius: 12, background: m.me ? "var(--primary)" : "var(--surface-2)", color: m.me ? "#fff" : "var(--text)" }}>
                    <p style={{ fontSize: 13, margin: 0 }}>{m.text}</p>
                    <span style={{ fontSize: 11, opacity: 0.7 }}>{m.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 12, borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
              <Input placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => e.key === "Enter" && handleSendMessage()} style={{ flex: 1 }} />
              <Button size="sm" onClick={handleSendMessage} icon={Icon.Send}>Send</Button>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <p className="muted">Select a conversation</p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function Connect({ role, onNav }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState("ministries");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const tabs = [
    { value: "ministries", label: t('connect.ministries'), icon: Icon.Hands },
    { value: "prayer", label: t('connect.prayer'), icon: Icon.Heart },
    { value: "community", label: t('connect.community'), icon: Icon.Sparkle },
    { value: "chat", label: t('connect.chat'), icon: Icon.Chat },
    { value: "documents", label: t('connect.documents'), icon: Icon.Doc },
    { value: "gallery", label: "Gallery", icon: Icon.Image },
  ];

  const [documents, setDocuments] = useState(DB.documents);
  const [uploadDoc, setUploadDoc] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("Finance");
  const [docCategory, setDocCategory] = useState("Finance");
  const [gallery, setGallery] = useState(DB.gallery);
  const [uploadImg, setUploadImg] = useState(false);
  const [imgName, setImgName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgCategory, setImgCategory] = useState("Events");
  const [docFilter, setDocFilter] = useState("All");
  const [imgFilter, setImgFilter] = useState("All");
  const [expandedImg, setExpandedImg] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/gallery", {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (response.ok) setGallery(await response.json());
    } catch (err) {
      console.error("Error fetching gallery:", err);
    }
  };

  const handleAddDocument = async () => {
    if (!docName) return;
    const newDoc = {
      id: documents.length + 1,
      name: docName,
      type: docType,
      category: docCategory,
      size: "1.2 MB",
      by: "You",
      date: new Date().toISOString().split('T')[0],
      access: "Leadership"
    };
    setDocuments([...documents, newDoc]);
    setDocName("");
    setDocType("Finance");
    setDocCategory("Finance");
    setUploadDoc(false);
  };

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const handleAddImage = async () => {
    if (!imgName) return;

    let imageUrl = imgUrl;
    if (!imageUrl) {
      alert("Por favor carga una imagen o proporciona una URL");
      return;
    }

    const newImg = {
      id: gallery.length + 1,
      name: imgName,
      url: imageUrl,
      category: imgCategory,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: "You"
    };

    try {
      const token = localStorage.getItem("authToken");
      await fetch("http://localhost:5000/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(newImg)
      });
    } catch (err) {
      console.error("Error saving to server:", err);
    }

    setGallery([...gallery, newImg]);
    setImgName("");
    setImgUrl("");
    setImgCategory("Events");
    setUploadImg(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImgUrl(event.target.result);
      if (!imgName) setImgName(file.name.replace(/\.[^/.]+$/, ""));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = (id) => {
    setGallery(gallery.filter(img => img.id !== id));
  };

  const docCategories = ["All", ...new Set(documents.map(d => d.category || d.type))];
  const imgCategories = ["All", ...new Set(gallery.map(img => img.category))];
  const filteredDocs = docFilter === "All" ? documents : documents.filter(d => (d.category || d.type) === docFilter);
  const filteredImgs = imgFilter === "All" ? gallery : gallery.filter(img => img.category === imgFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 4, overflowX: "auto" }}>
        {tabs.map(t => {
          const on = tab === t.value;
          return (
            <button key={t.value} onClick={() => setTab(t.value)}
              style={{
                padding: "11px 16px", fontSize: 14, fontWeight: 600, border: "none", background: "none",
                color: on ? "var(--primary)" : "var(--text-muted)", position: "relative", marginBottom: -1, whiteSpace: "nowrap",
              }}>{t.label}
              <span style={{ position: "absolute", left: 12, right: 12, bottom: 0, height: 2.5, borderRadius: 3, background: on ? "var(--primary)" : "transparent" }} />
            </button>
          );
        })}
      </div>

      {tab === "ministries" && <Ministries role={role} />}
      {tab === "prayer" && <Prayer />}
      {tab === "community" && <Community role={role} />}
      {tab === "chat" && <ChatPage role={role} />}
      {tab === "documents" && (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {docCategories.map(cat => (
                <button key={cat} onClick={() => setDocFilter(cat)} style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid " + (docFilter === cat ? "transparent" : "var(--border-strong)"), background: docFilter === cat ? "var(--primary)" : "var(--surface)", color: docFilter === cat ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>{cat}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button icon={Icon.Image} onClick={() => setUploadImg(true)}>Subir foto</Button>
              <Button icon={Icon.Plus} onClick={() => setUploadDoc(true)}>Subir documento</Button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
            {filteredDocs.map(d => (
              <Card key={d.id} hover style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ width: "100%", height: 100, borderRadius: 8, background: "var(--surface-3)", color: "var(--primary)", display: "grid", placeItems: "center", marginBottom: 12 }}><Icon.Doc size={32} /></div>
                <h4 style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{d.name}</h4>
                <p className="muted" style={{ fontSize: 11, marginTop: 4, marginBottom: 12 }}><Badge style={{ marginRight: 4 }}>{d.category || d.type}</Badge>{d.size}</p>
                <div style={{ display: "flex", gap: 4, marginTop: "auto" }}>
                  <Button size="sm" icon={Icon.Download} variant="ghost" style={{ flex: 1 }}>Download</Button>
                  <Button size="sm" icon={Icon.Trash} variant="ghost" onClick={() => handleDeleteDocument(d.id)}>Delete</Button>
                </div>
              </Card>
            ))}

            {filteredImgs.length > 0 && filteredImgs.map(img => (
              <Card key={img.id} hover pad={false} style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => setExpandedImg(img)}>
                <div style={{ width: "100%", height: 150, background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: 12 }}>
                  <h4 style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{img.name}</h4>
                  <p className="muted" style={{ fontSize: 12, marginTop: 4 }}><Badge>{img.category}</Badge></p>
                  <Button size="sm" icon={Icon.Trash} variant="ghost" onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.id); }} style={{ marginTop: 8, width: "100%" }}>Eliminar</Button>
                </div>
              </Card>
            ))}
          </div>
          <Modal open={uploadDoc} onClose={() => setUploadDoc(false)} title="Upload document" width={500}
            footer={<><Button variant="outline" onClick={() => setUploadDoc(false)}>Cancel</Button><Button icon={Icon.Plus} onClick={handleAddDocument}>Upload</Button></>}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Document name"><Input placeholder="2026 Annual Budget.pdf" value={docName} onChange={e => setDocName(e.target.value)} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Type"><Select value={docType} onChange={e => setDocType(e.target.value)} options={["Finance", "Policy", "Members", "Children", "Reports"]} /></Field>
                <Field label="Category"><Input placeholder="Finance, Policy, etc" value={docCategory} onChange={e => setDocCategory(e.target.value)} /></Field>
              </div>
              <Field label="File" hint="Select a file to upload"><input type="file" style={{ padding: "8px", border: "1px solid var(--border)", borderRadius: 11, width: "100%" }} /></Field>
            </div>
          </Modal>
        </div>
      )}
      {tab === "gallery" && (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {imgCategories.map(cat => (
                <button key={cat} onClick={() => setImgFilter(cat)} style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid " + (imgFilter === cat ? "transparent" : "var(--border-strong)"), background: imgFilter === cat ? "var(--primary)" : "var(--surface)", color: imgFilter === cat ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{cat}</button>
              ))}
              <button onClick={() => setShowNewCategory(!showNewCategory)} style={{ padding: "7px 14px", borderRadius: 999, border: "1px dashed var(--border-strong)", background: "transparent", color: "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Nuevo álbum</button>
            </div>
            <Button icon={Icon.Plus} onClick={() => setUploadImg(true)}>Subir foto</Button>
          </div>

          {showNewCategory && (
            <Card style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <Field label="Nombre del álbum" style={{ flex: 1 }}>
                <Input placeholder="Mi álbum" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
              </Field>
              <Button size="sm" onClick={() => { if(newCategoryName) { setImgCategory(newCategoryName); setImgFilter(newCategoryName); setNewCategoryName(""); setShowNewCategory(false); setUploadImg(true); } }} disabled={!newCategoryName}>Crear</Button>
              <Button size="sm" variant="outline" onClick={() => { setNewCategoryName(""); setShowNewCategory(false); }}>Cancelar</Button>
            </Card>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
            {filteredImgs.length === 0 ? (
              <Card style={{ gridColumn: "1 / -1", padding: 40, textAlign: "center" }}>
                <Icon.Image size={48} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
                <p className="muted">No images in this category</p>
              </Card>
            ) : filteredImgs.map(img => (
              <Card key={img.id} hover pad={false} style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => setExpandedImg(img)}>
                <div style={{ width: "100%", height: 150, background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                  <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: 12 }}>
                  <h4 style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{img.name}</h4>
                  <p className="muted" style={{ fontSize: 12, marginTop: 4 }}><Badge>{img.category}</Badge> {img.date}</p>
                  <Button size="sm" icon={Icon.Trash} variant="ghost" onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.id); }} style={{ marginTop: 8 }}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
          <Modal open={uploadImg} onClose={() => setUploadImg(false)} title="Add image" width={500}
            footer={<><Button variant="outline" onClick={() => { setUploadImg(false); setImgUrl(""); setImgName(""); }}>Cancel</Button><Button icon={Icon.Plus} onClick={handleAddImage} disabled={!imgName}>Add photo</Button></>}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Photo name *"><Input placeholder="Domingo servicio" value={imgName} onChange={e => setImgName(e.target.value)} /></Field>

              <Field label="Choose photo or paste URL">
                <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, border: "2px dashed var(--border)", borderRadius: 11, cursor: "pointer", background: "var(--surface-2)", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                    <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />
                    <div style={{ textAlign: "center" }}>
                      <Icon.Image size={32} style={{ color: "var(--primary)", marginBottom: 8 }} />
                      <div style={{ fontWeight: 600 }}>Click to upload or drag</div>
                      <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>PNG, JPG, GIF up to 10MB</div>
                    </div>
                  </label>
                  {imgUrl && <div style={{ fontSize: 12, padding: 8, background: "var(--accent-soft)", borderRadius: 8, color: "var(--accent)" }}>✓ Foto cargada</div>}
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>O pega una URL:</div>
                  <Input placeholder="https://..." value={imgUrl.startsWith("data:") ? "" : imgUrl} onChange={e => setImgUrl(e.target.value)} />
                </div>
              </Field>

              <Field label="Album/Category *">
                <div style={{ display: "flex", gap: 8 }}>
                  <Select value={imgCategory} onChange={e => setImgCategory(e.target.value)} options={["Events", "Services", "Retreats", "Children", "Outreach", "Worship"]} style={{ flex: 1 }} />
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Selecciona un álbum existente o escribe uno nuevo</div>
              </Field>
            </div>
          </Modal>
          <Modal open={!!expandedImg} onClose={() => setExpandedImg(null)} title={expandedImg?.name} width={800}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
              {expandedImg && <img src={expandedImg.url} alt={expandedImg.name} style={{ width: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: 12 }} />}
              {expandedImg && (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div><strong>Category:</strong> {expandedImg.category}</div>
                  <div><strong>Date:</strong> {expandedImg.date}</div>
                  <div><strong>Uploaded by:</strong> {expandedImg.uploadedBy}</div>
                </div>
              )}
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}
