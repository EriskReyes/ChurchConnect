import { useState, useRef, useEffect } from 'react';
import { Icon } from './icons';

export function Button({ variant = "primary", size = "md", icon: Ic, iconRight: IR, children, style, ...p }) {
  const sizes = {
    sm: { padding: "7px 13px", fontSize: 13, gap: 6, radius: 9 },
    md: { padding: "10px 17px", fontSize: 14, gap: 8, radius: 11 },
    lg: { padding: "13px 22px", fontSize: 15, gap: 9, radius: 13 },
  }[size];
  const variants = {
    primary: { background: "var(--primary)", color: "var(--primary-ink)", border: "1px solid transparent", boxShadow: "var(--shadow-sm)" },
    soft: { background: "var(--primary-soft)", color: "var(--on-primary-soft)", border: "1px solid var(--primary-border)" },
    ghost: { background: "transparent", color: "var(--text-muted)", border: "1px solid transparent" },
    outline: { background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border-strong)" },
    danger: { background: "var(--danger-soft)", color: "var(--danger)", border: "1px solid transparent" },
  }[variant];
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: sizes.gap, fontWeight: 600, fontFamily: "var(--font-body)",
        padding: sizes.padding, fontSize: sizes.fontSize, borderRadius: sizes.radius,
        transition: "all .16s ease", whiteSpace: "nowrap",
        transform: h ? "translateY(-1px)" : "none",
        filter: h ? "brightness(1.04)" : "none",
        ...variants, ...style,
      }} {...p}>
      {Ic && <Ic size={sizes.fontSize + 3} />}{children}{IR && <IR size={sizes.fontSize + 2} />}
    </button>
  );
}

export function IconButton({ icon: Ic, active, badge, size = 18, title, ...p }) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        position: "relative", display: "grid", placeItems: "center", width: 38, height: 38,
        borderRadius: 11, border: "1px solid transparent",
        background: active ? "var(--primary-soft)" : h ? "var(--surface-3)" : "transparent",
        color: active ? "var(--on-primary-soft)" : "var(--text-muted)", transition: "all .15s ease",
      }} {...p}>
      <Ic size={size} />
      {badge ? <span style={{ position: "absolute", top: 7, right: 7, minWidth: 7, height: 7, borderRadius: 9, background: "var(--danger)", border: "2px solid var(--surface)" }} /> : null}
    </button>
  );
}

export function Card({ children, style, pad = true, hover, onClick, className = "", ...p }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className={className}
      style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)", boxShadow: hover && h ? "var(--shadow-md)" : "var(--shadow-sm)",
        padding: pad ? "var(--pad-card)" : 0, transition: "box-shadow .2s ease, transform .2s ease, border-color .2s",
        transform: hover && h ? "translateY(-2px)" : "none", cursor: onClick ? "pointer" : "default",
        borderColor: hover && h ? "var(--border-strong)" : "var(--border)", ...style,
      }} {...p}>{children}</div>
  );
}

export function Badge({ tone = "neutral", children, dot, style }) {
  const tones = {
    neutral: { bg: "var(--surface-3)", fg: "var(--text-muted)" },
    primary: { bg: "var(--primary-soft)", fg: "var(--on-primary-soft)" },
    sage: { bg: "var(--accent-soft)", fg: "var(--accent)" },
    warn: { bg: "var(--warn-soft)", fg: "var(--warn)" },
    danger: { bg: "var(--danger-soft)", fg: "var(--danger)" },
  }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
      borderRadius: "var(--r-pill)", background: tones.bg, color: tones.fg,
      fontSize: 12, fontWeight: 600, lineHeight: 1.4, whiteSpace: "nowrap", ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 9, background: "currentColor" }} />}
      {children}
    </span>
  );
}

const AV_COLORS = ["#3B5BA5", "#6E9B7E", "#B5742E", "#7A4E9E", "#1F4E5F", "#C25B62", "#4A7C59", "#2A6FA8"];
export function Avatar({ name = "?", size = 38, src, ring }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const c = AV_COLORS[(name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0)) % AV_COLORS.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      display: "grid", placeItems: "center", color: "#fff", fontWeight: 700,
      fontSize: size * 0.38, fontFamily: "var(--font-head)",
      background: src ? `center/cover url(${src})` : `linear-gradient(135deg, ${c}, ${c}cc)`,
      boxShadow: ring ? `0 0 0 3px var(--surface), 0 0 0 4px ${c}55` : "none",
    }}>{!src && initials}</div>
  );
}

export function Stat({ icon: Ic, label, value, delta, deltaTone = "sage", tint = "primary", style }) {
  const tints = {
    primary: { bg: "var(--primary-soft)", fg: "var(--primary)" },
    sage: { bg: "var(--accent-soft)", fg: "var(--accent)" },
    warn: { bg: "var(--warn-soft)", fg: "var(--warn)" },
    danger: { bg: "var(--danger-soft)", fg: "var(--danger)" },
  }[tint];
  return (
    <Card hover style={style}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: tints.bg, color: tints.fg, display: "grid", placeItems: "center" }}>
          <Ic size={22} />
        </div>
        {delta && <Badge tone={deltaTone}>{delta}</Badge>}
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "var(--font-head)", marginTop: 16, letterSpacing: "-0.02em" }}>{value}</div>
      <div className="muted" style={{ fontSize: 13.5, marginTop: 2 }}>{label}</div>
    </Card>
  );
}

export function SearchInput({ placeholder = "Search…", value, onChange, style }) {
  return (
    <div style={{ position: "relative", ...style }}>
      <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", display: "grid" }}><Icon.Search size={17} /></span>
      <input value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 14px 10px 38px", borderRadius: 11,
          border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text)",
          fontSize: 14, outline: "none",
        }}
        onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px var(--ring)"; }}
        onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }} />
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label style={{ display: "block" }}>
      {label && <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 7, color: "var(--text)" }}>{label}</div>}
      {children}
      {hint && <div className="faint" style={{ fontSize: 12, marginTop: 5 }}>{hint}</div>}
    </label>
  );
}
const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 11, border: "1px solid var(--border-strong)",
  background: "var(--surface-2)", color: "var(--text)", fontSize: 14, outline: "none", transition: "border-color .15s, box-shadow .15s",
};
export function Input(p) {
  return <input {...p} style={{ ...inputStyle, ...p.style }}
    onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px var(--ring)"; p.onFocus?.(e); }}
    onBlur={e => { e.target.style.borderColor = "var(--border-strong)"; e.target.style.boxShadow = "none"; p.onBlur?.(e); }} />;
}
export function Textarea(p) {
  return <textarea {...p} style={{ ...inputStyle, resize: "vertical", minHeight: 90, lineHeight: 1.5, ...p.style }}
    onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px var(--ring)"; }}
    onBlur={e => { e.target.style.borderColor = "var(--border-strong)"; e.target.style.boxShadow = "none"; }} />;
}
export function Select({ options = [], ...p }) {
  return (
    <div style={{ position: "relative" }}>
      <select {...p} style={{ ...inputStyle, appearance: "none", paddingRight: 36, cursor: "pointer", ...p.style }}>
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
      <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)", display: "grid" }}><Icon.ChevronDown size={16} /></span>
    </div>
  );
}

export function Segmented({ options, value, onChange, size = "md" }) {
  const pad = size === "sm" ? "6px 12px" : "8px 15px";
  const fs = size === "sm" ? 12.5 : 13.5;
  return (
    <div style={{ display: "inline-flex", background: "var(--surface-3)", borderRadius: 12, padding: 4, gap: 2, border: "1px solid var(--border)" }}>
      {options.map(o => {
        const v = o.value ?? o, lbl = o.label ?? o, on = v === value;
        return (
          <button key={v} onClick={() => onChange(v)}
            style={{
              padding: pad, fontSize: fs, fontWeight: 600, borderRadius: 9, border: "none",
              background: on ? "var(--surface)" : "transparent",
              color: on ? "var(--text)" : "var(--text-muted)",
              boxShadow: on ? "var(--shadow-sm)" : "none", transition: "all .15s ease",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>{o.icon ? <o.icon size={15} /> : null}{lbl}</button>
        );
      })}
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)" }}>
      {tabs.map(t => {
        const v = t.value ?? t, lbl = t.label ?? t, on = v === value;
        return (
          <button key={v} onClick={() => onChange(v)}
            style={{
              padding: "11px 16px", fontSize: 14, fontWeight: 600, border: "none", background: "none",
              color: on ? "var(--primary)" : "var(--text-muted)", position: "relative", marginBottom: -1,
            }}>{lbl}
            {t.count != null && <span style={{ marginLeft: 7, fontSize: 11.5, padding: "2px 7px", borderRadius: 9, background: on ? "var(--primary-soft)" : "var(--surface-3)", color: on ? "var(--on-primary-soft)" : "var(--text-faint)", fontWeight: 700 }}>{t.count}</span>}
            <span style={{ position: "absolute", left: 12, right: 12, bottom: 0, height: 2.5, borderRadius: 3, background: on ? "var(--primary)" : "transparent" }} />
          </button>
        );
      })}
    </div>
  );
}

export function Progress({ value, tone = "primary", height = 8 }) {
  const c = { primary: "var(--primary)", sage: "var(--accent)", warn: "var(--warn)" }[tone];
  return (
    <div style={{ height, background: "var(--surface-3)", borderRadius: 999, overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, value)}%`, height: "100%", background: c, borderRadius: 999, transition: "width .6s cubic-bezier(.16,.84,.44,1)" }} />
    </div>
  );
}

export function Modal({ open, onClose, title, children, width = 540, footer }) {
  useEffect(() => {
    const h = e => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100, background: "rgba(13,20,33,.45)",
      backdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 24, animation: "fadeIn .2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: width, maxHeight: "88vh", background: "var(--surface)",
        borderRadius: "var(--r-xl)", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)",
        display: "flex", flexDirection: "column", animation: "scaleIn .24s cubic-bezier(.16,.84,.44,1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 19, fontWeight: 700 }}>{title}</h3>
          <IconButton icon={Icon.Plus} onClick={onClose} title="Close" style={{ transform: "rotate(45deg)" }} />
        </div>
        <div className="scroll-y" style={{ padding: 24, flex: 1 }}>{children}</div>
        {footer && <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: "1px solid var(--border)" }}>{footer}</div>}
      </div>
    </div>
  );
}

export function SectionHead({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>{title}</h2>
        {subtitle && <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Menu({ trigger, items, align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", [align]: 0, zIndex: 50, minWidth: 180,
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
          boxShadow: "var(--shadow-lg)", padding: 6, animation: "scaleIn .15s ease",
        }}>
          {items.map((it, i) => it.divider ? <div key={i} style={{ height: 1, background: "var(--border)", margin: "6px 4px" }} /> : (
            <button key={i} onClick={() => { it.onClick?.(); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 11px",
                border: "none", background: "transparent", borderRadius: 9, fontSize: 13.5, fontWeight: 500,
                color: it.danger ? "var(--danger)" : "var(--text)", textAlign: "left",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-3)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {it.icon && <it.icon size={16} />}{it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
