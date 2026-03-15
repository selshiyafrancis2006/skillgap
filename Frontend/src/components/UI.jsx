import { useState, useEffect } from "react";

// ── Loader ──────────────────────────────────────────────────────────────────
export function Loader({ text = "Loading..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 16 }}>
      <div style={{
        width: 40, height: 40, border: "2px solid var(--border2)",
        borderTop: "2px solid var(--amber)", borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 3 }}>{text.toUpperCase()}</span>
    </div>
  );
}

// ── Empty State ─────────────────────────────────────────────────────────────
export function Empty({ icon = "◎", title, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px", animation: "fadeIn 0.4s ease" }}>
      <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>{icon}</div>
      <div style={{ fontSize: 14, color: "var(--muted2)", marginBottom: 8 }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--muted)", maxWidth: 340, margin: "0 auto", lineHeight: 1.7 }}>{sub}</div>}
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 32, animation: "fadeUp 0.4s ease" }}>
      {eyebrow && (
        <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 5, marginBottom: 8, fontWeight: 500 }}>
          {eyebrow.toUpperCase()}
        </div>
      )}
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, letterSpacing: 0.5,
        lineHeight: 1.2, color: "var(--text)", marginBottom: 8
      }}>{title}</h2>
      {sub && <p style={{ fontSize: 12, color: "var(--muted2)", lineHeight: 1.8, maxWidth: 500 }}>{sub}</p>}
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, color = "var(--amber)", icon, delay = 0 }) {
  return (
    <div style={{
      background: "var(--bg2)", border: "1px solid var(--border)",
      borderTop: `2px solid ${color}`, borderRadius: 4, padding: "20px 18px",
      animation: `fadeUp 0.5s ease ${delay}s both`
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 3 }}>{label.toUpperCase()}</span>
        {icon && <span style={{ fontSize: 16, opacity: 0.5 }}>{icon}</span>}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color, letterSpacing: 0, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

// ── Skill Bar ────────────────────────────────────────────────────────────────
export function SkillBar({ name, current, required = 100, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const pct = Math.round((current / required) * 100);
  const color = pct >= 75 ? "var(--green)" : pct >= 45 ? "var(--amber)" : "var(--red)";

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay * 1000 + 100);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: "var(--muted2)" }}>{name}</span>
        <span style={{ fontSize: 11, color, fontWeight: 500 }}>{pct}%</span>
      </div>
      <div style={{ height: 3, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${width}%`, background: color,
          transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
          borderRadius: 2, boxShadow: `0 0 6px ${color}88`
        }} />
      </div>
    </div>
  );
}

// ── Tag ──────────────────────────────────────────────────────────────────────
export function Tag({ children, color = "var(--border2)", textColor = "var(--muted2)", dot }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: `${color}22`, border: `1px solid ${color}55`,
      borderRadius: 3, padding: "3px 10px", fontSize: 11, color: textColor,
      whiteSpace: "nowrap"
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: textColor, flexShrink: 0 }} />}
      {children}
    </span>
  );
}

// ── Primary Button ───────────────────────────────────────────────────────────
export function Btn({ children, onClick, disabled, variant = "primary", small }) {
  const styles = {
    primary: { bg: "var(--amber)", color: "#07080f", border: "var(--amber)" },
    ghost: { bg: "transparent", color: "var(--amber)", border: "var(--amber)" },
    danger: { bg: "transparent", color: "var(--red)", border: "var(--red)" },
    subtle: { bg: "var(--bg3)", color: "var(--muted2)", border: "var(--border2)" },
  }[variant];

  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: styles.bg, color: styles.color, border: `1px solid ${styles.border}`,
      padding: small ? "7px 16px" : "10px 22px",
      fontSize: small ? 11 : 12, letterSpacing: 2, fontWeight: 500,
      borderRadius: 3, transition: "all .2s", opacity: disabled ? 0.4 : 1,
      cursor: disabled ? "not-allowed" : "pointer"
    }}>
      {children}
    </button>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style = {}, accent }) {
  return (
    <div style={{
      background: "var(--bg2)", border: "1px solid var(--border)",
      borderLeft: accent ? `3px solid ${accent}` : "1px solid var(--border)",
      borderRadius: 4, padding: 24, ...style
    }}>
      {children}
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
export function Input({ value, onChange, placeholder, type = "text", style = {} }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        background: "var(--bg3)", border: "1px solid var(--border2)",
        borderRadius: 3, padding: "10px 14px", color: "var(--text)",
        fontSize: 12, outline: "none", width: "100%",
        transition: "border-color .2s", ...style
      }}
      onFocus={e => e.target.style.borderColor = "var(--amber)"}
      onBlur={e => e.target.style.borderColor = "var(--border2)"}
    />
  );
}

// ── Badge Score ──────────────────────────────────────────────────────────────
export function ScoreBadge({ score, size = 80 }) {
  const color = score >= 70 ? "var(--green)" : score >= 40 ? "var(--amber)" : "var(--red)";
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const [dash, setDash] = useState(0);
  useEffect(() => { setTimeout(() => setDash((score / 100) * circ), 150); }, [score, circ]);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={4} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          strokeDashoffset={0} transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: size * 0.22, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 8, color: "var(--muted)", letterSpacing: 1 }}>SCORE</span>
      </div>
    </div>
  );
}

// ── Radar Chart ──────────────────────────────────────────────────────────────
export function RadarChart({ skills, size = 300 }) {
  if (!skills?.length) return null;
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = skills.length;
  const angle = (i) => (i / n) * 2 * Math.PI - Math.PI / 2;
  const pt = (i, level) => [
    cx + (level / 100) * r * Math.cos(angle(i)),
    cy + (level / 100) * r * Math.sin(angle(i))
  ];

  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {[25, 50, 75, 100].map(l => (
        <polygon key={l}
          points={skills.map((_, i) => pt(i, l).join(",")).join(" ")}
          fill="none" stroke="var(--border2)" strokeWidth={0.5} />
      ))}
      {skills.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth={0.5} />;
      })}
      <polygon
        points={skills.map((s, i) => pt(i, s.currentLevel ?? s.value ?? 50).join(",")).join(" ")}
        fill="rgba(245,166,35,0.12)" stroke="var(--amber)" strokeWidth={1.5}
      />
      {skills.map((s, i) => {
        const [x, y] = pt(i, s.currentLevel ?? s.value ?? 50);
        return <circle key={i} cx={x} cy={y} r={3} fill="var(--amber)" />;
      })}
      {skills.map((s, i) => {
        const [lx, ly] = pt(i, 118);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fill="var(--muted2)" fontSize={10} fontFamily="var(--font-mono)">{s.name}</text>
        );
      })}
    </svg>
  );
}