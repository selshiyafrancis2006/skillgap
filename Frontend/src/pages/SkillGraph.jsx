import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { SectionHeader, SkillBar, RadarChart, Card, Empty, Loader, Tag } from "../components/UI";

export default function SkillGraph({ resumeId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("bars"); // bars | radar

  useEffect(() => {
    if (!resumeId) return;
    setLoading(true);
    api.getSkillGraph(resumeId)
      .then(setData).catch(console.error)
      .finally(() => setLoading(false));
  }, [resumeId]);

  if (!resumeId) return (
    <div>
      <SectionHeader eyebrow="Feature 03" title="SKILL GRAPH" />
      <Empty icon="◎" title="No resume loaded" sub="Upload your resume to generate your interactive skill graph." />
    </div>
  );

  if (loading) return <><SectionHeader eyebrow="Feature 03" title="SKILL GRAPH" /><Loader text="Generating skill graph" /></>;

  const sg = data?.data;

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionHeader eyebrow="Feature 03" title="SKILL GRAPH" sub={`Visual skill breakdown for ${sg?.targetRole ?? "your target role"}`} />

      {/* View Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["bars","radar"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "7px 20px", fontSize: 10, letterSpacing: 3,
            border: `1px solid ${view === v ? "var(--amber)" : "var(--border2)"}`,
            background: view === v ? "rgba(245,166,35,0.1)" : "transparent",
            color: view === v ? "var(--amber)" : "var(--muted)",
            borderRadius: 3, cursor: "pointer", transition: "all .15s"
          }}>{v.toUpperCase()}</button>
        ))}
      </div>

      {sg && (
        <div style={{ display: "grid", gridTemplateColumns: view === "radar" ? "1fr 1fr" : "1fr", gap: 20 }}>
          <Card>
            <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 20 }}>
              {view === "bars" ? "SKILL PROFICIENCY" : "ROLE: " + sg.targetRole}
            </div>
            {view === "bars" ? (
              sg.skills?.map((s, i) => (
                <SkillBar key={s.name} name={s.name} current={s.currentLevel} required={s.requiredLevel} delay={i * 0.07} />
              ))
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <RadarChart skills={sg.skills} size={340} />
              </div>
            )}
          </Card>

          {view === "radar" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card>
                <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 16 }}>SKILL BREAKDOWN</div>
                {sg.skills?.map((s, i) => (
                  <div key={s.name} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: "1px solid var(--border)",
                    animation: `fadeUp 0.3s ease ${i * 0.05}s both`
                  }}>
                    <span style={{ fontSize: 12, color: "var(--muted2)" }}>{s.name}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{s.currentLevel}/{s.requiredLevel}</span>
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: s.currentLevel >= s.requiredLevel * 0.75 ? "var(--green)" : s.currentLevel >= s.requiredLevel * 0.45 ? "var(--amber)" : "var(--red)"
                      }} />
                    </div>
                  </div>
                ))}
              </Card>

              {sg.missingSkills?.length > 0 && (
                <Card>
                  <div style={{ fontSize: 10, color: "var(--red)", letterSpacing: 4, marginBottom: 14 }}>SKILL GAPS</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {sg.missingSkills.map(s => <Tag key={s} color="var(--red)" textColor="var(--red)" dot>{s}</Tag>)}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* Roadmap */}
      {sg?.roadmap?.length > 0 && (
        <Card style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 20 }}>LEARNING PATH</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {sg.roadmap.map((item, i) => (
              <div key={i} style={{
                background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: 4, padding: "16px", position: "relative", overflow: "hidden",
                animation: `fadeUp 0.4s ease ${i * 0.08}s both`
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `hsl(${(i * 37) % 360}, 70%, 55%)`
                }} />
                <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 3, marginBottom: 6 }}>WEEK {item.week}</div>
                <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, marginBottom: 6 }}>{item.topic}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontStyle: "italic", lineHeight: 1.5 }}>{item.project}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}