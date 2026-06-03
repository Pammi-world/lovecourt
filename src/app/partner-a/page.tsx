"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DisputeForm {
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

export default function PartnerAForm() {
  const router = useRouter();
  const [form, setForm] = useState<DisputeForm>({
    category: "",
    intensity: 3,
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    // Store in localStorage for now
    const caseId = `CASE-${Date.now()}`;
    const partnerASubmission = {
      id: caseId,
      partnerA: form,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("lovecourt_partner_a", JSON.stringify(partnerASubmission));
    
    // Navigate to Partner B
    router.push("/partner-b");
  };

  const updateField = (field: keyof DisputeForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const { [field]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="container max-w-lg mx-auto w-full">
        {/* Back Link */}
        <Link href="/" className="btn btn-ghost mb-8">
          ← Back to Court
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl block mb-4 judge-nod">👤</span>
          <h1 className="display-2 font-serif text-[var(--cream)] mb-2">
            Partner A&apos;s Turn
          </h1>
          <p className="text-[var(--text-secondary)]">
            Present your side of the story
          </p>
        </div>

        {/* Progress */}
        <div className="progress-bar mb-8">
          <div className="progress-bar-fill" style={{ width: '33%' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-[slideInRight_0.3s_ease_forwards]">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              What are you disputing?
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

          {/* Intensity */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              How intense is this? <span className="text-[var(--accent)]">{form.intensity}/5</span>
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
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
              <span>Calm</span>
              <span>WAR</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Describe your side of the dispute
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={e => updateField("description", e.target.value)}
              rows={6}
              placeholder="What happened? Why are you right? Give us the details..."
              className={`w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border ${
                errors.description ? 'border-[var(--error)]' : 'border-[var(--border)]'
              } focus:border-[var(--accent)] transition-all resize-none input-glow`}
            />
            <div className="flex justify-between text-sm mt-1">
              {errors.description && (
                <p className="text-[var(--error)]">Describe in more detail</p>
              )}
              <span className="text-[var(--text-muted)] ml-auto">
                {form.description.length} chars
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? (
              <>
                <span className="spinner" />
                Saving...
              </>
            ) : (
              <>
                Submit My Case →
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}