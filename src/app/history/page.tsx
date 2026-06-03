"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Case {
  id: string;
  partnerA: { category: string; intensity: number; description: string };
  partnerB: { category: string; intensity: number; description: string };
  completedAt: string;
}

const verdicts = [
  { winner: "A", text: "Partner A Wins!" },
  { winner: "B", text: "Partner B Wins!" },
  { winner: "draw", text: "Draw" },
];

export default function HistoryPage() {
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem("lovecourt_history");
    if (stored) {
      setCases(JSON.parse(stored));
    }
    
    // Move current to history if exists
    const current = localStorage.getItem("lovecourt_current");
    if (current) {
      const currentCase = JSON.parse(current);
      if (currentCase.completedAt) {
        const history = stored ? JSON.parse(stored) : [];
        // Avoid duplicates
        if (!history.find((c: Case) => c.id === currentCase.id)) {
          history.unshift(currentCase);
          localStorage.setItem("lovecourt_history", JSON.stringify(history));
        }
        setCases(history);
      }
      // Clear current
      localStorage.removeItem("lovecourt_current");
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="container max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="btn btn-ghost">
            ← Court
          </Link>
          <h1 className="display-2 font-serif text-[var(--cream)]">
            History
          </h1>
          <div />{/* Spacer */}
        </div>

        {/* Cases */}
        {cases.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">📜</span>
            <p className="text-[var(--text-secondary)] mb-4">No past disputes</p>
            <Link href="/" className="btn btn-primary">
              Start Your First Case
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cases.map((c, i) => (
              <div key={c.id} className="card animate-[fadeUp_0.3s_ease_forwards]" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(c.completedAt).toLocaleDateString()}
                    </span>
                    <h3 className="text-sm font-medium text-[var(--cream)] mt-1">
                      {c.id}
                    </h3>
                  </div>
                  <span className="text-2xl">
                    {c.partnerA.category === c.partnerB.category 
                      ? "💬" 
                      : c.partnerA.category === "chores" ? "🧹" 
                      : c.partnerA.category === "money" ? "💰"
                      : c.partnerA.category === "time" ? "⏰"
                      : "🤷"
                    }
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--text-muted)]">A:</span>
                    <p className="text-[var(--text-secondary)] truncate">
                      {c.partnerA.description.slice(0, 40)}...
                    </p>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">B:</span>
                    <p className="text-[var(--text-secondary)] truncate">
                      {c.partnerB.description.slice(0, 40)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--text-muted)]">
            {cases.length} dispute{cases.length !== 1 ? 's' : ''} settled
          </p>
        </footer>
      </div>
    </main>
  );
}