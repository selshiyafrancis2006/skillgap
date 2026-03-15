import { useState } from "react";
import "./index.css";
import Sidebar from "./components/Sidebar";
import ResumeIntelligence from "./pages/ResumeIntelligence";
import IndustryBenchmark from "./pages/IndustryBenchmark";
import SkillGraph from "./pages/SkillGraph";
import ProgressDashboard from "./pages/ProgressDashboard";
import MockInterview from "./pages/MockInterview";
import CompanyForge from "./pages/CompanyForge";

export default function App() {
  const [active, setActive] = useState("resume");
  const [resumeId, setResumeId] = useState(null);

  const page = {
    resume:    <ResumeIntelligence onResumeLoaded={setResumeId} />,
    benchmark: <IndustryBenchmark resumeId={resumeId} />,
    skills:    <SkillGraph resumeId={resumeId} />,
    progress:  <ProgressDashboard resumeId={resumeId} />,
    interview: <MockInterview resumeId={resumeId} />,
    forge:     <CompanyForge resumeId={resumeId} />,
  }[active];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active={active} setActive={setActive} resumeId={resumeId} />
      <main style={{
        flex: 1, padding: "40px 48px", overflowY: "auto",
        maxWidth: "calc(100vw - 240px)",
        background: "radial-gradient(ellipse at 80% 0%, rgba(245,166,35,0.04) 0%, transparent 60%)"
      }}>
        {page}
      </main>
    </div>
  );
}