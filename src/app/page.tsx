import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="container max-w-lg mx-auto text-center">
        {/* Judge Character */}
        <div className="judge-container mb-8">
          <span 
            className="text-8xl block mb-4 animate-[bounce_2s_ease-in-out_infinite]"
            role="img"
            aria-label="Judge gavel"
          >
            ⚖️
          </span>
        </div>

        {/* Tagline */}
        <h1 className="display-1 font-serif text-[var(--cream)] mb-4">
          Let the Judge Decide
        </h1>
        
        <p className="text-xl text-[var(--text-secondary)] mb-2">
          Can&apos;t agree? Let an impartial judge settle it.
        </p>
        
        <p className="text-base text-[var(--text-muted)] mb-8">
          Couples dispute resolution from the comfort of your couch.
        </p>

        {/* Partner Selection */}
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <Link 
            href="/partner-a"
            className="btn btn-primary w-full animate-[fadeUp_0.4s_ease_forwards]"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            <span aria-hidden="true">👤</span>
            I&apos;m Partner A
          </Link>
          
          <Link 
            href="/partner-b"
            className="btn btn-secondary w-full animate-[fadeUp_0.4s_ease_forwards]"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            <span aria-hidden="true">👥</span>
            I&apos;m Partner B
          </Link>
        </div>

        {/* Past Disputes Link */}
        <div className="mt-8 animate-[fadeUp_0.4s_ease_forwards]" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <Link 
            href="/history"
            className="btn btn-ghost text-sm"
          >
            📜 View Past Disputes
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