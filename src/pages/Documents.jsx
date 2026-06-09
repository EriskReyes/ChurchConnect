import { useState } from 'react';
import { Icon } from '../components/icons';
import { Card, Button, Modal, Field, Input, Select } from '../components/ui';
import DB from '../data';

const DOC_TYPES = ["Finance", "Policy", "Members", "Children", "Worship", "Facilities", "Pastoral", "Outreach"];
const ACCESS_LEVELS = ["All", "Staff", "Leadership", "Ministry"];

function DocumentDetailModal({ open, onClose, document, onDelete, role }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres borrar este documento?")) return;
    setDeleting(true);
    try {
      setTimeout(() => {
        onDelete();
        setDeleting(false);
      }, 300);
    } catch (err) {
      alert("Error: " + err.message);
      setDeleting(false);
    }
  };

  const getAccessColor = (access) => {
    const colors = {
      "All": "var(--primary)",
      "Staff": "#B5742E",
      "Leadership": "#7A4E9E",
      "Ministry": "#6E9B7E"
    };
    return colors[access] || "var(--text-muted)";
  };

  return (
    <Modal open={!!document} onClose={onClose} title="Documento" width={480}
      footer={<><Button variant="outline" onClick={onClose}>Cerrar</Button>{role !== "Member" && <Button icon={Icon.Trash} variant="danger" onClick={handleDelete} disabled={deleting}>{deleting ? "Borrando..." : "Eliminar"}</Button>}</>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ padding: 16, background: "var(--surface-2)", borderRadius: 12, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ fontSize: 32 }}>
            {document?.name.endsWith('.pdf') ? '📄' : document?.name.endsWith('.xlsx') || document?.name.endsWith('.xls') ? '📊' : document?.name.endsWith('.docx') || document?.name.endsWith('.doc') ? '📝' : document?.name.endsWith('.zip') ? '📦' : '📋'}
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0 }}>{document?.name}</h3>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{document?.size}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Tipo</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{document?.type}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Fecha</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{document?.date}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Por</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginTop: 4 }}>{document?.by}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Acceso</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: getAccessColor(document?.access), marginTop: 4 }}>{document?.access}</div>
          </div>
        </div>

        {document?.description && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>Descripción</div>
            <p style={{ fontSize: 13, color: "var(--text)", margin: 0, lineHeight: 1.5 }}>{document?.description}</p>
          </div>
        )}

        <Button style={{ width: "100%" }}>⬇️ Descargar</Button>
      </div>
    </Modal>
  );
}

export default function Documents({ role }) {
  const [documents, setDocuments] = useState(DB.documents);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterAccess, setFilterAccess] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleDocumentDeleted = () => {
    setDocuments(documents.filter(d => d.id !== selectedDocument.id));
    setSelectedDocument(null);
  };

  let filtered = documents.filter(d => {
    const matchesType = filterType === "All" || d.type === filterType;
    const matchesAccess = filterAccess === "All" || d.access === filterAccess;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesAccess && matchesSearch;
  });

  const typeStats = DOC_TYPES.map(t => ({
    type: t,
    count: documents.filter(d => d.type === t).length
  })).filter(s => s.count > 0);

  const getAccessColor = (access) => {
    const colors = {
      "All": "var(--primary)",
      "Staff": "#B5742E",
      "Leadership": "#7A4E9E",
      "Ministry": "#6E9B7E"
    };
    return colors[access] || "var(--text-muted)";
  };

  const getDocIcon = (name) => {
    if (name.endsWith('.pdf')) return '📄';
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) return '📊';
    if (name.endsWith('.docx') || name.endsWith('.doc')) return '📝';
    if (name.endsWith('.zip')) return '📦';
    return '📋';
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, minWidth: 200 }}>
          <Icon.Search size={16} style={{ color: "var(--text-muted)" }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar documentos..."
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
      </div>

      <div className="fade-up" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", paddingRight: 8, borderRight: "1px solid var(--border)" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Tipo:</span>
          <button onClick={() => setFilterType("All")} style={{
            padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "1px solid var(--border)", borderRadius: 16,
            background: filterType === "All" ? "var(--primary)" : "var(--surface)",
            color: filterType === "All" ? "#fff" : "var(--text)", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s"
          }}>
            Todos
          </button>
          {typeStats.map(stat => (
            <button key={stat.type} onClick={() => setFilterType(stat.type)} style={{
              padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "1px solid var(--border)", borderRadius: 16,
              background: filterType === stat.type ? "var(--primary)" : "var(--surface)",
              color: filterType === stat.type ? "#fff" : "var(--text)", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s"
            }}>
              {stat.type}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Acceso:</span>
          <button onClick={() => setFilterAccess("All")} style={{
            padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "1px solid var(--border)", borderRadius: 16,
            background: filterAccess === "All" ? "var(--primary)" : "var(--surface)",
            color: filterAccess === "All" ? "#fff" : "var(--text)", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s"
          }}>
            Todos
          </button>
          {ACCESS_LEVELS.map(level => (
            <button key={level} onClick={() => setFilterAccess(level)} style={{
              padding: "6px 12px", fontSize: 12, fontWeight: 600, border: "1px solid var(--border)", borderRadius: 16,
              background: filterAccess === level ? `${getAccessColor(level)}` : "var(--surface)",
              color: filterAccess === level ? "#fff" : "var(--text)", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s"
            }}>
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: 12, padding: "12px 16px", background: "var(--surface-2)", borderRadius: "8px 8px 0 0", fontWeight: 600, fontSize: 12, color: "var(--text-muted)" }}>
          <div>Documento</div>
          <div>Tipo</div>
          <div>Por</div>
          <div>Fecha</div>
          <div>Acceso</div>
          <div></div>
        </div>
        {filtered.map(d => (
          <div key={d.id} onClick={() => setSelectedDocument(d)} style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", gap: 12, padding: "12px 16px",
            borderBottom: "1px solid var(--border)", alignItems: "center", cursor: "pointer", transition: "all 0.2s",
            background: "var(--surface)"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--surface)"}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
              <span style={{ fontSize: 18 }}>{getDocIcon(d.name)}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{d.size}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text)" }}>{d.type}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{d.by}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{d.date}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: getAccessColor(d.access) }}>{d.access}</div>
            <Button icon={Icon.Download} size="sm" variant="ghost" />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No hay documentos</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>No se encontraron documentos que coincidan con tu búsqueda</div>
        </div>
      )}

      <DocumentDetailModal document={selectedDocument} open={!!selectedDocument} onClose={() => setSelectedDocument(null)} onDelete={handleDocumentDeleted} role={role} />
    </div>
  );
}
