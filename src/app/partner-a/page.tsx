"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = [
  { value: "chores", label: "Chores", emoji: "🧹" },
  { value: "money", label: "Money", emoji: "💰" },
  { value: "communication", label: "Comm", emoji: "💬" },
  { value: "time", label: "Time", emoji: "⏰" },
  { value: "affection", label: "Love", emoji: "❤️" },
  { value: "other", label: "Other", emoji: "🤷" },
];

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function PartnerAForm() {
  const router = useRouter();
  const [form, setForm] = useState({ category: "", intensity: 3, description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareMode, setShareMode] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const [copied, setCopied] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.category) newErrors.category = "required";
    if (!form.description.trim()) newErrors.description = "required";
    else if (form.description.length < 20) newErrors.description = "too_short";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    
    const codeGenerate = generateCode();
    const caseData = {
      id: codeGenerate,
      partnerA: form,
      timestamp: new Date().toISOString(),
      status: "pending",
    };
    
    if (shareMode) {
      // Show share code for Partner B to join remotely
      localStorage.setItem("lovecourt_pending_" + codeGenerate, JSON.stringify(caseData));
      setShareCode(codeGenerate);
      setIsSubmitting(false);
    } else {
      // Same device: store directly and go to Partner B
      localStorage.setItem("lovecourt_pending", JSON.stringify(caseData));
      router.push("/partner-b");
    }
  };

  const copyLink = async () => {
    const link = `${window.location.origin}/join/${shareCode}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInput = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const { [field]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  if (shareCode) {
    return (
      <main className="min-h-screen flex flex-col items-center px-4 py-8 bg-pattern">
        <div className="container max-w-lg mx-auto w-full text-center">
          <div className="card mb-6">
            <span className="text-4xl block mb-4">🔗</span>
            <h2 className="display-2 font-serif text-[var(--gold-400)] mb-4">
              Share with Partner B
            </h2>
            <p className="text-[var(--text-muted)] mb-4">
              Send this link:
            </p>
            <div className="bg-[var(--navy-700)] rounded-lg p-3 mb-4 overflow-x-auto">
              <code className="text-[var(--gold-400)] text-sm whitespace-nowrap">
                {typeof window !== 'undefined' ? `${window.location.origin}/join/${shareCode}` : `/join/${shareCode}`}
              </code>
            </div>
            <button onClick={copyLink} className="btn btn-primary w-full">
              {copied ? "✓ Copied!" : "📋 Copy Link"}
            </button>
          </div>
          <Link href="/partner-b" className="btn btn-secondary w-full">
            Or continue here →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 bg-pattern">
      <div className="container max-w-lg mx-auto w-full">
        <Link href="/" className="btn btn-ghost mb-6">← Back</Link>

        <div className="text-center mb-8">
          <span className="text-5xl block mb-4 judge-nod">👤</span>
          <h1 className="display-2 font-serif text-[var(--cream)] mb-2">Partner A</h1>
          <p className="text-[var(--text-secondary)]">File your dispute</p>
        </div>

        {shareMode && (
          <div className="card mb-6 animate-fade-up">
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Partner B will join remotely. When they submit, you'll both see the verdict!
            </p>
            <button onClick={() => setShareMode(false)} className="btn btn-ghost w-full">
              ← Actually, we're together
            </button>
          </div>
        )}

        <div className="progress-track mb-8">
          <div className="progress-bar" style={{ width: '33%' }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-slide-right">
          <fieldset>
            <legend className="text-sm font-medium text-[var(--text-secondary)] mb-4">
              What are you disputing? *
            </legend>
            <div className="grid grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleInput("category", cat.value)}
                  className={`card card-interactive text-center py-3 ${
                    form.category === cat.value ? 'border-[var(--accent)] shadow-glow' : ''
                  }`}
                >
                  <span className="text-xl block">{cat.emoji}</span>
                  <span className="text-sm">{cat.label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex justify-between">
              <span>Intensity</span>
              <span className="text-[var(--gold-400)]">{form.intensity}/5</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleInput("intensity", level)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    level <= form.intensity 
                      ? 'bg-[var(--gold-500)] text-[var(--navy-900)]' 
                      : 'bg-[var(--bg-interactive)]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="desc" className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
              Your side * (20+ chars)
            </label>
            <textarea
              id="desc"
              value={form.description}
              onChange={e => handleInput("description", e.target.value)}
              rows={4}
              placeholder="What happened? Why are you right?"
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg-surface)] border-2 border-[var(--border)] focus:border-[var(--accent)] input-glow resize-none"
            />
            <p className={`text-right text-sm mt-1 ${form.description.length >= 20 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
              {form.description.length}/20
            </p>
          </div>

          {!shareMode && (
            <button type="button" onClick={() => setShareMode(true)} className="btn btn-ghost w-full">
              🔗 Partner B is remote?
            </button>
          )}

          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full text-lg py-4">
            {isSubmitting ? <span className="spinner spinner-small" /> : "📋 Submit"}
          </button>
        </form>
      </div>
    </main>
  );
}