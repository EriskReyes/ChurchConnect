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
              <Avatar name="James Whitfield" size={76} ring src={profileImage} />
              <div>
                <Button variant="outline" icon={Icon.Image} onClick={() => fileInputRef.current?.click()}>Change photo</Button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handlePhotoUpload} style={{ display: "none" }} />
                <div className="faint" style={{ fontSize: 12, marginTop: 8 }}>JPG or PNG, max 4 MB</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="First name"><Input defaultValue="James" /></Field>
              <Field label="Last name"><Input defaultValue="Whitfield" /></Field>
              <Field label="Email"><Input defaultValue="pastor.james@example.com" /></Field>
              <Field label="Phone"><Input defaultValue="(503) 555-0100" /></Field>
              <div style={{ gridColumn: "1 / -1" }}><Field label="Bio"><Textarea defaultValue="Lead Pastor at Grace Community Church. Husband, father, and lifelong learner." /></Field></div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}><Button variant="outline">Cancel</Button><Button icon={Icon.Check}>Save changes</Button></div>
          </Card>
        </div>
      )}

      {tab === "church" && (
        <div className="fade-up">
          <Card>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Church details</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 22 }}>Information about your congregation.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Church name"><Input defaultValue="Grace Community Church" /></Field>
              <Field label="Founded"><Input type="number" defaultValue="2010" /></Field>
              <Field label="Address"><Input defaultValue="123 Main St, Portland, OR 97201" /></Field>
              <Field label="City"><Input defaultValue="Portland" /></Field>
              <div style={{ gridColumn: "1 / -1" }}><Field label="Description"><Textarea defaultValue="A welcoming community dedicated to grace, growth, and generosity." /></Field></div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}><Button variant="outline">Cancel</Button><Button icon={Icon.Check}>Save changes</Button></div>
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
