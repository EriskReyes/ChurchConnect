import { useState } from 'react';

export function AreaChart({ data, height = 160, fmt = v => v, color = "var(--primary)" }) {
  const w = 520, pad = 8;
  const vals = data.map(d => d.v);
  const max = Math.max(...vals) * 1.12, min = Math.min(...vals) * 0.85;
  const x = i => pad + (i * (w - pad * 2)) / (data.length - 1);
  const y = v => height - pad - ((v - min) / (max - min)) * (height - pad * 2 - 18);
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.v)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${height - pad} L${x(0)},${height - pad} Z`;
  const [hov, setHov] = useState(null);
  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${w} ${height}`} width="100%" height={height} preserveAspectRatio="none" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="ac-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#ac-grad)" />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            <rect x={x(i) - (w / data.length) / 2} y="0" width={w / data.length} height={height} fill="transparent" />
            <circle cx={x(i)} cy={y(d.v)} r={hov === i ? 5.5 : 3.5} fill="var(--surface)" stroke={color} strokeWidth="2.5" />
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        {data.map((d, i) => <span key={i} style={{ fontSize: 11.5, color: hov === i ? "var(--text)" : "var(--text-faint)", fontWeight: hov === i ? 700 : 500 }}>{d.m}</span>)}
      </div>
      {hov != null && (
        <div style={{ position: "absolute", top: -6, left: `${(hov / (data.length - 1)) * 100}%`, transform: "translate(-50%,-100%)", background: "var(--text)", color: "var(--surface)", padding: "5px 9px", borderRadius: 8, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", pointerEvents: "none" }}>{fmt(data[hov].v)}</div>
      )}
    </div>
  );
}

export function BarChart({ data, height = 160, fmt = v => v, color = "var(--primary)" }) {
  const max = Math.max(...data.map(d => d.v)) * 1.1;
  const [hov, setHov] = useState(null);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height }}>
        {data.map((d, i) => (
          <div key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", position: "relative" }}>
            {hov === i && <div style={{ position: "absolute", top: -2, transform: "translateY(-100%)", background: "var(--text)", color: "var(--surface)", padding: "4px 8px", borderRadius: 7, fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap" }}>{fmt(d.v)}</div>}
            <div style={{ width: "100%", maxWidth: 44, height: `${(d.v / max) * 100}%`, background: hov === i ? color : "color-mix(in srgb, " + (color.startsWith("var") ? "var(--primary)" : color) + " 55%, var(--surface-3))", borderRadius: "8px 8px 4px 4px", transition: "all .2s ease", minHeight: 6 }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        {data.map((d, i) => <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 11.5, color: "var(--text-faint)", fontWeight: 500 }}>{d.m}</span>)}
      </div>
    </div>
  );
}

export function Donut({ segments, size = 150, thickness = 20, center }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2, c = 2 * Math.PI * r;
  let off = 0;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={thickness} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off} strokeLinecap="round" />;
          off += len; return el;
        })}
      </svg>
      {center && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>{center}</div>}
    </div>
  );
}
