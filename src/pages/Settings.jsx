import { useState, useContext, useRef } from 'react';
import { Icon } from '../components/icons';
import { Card, Button, Avatar, Field, Input, Textarea } from '../components/ui';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageContext } from '../contexts/LanguageContext';

export default function Settings({ role }) {
  const [tab, setTab] = useState("profile");
  const { t } = useTranslation();
  const { language, setLanguage } = useContext(LanguageContext);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingChurch, setEditingChurch] = useState(false);
  const [profileData, setProfileData] = useState({ firstName: "James", lastName: "Whitfield", email: "pastor.james@example.com", phone: "(503) 555-0100", bio: "Lead Pastor at Grace Community Church. Husband, father, and lifelong learner." });
  const [churchData, setChurchData] = useState({ name: "Grace Community Church", founded: "2010", address: "123 Main St, Portland, OR 97201", city: "Portland", description: "A welcoming community dedicated to grace, growth, and generosity." });
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

  const tabs = ["profile", "church", "preferences", "languages"];
  const tabLabels = {
    profile: "Profile",
    church: "Church",
    preferences: "Preferences",
    languages: t('settings.languages'),
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 }}>
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
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Bio</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", lineHeight: 1.5 }}>{profileData.bio}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}><Button icon={Icon.Pencil} onClick={() => { setTempProfileData(profileData); setEditingProfile(true); }}>Edit profile</Button></div>
              </>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="First name"><Input value={tempProfileData.firstName} onChange={e => setTempProfileData({ ...tempProfileData, firstName: e.target.value })} /></Field>
                  <Field label="Last name"><Input value={tempProfileData.lastName} onChange={e => setTempProfileData({ ...tempProfileData, lastName: e.target.value })} /></Field>
                  <Field label="Email"><Input value={tempProfileData.email} onChange={e => setTempProfileData({ ...tempProfileData, email: e.target.value })} /></Field>
                  <Field label="Phone"><Input value={tempProfileData.phone} onChange={e => setTempProfileData({ ...tempProfileData, phone: e.target.value })} /></Field>
                  <div style={{ gridColumn: "1 / -1" }}><Field label="Bio"><Textarea value={tempProfileData.bio} onChange={e => setTempProfileData({ ...tempProfileData, bio: e.target.value })} /></Field></div>
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 }}>
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
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Description</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", lineHeight: 1.5 }}>{churchData.description}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}><Button icon={Icon.Pencil} onClick={() => { setTempChurchData(churchData); setEditingChurch(true); }}>Edit details</Button></div>
              </>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Church name"><Input value={tempChurchData.name} onChange={e => setTempChurchData({ ...tempChurchData, name: e.target.value })} /></Field>
                  <Field label="Founded"><Input type="number" value={tempChurchData.founded} onChange={e => setTempChurchData({ ...tempChurchData, founded: e.target.value })} /></Field>
                  <Field label="Address"><Input value={tempChurchData.address} onChange={e => setTempChurchData({ ...tempChurchData, address: e.target.value })} /></Field>
                  <Field label="City"><Input value={tempChurchData.city} onChange={e => setTempChurchData({ ...tempChurchData, city: e.target.value })} /></Field>
                  <div style={{ gridColumn: "1 / -1" }}><Field label="Description"><Textarea value={tempChurchData.description} onChange={e => setTempChurchData({ ...tempChurchData, description: e.target.value })} /></Field></div>
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
