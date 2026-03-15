import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { SectionHeader, SkillBar, Card, Btn, Input, Empty, Loader, ScoreBadge } from "../components/UI";

function MiniLineChart({ scores }) {
  if (!scores?.length) return null;
  const w = 300, h = 80, pad = 12;
  const vals = scores.map(s => s.score);
  const max = Math.max(...vals, 100);
  const min = 0;
  const xs = vals.map((_, i) => pad + (i / Math.max(vals.length - 1, 1)) * (w - pad * 2));
  const ys = vals.map(v => h - pad - ((v - min) / (max - min)) * (h - pad * 2));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const area = `${path} L${xs[xs.length-1]},${h} L${xs[0]},${h} Z`;

  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--amber)" stopOpacity={0.3} />
          <stop offset="100%" stopColor="var(--amber)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lineGrad)" />
      <path d={path} fill="none" stroke="var(--amber)" strokeWidth={1.5} />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={3} fill="var(--amber)" />
      ))}
    </svg>
  );
}

export default function ProgressDashboard({ resumeId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("70");

  const load = async () => {
    if (!resumeId) return;
    setLoading(true);
    try { setData(await api.getProgress(resumeId)); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const update = async () => {
    if (!skill.trim()) return;
    await api.updateSkillProgress(resumeId, skill.trim(), Number(level));
    setSkill(""); setLevel("70");
    load();
  };

  useEffect(() => { load(); }, [resumeId]);

  if (!resumeId) return (
    <div>
      <SectionHeader eyebrow="Feature 04" title="PROGRESS DASHBOARD" />
      <Empty icon="◐" title="No resume loaded" sub="Upload your resume to start tracking your learning progress." />
    </div>
  );

  if (loading) return <><SectionHeader eyebrow="Feature 04" title="PROGRESS DASHBOARD" /><Loader text="Loading progress" /></>;

  const readiness = data?.readinessScore ?? 0;
  const progress = data?.progress;
  const weeks = progress?.completedRoadmapWeeks ?? [];
  const scores = progress?.interviewScores ?? [];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionHeader eyebrow="Feature 04" title="PROGRESS DASHBOARD" sub="Track your improvement, skill levels, and interview performance over time." />

      {/* Top row */}
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Readiness ring */}
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <ScoreBadge score={readiness} size={110} />
          <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 3 }}>JOB READINESS</div>
        </Card>

        {/* Update skill */}
        <Card>
          <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 16 }}>LOG SKILL PROGRESS</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <Input value={skill} onChange={e => setSkill(e.target.value)} placeholder="Skill name" />
            <input type="number" value={level} onChange={e => setLevel(e.target.value)} min={0} max={100}
              placeholder="0-100"
              style={{
                width: 72, background: "var(--bg3)", border: "1px solid var(--border2)",
                borderRadius: 3, padding: "10px 12px", color: "var(--text)", fontSize: 12, outline: "none"
              }} />
          </div>
          <Btn onClick={update} small>LOG PROGRESS</Btn>
        </Card>

        {/* Weeks completed */}
        <Card>
          <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 16 }}>ROADMAP WEEKS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {Array.from({ length: 8 }, (_, i) => i + 1).map(w => (
              <div key={w} style={{
                width: 34, height: 34, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 500,
                background: weeks.includes(w) ? "rgba(46,213,115,0.15)" : "var(--bg3)",
                border: `1px solid ${weeks.includes(w) ? "var(--green)" : "var(--border)"}`,
                color: weeks.includes(w) ? "var(--green)" : "var(--muted)"
              }}>{w}</div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 10 }}>
            {weeks.length}/8 weeks completed
          </div>
        </Card>
      </div>

      {/* Skill log */}
      {progress?.completedSkills?.length > 0 && (
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 20 }}>SKILL LOG</div>
          <div style={{ columns: 2, gap: 32 }}>
            {progress.completedSkills.map((s, i) => (
              <div key={s.skill} style={{ breakInside: "avoid", marginBottom: 4 }}>
                <SkillBar name={s.skill} current={s.level} required={100} delay={i * 0.05} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Interview score chart */}
      {scores.length > 0 && (
        <Card>
          <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 16 }}>INTERVIEW SCORE TREND</div>
          <MiniLineChart scores={scores} />
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {scores.map((s, i) => (
              <div key={i} style={{
                background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: 3, padding: "10px 14px", textAlign: "center",
                animation: `fadeUp 0.3s ease ${i * 0.06}s both`
              }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: s.score >= 70 ? "var(--green)" : "var(--amber)" }}>
                  {s.score}
                </div>
                <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 1 }}>ROUND {i + 1}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}