"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Submission {
  category: string;
  intensity: number;
  description: string;
}

const categories = [
  { value: "chores", label: "🧹 Chores", emoji: "🧹" },
  { value: "money", label: "💰 Money", emoji: "💰" },
  { value: "communication", label: "💬 Communication", emoji: "💬" },
  { value: "time", label: "⏰ Time Management", emoji: "⏰" },
  { value: "other", label: "🤷 Other", emoji: "🤷" },
];

export default function PartnerBForm() {
  const router = useRouter();
  const [partnerA, setPartnerA] = useState<{ partnerA: Submission } | null>(null);
  const [form, setForm] = useState<Submission>({
    category: "",
    intensity: 3,
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lovecourt_partner_a");
    if (stored) {
      setPartnerA(JSON.parse(stored));
    } else {
      router.push("/partner-a");
    }
  }, [router]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.category) newErrors.category = "required";
    if (!form.description.trim()) newErrors.description = "required";
    if (form.description.length < 20) newErrors.description = "too_short";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    const partnerAData = JSON.parse(localStorage.getItem("lovecourt_partner_a") || "{}");
    
    const caseId = partnerAData.id || `CASE-${Date.now()}`;
    const fullCase = {
      id: caseId,
      partnerA: partnerAData.partnerA,
      partnerB: form,
      createdAt: partnerAData.timestamp,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem("lovecourt_current", JSON.stringify(fullCase));
    
    router.push("/verdict");
  };

  const updateField = (field: keyof Submission, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const { [field]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  if (!partnerA) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <span className="text-4xl block mb-4 judge-bounce">⏳</span>
          <p className="text-[var(--text-secondary)]">Waiting for Partner A...</p>
        </div>
      </main>
    );
  }

  const { partnerA: partnerASubmission } = partnerA;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="container max-w-lg mx-auto w-full">
        <Link href="/partner-a" className="btn btn-ghost mb-8">
          ← Back
        </Link>

        <div className="text-center mb-8">
          <span className="text-4xl block mb-4 judge-nod">👥</span>
          <h1 className="display-2 font-serif text-[var(--cream)] mb-2">
            Partner B&apos;s Turn
          </h1>
          <p className="text-[var(--text-secondary)]">
            Now hear both sides equally
          </p>
        </div>

        <div className="card mb-8 animate-[slideInLeft_0.3s_ease_forwards]">
          <h3 className="text-sm font-medium text-[var(--accent)] mb-4">
            📋 Partner A&apos;s Statement
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {categories.find(c => c.value === partnerASubmission?.category)?.emoji || "🤔"}
              </span>
              <span className="text-[var(--text-secondary)]">
                {categories.find(c => c.value === partnerASubmission?.category)?.label}
              </span>
              <span className="ml-auto bg-[var(--accent)] text-[var(--navy-900)] px-2 py-0.5 rounded text-sm font-medium">
                {partnerASubmission?.intensity}/5
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-sm">
              {partnerASubmission?.description}
            </p>
          </div>
        </div>

        <div className="progress-bar mb-8">
          <div className="progress-bar-fill" style={{ width: '66%' }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-[slideInRight_0.3s_ease_forwards]">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Your dispute category
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => updateField("category", cat.value)}
                  className={`card text-left transition-all ${
                    form.category === cat.value 
                      ? 'border-[var(--accent)] shadow-[var(--shadow-glow)]' 
                      : ''
                  }`}
                >
                  <span className="text-xl mr-2">{cat.emoji}</span>
                  {cat.label.replace(/^.+\s/, '')}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-[var(--error)] text-sm mt-2">Please select a category</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Your intensity level <span className="text-[var(--accent)]">{form.intensity}/5</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => updateField("intensity", level)}
                  className={`flex-1 py-4 rounded-[var(--radius-md)] transition-all ${
                    level <= form.intensity 
                      ? 'bg-[var(--accent)] text-[var(--navy-900)]' 
                      : 'bg-[var(--bg-interactive)]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="response" className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Your rebuttal/response
            </label>
            <textarea
              id="response"
              value={form.description}
              onChange={e => updateField("description", e.target.value)}
              rows={6}
              placeholder="Why is Partner A wrong? What's your side?"
              className={`w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border ${
                errors.description ? 'border-[var(--error)]' : 'border-[var(--border)]'
              } focus:border-[var(--accent)] transition-all resize-none input-glow`}
            />
            <div className="flex justify-between text-sm mt-1">
              {errors.description && (
                <p className="text-[var(--error)]">Tell us your side</p>
              )}
              <span className="text-[var(--text-muted)] ml-auto">
                {form.description.length} chars
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? (
              <>
                <span className="spinner" />
                Await Judgment...
              </>
            ) : (
              <>
                Demand Justice ⚖️
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}