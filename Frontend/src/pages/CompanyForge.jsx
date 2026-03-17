import { useState } from "react";
import { api } from "../utils/api";
import { SectionHeader, Card, Btn, Input, Tag, SkillBar, Empty, StatCard } from "../components/UI";

// Company profiles with their known tech stacks + culture signals
const COMPANIES = {
  "Google": {
    stack: ["Python","Go","C++","Kubernetes","TensorFlow","BigQuery","Angular","gRPC"],
    culture: ["System Design","Algorithms","Data Structures","Scalability","Code Quality"],
    values: ["10x thinking","Data-driven decisions","Open source contribution","Technical depth"],
    interviewStyle: "Algorithm-heavy. Expect LeetCode Hard, System Design at L4+. Google values clarity of thought.",
    color: "#4285f4"
  },
  "Meta": {
    stack: ["React","GraphQL","Hack/PHP","Python","PyTorch","Spark","Cassandra","RocksDB"],
    culture: ["Move Fast","Product Thinking","A/B Testing","Scale","Impact at Scale"],
    values: ["Ship fast and iterate","Ruthless prioritization","Social impact","Infrastructure at scale"],
    interviewStyle: "Behavioral + Coding. Expect Meta's 4 pillars: Problem Solving, Collaboration, Initiative, Impact.",
    color: "#0866ff"
  },
  "Netflix": {
    stack: ["Java","Spring","AWS","Kafka","Cassandra","Spinnaker","React","Node.js"],
    culture: ["Freedom & Responsibility","Context not Control","Highly Aligned Loosely Coupled"],
    values: ["Judgment over rules","Curious and open","Candid feedback","High performance density"],
    interviewStyle: "Culture fit is paramount. Netflix hires for senior roles. Expect deep system design + culture alignment questions.",
    color: "#e50914"
  },
  "Amazon": {
    stack: ["Java","AWS","DynamoDB","Lambda","S3","SQS","React","Python"],
    culture: ["Leadership Principles","Customer Obsession","Ownership","Bias for Action"],
    values: ["Day 1 mentality","Frugality","Invent and simplify","Earn trust"],
    interviewStyle: "Heavy LP-based behavioral. Every answer needs a STAR story tied to an LP. Coding is secondary.",
    color: "#ff9900"
  },
  "Microsoft": {
    stack: ["C#",".NET","Azure","TypeScript","React","SQL Server","CosmosDB","PowerShell"],
    culture: ["Growth Mindset","Collaboration","Inclusive","Clarity Impact Energy"],
    values: ["Empower every person","Cloud-first mobile-first","Open and inclusive","Clarity in thinking"],
    interviewStyle: "Mix of coding + design. Microsoft values 'growth mindset'. Collaborative interview style.",
    color: "#00a4ef"
  },
  "Startup": {
    stack: ["Node.js","React","PostgreSQL","Redis","Docker","Terraform","TypeScript","GraphQL"],
    culture: ["Hustle","Full ownership","Generalist","Fast shipping","Lean"],
    values: ["Build fast","Wear many hats","Customer obsession","Default to action"],
    interviewStyle: "Practical take-home projects. Culture fit + raw skills. They want builders, not theorists.",
    color: "#7c3aed"
  }
};

export default function CompanyForge({ resumeId }) {
  const [selected, setSelected] = useState(null);
  const [userSkills, setUserSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const forge = async () => {
    if (!selected) return;
    const company = COMPANIES[selected];
    const skills = userSkills.split(",").map(s => s.trim()).filter(Boolean);

    setLoading(true);

    let optResult = null;
    if (resumeId) {
      try { optResult = await api.optimizeResume(resumeId, company.stack); } catch { }
    }

    const matched = optResult
      ? company.stack.filter(s => !(optResult.missingSkills || []).includes(s))
      : company.stack.filter(s => skills.map(x => x.toLowerCase()).includes(s.toLowerCase()));

    const missing = optResult?.missingSkills
      ?? company.stack.filter(s => !skills.map(x => x.toLowerCase()).includes(s.toLowerCase()));

    // Always calculate from matched/total — never trust raw optResult score
    const matchScore = Math.min(
      Math.round((matched.length / company.stack.length) * 100),
      100
    );
    const targetScore = Math.min(matchScore + 40, 100);

    setResult({ matched, missing, matchScore, targetScore, company });
    setLoading(false);
  };



  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionHeader eyebrow="Feature 06" title="COMPANYFORGE"
        sub="Shape yourself specifically for your dream company — stack alignment, culture fit, and tailored interview prep." />

      {/* Company selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
        {Object.entries(COMPANIES).map(([name, co]) => (
          <button key={name} onClick={() => { setSelected(name); setResult(null); }} style={{
            background: selected === name ? `${co.color}18` : "var(--bg2)",
            border: `1px solid ${selected === name ? co.color : "var(--border)"}`,
            borderRadius: 4, padding: "16px 20px", textAlign: "left", cursor: "pointer",
            transition: "all .2s", transform: selected === name ? "translateY(-2px)" : "none",
            boxShadow: selected === name ? `0 4px 24px ${co.color}33` : "none"
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, letterSpacing: 0, color: selected === name ? co.color : "var(--text)", marginBottom: 6 }}>
              {name}
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)", lineHeight: 1.6 }}>
              {co.stack.slice(0, 4).join(" · ")}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Company Profile */}
          <Card accent={COMPANIES[selected].color}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ fontSize: 10, color: COMPANIES[selected].color, letterSpacing: 4, marginBottom: 12 }}>
                  TECH STACK
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {COMPANIES[selected].stack.map(s => (
                    <Tag key={s} color={COMPANIES[selected].color} textColor={COMPANIES[selected].color}>{s}</Tag>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: COMPANIES[selected].color, letterSpacing: 4, marginBottom: 12 }}>
                  CULTURE DNA
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {COMPANIES[selected].culture.map(c => (
                    <Tag key={c} color="var(--muted2)" textColor="var(--muted2)">{c}</Tag>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.7, fontStyle: "italic", borderLeft: `2px solid ${COMPANIES[selected].color}`, paddingLeft: 12 }}>
                  {COMPANIES[selected].interviewStyle}
                </div>
              </div>
            </div>
          </Card>

          {/* Forge Input */}
          {!resumeId && (
            <Card>
              <div style={{ fontSize: 10, color: "var(--amber)", letterSpacing: 4, marginBottom: 12 }}>
                YOUR CURRENT SKILLS (or upload resume for auto-detection)
              </div>
              <Input value={userSkills} onChange={e => setUserSkills(e.target.value)}
                placeholder="React, Node.js, Python, Docker…" />
            </Card>
          )}

          <Btn onClick={forge} disabled={loading || (!resumeId && !userSkills.trim())}>
            {loading ? "FORGING…" : `FORGE FOR ${selected.toUpperCase()}`}
          </Btn>

          {/* Results */}
          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                <StatCard label="Current Fit" value={`${Math.min(result.matchScore, 100)}%`} color="var(--red)" delay={0} />
                <StatCard label="Target Fit" value={`${Math.min(result.targetScore, 100)}%`} color="var(--green)" delay={0.05} />
                <StatCard label="Skills to Add" value={result.missing.length} color={COMPANIES[selected].color} delay={0.1} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Card>
                  <div style={{ fontSize: 10, color: "var(--green)", letterSpacing: 4, marginBottom: 14 }}>ALIGNED</div>
                  {result.matched.map((s, i) => (
                    <SkillBar key={s} name={s} current={75} required={100} delay={i * 0.05} />
                  ))}
                  {result.matched.length === 0 && <span style={{ fontSize: 12, color: "var(--muted)" }}>No matches yet</span>}
                </Card>
                <Card>
                  <div style={{ fontSize: 10, color: "var(--red)", letterSpacing: 4, marginBottom: 14 }}>BUILD THESE</div>
                  {result.missing.map((s, i) => (
                    <div key={s} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 0", borderBottom: "1px solid var(--border)",
                      animation: `fadeUp 0.3s ease ${i * 0.06}s both`
                    }}>
                      <span style={{ fontSize: 12, color: "var(--muted2)" }}>{s}</span>
                      <span style={{ fontSize: 9, color: "var(--red)", letterSpacing: 2 }}>MISSING</span>
                    </div>
                  ))}
                </Card>
              </div>

              {/* Company Values */}
              <Card accent={COMPANIES[selected].color}>
                <div style={{ fontSize: 10, color: COMPANIES[selected].color, letterSpacing: 4, marginBottom: 14 }}>
                  EMBODY THESE VALUES
                </div>
                {COMPANIES[selected].values.map((v, i) => (
                  <div key={v} style={{
                    display: "flex", gap: 12, padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                    animation: `fadeUp 0.3s ease ${i * 0.08}s both`
                  }}>
                    <span style={{ color: COMPANIES[selected].color, fontSize: 12 }}>◆</span>
                    <span style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.6 }}>{v}</span>
                  </div>
                ))}
              </Card>
            </div>
          )}


        </div>
      )}
    </div>
  );
}