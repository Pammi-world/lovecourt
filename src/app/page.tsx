import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-pattern">
      <div className="container max-w-lg mx-auto text-center">
        {/* Judge Character - greeting bounce */}
        <div className="mb-8">
          <span 
            className="text-8xl block mb-4 judge-bounce"
            role="img"
            aria-label="Judge with gavel"
          >
            ⚖️
          </span>
        </div>

        {/* Tagline with staggered entrance */}
        <h1 className="display-1 font-serif text-[var(--cream)] mb-4 animate-fade-up" style={{ animationDelay: '0ms' }}>
          Let the Judge Decide
        </h1>
        
        <p className="text-xl text-[var(--text-secondary)] mb-2 animate-fade-up" style={{ animationDelay: '100ms', opacity: 0 }}>
          Can&apos;t agree? Let an impartial judge settle it.
        </p>
        
        <p className="text-base text-[var(--text-muted)] mb-8 animate-fade-up" style={{ animationDelay: '200ms', opacity: 0 }}>
          Couples dispute resolution from the comfort of your couch.
        </p>

        {/* Partner Selection - staggered cards */}
        <div className="flex flex-col gap-4 max-w-sm mx-auto stagger-children">
          <Link 
            href="/partner-a"
            className="card card-interactive animate-slide-up"
            style={{ animationDelay: '300ms', opacity: 0 }}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">👤</span>
              <div className="text-left">
                <span className="block font-semibold text-[var(--cream)]">I&apos;m Partner A</span>
                <span className="text-sm text-[var(--text-muted)]">Start a new case</span>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/partner-b"
            className="card card-interactive animate-slide-up"
            style={{ animationDelay: '400ms', opacity: 0 }}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">👥</span>
              <div className="text-left">
                <span className="block font-semibold text-[var(--cream)]">I&apos;m Partner B</span>
                <span className="text-sm text-[var(--text-muted)]">Respond to a case</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Past Disputes Link */}
        <div className="mt-8 animate-fade-up" style={{ animationDelay: '500ms', opacity: 0 }}>
          <Link 
            href="/history"
            className="btn btn-ghost text-sm hover-glow"
          >
            <span aria-hidden="true">📜</span>
            View Past Disputes
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)]">
            Made with 💕 for relationships everywhere
          </p>
        </footer>
      </div>
    </main>
  );
}