import { useState } from "react";
import { api } from "../utils/api";
import { SectionHeader, SkillBar, Tag, Btn, Card, StatCard, Empty } from "../components/UI";

const ROLES = [
  "Full Stack Developer","Frontend Developer","Backend Developer",
  "Data Scientist","AI Engineer","DevOps Engineer",
  "Mobile Developer","Cloud Engineer","Cybersecurity Engineer"
];

export default function IndustryBenchmark({ resumeId }) {
  const [role, setRole] = useState("Full Stack Developer");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    if (!resumeId) return alert("Upload a resume first.");
    setLoading(true);
    try { setData(await api.getBenchmark(resumeId, role)); }
    catch { alert("Failed to fetch benchmark."); }
    setLoading(false);
  };

  if (!resumeId) return (
    <div>
      <SectionHeader eyebrow="Feature 02" title="INDUSTRY BENCHMARK" />
      <Empty icon="◈" title="No resume loaded" sub="Upload your resume in Resume Intelligence to unlock benchmark comparisons." />
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionHeader eyebrow="Feature 02" title="INDUSTRY BENCHMARK" sub="Compare your skill profile against real industry expectations for your target role." />

      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 16 }}>SELECT TARGET ROLE</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          {ROLES.map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              padding: "7px 14px", fontSize: 11, letterSpacing: 1, borderRadius: 3,
              border: `1px solid ${role === r ? "var(--amber)" : "var(--border2)"}`,
              background: role === r ? "rgba(245,166,35,0.12)" : "var(--bg3)",
              color: role === r ? "var(--amber)" : "var(--muted2)",
              cursor: "pointer", transition: "all .15s"
            }}>{r}</button>
          ))}
        </div>
        <Btn onClick={fetch} disabled={loading}>{loading ? "ANALYZING…" : "RUN BENCHMARK"}</Btn>
      </Card>

      {data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Overview stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            <StatCard label="Gap Score" value={`${data.gapScore ?? 0}%`} icon="◎" delay={0} />
            <StatCard label="Matched Skills" value={data.matchedSkills?.length ?? 0} color="var(--green)" icon="✓" delay={0.05} />
            <StatCard label="Missing Skills" value={data.missingSkills?.length ?? 0} color="var(--red)" icon="✗" delay={0.1} />
          </div>

          {/* Visual comparison */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Card>
              <div style={{ fontSize: 10, color: "var(--green)", letterSpacing: 4, marginBottom: 16 }}>YOU HAVE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.matchedSkills?.map((s, i) => (
                  <div key={s} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    animation: `fadeUp 0.3s ease ${i * 0.05}s both`
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green)" }} />
                    <span style={{ fontSize: 12, color: "var(--text)" }}>{s}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div style={{ fontSize: 10, color: "var(--red)", letterSpacing: 4, marginBottom: 16 }}>YOU NEED</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.missingSkills?.map((s, i) => (
                  <div key={s} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    animation: `fadeUp 0.3s ease ${i * 0.05}s both`
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)" }} />
                    <span style={{ fontSize: 12, color: "var(--muted2)" }}>{s}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Gap progress bar */}
          <Card>
            <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 20 }}>INDUSTRY ALIGNMENT</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "var(--muted2)" }}>Your profile vs {role}</span>
                <span style={{ fontSize: 14, color: "var(--amber)", fontFamily: "var(--font-display)", fontWeight: 700 }}>{data.gapScore ?? 0}%</span>
              </div>
              <div style={{ height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${data.gapScore ?? 0}%`, borderRadius: 4,
                  background: `linear-gradient(90deg, var(--red), var(--amber) 50%, var(--green))`,
                  transition: "width 1.5s cubic-bezier(.4,0,.2,1)",
                  boxShadow: "0 0 10px var(--amber)"
                }} />
              </div>
            </div>

            {data.industrySkills?.map((s, i) => (
              <SkillBar key={s}
                name={s}
                current={data.matchedSkills?.includes(s) ? 75 : 20}
                required={100}
                delay={i * 0.06}
              />
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}