const NAV = [
  { id: "resume",    icon: "▲", label: "Resume Intelligence" },
  { id: "benchmark", icon: "◈", label: "Industry Benchmark" },
  { id: "skills",    icon: "◎", label: "Skill Graph" },
  { id: "progress",  icon: "◐", label: "Progress Dashboard" },
  { id: "interview", icon: "◆", label: "Mock Interview" },
  { id: "forge",     icon: "⬡", label: "CompanyForge" },
];

export default function Sidebar({ active, setActive, resumeId }) {
  return (
    <aside style={{
      width: 240, minHeight: "100vh", background: "var(--bg2)",
      borderRight: "1px solid var(--border)", display: "flex",
      flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh"
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 9, color: "var(--amber)", letterSpacing: 5, marginBottom: 4 }}>SKILLGAP</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, letterSpacing: 1, color: "var(--text)", lineHeight: 1 }}>
          CAREER<span style={{ color: "var(--amber)" }}>AI</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0" }}>
        {NAV.map((item, i) => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "13px 24px", background: isActive ? "var(--bg3)" : "transparent",
              border: "none", borderLeft: `2px solid ${isActive ? "var(--amber)" : "transparent"}`,
              color: isActive ? "var(--text)" : "var(--muted)",
              fontSize: 11, letterSpacing: 1, textAlign: "left",
              transition: "all .15s", animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
              cursor: "pointer"
            }}>
              <span style={{
                fontSize: 13, width: 18, textAlign: "center",
                color: isActive ? "var(--amber)" : "var(--muted)"
              }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Status */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: resumeId ? "var(--green)" : "var(--muted)",
            boxShadow: resumeId ? "0 0 8px var(--green)" : "none",
            animation: resumeId ? "pulse 2s infinite" : "none"
          }} />
          <span style={{ fontSize: 10, color: resumeId ? "var(--green)" : "var(--muted)", letterSpacing: 2 }}>
            {resumeId ? "RESUME ACTIVE" : "NO RESUME"}
          </span>
        </div>
        {resumeId && (
          <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 4, fontStyle: "italic" }}>
            ID: …{resumeId.slice(-8)}
          </div>
        )}
      </div>
    </aside>
  );
}