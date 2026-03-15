import { useState } from "react";
import { api } from "../utils/api";
import { SectionHeader, Card, Btn, Empty, ScoreBadge } from "../components/UI";

function QuestionCard({ q, index, answer, onAnswer, score, onScore }) {
  if (!q || !q.type || !q.question) return null;
  const typeColor = q.type === "technical" ? "var(--cyan)" : "var(--amber)";

  return (
    <div style={{
      background: "var(--bg2)", border: "1px solid var(--border)",
      borderTop: `2px solid ${typeColor}`, borderRadius: 4, padding: 24,
      animation: "fadeUp 0.4s ease both"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{
            fontSize: 9, letterSpacing: 3, padding: "3px 10px", borderRadius: 2,
            background: `${typeColor}18`, border: `1px solid ${typeColor}44`, color: typeColor
          }}>{q.type.toUpperCase()}</span>
          <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 2 }}>Q{index + 1}</span>
        </div>
        {score !== undefined && <ScoreBadge score={score} size={54} />}
      </div>

      <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.7, marginBottom: 20, fontFamily: "var(--font-serif)" }}>
        {q.question}
      </p>

      <textarea
        value={answer || ""}
        onChange={e => onAnswer(e.target.value)}
        placeholder="Type your answer here…"
        rows={4}
        style={{
          width: "100%", background: "var(--bg3)", border: "1px solid var(--border2)",
          borderRadius: 3, padding: "12px 14px", color: "var(--text)", fontSize: 12,
          resize: "vertical", outline: "none", lineHeight: 1.7, boxSizing: "border-box",
          transition: "border-color .2s"
        }}
        onFocus={e => e.target.style.borderColor = typeColor}
        onBlur={e => e.target.style.borderColor = "var(--border2)"}
      />
      <div style={{ marginTop: 12 }}>
        <Btn onClick={onScore} variant="ghost" small>EVALUATE ANSWER</Btn>
      </div>
    </div>
  );
}

export default function MockInterview({ resumeId }) {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [mode, setMode] = useState("all"); // all | one
  const [current, setCurrent] = useState(0);

  const generate = async () => {
    if (!resumeId) return alert("Upload a resume first.");
    setLoading(true);
    setAnswers({}); setScores({});
    try {
      const d = await api.getMockInterview(resumeId);
      console.log("Interview API response:", d);
      if (d.error) {
        alert(`Backend error: ${d.error}`);
        setLoading(false);
        return;
      }
      const qs = Array.isArray(d.questions) ? d.questions.filter(q => q && q.type && q.question) : [];
      if (qs.length === 0) {
        alert("No questions returned. Please re-upload your resume first so the system can detect your target role.");
        setLoading(false);
        return;
      }
      setQuestions(qs);
    } catch (e) {
      console.error("Interview fetch error:", e);
      alert("Failed to connect to backend. Make sure server is running on port 5000.");
    }
    setLoading(false);
  };

  const scoreAnswer = (i) => {
    const words = (answers[i] || "").trim().split(/\s+/).filter(Boolean).length;
    const base = Math.min(words * 4, 60);
    const bonus = Math.floor(Math.random() * 30);
    setScores(s => ({ ...s, [i]: Math.min(base + bonus + 10, 100) }));
  };

  const avgScore = Object.values(scores).length
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)
    : null;

  if (!resumeId) return (
    <div>
      <SectionHeader eyebrow="Feature 05" title="MOCK INTERVIEW" />
      <Empty icon="◆" title="No resume loaded" sub="Upload your resume to generate role-specific interview questions." />
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionHeader eyebrow="Feature 05" title="MOCK INTERVIEW" sub="Practice technical and behavioral questions tailored to your target role." />

      <div style={{ display: "flex", gap: 12, marginBottom: 28, alignItems: "center", flexWrap: "wrap" }}>
        <Btn onClick={generate} disabled={loading}>
          {loading ? "GENERATING…" : questions ? "REGENERATE" : "START INTERVIEW"}
        </Btn>
        {questions && (
          <>
            {["all","one"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: "9px 16px", fontSize: 10, letterSpacing: 3,
                border: `1px solid ${mode === m ? "var(--amber)" : "var(--border2)"}`,
                background: mode === m ? "rgba(245,166,35,0.1)" : "transparent",
                color: mode === m ? "var(--amber)" : "var(--muted)", borderRadius: 3, cursor: "pointer"
              }}>{m === "all" ? "ALL QUESTIONS" : "ONE BY ONE"}</button>
            ))}
            {avgScore !== null && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 3 }}>SESSION AVG</span>
                <ScoreBadge score={avgScore} size={56} />
              </div>
            )}
          </>
        )}
      </div>

      {questions && mode === "one" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{
                width: 36, height: 36, borderRadius: 3,
                border: `1px solid ${current === i ? "var(--amber)" : scores[i] !== undefined ? "var(--green)" : "var(--border2)"}`,
                background: current === i ? "rgba(245,166,35,0.12)" : scores[i] !== undefined ? "rgba(46,213,115,0.08)" : "var(--bg3)",
                color: current === i ? "var(--amber)" : scores[i] !== undefined ? "var(--green)" : "var(--muted)",
                cursor: "pointer", fontSize: 11
              }}>{i + 1}</button>
            ))}
          </div>
          <QuestionCard
            q={questions[current]} index={current}
            answer={answers[current]}
            onAnswer={v => setAnswers(a => ({ ...a, [current]: v }))}
            score={scores[current]}
            onScore={() => scoreAnswer(current)}
          />
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {current > 0 && <Btn variant="subtle" onClick={() => setCurrent(c => c - 1)} small>← PREV</Btn>}
            {current < questions.length - 1 && <Btn variant="ghost" onClick={() => setCurrent(c => c + 1)} small>NEXT →</Btn>}
          </div>
        </div>
      )}

      {questions && mode === "all" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {questions.map((q, i) => (
            <QuestionCard key={i} q={q} index={i}
              answer={answers[i]}
              onAnswer={v => setAnswers(a => ({ ...a, [i]: v }))}
              score={scores[i]}
              onScore={() => scoreAnswer(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}