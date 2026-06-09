import { useState, useEffect } from 'react';
import { Icon } from './icons';
import { Button, Input, Field } from './ui';
import { useTranslation } from '../hooks/useTranslation';

function Brandside() {
  return (
    <div style={{
      flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
      justifyContent: "space-between", padding: "48px 52px", color: "#fff",
      background: "linear-gradient(150deg, var(--primary), color-mix(in srgb, var(--primary) 55%, var(--accent)))",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(700px 500px at 80% -10%, rgba(255,255,255,.22), transparent 60%), radial-gradient(600px 600px at -10% 100%, rgba(255,255,255,.12), transparent 60%)" }} />
      <div style={{ position: "absolute", right: -60, bottom: -60, opacity: .12, transform: "rotate(-8deg)" }}><Icon.Cross size={360} sw={1} /></div>

      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 13 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,.18)", display: "grid", placeItems: "center", backdropFilter: "blur(6px)" }}><Icon.Cross size={24} sw={2} /></div>
        <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 21 }}>ChurchConnect</div>
      </div>

      <div style={{ position: "relative", maxWidth: 420 }}>
        <div style={{ fontSize: 13, fontWeight: 600, opacity: .8, letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 18 }}>Grace Community Church</div>
        <h1 style={{ fontFamily: "var(--font-head)", fontSize: 40, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.02em" }}>One church family, beautifully connected.</h1>
        <p style={{ fontSize: 16, opacity: .9, marginTop: 18, lineHeight: 1.6 }}>Manage events, members, giving, and ministries — all in one calm, organized place built for your community.</p>
      </div>

      <div style={{ position: "relative", display: "flex", gap: 28 }}>
        {[["1,240", "Members"], ["6", "Ministries"], ["$184k", "Given YTD"]].map(([v, l]) => (
          <div key={l}>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 700 }}>{v}</div>
            <div style={{ fontSize: 12.5, opacity: .8 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuthScreen({ onEnter }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState("login");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showChurchLogin, setShowChurchLogin] = useState(false);
  const [churchFormData, setChurchFormData] = useState({ email: "", code: "" });
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Member" });
  const reg = mode === "register";
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Cargar script de Apple Sign In
    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jslib/appleid.auth.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleAuth = async () => {
    if (!formData.email || !formData.password || (reg && !formData.name)) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const endpoint = reg ? '/api/auth/register' : '/api/auth/login';
      const payload = reg
        ? { name: formData.name, email: formData.email, password: formData.password, role: formData.role }
        : { email: formData.email, password: formData.password };

      console.log("Attempting auth at:", API + endpoint, "payload:", payload);

      const res = await fetch(API + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("Auth response:", res.status, data);

      if (!res.ok) {
        throw new Error(data.message || `Authentication failed: ${res.status}`);
      }

      if (!data.token) {
        throw new Error("No token received from server");
      }

      console.log("Saving token to localStorage:", data.token.substring(0, 50));
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log("Token saved, calling onEnter");
      onEnter(data.user);
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ height: "100vh", display: "flex", background: "var(--bg)" }}>
      <div className="brand-side" style={{ display: "flex", flex: 1 }}><Brandside /></div>

      <div style={{ width: 480, maxWidth: "100%", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 56px", background: "var(--surface)" }}>
        <div className="fade-up" style={{ width: "100%" }}>
          <div style={{ display: "inline-flex", background: "var(--surface-3)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ padding: "8px 22px", fontSize: 14, fontWeight: 600, borderRadius: 9, border: "none", background: mode === m ? "var(--surface)" : "transparent", color: mode === m ? "var(--text)" : "var(--text-muted)", boxShadow: mode === m ? "var(--shadow-sm)" : "none", textTransform: "capitalize", transition: "all .15s" }}>{m === "login" ? t('auth.signIn') : t('auth.createAccount')}</button>
            ))}
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 700 }}>{reg ? "Join the community" : "Welcome back"}</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 6, marginBottom: 26 }}>{reg ? "Create your account to get connected." : `Sign in to your ChurchConnect account.`}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--error-soft, #fee)', color: 'var(--error, #c00)', fontSize: 13 }}>{error}</div>}
            {reg && <Field label={t('auth.name')}><Input placeholder="Your name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></Field>}
            <Field label={t('auth.email')}><Input type="email" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></Field>
            <Field label={t('auth.password')}>
              <div style={{ position: "relative" }}>
                <Input type={show ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ paddingRight: 44 }} />
                <button onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", color: "var(--text-faint)", display: "grid", padding: 4 }}><Icon.Eye size={18} /></button>
              </div>
            </Field>
            {reg && <Field label={t('auth.selectRole')}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Member", "Ministry Leader", "Staff", "Visitor"].map((r, i) => (
                  <label key={r} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 10, border: "1px solid var(--border-strong)", fontSize: 13, fontWeight: 500, cursor: "pointer", background: formData.role === r ? "var(--primary-soft)" : "var(--surface-2)", color: formData.role === r ? "var(--on-primary-soft)" : "var(--text)" }}>
                    <input type="radio" name="role" checked={formData.role === r} onChange={() => setFormData({...formData, role: r})} style={{ accentColor: "var(--primary)" }} />{r}
                  </label>
                ))}
              </div>
            </Field>}

            {!reg && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}><input type="checkbox" defaultChecked style={{ accentColor: "var(--primary)" }} />Remember me</label>
              <a style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)", cursor: "pointer" }}>Forgot password?</a>
            </div>}

            <Button size="lg" onClick={handleAuth} disabled={loading} style={{ width: "100%", marginTop: 4 }} iconRight={Icon.Arrow}>{loading ? (reg ? "Creating..." : "Signing in...") : (reg ? "Create account" : "Sign in")}</Button>

            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} /><span className="faint" style={{ fontSize: 12 }}>or continue with</span><div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            {!showChurchLogin ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button key="google" onClick={() => {
                  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}&redirect_uri=${window.location.origin}/auth/google&response_type=id_token&scope=openid email profile&nonce=${Date.now()}`;
                }} style={{ flex: 1, padding: "11px", borderRadius: 11, border: "1px solid var(--border-strong)", background: "var(--surface-2)", fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>Google</button>

                <button key="apple" onClick={async () => {
                  if (!window.AppleID) {
                    setError("Apple Sign In SDK not loaded. Please try again.");
                    return;
                  }
                  try {
                    setLoading(true);
                    const response = await window.AppleID.auth.signIn();
                    const { identityToken, user } = response.authorization;

                    const res = await fetch(API + '/api/auth/apple', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        identityToken,
                        user: {
                          name: user?.name,
                          email: user?.email
                        }
                      })
                    });

                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || 'Apple login failed');

                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    onEnter(data.user);
                  } catch (err) {
                    setError(err.message || "Apple Sign In failed");
                  } finally {
                    setLoading(false);
                  }
                }} style={{ flex: 1, padding: "11px", borderRadius: 11, border: "1px solid var(--border-strong)", background: "var(--surface-2)", fontSize: 13.5, fontWeight: 600, color: "var(--text)" }} disabled={loading}>Apple</button>

                <button key="church" onClick={() => setShowChurchLogin(true)} style={{ flex: 1, padding: "11px", borderRadius: 11, border: "1px solid var(--border-strong)", background: "var(--surface-2)", fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>Church ID</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Field label="Email"><Input type="email" placeholder="you@church.org" value={churchFormData.email} onChange={e => setChurchFormData({...churchFormData, email: e.target.value})} /></Field>
                <Field label="Invite Code"><Input placeholder="ABC123" value={churchFormData.code} onChange={e => setChurchFormData({...churchFormData, code: e.target.value.toUpperCase()})} maxLength="6" /></Field>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="outline" onClick={() => { setShowChurchLogin(false); setChurchFormData({ email: "", code: "" }); }} style={{ flex: 1 }}>Back</Button>
                  <Button onClick={async () => {
                    if (!churchFormData.email || !churchFormData.code) {
                      setError("Please fill in all fields");
                      return;
                    }
                    setLoading(true);
                    setError("");
                    try {
                      const res = await fetch(API + '/api/auth/church-login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(churchFormData)
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Church login failed');
                      localStorage.setItem('authToken', data.token);
                      localStorage.setItem('user', JSON.stringify(data.user));
                      onEnter(data.user);
                    } catch (err) {
                      setError(err.message || "Church login failed");
                    } finally {
                      setLoading(false);
                    }
                  }} style={{ flex: 1 }} disabled={loading}>{loading ? "Verifying..." : "Verify Code"}</Button>
                </div>
              </div>
            )}
          </div>

          <p className="faint" style={{ fontSize: 12, textAlign: "center", marginTop: 26, lineHeight: 1.6 }}>By continuing you agree to our Community Covenant & Privacy Policy.</p>
        </div>
      </div>

      <style>{`@media (max-width: 860px){ .brand-side{ display:none !important; } }`}</style>
    </div>
  );
}
