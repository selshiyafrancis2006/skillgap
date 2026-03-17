import { useState, useRef } from "react";
import { api } from "../utils/api";
import { SectionHeader, StatCard, Tag, Btn, Card, SkillBar } from "../components/UI";

function UploadZone({ onUpload, loading }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  const handle = (file) => {
    if (!file || file.type !== "application/pdf") return alert("PDF files only.");
    onUpload(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
      onClick={() => !loading && ref.current.click()}
      style={{
        border: `1px dashed ${drag ? "var(--amber)" : "var(--border2)"}`,
        borderRadius: 4, padding: "60px 40px", textAlign: "center",
        cursor: loading ? "wait" : "pointer",
        background: drag ? "rgba(245,166,35,0.04)" : "var(--bg2)",
        transition: "all .3s", position: "relative", overflow: "hidden"
      }}
    >
      {/* Animated corner accents */}
      {[["0","0","right","bottom"],["auto","0","left","bottom"],["0","auto","right","top"],["auto","auto","left","top"]].map(([t,b,r,l], i) => (
        <div key={i} style={{
          position: "absolute", top: t !== "auto" ? 0 : undefined, bottom: b !== "auto" ? 0 : undefined,
          right: r !== "auto" ? 0 : undefined, left: l !== "auto" ? 0 : undefined,
          width: 20, height: 20,
          borderTop: (t === "0") ? `1px solid var(--amber)` : "none",
          borderBottom: (b === "0") ? `1px solid var(--amber)` : "none",
          borderRight: (r === "0") ? `1px solid var(--amber)` : "none",
          borderLeft: (l === "0") ? `1px solid var(--amber)` : "none",
          opacity: drag ? 1 : 0.4, transition: "opacity .3s"
        }} />
      ))}

      <input ref={ref} type="file" accept=".pdf" style={{ display: "none" }}
        onChange={(e) => handle(e.target.files[0])} />

      <div style={{
        width: 56, height: 56, border: "1px solid var(--border2)", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px", fontSize: 22,
        background: loading ? "rgba(245,166,35,0.1)" : "var(--bg3)",
        animation: loading ? "pulse 1s infinite" : "none"
      }}>
        {loading ? "⟳" : "↑"}
      </div>
      <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 6 }}>
        {loading ? "Analyzing your resume with AI…" : "Drop your PDF resume"}
      </div>
      <div style={{ fontSize: 11, color: "var(--muted)" }}>
        {loading ? "Extracting skills, scoring, generating roadmap" : "or click to browse — PDF format only"}
      </div>
    </div>
  );
}

function RoadmapTimeline({ roadmap }) {
  if (!roadmap?.length) return null;
  return (
    <div>
      <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 20 }}>PERSONALIZED ROADMAP</div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 11, top: 0, bottom: 0, width: 1, background: "var(--border)" }} />
        {roadmap.map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: 20, marginBottom: 16, paddingLeft: 0,
            animation: `fadeUp 0.4s ease ${i * 0.08}s both`
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%", background: "var(--bg)",
              border: "1px solid var(--amber)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, color: "var(--amber)", flexShrink: 0, zIndex: 1
            }}>{i + 1}</div>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 4, padding: "12px 16px", flex: 1 }}>
              <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 2, marginBottom: 4 }}>
                WEEK {item.week ?? i + 1}
              </div>
              <div style={{ fontSize: 13, color: "var(--text)", marginBottom: item.project ? 6 : 0 }}>
                {item.topic ?? item}
              </div>
              {item.project && (
                <div style={{ fontSize: 11, color: "var(--muted2)", fontStyle: "italic" }}>{item.project}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Safely extract a numeric score from any format the backend might return
function parseScore(raw) {
  if (raw === null || raw === undefined) return 0;
  if (typeof raw === "number") return Math.round(raw);
  if (typeof raw === "string") return Math.round(parseFloat(raw)) || 0;
  if (typeof raw === "object") {
    // Try common field names
    const val = raw.score ?? raw.total ?? raw.value ?? raw.percentage ?? raw.result ?? 0;
    return Math.round(typeof val === "number" ? val : parseFloat(val) || 0);
  }
  return 0;
}

// Role-based target skill sets — more comprehensive than user's current skills
const roleTargetSkills = {
  "Full Stack Developer":   "React, Node.js, MongoDB, Express, AWS, TypeScript, Docker, PostgreSQL, Redis, System Design",
  "Frontend Developer":     "React, TypeScript, Next.js, Redux, Tailwind, GraphQL, Testing, Webpack, Accessibility, Performance",
  "Backend Developer":      "Node.js, Express, PostgreSQL, MongoDB, Redis, Docker, AWS, Microservices, System Design, Security",
  "Data Scientist":         "Python, Pandas, NumPy, scikit-learn, TensorFlow, SQL, Matplotlib, Spark, Statistics, ML Pipelines",
  "AI Engineer":            "Python, TensorFlow, PyTorch, NLP, Docker, AWS, FastAPI, MLflow, Transformers, RAG",
  "DevOps Engineer":        "Docker, Kubernetes, AWS, Jenkins, Terraform, Linux, CI/CD, Ansible, Monitoring, Security",
  "Mobile Developer":       "React Native, Flutter, Swift, Kotlin, Firebase, Redux, Testing, CI/CD, App Store, Performance",
  "Cloud Engineer":         "AWS, Azure, GCP, Terraform, Kubernetes, Docker, Linux, Networking, Security, Cost Optimization",
  "Cybersecurity Engineer": "Linux, Networking, Python, Wireshark, Metasploit, Firewalls, SIEM, Cryptography, Pentesting, OWASP",
};

export default function ResumeIntelligence({ onResumeLoaded }) {
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optResult, setOptResult] = useState(null);
  const [targetSkills, setTargetSkills] = useState("React, Node.js, AWS, MongoDB, TypeScript, Docker");

  const upload = async (file) => {
    setUploading(true);
    try {
      const d = await api.uploadResume(file);
      if (d.resume) {
        setData(d);
        onResumeLoaded(d.resume._id);
        // Auto-set target skills based on detected role
        const role = d.targetRole || d.resume?.targetRole || "Full Stack Developer";
        const suggested = roleTargetSkills[role] || roleTargetSkills["Full Stack Developer"];
        setTargetSkills(suggested);
      }
      else alert(d.error || "Upload failed");
    } catch { alert("Cannot connect to backend on port 5000."); }
    setUploading(false);
  };

  const optimize = async () => {
    if (!data?.resume?._id) return;
    const skills = targetSkills.split(",").map(s => s.trim()).filter(Boolean);
    setOptimizing(true);
    try { setOptResult(await api.optimizeResume(data.resume._id, skills)); }
    catch { alert("Optimizer failed."); }
    setOptimizing(false);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionHeader eyebrow="Feature 01" title="RESUME INTELLIGENCE" sub="AI-powered parsing, scoring, gap detection and personalized learning roadmaps." />

      {!data ? (
        <UploadZone onUpload={upload} loading={uploading} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            <StatCard label="Resume Score" value={`${parseScore(data.resumeScore)}%`} icon="◎" delay={0} />
            <StatCard label="Experience" value={data.experienceLevel ?? "MID"} color="var(--cyan)" icon="◈" delay={0.05} />
            <StatCard label="Skills Found" value={data.skillsDetected?.length ?? 0} color="var(--green)" icon="▲" delay={0.1} />
            <StatCard label="Gaps Found" value={data.missingCoreSkills?.length ?? 0} color="var(--red)" icon="◆" delay={0.15} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Detected Skills */}
            <Card>
              <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 16 }}>DETECTED SKILLS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {data.skillsDetected?.map(s => <Tag key={s} color="var(--green)" textColor="var(--green)" dot>{s}</Tag>)}
              </div>
            </Card>

            {/* Missing Skills */}
            <Card>
              <div style={{ fontSize: 10, color: "var(--red)", letterSpacing: 4, marginBottom: 16 }}>MISSING CORE SKILLS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {data.missingCoreSkills?.length
                  ? data.missingCoreSkills.map(s => <Tag key={s} color="var(--red)" textColor="var(--red)" dot>{s}</Tag>)
                  : <span style={{ fontSize: 12, color: "var(--muted)" }}>No critical gaps detected ✓</span>
                }
              </div>
            </Card>
          </div>

          {/* Optimizer */}
          <Card>
            <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 16 }}>RESUME OPTIMIZER</div>
            <div style={{ display: "flex", gap: 12, marginBottom: optResult ? 20 : 0 }}>
              <input
                value={targetSkills} onChange={e => setTargetSkills(e.target.value)}
                placeholder="Target skills (comma-separated)"
                style={{
                  flex: 1, background: "var(--bg3)", border: "1px solid var(--border2)",
                  borderRadius: 3, padding: "10px 14px", color: "var(--text)", fontSize: 12, outline: "none"
                }}
              />
              <Btn onClick={optimize} disabled={optimizing}>
                {optimizing ? "RUNNING…" : "OPTIMIZE"}
              </Btn>
            </div>
            {optResult && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ background: "var(--bg3)", border: "1px solid var(--red)22", borderRadius: 4, padding: 16, textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--red)" }}>
                      {Math.min(optResult.currentScore, 100)}%
                    </div>
                    <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 2, marginTop: 4 }}>CURRENT SCORE</div>
                  </div>
                  <div style={{ background: "var(--bg3)", border: "1px solid var(--green)22", borderRadius: 4, padding: 16, textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--green)" }}>
                      {Math.min(optResult.optimizedScore, 100)}%
                    </div>
                    <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 2, marginTop: 4 }}>OPTIMIZED SCORE</div>
                  </div>
                </div>

                {optResult.suggestedChanges?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 10, color: "var(--muted2)", letterSpacing: 2, marginBottom: 10 }}>SUGGESTED CHANGES</div>
                    {optResult.suggestedChanges.map((c, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--muted2)" }}>
                        <span style={{ color: "var(--amber)" }}>→</span>{c}
                      </div>
                    ))}
                  </div>
                )}

                {/* Smart roadmap based on missing skills */}
                {optResult.missingSkills?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 14 }}>
                      YOUR LEARNING ROADMAP TO CLOSE GAPS
                    </div>
                    {optResult.missingSkills.map((skill, i) => {
                      const plans = {
                        "React":       { weeks: 2, project: "Build a dynamic todo app with React hooks" },
                        "Node.js":     { weeks: 2, project: "Build a REST API with Express and MongoDB" },
                        "AWS":         { weeks: 3, project: "Deploy a Node.js app on AWS EC2 + S3" },
                        "MongoDB":     { weeks: 1, project: "Build a CRUD app with Mongoose" },
                        "TypeScript":  { weeks: 2, project: "Rewrite an existing JS project in TypeScript" },
                        "Docker":      { weeks: 2, project: "Containerize your full-stack app" },
                        "PostgreSQL":  { weeks: 2, project: "Build a relational DB schema for a blog" },
                        "Redis":       { weeks: 1, project: "Implement session caching with Redis" },
                        "GraphQL":     { weeks: 2, project: "Build a GraphQL API with Apollo Server" },
                        "Python":      { weeks: 3, project: "Build a data analysis script with Pandas" },
                        "Kubernetes":  { weeks: 3, project: "Deploy a microservice on a local K8s cluster" },
                        "Terraform":   { weeks: 2, project: "Provision AWS infrastructure with Terraform" },
                        "JavaScript":  { weeks: 2, project: "Build 3 JS mini projects (calculator, quiz, weather app)" },
                        "System Design": { weeks: 3, project: "Design a URL shortener and a chat system" },
                      };
                      const plan = plans[skill] || { weeks: 2, project: `Build a mini project using ${skill}` };
                      return (
                        <div key={skill} style={{
                          background: "var(--bg3)", border: "1px solid var(--border)",
                          borderLeft: `3px solid var(--amber)`, borderRadius: "0 4px 4px 0",
                          padding: "14px 16px", marginBottom: 8,
                          animation: `fadeUp 0.3s ease ${i * 0.07}s both`
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{skill}</span>
                            <span style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 2 }}>~{plan.weeks} WEEKS</span>
                          </div>
                          <div style={{ fontSize: 11, color: "var(--muted2)", fontStyle: "italic" }}>
                            {plan.project}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Roadmap — only show if optimizer hasn't run yet */}
          {data.roadmap?.length > 0 && !optResult && (
            <Card>
              <RoadmapTimeline roadmap={data.roadmap} />
            </Card>
          )}

          {/* Re-upload */}
          <div>
            <Btn variant="ghost" onClick={() => { setData(null); setOptResult(null); }}>
              ↑ UPLOAD NEW RESUME
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}