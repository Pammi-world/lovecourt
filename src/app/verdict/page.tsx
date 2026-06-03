"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export interface Case {
  id: string;
  partnerA: { category: string; intensity: number; description: string };
  partnerB: { category: string; intensity: number; description: string };
  createdAt: string;
}

const verdicts = [
  { 
    winner: "A", 
    text: "Partner A Wins!", 
    emoji: "👤", 
    color: "text-[var(--gold-400)]",
    reasoning: "After careful consideration of both arguments, the evidence strongly supports Partner A's position. Partner B's rebuttal failed to address the core issues raised."
  },
  { 
    winner: "B", 
    text: "Partner B Wins!", 
    emoji: "👥", 
    color: "text-[var(--gold-400)]",
    reasoning: "Following a thorough review of both submissions, the balance of evidence clearly favors Partner B. Partner A's claims were not sufficiently substantiated."
  },
  { 
    winner: "draw", 
    text: "It's a Draw!", 
    emoji: "⚖️", 
    color: "text-[var(--cream)]",
    reasoning: "Both parties presented compelling arguments. The judge finds that neither party is entirely right or wrong. A compromise is hereby recommended."
  },
];

function getVerdict(caseData: Case) {
  const aScore = caseData.partnerA.intensity + (caseData.partnerA.description.length / 50);
  const bScore = caseData.partnerB.intensity + (caseData.partnerB.description.length / 50);
  const scoreDiff = Math.abs(aScore - bScore);
  
  // More likely to be a draw if scores are close
  if (scoreDiff < 1.5) return verdicts[2];
  if (scoreDiff < 3) return Math.random() > 0.5 ? verdicts[0] : verdicts[1];
  return aScore > bScore ? verdicts[0] : verdicts[1];
}

type Phase = 'loading' | 'thinking' | 'drumming' | 'reveal';

export default function VerdictPage() {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [verdict, setVerdict] = useState<typeof verdicts[0] | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');

  useEffect(() => {
    const stored = localStorage.getItem("lovecourt_current");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCaseData(parsed);
      
      // Animation sequence
      setPhase('loading');
      setTimeout(() => setPhase('thinking'), 1200);
      setTimeout(() => setPhase('drumming'), 3500);
      setTimeout(() => {
        setVerdict(getVerdict(parsed));
        setPhase('reveal');
      }, 5000);
    }
  }, []);

  if (!caseData) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="spinner mb-4 mx-auto" />
          <p className="text-[var(--text-secondary)]">Loading case...</p>
          <Link href="/" className="btn btn-ghost mt-6">
            ← Back to Court
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 bg-pattern">
      <div className="container max-w-lg mx-auto w-full">
        {/* Progress */}
        <div className="progress-track mb-8">
          <div className="progress-bar" style={{ width: '100%' }} />
        </div>

        {/* PHASE: LOADING */}
        {phase === 'loading' && (
          <div className="text-center py-16 animate-fade-in">
            <span className="text-6xl block mb-6">📁</span>
            <h1 className="display-2 font-serif text-[var(--cream)] mb-4">
              Case Filed
            </h1>
            <p className="text-[var(--text-muted)] font-mono text-sm">
              {caseData.id}
            </p>
          </div>
        )}

        {/* PHASE: THINKING */}
        {phase === 'thinking' && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-block judge-thinking mb-6">
              <span className="text-8xl block">🧐</span>
            </div>
            <h1 className="display-2 font-serif text-[var(--cream)] mb-4">
              Deliberating...
            </h1>
            <p className="text-[var(--text-secondary)] mb-6">
              The Judge is considering all evidence
            </p>
            <div className="loader-dots justify-center">
              <span /><span /><span />
            </div>
          </div>
        )}

        {/* PHASE: DRUMMING */}
        {phase === 'drumming' && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-block animate-drumroll mb-6">
              <span className="text-8xl block">⚖️</span>
            </div>
            <h1 className="display-2 font-serif text-[var(--cream)] mb-4">
              <span className="animate-pulse-once">THE VERDICT</span>
            </h1>
            <p className="text-[var(--text-muted)]">
              * drum roll *
            </p>
          </div>
        )}

        {/* PHASE: REVEAL */}
        {phase === 'reveal' && verdict && (
          <div className="space-y-6 animate-verdict">
            {/* Spotligth effect container */}
            <div className="text-center py-8 animate-spotlight">
              <span className="text-8xl block mb-6 animate-gavel">⚖️</span>
              
              <h1 className={`display-1 font-serif mb-4 ${verdict.color}`}>
                {verdict.text}
              </h1>
            </div>
            
            {/* Reasoning Card */}
            <div className="card animate-fade-up" style={{ animationDelay: '300ms' }}>
              <h2 className="text-sm font-semibold text-[var(--gold-400)] mb-4">
                📜 The Judge&apos;s Reasoning
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                {verdict.reasoning}
              </p>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card animate-fade-up" style={{ animationDelay: '450ms' }}>
                <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-3 uppercase tracking-wide">
                  👤 Partner A
                </h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-3">
                  "{caseData.partnerA.description}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[var(--bg-interactive)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--gold-500)] rounded-full transition-all"
                      style={{ width: `${(caseData.partnerA.intensity / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-[var(--gold-400)]">
                    {caseData.partnerA.intensity}/5
                  </span>
                </div>
              </div>
              
              <div className="card animate-fade-up" style={{ animationDelay: '550ms' }}>
                <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-3 uppercase tracking-wide">
                  👥 Partner B
                </h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-3">
                  "{caseData.partnerB.description}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[var(--bg-interactive)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--gold-500)] rounded-full"
                      style={{ width: `${(caseData.partnerB.intensity / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-[var(--gold-400)]">
                    {caseData.partnerB.intensity}/5
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Link href="/" className="btn btn-primary w-full text-lg py-4">
                🎮 New Case
              </Link>
              <Link href="/history" className="btn btn-secondary w-full">
                📜 View All History
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--text-muted)]">
            ❤️ Fair & Impartial Since 2026
          </p>
        </footer>
      </div>
    </main>
  );
}