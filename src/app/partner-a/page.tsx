"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface DisputeForm {
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

export default function PartnerAForm() {
  const router = useRouter();
  const [form, setForm] = useState<DisputeForm>({
    category: "",
    intensity: 3,
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.category) newErrors.category = "required";
    if (!form.description.trim()) newErrors.description = "required";
    else if (form.description.length < 20) newErrors.description = "too_short";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form.category, form.description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Shake animation
      const formEl = document.getElementById('dispute-form');
      formEl?.classList.add('animate-shake');
      setTimeout(() => formEl?.classList.remove('animate-shake'), 500);
      return;
    }

    setIsSubmitting(true);
    
    const caseId = `CASE-${Date.now().toString(36).toUpperCase()}`;
    const partnerASubmission = {
      id: caseId,
      partnerA: form,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("lovecourt_partner_a", JSON.stringify(partnerASubmission));
    
    router.push("/partner-b");
  };

  const handleBlur = (field: keyof DisputeForm) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate();
  };

  const updateField = (field: keyof DisputeForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const { [field]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 bg-pattern">
      <div className="container max-w-lg mx-auto w-full">
        {/* Back Link */}
        <Link href="/" className="btn btn-ghost mb-6 hover-glow">
          <span aria-hidden="true">←</span>
          Back to Court
        </Link>

        {/* Header with judge nod */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4 judge-nod" role="img" aria-label="Partner A">👤</span>
          <h1 className="display-2 font-serif text-[var(--cream)] mb-2">
            Partner A&apos;s Turn
          </h1>
          <p className="text-[var(--text-secondary)]">
            Present your side of the story
          </p>
        </div>

        {/* Progress */}
        <div className="progress-track mb-8">
          <div className="progress-bar" style={{ width: '33%' }} />
        </div>

        {/* Form with slide in from right */}
        <form 
          id="dispute-form"
          onSubmit={handleSubmit} 
          className="space-y-8 animate-slide-right"
        >
          {/* Category - Card Grid */}
          <div>
            <fieldset>
              <legend className="text-sm font-medium text-[var(--text-secondary)] mb-4">
                What are you disputing?
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
              <p className="text-[var(--error)] text-sm mt-2 animate-shake" role="alert">
                Please select a category
              </p>
            )}
          </div>

          {/* Intensity - styled slider */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-4 flex justify-between">
              <span>How intense is this?</span>
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
                  aria-pressed={form.intensity >= level}
                  className={`flex-1 py-4 rounded-lg font-semibold transition-all duration-200 ${
                    level <= form.intensity 
                      ? 'bg-gradient-to-b from-[var(--gold-500)] to-[var(--gold-600)] text-[var(--navy-900)] shadow-glow' 
                      : 'bg-[var(--bg-interactive)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2 px-1">
              <span>Chill 😌</span>
              <span>WOR ⚔️</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label 
              htmlFor="description" 
              className="text-sm font-medium text-[var(--text-secondary)] mb-3 block"
            >
              Describe your side of the dispute
              <span className="text-[var(--accent)] ml-1">*</span>
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={e => updateField("description", e.target.value)}
              onBlur={() => handleBlur('description')}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "desc-error" : undefined}
              rows={5}
              placeholder="What happened? Why are you right? Give us the details... The more context, the fairer the judgment."
              className={`w-full px-4 py-3 rounded-lg bg-[var(--bg-surface)] border-2 transition-all resize-none input-glow ${
                errors.description && touched.description
                  ? 'border-[var(--error)]' 
                  : 'border-[var(--border)] focus:border-[var(--accent)]'
              }`}
            />
            <div className="flex justify-between text-sm mt-2">
              {errors.description && touched.description && (
                <p id="desc-error" className="text-[var(--error)] text-sm">
                  {errors.description === 'too_short' 
                    ? 'Need more details please (20+ chars)' 
                    : 'Please describe your side'}
                </p>
              )}
              <span className={`ml-auto text-sm ${
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
                Filing Case...
              </>
            ) : (
              <>
                📋 Submit My Case
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
          
          <p className="text-center text-xs text-[var(--text-muted)]">
            Data stays on your device • No account required
          </p>
        </form>
      </div>
    </main>
  );
}