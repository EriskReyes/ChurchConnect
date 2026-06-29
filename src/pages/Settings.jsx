import { useState, useContext, useRef, useEffect } from 'react';
import { Icon } from '../components/icons';
import { Card, Button, Avatar, Field, Input, Textarea } from '../components/ui';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageContext } from '../contexts/LanguageContext';

export default function Settings({ role }) {
  const [tab, setTab] = useState("profile");
  const { t } = useTranslation();
  const { language, setLanguage } = useContext(LanguageContext);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 600);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      const [firstName, ...lastNameParts] = (userData.name || "").split(" ");
      const lastName = lastNameParts.join(" ");
      setProfileData({
        firstName: firstName || "",
        lastName: lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        bio: userData.bio || ""
      });
      setTempProfileData({
        firstName: firstName || "",
        lastName: lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        bio: userData.bio || ""
      });
    }
  }, []);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // --- Admin panel state ---
  const isAdmin = role === 'Admin';
  const [adminCode, setAdminCode] = useState('');
  const [adminMsg, setAdminMsg] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [roleChanges, setRoleChanges] = useState({});
  const [savingRole, setSavingRole] = useState({});
  const [savedRole, setSavedRole] = useState({});
  const [search, setSearch] = useState('');
  const [changingCode, setChangingCode] = useState(false);
  const [currentCodeInput, setCurrentCodeInput] = useState('');
  const [newCode, setNewCode] = useState('');
  const [changeCodeMsg, setChangeCodeMsg] = useState(null);
  const [changeCodeLoading, setChangeCodeLoading] = useState(false);

  const jwtHeader = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  });

  const handleEnterAdmin = async () => {
    if (!adminCode.trim()) return;
    setAdminLoading(true);
    setAdminMsg(null);
    try {
      const res = await fetch(`${API}/api/admin/enter`, {
        method: 'POST',
        headers: jwtHeader(),
        body: JSON.stringify({ code: adminCode.trim() })
      });
      const data = await res.json();
      if (!res.ok) { setAdminMsg(data.message); return; }
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAdminCode('');
      window.location.reload();
    } catch { setAdminMsg('Error de conexión'); }
    finally { setAdminLoading(false); }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/users`, { headers: jwtHeader() });
      if (res.ok) setUsers(await res.json());
    } catch {}
    finally { setUsersLoading(false); }
  };

  useEffect(() => {
    if (tab === 'access' && isAdmin) fetchUsers();
  }, [tab, isAdmin]);

  const handleSaveRole = async (userId) => {
    const newRole = roleChanges[userId];
    if (!newRole) return;
    setSavingRole(prev => ({ ...prev, [userId]: true }));
    try {
      const res = await fetch(`${API}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: jwtHeader(),
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setRoleChanges(prev => { const n = { ...prev }; delete n[userId]; return n; });
      setSavedRole(prev => ({ ...prev, [userId]: true }));
      setTimeout(() => setSavedRole(prev => { const n = { ...prev }; delete n[userId]; return n; }), 2000);
    } catch { alert('Error al guardar'); }
    finally { setSavingRole(prev => ({ ...prev, [userId]: false })); }
  };

  const handleChangeCode = async () => {
    if (!newCode.trim() || newCode.trim().length < 4) {
      setChangeCodeMsg({ ok: false, text: 'Mínimo 4 caracteres' });
      return;
    }
    setChangeCodeLoading(true);
    setChangeCodeMsg(null);
    try {
      const res = await fetch(`${API}/api/admin/change-code`, {
        method: 'POST',
        headers: jwtHeader(),
        body: JSON.stringify({ currentCode: currentCodeInput.trim(), newCode: newCode.trim() })
      });
      const data = await res.json();
      if (!res.ok) { setChangeCodeMsg({ ok: false, text: data.message }); return; }
      setCurrentCodeInput('');
      setNewCode('');
      setChangingCode(false);
      setChangeCodeMsg({ ok: true, text: '✓ Contraseña actualizada' });
      setTimeout(() => setChangeCodeMsg(null), 3000);
    } catch { setChangeCodeMsg({ ok: false, text: 'Error de conexión' }); }
    finally { setChangeCodeLoading(false); }
  };

  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingChurch, setEditingChurch] = useState(false);
  const [profileData, setProfileData] = useState({ firstName: "", lastName: "", email: "", phone: "", bio: "" });
  const [churchData, setChurchData] = useState({ name: "", founded: "", address: "", city: "", description: "" });
  const [tempProfileData, setTempProfileData] = useState(profileData);
  const [tempChurchData, setTempChurchData] = useState(churchData);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("La imagen es muy grande. Máximo 4 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target?.result);
    };
    reader.readAsDataURL(file);
  };


  const tabs = ["profile", "church", "preferences", "languages", "access"];
  const tabLabels = {
    profile: "Profile",
    church: "Church",
    preferences: "Preferences",
    languages: t('settings.languages'),
    access: "Acceso",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
      <div className="fade-up" style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
        {tabs.map(tabKey => {
          const on = tab === tabKey;
          return (
            <button key={tabKey} onClick={() => setTab(tabKey)}
              style={{
                padding: "11px 16px", fontSize: 14, fontWeight: 600, border: "none", background: "none",
                color: on ? "var(--primary)" : "var(--text-muted)", position: "relative", marginBottom: -1,
              }}>{tabLabels[tabKey]}
              <span style={{ position: "absolute", left: 12, right: 12, bottom: 0, height: 2.5, borderRadius: 3, background: on ? "var(--primary)" : "transparent" }} />
            </button>
          );
        })}
      </div>

      {tab === "profile" && (
        <div className="fade-up">
          <Card>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Your profile</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 22 }}>This information is visible to other church members.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
              <Avatar name={`${profileData.firstName} ${profileData.lastName}`} size={76} ring src={profileImage} />
              <div>
                {editingProfile && (
                  <>
                    <Button variant="outline" icon={Icon.Image} onClick={() => fileInputRef.current?.click()}>Change photo</Button>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handlePhotoUpload} style={{ display: "none" }} />
                    <div className="faint" style={{ fontSize: 12, marginTop: 8 }}>JPG or PNG, max 4 MB</div>
                  </>
                )}
              </div>
            </div>

            {!editingProfile ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 22 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>First name</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{profileData.firstName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Last name</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{profileData.lastName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Email</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{profileData.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Phone</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{profileData.phone}</div>
                  </div>
                  <div style={{ gridColumn: isMobile ? "auto" : "1 / -1" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Bio</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", lineHeight: 1.5 }}>{profileData.bio}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <Button variant="danger" size="sm" onClick={() => {
                    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
                      setLoading(true);
                      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/delete-account`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
                      })
                        .then(res => res.json())
                        .then(data => {
                          if (data.success) {
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('user');
                            window.location.href = '/';
                          } else {
                            alert('Error deleting account: ' + data.message);
                          }
                        })
                        .catch(err => alert('Error: ' + err.message))
                        .finally(() => setLoading(false));
                    }
                  }} icon={Icon.Trash}>Delete account</Button>
                  <Button icon={Icon.Edit} onClick={() => { setTempProfileData(profileData); setEditingProfile(true); }}>Edit profile</Button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                  <Field label="First name"><Input value={tempProfileData.firstName} onChange={e => setTempProfileData({ ...tempProfileData, firstName: e.target.value })} /></Field>
                  <Field label="Last name"><Input value={tempProfileData.lastName} onChange={e => setTempProfileData({ ...tempProfileData, lastName: e.target.value })} /></Field>
                  <Field label="Email"><Input value={tempProfileData.email} onChange={e => setTempProfileData({ ...tempProfileData, email: e.target.value })} /></Field>
                  <Field label="Phone"><Input value={tempProfileData.phone} onChange={e => setTempProfileData({ ...tempProfileData, phone: e.target.value })} /></Field>
                  <div style={{ gridColumn: isMobile ? "auto" : "1 / -1" }}><Field label="Bio"><Textarea value={tempProfileData.bio} onChange={e => setTempProfileData({ ...tempProfileData, bio: e.target.value })} /></Field></div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
                  <Button variant="outline" onClick={() => setEditingProfile(false)}>Cancel</Button>
                  <Button icon={Icon.Check} onClick={() => { setProfileData(tempProfileData); setEditingProfile(false); }}>Save changes</Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {tab === "church" && (
        <div className="fade-up">
          <Card>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Church details</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 22 }}>Information about your congregation.</p>

            {!editingChurch ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 22 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Church name</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{churchData.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Founded</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{churchData.founded}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Address</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{churchData.address}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>City</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{churchData.city}</div>
                  </div>
                  <div style={{ gridColumn: isMobile ? "auto" : "1 / -1" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Description</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", lineHeight: 1.5 }}>{churchData.description}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}><Button icon={Icon.Edit} onClick={() => { setTempChurchData(churchData); setEditingChurch(true); }}>Edit details</Button></div>
              </>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                  <Field label="Church name"><Input value={tempChurchData.name} onChange={e => setTempChurchData({ ...tempChurchData, name: e.target.value })} /></Field>
                  <Field label="Founded"><Input type="number" value={tempChurchData.founded} onChange={e => setTempChurchData({ ...tempChurchData, founded: e.target.value })} /></Field>
                  <Field label="Address"><Input value={tempChurchData.address} onChange={e => setTempChurchData({ ...tempChurchData, address: e.target.value })} /></Field>
                  <Field label="City"><Input value={tempChurchData.city} onChange={e => setTempChurchData({ ...tempChurchData, city: e.target.value })} /></Field>
                  <div style={{ gridColumn: isMobile ? "auto" : "1 / -1" }}><Field label="Description"><Textarea value={tempChurchData.description} onChange={e => setTempChurchData({ ...tempChurchData, description: e.target.value })} /></Field></div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
                  <Button variant="outline" onClick={() => setEditingChurch(false)}>Cancel</Button>
                  <Button icon={Icon.Check} onClick={() => { setChurchData(tempChurchData); setEditingChurch(false); }}>Save changes</Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {tab === "preferences" && (
        <div className="fade-up">
          <Card>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Preferences</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
              <div><div style={{ fontSize: 14, fontWeight: 600 }}>Email notifications</div><div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>Receive updates about events and requests</div></div>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--primary)", width: 20, height: 20 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, paddingTop: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
              <div><div style={{ fontSize: 14, fontWeight: 600 }}>Prayer request notifications</div><div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>Get alerts when new prayer requests are shared</div></div>
              <input type="checkbox" style={{ accentColor: "var(--primary)", width: 20, height: 20 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}><Button>Save preferences</Button></div>
          </Card>
        </div>
      )}

      {tab === "access" && (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {!isAdmin ? (
            <Card>
              <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--primary-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Icon.Lock size={26} style={{ color: "var(--primary)" }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Acceso Admin</h3>
                <p className="muted" style={{ fontSize: 13, marginBottom: 22 }}>Ingresa la contraseña para convertirte en Admin y gestionar usuarios.</p>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", maxWidth: 420, margin: "0 auto" }}>
                <input
                  type="password"
                  value={adminCode}
                  onChange={e => setAdminCode(e.target.value)}
                  placeholder="Contraseña de admin"
                  onKeyDown={e => e.key === 'Enter' && handleEnterAdmin()}
                  style={{
                    flex: 1, minWidth: 200, padding: "11px 14px", fontSize: 14,
                    borderRadius: "var(--r-md)", border: "1.5px solid var(--border)",
                    background: "var(--surface-2)", color: "var(--text)", outline: "none"
                  }}
                />
                <button onClick={handleEnterAdmin} disabled={adminLoading || !adminCode.trim()} style={{
                  padding: "11px 24px", fontSize: 14, fontWeight: 700, borderRadius: "var(--r-md)",
                  background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", opacity: adminLoading ? 0.7 : 1
                }}>{adminLoading ? "..." : "Entrar"}</button>
              </div>
              {adminMsg && (
                <div style={{
                  marginTop: 14, padding: "10px 14px", borderRadius: "var(--r-md)", fontSize: 13.5, fontWeight: 600,
                  background: "var(--error-soft, #fdecea)", color: "var(--error, #c62828)", textAlign: "center"
                }}>{adminMsg}</div>
              )}
            </Card>
          ) : (
            <>
              <Card style={{ padding: "14px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon.Shield size={18} style={{ color: "var(--primary)" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>Modo Admin activo</div>
                      <div className="muted" style={{ fontSize: 12 }}>{users.length} usuarios cargados</div>
                    </div>
                  </div>
                  <button onClick={() => setChangingCode(v => !v)} style={{
                    padding: "7px 14px", fontSize: 12.5, fontWeight: 600, borderRadius: "var(--r-md)",
                    background: "none", color: "var(--primary)", border: "1.5px solid var(--primary)", cursor: "pointer"
                  }}>Cambiar contraseña</button>
                </div>

                {changingCode && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Cambiar contraseña de admin</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <input
                        type="password"
                        value={currentCodeInput}
                        onChange={e => setCurrentCodeInput(e.target.value)}
                        placeholder="Contraseña actual"
                        style={{
                          padding: "9px 12px", fontSize: 13, borderRadius: "var(--r-md)",
                          border: "1.5px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", outline: "none"
                        }}
                      />
                      <input
                        type="password"
                        value={newCode}
                        onChange={e => setNewCode(e.target.value)}
                        placeholder="Nueva contraseña (mínimo 4 caracteres)"
                        style={{
                          padding: "9px 12px", fontSize: 13, borderRadius: "var(--r-md)",
                          border: "1.5px solid var(--border)", background: "var(--surface-2)", color: "var(--text)", outline: "none"
                        }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={handleChangeCode} disabled={changeCodeLoading} style={{
                          padding: "9px 18px", fontSize: 13, fontWeight: 700, borderRadius: "var(--r-md)",
                          background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer"
                        }}>{changeCodeLoading ? "..." : "Guardar"}</button>
                        <button onClick={() => { setChangingCode(false); setCurrentCodeInput(''); setNewCode(''); setChangeCodeMsg(null); }} style={{
                          padding: "9px 14px", fontSize: 13, fontWeight: 600, borderRadius: "var(--r-md)",
                          background: "none", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer"
                        }}>Cancelar</button>
                      </div>
                    </div>
                    {changeCodeMsg && (
                      <div style={{
                        marginTop: 10, padding: "8px 12px", borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 600,
                        background: changeCodeMsg.ok ? "var(--success-soft, #e8f5e9)" : "var(--error-soft, #fdecea)",
                        color: changeCodeMsg.ok ? "var(--success, #2e7d32)" : "var(--error, #c62828)"
                      }}>{changeCodeMsg.text}</div>
                    )}
                  </div>
                )}
              </Card>

              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Gestionar usuarios</h3>
                  <button onClick={fetchUsers} style={{ fontSize: 12, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Actualizar</button>
                </div>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o email..."
                  style={{
                    width: "100%", padding: "9px 12px", fontSize: 13, borderRadius: "var(--r-md)",
                    border: "1.5px solid var(--border)", background: "var(--surface-2)", color: "var(--text)",
                    marginBottom: 14, boxSizing: "border-box", outline: "none"
                  }}
                />
                {usersLoading && <p className="muted" style={{ fontSize: 13, textAlign: "center", padding: "16px 0" }}>Cargando usuarios...</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {users
                    .filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
                    .map(u => (
                      <div key={u._id} style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                        borderRadius: "var(--r-md)", background: "var(--surface-2)",
                        border: "1px solid var(--border)", flexWrap: "wrap"
                      }}>
                        <div style={{ flex: 1, minWidth: 140 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700 }}>{u.name}</div>
                          <div className="muted" style={{ fontSize: 12 }}>{u.email}</div>
                        </div>
                        <select
                          value={roleChanges[u._id] ?? u.role}
                          onChange={e => setRoleChanges(prev => ({ ...prev, [u._id]: e.target.value }))}
                          style={{
                            padding: "6px 10px", fontSize: 12.5, fontWeight: 600, borderRadius: "var(--r-md)",
                            border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text)", cursor: "pointer"
                          }}
                        >
                          {['Admin', 'Pastor', 'Treasurer', 'Ministry Leader', 'Staff', 'Member', 'Visitor'].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleSaveRole(u._id)}
                          disabled={savingRole[u._id] || !roleChanges[u._id] || roleChanges[u._id] === u.role}
                          style={{
                            padding: "6px 14px", fontSize: 12.5, fontWeight: 700, borderRadius: "var(--r-md)",
                            background: savedRole[u._id] ? "var(--success, #2e7d32)" : "var(--primary)",
                            color: "#fff", border: "none", cursor: "pointer",
                            opacity: (!roleChanges[u._id] || roleChanges[u._id] === u.role) ? 0.35 : 1,
                            minWidth: 72
                          }}
                        >{savingRole[u._id] ? "..." : savedRole[u._id] ? "✓ Listo" : "Guardar"}</button>
                      </div>
                    ))}
                </div>
              </Card>
            </>
          )}
        </div>
      )}

      {tab === "languages" && (
        <div className="fade-up">
          <Card>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{t('settings.languages')}</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 22 }}>Choose your preferred language for the application.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
              {[
                { code: 'en', label: 'settings.english', flag: '🇺🇸' },
                { code: 'es', label: 'settings.spanish', flag: '🇪🇸' },
                { code: 'fr', label: 'settings.french', flag: '🇫🇷' },
                { code: 'pt', label: 'settings.portuguese', flag: '🇵🇹' },
                { code: 'it', label: 'settings.italian', flag: '🇮🇹' },
                { code: 'de', label: 'settings.german', flag: '🇩🇪' },
                { code: 'nl', label: 'settings.dutch', flag: '🇳🇱' },
                { code: 'pl', label: 'settings.polish', flag: '🇵🇱' },
                { code: 'ru', label: 'settings.russian', flag: '🇷🇺' },
                { code: 'ja', label: 'settings.japanese', flag: '🇯🇵' },
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  style={{
                    padding: "12px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    border: language === lang.code ? "2px solid var(--primary)" : "1px solid var(--border)",
                    borderRadius: "var(--r-md)",
                    background: language === lang.code ? "var(--primary-soft)" : "var(--surface-2)",
                    color: language === lang.code ? "var(--primary)" : "var(--text)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    flexDirection: "column"
                  }}
                >
                  <span style={{ fontSize: 20 }}>{lang.flag}</span>
                  <span>{t(lang.label)}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
