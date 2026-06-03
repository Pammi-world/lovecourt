"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Case {
  id: string;
  partnerA: { category: string; intensity: number; description: string };
  partnerB: { category: string; intensity: number; description: string };
  createdAt: string;
}

const verdicts = [
  { winner: "A", text: "Partner A Wins!", emoji: "👤", reasoning: "After careful consideration of both arguments, the evidence strongly supports Partner A's position. Partner B's rebuttal failed to address the core issues raised." },
  { winner: "B", text: "Partner B Wins!", emoji: "👥", reasoning: "Following a thorough review of both submissions, the balance of evidenceclearly favors Partner B. Partner A's claims were not sufficiently substantiated." },
  { winner: "draw", text: "It's a Draw!", emoji: "⚖️", reasoning: "Both parties presented compelling arguments. The judge finds that neither party is entirely right or wrong. Compromise is hereby recommended." },
];

function getVerdict(caseData: Case) {
  // Simple mock algorithm based on combined intensity
  const aScore = caseData.partnerA.intensity + Math.random() * 2;
  const bScore = caseData.partnerB.intensity + Math.random() * 2;
  const diff = Math.abs(aScore - bScore);
  
  if (diff < 1.5) return verdicts[2]; // draw
  return aScore > bScore ? verdicts[0] : verdicts[1];
}

export default function VerdictPage() {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [verdict, setVerdict] = useState<typeof verdicts[0] | null>(null);
  const [phase, setPhase] = useState<"loading" | "thinking" | "reveal">("loading");

  useEffect(() => {
    const stored = localStorage.getItem("lovecourt_current");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCaseData(parsed);
      
      // Start animation sequence
      setPhase("loading");
      setTimeout(() => setPhase("thinking"), 1500);
      setTimeout(() => {
        setVerdict(getVerdict(parsed));
        setPhase("reveal");
      }, 4000);
    }
  }, []);

  if (!caseData) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <span className="spinner block mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading case...</p>
          <Link href="/" className="btn btn-ghost mt-4">← Back to Court</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="container max-w-lg mx-auto w-full text-center">
        {/* Progress */}
        <div className="progress-bar mb-8">
          <div className="progress-bar-fill" style={{ width: '100%' }} />
        </div>

        {/* Phase: Loading */}
        {phase === "loading" && (
          <div className="animate-[fadeUp_0.4s_ease_forwards]">
            <span className="text-6xl block mb-4">📁</span>
            <h1 className="display-2 font-serif text-[var(--cream)] mb-2">
              Case Filed
            </h1>
            <p className="text-[var(--text-secondary)]">
              {caseData.id}
            </p>
          </div>
        )}

        {/* Phase: Thinking */}
        {phase === "thinking" && (
          <div className="animate-[fadeUp_0.4s_ease_forwards]">
            <div className="judge-thinking">
              <span className="text-8xl block mb-4">🧐</span>
            </div>
            <h1 className="display-2 font-serif text-[var(--cream)] mb-2">
              Deliberating...
            </h1>
            <p className="text-[var(--text-secondary)] mb-4">
              The Judge is considering all evidence
            </p>
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map(i => (
                <span 
                  key={i}
                  className="w-2 h-2 rounded-full bg-[var(--accent)]"
                  style={{ 
                    animation: 'spin 0.8s ease-in-out infinite',
                    animationDelay: `${i * 0.15}s`,
                    opacity: 0.3 + (i * 0.25)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Phase: Reveal */}
        {phase === "reveal" && verdict && (
          <div className="space-y-6 animate-[fadeUp_0.6s_ease_forwards]">
            {/* Spotlight effect */}
            <div className="verdict-spotlight">
              <span className="text-8xl block mb-4 judge-gavel">⚖️</span>
            </div>
            
            {/* Verdict */}
            <div className="verdict-bang">
              <h1 className="display-1 font-serif text-[var(--gold-500)] mb-4">
                {verdict.text}
              </h1>
            </div>
            
            {/* Reasoning */}
            <div className="card text-left">
              <h2 className="text-sm font-medium text-[var(--accent)] mb-3">
                📜 The Judge&apos;s Reasoning
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {verdict.reasoning}
              </p>
            </div>
            
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card">
                <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Partner A</h3>
                <p className="text-sm text-[var(--text-secondary)] truncate">
                  {caseData.partnerA.description.slice(0, 50)}...
                </p>
                <span className="text-lg text-[var(--accent)] mt-2 block">
                  Level {caseData.partnerA.intensity}/5
                </span>
              </div>
              <div className="card">
                <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Partner B</h3>
                <p className="text-sm text-[var(--text-secondary)] truncate">
                  {caseData.partnerB.description.slice(0, 50)}...
                </p>
                <span className="text-lg text-[var(--accent)] mt-2 block">
                  Level {caseData.partnerB.intensity}/5
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link href="/" className="btn btn-primary w-full">
                🎮 New Case
              </Link>
              <Link href="/history" className="btn btn-secondary w-full">
                📜 View History
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)]">
            ❤️ Fair & Impartial Since 2026
          </p>
        </footer>
      </div>
    </main>
  );
}