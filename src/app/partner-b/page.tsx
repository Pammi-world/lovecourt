"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface Submission {
  category: string;
  intensity: number;
  description: string;
}

const categories = [
  { value: "chores", label: "Chores", emoji: "🧹" },
  { value: "money", label: "Money", emoji: "💰" },
  { value: "communication", label: "Communication", emoji: "💬" },
  { value: "time", label: "Time", emoji: "⏰" },
  { value: "affection", label: "Affection", emoji: "❤️" },
  { value: "other", label: "Other", emoji: "🤷" },
];

const categoryEmojis: Record<string, string> = {
  chores: "🧹", money: "💰", communication: "💬", time: "⏰", affection: "❤️", other: "🤷"
};

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
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
    else if (form.description.length < 20) newErrors.description = "too_short";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const formEl = document.getElementById('dispute-form-b');
      formEl?.classList.add('animate-shake');
      setTimeout(() => formEl?.classList.remove('animate-shake'), 500);
      return;
    }

    setIsSubmitting(true);
    
    const partnerAData = JSON.parse(localStorage.getItem("lovecourt_partner_a") || "{}");
    
    const caseId = partnerAData.id || `CASE-${Date.now().toString(36).toUpperCase()}`;
    const fullCase = {
      id: caseId,
      partnerA: partnerAData.partnerA,
      partnerB: form,
      createdAt: partnerAData.timestamp,
      status: 'complete',
    };
    localStorage.setItem("lovecourt_current", JSON.stringify(fullCase));
    
    router.push("/verdict");
  };

  const handleBlur = (field: keyof Submission) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate();
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
          <span className="text-5xl block mb-4 judge-bounce">⏳</span>
          <p className="text-[var(--text-secondary)]">Waiting for Partner A to file...</p>
          <Link href="/" className="btn btn-ghost mt-6">
            ← Go to Court
          </Link>
        </div>
      </main>
    );
  }

  const { partnerA: partnerASubmission } = partnerA;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 bg-pattern">
      <div className="container max-w-lg mx-auto w-full">
        {/* Back Link */}
        <Link href="/partner-a" className="btn btn-ghost mb-6 hover-glow">
          <span aria-hidden="true">←</span>
          Back
        </Link>

        {/* Header with judge */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4 judge-nod" role="img" aria-label="Partner B">👥</span>
          <h1 className="display-2 font-serif text-[var(--cream)] mb-2">
            Partner B&apos;s Turn
          </h1>
          <p className="text-[var(--text-secondary)]">
            Now hear both sides equally
          </p>
        </div>

        {/* Partner A Summary Card */}
        <div className="card mb-8 animate-slide-left border-l-4 border-l-[var(--gold-500)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--gold-400)]">
              📋 Partner A&apos;s Statement
            </h3>
            <span className="text-xs px-2 py-1 bg-[var(--bg-interactive)] rounded">
              READ ONLY
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {categoryEmojis[partnerASubmission?.category] || "🤔"}
              </span>
              <div>
                <span className="text-[var(--text-secondary)] capitalize">
                  {categories.find(c => c.value === partnerASubmission?.category)?.label}
                </span>
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4,5].map(i => (
                    <span 
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i <= (partnerASubmission?.intensity || 0)
                          ? 'bg-[var(--gold-500)]' 
                          : 'bg-[var(--bg-interactive)]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <blockquote className="border-l-2 border-[var(--border)] pl-4 italic text-[var(--text-muted)]">
              "{partnerASubmission?.description}"
            </blockquote>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-track mb-8">
          <div className="progress-bar" style={{ width: '66%' }} />
        </div>

        {/* Form */}
        <form 
          id="dispute-form-b"
          onSubmit={handleSubmit} 
          className="space-y-8 animate-slide-right"
        >
          {/* Category */}
          <div>
            <fieldset>
              <legend className="text-sm font-medium text-[var(--text-secondary)] mb-4">
                Your dispute category
                <span className="text-[var(--accent)] ml-1">*</span>
              </legend>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateField("category", cat.value)}
                    aria-pressed={form.category === cat.value}
                    className={`card card-interactive text-center py-4 ${
                      form.category === cat.value 
                        ? 'border-[var(--accent)] shadow-glow' 
                        : ''
                    }`}
                  >
                    <span className="text-2xl block mb-1">{cat.emoji}</span>
                    <span className="text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            {errors.category && touched.category && (
              <p className="text-[var(--error)] text-sm mt-2 animate-shake">
                Please select a category
              </p>
            )}
          </div>

          {/* Intensity */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-4 flex justify-between">
              <span>Your intensity level</span>
              <span className="text-[var(--gold-400)] font-bold">
                {form.intensity}/5
              </span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => updateField("intensity", level)}
                  className={`flex-1 py-4 rounded-lg font-semibold transition-all ${
                    level <= form.intensity 
                      ? 'bg-gradient-to-b from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-900)] shadow-glow' 
                      : 'bg-[var(--bg-interactive)] text-[var(--text-muted)]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Response */}
          <div>
            <label 
              htmlFor="response" 
              className="text-sm font-medium text-[var(--text-secondary)] mb-3 block"
            >
              Your rebuttal/response
              <span className="text-[var(--accent)] ml-1">*</span>
            </label>
            <textarea
              id="response"
              value={form.description}
              onChange={e => updateField("description", e.target.value)}
              onBlur={() => handleBlur('description')}
              aria-invalid={!!errors.description}
              rows={5}
              placeholder="Why is Partner A wrong? What's your side of the story?"
              className={`w-full px-4 py-3 rounded-lg bg-[var(--bg-surface)] border-2 transition-all resize-none input-glow ${
                errors.description && touched.description
                  ? 'border-[var(--error)]' 
                  : 'border-[var(--border)]'
              }`}
            />
            <div className="flex justify-between text-sm mt-2">
              {errors.description && touched.description && (
                <p className="text-[var(--error)]">
                  Tell us your side
                </p>
              )}
              <span className={`ml-auto ${
                form.description.length >= 20 
                  ? 'text-[var(--success)]' 
                  : 'text-[var(--text-muted)]'
              }`}>
                {form.description.length}/20 min
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full text-lg py-4"
          >
            {isSubmitting ? (
              <>
                <span className="spinner spinner-small" />
                Awaiting Judgment...
              </>
            ) : (
              <>
              ⚖️ Demand Justice
            </>
          )}
          </button>
        </form>
      </div>
    </main>
  );
}