import { useState, useEffect } from 'react';
import { Icon } from '../components/icons';
import { Card, Badge, Button, Modal, Field, Input, Textarea } from '../components/ui';
import DB from '../data';

export default function Gallery({ role, onNav }) {
  const [gallery, setGallery] = useState(DB.gallery);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [uploadImg, setUploadImg] = useState(false);
  const [imgName, setImgName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [uploadType, setUploadType] = useState("photo");
  const [expandedImg, setExpandedImg] = useState(null);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumDesc, setNewAlbumDesc] = useState("");
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);

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

  const getAlbums = () => {
    const categories = [...new Set(gallery.map(img => img.category))];
    return categories.map(cat => ({
      name: cat,
      items: gallery.filter(img => img.category === cat),
      count: gallery.filter(img => img.category === cat).length
    })).sort((a, b) => b.items.length - a.items.length);
  };

  const handleAddImage = async () => {
    if (!selectedAlbum || selectedFiles.length === 0) {
      alert("Por favor selecciona al menos una foto o video");
      return;
    }

    let addedCount = 0;
    const newImages = [];

    for (const file of selectedFiles) {
      const newImg = {
        id: Math.max(0, ...gallery.map(img => img.id || 0)) + addedCount + 1,
        name: file.name,
        url: file.url,
        category: selectedAlbum,
        date: new Date().toISOString().split('T')[0],
        uploadedBy: "You",
        type: file.type
      };

      newImages.push(newImg);
      addedCount++;
    }

    setGallery(prev => [...prev, ...newImages]);
    setImgName("");
    setImgUrl("");
    setUploadType("photo");
    setSelectedFiles([]);
    setUploadImg(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = uploadType === "video" ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    const newFiles = [];

    files.forEach(file => {
      if (file.size > maxSize) {
        alert(`${file.name} es demasiado grande. Máximo: ${uploadType === "video" ? "50MB" : "5MB"}`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        newFiles.push({
          name: file.name.replace(/\.[^/.]+$/, ""),
          url: event.target.result,
          type: uploadType
        });

        if (newFiles.length === files.length) {
          setSelectedFiles([...selectedFiles, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (id) => {
    setGallery(gallery.filter(img => img.id !== id));
  };

  const handleSwipe = () => {
    if (selectedAlbum && expandedImg) {
      const itemsInAlbum = gallery.filter(img => img.category === selectedAlbum);
      const currentIndex = itemsInAlbum.findIndex(img => img.id === expandedImg.id);

      if (touchStart - touchEnd > 50) {
        // Swipe left -> siguiente foto
        if (currentIndex < itemsInAlbum.length - 1) {
          setExpandedImg(itemsInAlbum[currentIndex + 1]);
        }
      } else if (touchEnd - touchStart > 50) {
        // Swipe right -> foto anterior
        if (currentIndex > 0) {
          setExpandedImg(itemsInAlbum[currentIndex - 1]);
        }
      }
    }
  };

  const goToPrevImage = () => {
    if (selectedAlbum && expandedImg) {
      const itemsInAlbum = gallery.filter(img => img.category === selectedAlbum);
      const currentIndex = itemsInAlbum.findIndex(img => img.id === expandedImg.id);
      if (currentIndex > 0) {
        setExpandedImg(itemsInAlbum[currentIndex - 1]);
      }
    }
  };

  const goToNextImage = () => {
    if (selectedAlbum && expandedImg) {
      const itemsInAlbum = gallery.filter(img => img.category === selectedAlbum);
      const currentIndex = itemsInAlbum.findIndex(img => img.id === expandedImg.id);
      if (currentIndex < itemsInAlbum.length - 1) {
        setExpandedImg(itemsInAlbum[currentIndex + 1]);
      }
    }
  };

  const handleCreateAlbum = () => {
    if (!newAlbumName) return;
    setSelectedAlbum(newAlbumName);
    setNewAlbumName("");
    setNewAlbumDesc("");
    setShowNewAlbum(false);
    setUploadImg(true);
  };

  const albums = getAlbums();
  const albumItems = selectedAlbum ? gallery.filter(img => img.category === selectedAlbum) : [];
  const currentAlbumIndex = albums.findIndex(a => a.name === selectedAlbum);
  const prevAlbum = currentAlbumIndex > 0 ? albums[currentAlbumIndex - 1].name : null;
  const nextAlbum = currentAlbumIndex < albums.length - 1 ? albums[currentAlbumIndex + 1].name : null;

  if (selectedAlbum) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
        <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button icon={Icon.Chevron} onClick={() => setSelectedAlbum(null)} variant="ghost" title="Volver a álbumes" />
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{selectedAlbum}</h2>
            <Badge>{albumItems.length} {albumItems.length === 1 ? "archivo" : "archivos"}</Badge>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button onClick={() => prevAlbum && setSelectedAlbum(prevAlbum)} variant="ghost" disabled={!prevAlbum} style={{ padding: "8px 12px" }} title="← Álbum anterior" size="sm">←</Button>
            <Button icon={Icon.Plus} onClick={() => setUploadImg(true)} size="sm">Agregar</Button>
            <Button onClick={() => nextAlbum && setSelectedAlbum(nextAlbum)} variant="ghost" disabled={!nextAlbum} style={{ padding: "8px 12px" }} title="Siguiente álbum →" size="sm">→</Button>
          </div>
        </div>

        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
          {albumItems.length === 0 ? (
            <Card style={{ gridColumn: "1 / -1", padding: 40, textAlign: "center" }}>
              <Icon.Image size={48} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
              <p className="muted">Este álbum está vacío</p>
              <Button icon={Icon.Plus} onClick={() => setUploadImg(true)} style={{ marginTop: 16 }}>Agregar fotos/videos</Button>
            </Card>
          ) : albumItems.map(img => (
            <Card key={img.id} hover pad={false} style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => setExpandedImg(img)}>
              <div style={{ width: "100%", height: 160, background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                {img.type === "video" ? (
                  <>
                    <video src={img.url} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <Icon.Play size={40} style={{ position: "absolute", color: "#fff", opacity: 0.8, background: "rgba(0,0,0,0.4)", borderRadius: "50%", padding: 8 }} />
                  </>
                ) : (
                  <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                )}
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <h4 style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", margin: 0, flex: 1 }}>{img.name}</h4>
                  <span style={{ fontSize: 10, padding: "2px 6px", background: img.type === "video" ? "var(--primary-soft)" : "var(--accent-soft)", color: img.type === "video" ? "var(--primary)" : "var(--accent)", borderRadius: 4, fontWeight: 600 }}>{img.type === "video" ? "VIDEO" : "FOTO"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span className="muted" style={{ fontSize: 11 }}>{img.date}</span>
                </div>
                <Button size="sm" icon={Icon.Trash} variant="ghost" onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.id); }} style={{ width: "100%" }}>Eliminar</Button>
              </div>
            </Card>
          ))}
        </div>

        <Modal open={expandedImg !== null} onClose={() => setExpandedImg(null)} title={expandedImg?.name} width={900}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", position: "relative" }}
            onTouchStart={e => setTouchStart(e.changedTouches[0].clientX)}
            onTouchEnd={e => { setTouchEnd(e.changedTouches[0].clientX); handleSwipe(); }}
          >
            {expandedImg && (
              <>
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, position: "relative" }}>
                  <button
                    onClick={goToPrevImage}
                    disabled={!selectedAlbum || gallery.filter(img => img.category === selectedAlbum).findIndex(img => img.id === expandedImg.id) === 0}
                    style={{
                      padding: "8px 12px",
                      background: "rgba(0,0,0,0.3)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 20,
                      opacity: gallery.filter(img => img.category === selectedAlbum).findIndex(img => img.id === expandedImg.id) === 0 ? 0.3 : 1
                    }}
                  >
                    ←
                  </button>

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {expandedImg.type === "video" ? (
                      <video src={expandedImg.url} style={{ width: "100%", maxHeight: "60vh", borderRadius: 12, background: "#000" }} controls autoPlay />
                    ) : (
                      <img src={expandedImg.url} alt={expandedImg.name} style={{ width: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: 12 }} />
                    )}
                  </div>

                  <button
                    onClick={goToNextImage}
                    disabled={!selectedAlbum || gallery.filter(img => img.category === selectedAlbum).findIndex(img => img.id === expandedImg.id) === gallery.filter(img => img.category === selectedAlbum).length - 1}
                    style={{
                      padding: "8px 12px",
                      background: "rgba(0,0,0,0.3)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 20,
                      opacity: gallery.filter(img => img.category === selectedAlbum).findIndex(img => img.id === expandedImg.id) === gallery.filter(img => img.category === selectedAlbum).length - 1 ? 0.3 : 1
                    }}
                  >
                    →
                  </button>
                </div>

                <div style={{ width: "100%", textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
                  {selectedAlbum && (
                    <span>{gallery.filter(img => img.category === selectedAlbum).findIndex(img => img.id === expandedImg.id) + 1} de {gallery.filter(img => img.category === selectedAlbum).length}</span>
                  )}
                </div>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div><strong>{expandedImg.type === "video" ? "🎬 Video" : "📷 Foto"}:</strong> {expandedImg.name}</div>
                  <div><strong>Álbum:</strong> {expandedImg.category}</div>
                  <div><strong>Fecha:</strong> {expandedImg.date}</div>
                  <div><strong>Subido por:</strong> {expandedImg.uploadedBy}</div>
                </div>
              </>
            )}
          </div>
        </Modal>

        <Modal open={uploadImg} onClose={() => { setUploadImg(false); setImgUrl(""); setImgName(""); setUploadType("photo"); setSelectedFiles([]); }} title={uploadType === "video" ? "Subir videos" : "Subir fotos"} width={600}
          footer={<><Button variant="outline" onClick={() => { setUploadImg(false); setImgUrl(""); setImgName(""); setUploadType("photo"); setSelectedFiles([]); }}>Cancelar</Button><Button icon={Icon.Plus} onClick={handleAddImage} disabled={selectedFiles.length === 0}>Subir {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}</Button></>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Tipo *">
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setUploadType("photo"); setSelectedFiles([]); }} style={{ flex: 1, padding: 12, border: uploadType === "photo" ? "2px solid var(--primary)" : "1px solid var(--border)", background: uploadType === "photo" ? "var(--primary-soft)" : "var(--surface)", borderRadius: 8, cursor: "pointer", fontWeight: 600, color: uploadType === "photo" ? "var(--primary)" : "var(--text)" }}>📷 Fotos</button>
                <button onClick={() => { setUploadType("video"); setSelectedFiles([]); }} style={{ flex: 1, padding: 12, border: uploadType === "video" ? "2px solid var(--primary)" : "1px solid var(--border)", background: uploadType === "video" ? "var(--primary-soft)" : "var(--surface)", borderRadius: 8, cursor: "pointer", fontWeight: 600, color: uploadType === "video" ? "var(--primary)" : "var(--text)" }}>🎬 Videos</button>
              </div>
            </Field>

            <Field label={`Selecciona ${uploadType === "video" ? "videos" : "fotos"} (puedes seleccionar varias)`}>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, border: "2px dashed var(--border)", borderRadius: 11, cursor: "pointer", background: "var(--surface-2)" }} onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <input type="file" accept={uploadType === "video" ? "video/*" : "image/*"} onChange={handleFileSelect} multiple style={{ display: "none" }} />
                <div style={{ textAlign: "center" }}>
                  {uploadType === "video" ? <Icon.Play size={32} style={{ color: "var(--primary)", marginBottom: 8 }} /> : <Icon.Image size={32} style={{ color: "var(--primary)", marginBottom: 8 }} />}
                  <div style={{ fontWeight: 600 }}>Click o arrastra múltiples archivos</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Puedes seleccionar varios a la vez</div>
                </div>
              </label>
            </Field>

            {selectedFiles.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Archivos seleccionados ({selectedFiles.length})</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflow: "auto" }}>
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, background: "var(--surface-2)", borderRadius: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 16 }}>{file.type === "video" ? "🎬" : "📷"}</span>
                        <span style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)" }}>{file.name}</span>
                      </div>
                      <Button size="sm" icon={Icon.Trash} variant="ghost" onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Álbumes de fotos y videos</h2>
        <Button icon={Icon.Plus} onClick={() => setShowNewAlbum(true)}>Crear álbum</Button>
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 16 }}>
        {albums.length === 0 ? (
          <Card style={{ gridColumn: "1 / -1", padding: 40, textAlign: "center" }}>
            <Icon.Image size={48} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
            <p className="muted">No hay álbumes creados</p>
            <Button icon={Icon.Plus} onClick={() => setShowNewAlbum(true)} style={{ marginTop: 16 }}>Crear tu primer álbum</Button>
          </Card>
        ) : albums.map(album => (
          <Card key={album.name} hover onClick={() => setSelectedAlbum(album.name)} style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%", height: 180, background: "var(--surface-3)", borderRadius: 8, marginBottom: 12, overflow: "hidden", position: "relative" }}>
              {album.items.length > 0 && (
                <>
                  {album.items[0].type === "video" ? (
                    <>
                      <video src={album.items[0].url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <Icon.Play size={40} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#fff", opacity: 0.8, background: "rgba(0,0,0,0.4)", borderRadius: "50%", padding: 8 }} />
                    </>
                  ) : (
                    <img src={album.items[0].url} alt={album.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </>
              )}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0", color: "var(--text)" }}>{album.name}</h3>
            <Badge style={{ marginBottom: 12 }}>{album.count} {album.count === 1 ? "archivo" : "archivos"}</Badge>
            <Button icon={Icon.Plus} onClick={(e) => { e.stopPropagation(); setSelectedAlbum(album.name); setUploadImg(true); }} style={{ marginTop: "auto" }}>Agregar</Button>
          </Card>
        ))}
      </div>

      <Modal open={showNewAlbum} onClose={() => { setShowNewAlbum(false); setNewAlbumName(""); setNewAlbumDesc(""); }} title="Crear nuevo álbum" width={500}
        footer={<><Button variant="outline" onClick={() => { setShowNewAlbum(false); setNewAlbumName(""); setNewAlbumDesc(""); }}>Cancelar</Button><Button icon={Icon.Plus} onClick={handleCreateAlbum} disabled={!newAlbumName}>Crear álbum</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Nombre del álbum *"><Input placeholder="Ej: Retiro de Verano 2026" value={newAlbumName} onChange={e => setNewAlbumName(e.target.value)} /></Field>
          <Field label="Descripción (opcional)"><Textarea placeholder="Describe el contenido del álbum..." value={newAlbumDesc} onChange={e => setNewAlbumDesc(e.target.value)} style={{ minHeight: 60 }} /></Field>
        </div>
      </Modal>
    </div>
  );
}
