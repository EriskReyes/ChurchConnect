import { useState, useEffect, useRef } from 'react';
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
  const [success, setSuccess] = useState("");
  const [googleFallback, setGoogleFallback] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Member" });
  const reg = mode === "register";
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const googleBtnRef = useRef(null);
  const callbackRef = useRef(null);

  const handleGoogleCallback = async (response) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API + '/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google sign-in failed');
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onEnter(data.user);
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  // Keep callbackRef current so Google's callback always uses latest closure
  callbackRef.current = handleGoogleCallback;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const initAndRender = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res) => callbackRef.current(res),
      });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: googleBtnRef.current.offsetWidth || 368,
          text: 'continue_with',
          logo_alignment: 'left',
        });
        // If Google didn't render anything after 1.5s, show fallback button
        setTimeout(() => {
          if (googleBtnRef.current && !googleBtnRef.current.hasChildNodes()) {
            setGoogleFallback(true);
          }
        }, 1500);
      } else {
        setGoogleFallback(true);
      }
    };

    if (window.google?.accounts) {
      initAndRender();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initAndRender;
      document.head.appendChild(script);
      return () => { if (document.head.contains(script)) document.head.removeChild(script); };
    }
  }, [GOOGLE_CLIENT_ID]);

  const handleAuth = async () => {
    if (!formData.email || !formData.password || (reg && !formData.name)) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const endpoint = reg ? '/api/auth/register' : '/api/auth/login';
      const payload = reg
        ? { name: formData.name, email: formData.email, password: formData.password, role: formData.role }
        : { email: formData.email, password: formData.password };

      const res = await fetch(API + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Authentication failed: ${res.status}`);

      // Register: account pending approval — don't log in
      if (data.pending) {
        setSuccess(data.message || '⏳ Tu cuenta está pendiente de aprobación.');
        setMode('login');
        setFormData({ name: "", email: formData.email, password: "", role: "Member" });
        setLoading(false);
        return;
      }

      if (!data.token) throw new Error("No token received from server");

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setTimeout(() => { onEnter(data.user); }, 100);
    } catch (err) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };


  return (
    <div style={{ height: "100svh", minHeight: "100vh", display: "flex", background: "var(--bg)" }}>
      <div className="brand-side" style={{ display: "flex", flex: 1 }}><Brandside /></div>

      <div style={{ width: 480, maxWidth: "100%", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 56px", background: "var(--surface)" }}>
        <div className="fade-up" style={{ width: "100%" }}>
          <div style={{ display: "inline-flex", background: "var(--surface-3)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ padding: "8px 22px", fontSize: 14, fontWeight: 600, borderRadius: 9, border: "none", background: mode === m ? "var(--surface)" : "transparent", color: mode === m ? "var(--text)" : "var(--text-muted)", boxShadow: mode === m ? "var(--shadow-sm)" : "none", textTransform: "capitalize", transition: "all .15s" }}>{m === "login" ? t('auth.signIn') : t('auth.createAccount')}</button>
            ))}
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 700 }}>{reg ? "Join the community" : "Welcome back"}</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 6, marginBottom: 26 }}>{reg ? "Create your account to get connected." : "Sign in to your ChurchConnect account."}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--error-soft, #fee)', color: 'var(--error, #c00)', fontSize: 13 }}>{error}</div>}
            {success && <div style={{ padding: '10px 14px', borderRadius: 10, background: '#e8f5e9', color: '#2e7d32', fontSize: 13, lineHeight: 1.5 }}>{success}</div>}
            {reg && <Field label={t('auth.name')}><Input placeholder="Your name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></Field>}
            <Field label={t('auth.email')}><Input type="email" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} onKeyDown={e => e.key === 'Enter' && handleAuth()} /></Field>
            <Field label={t('auth.password')}>
              <div style={{ position: "relative" }}>
                <Input type={show ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ paddingRight: 44 }} onKeyDown={e => e.key === 'Enter' && handleAuth()} />
                <button onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", color: "var(--text-faint)", display: "grid", padding: 4 }}><Icon.Eye size={18} /></button>
              </div>
            </Field>
            {reg && <Field label={t('auth.selectRole')}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Member", "Ministry Leader", "Staff", "Visitor"].map(r => (
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

            <Button size="lg" onClick={handleAuth} disabled={loading} style={{ width: "100%", marginTop: 4 }} iconRight={Icon.Arrow}>
              {loading ? (reg ? "Creating..." : "Signing in...") : (reg ? "Create account" : "Sign in")}
            </Button>

            <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span className="faint" style={{ fontSize: 12 }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            <div ref={googleBtnRef} style={{ width: "100%", minHeight: googleFallback ? 0 : 44 }} />
            {googleFallback && (
              <button
                onClick={() => {
                  const redirect = `${window.location.origin}/auth/google`;
                  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect)}&response_type=id_token&scope=openid%20email%20profile&nonce=${Date.now()}`;
                }}
                style={{ width: "100%", padding: "11px 16px", borderRadius: 11, border: "1px solid #dadce0", background: "#fff", color: "#3c4043", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
                Continue with Google
              </button>
            )}
          </div>

          <p className="faint" style={{ fontSize: 12, textAlign: "center", marginTop: 26, lineHeight: 1.6 }}>By continuing you agree to our Community Covenant & Privacy Policy.</p>
        </div>
      </div>

      <style>{`@media (max-width: 860px){ .brand-side{ display:none !important; } }`}</style>
    </div>
  );
}
