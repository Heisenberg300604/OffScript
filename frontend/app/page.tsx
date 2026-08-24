"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const steps = [
  ["01", "Get a topic", "Receive a prompt that takes you somewhere unfamiliar."],
  ["02", "Research", "Gather enough context to form your own point of view."],
  ["03", "Think", "Find the thread between what you know and what you discover."],
  ["04", "Speak", "Put it into your own words. Keep going for two minutes."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="offscript-landing">
      <section className="landing-hero">
        <header className="landing-nav">
          <Link href="/" className="landing-logo">
            OFFSCRIPT
          </Link>
          <nav className="landing-links" aria-label="Main navigation">
            <a href="#practice">Practice</a>
            <a href="#progress">Progress</a>
            <a href="#how-it-works">How it works</a>
          </nav>
          <div className="landing-actions">
            <Link href="/dashboard" className="landing-signin">
              Sign in
            </Link>
            <Link href="/dashboard" className="landing-nav-cta">
              Get started <ArrowRight size={15} />
            </Link>
          </div>
          <button
            type="button"
            className="landing-menu-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {menuOpen && (
          <nav className="landing-mobile-menu" aria-label="Mobile navigation">
            <a href="#practice" onClick={() => setMenuOpen(false)}>
              Practice
            </a>
            <a href="#progress" onClick={() => setMenuOpen(false)}>
              Progress
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
              Get started <ArrowRight size={15} />
            </Link>
          </nav>
        )}

        <div className="landing-hero-content">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow">
              RESEARCH <span>·</span> THINK <span>·</span> SPEAK <span>·</span> REPEAT
            </p>
            <h1>
              <span className="headline-speak">Speak</span>
              <span className="headline-script">without a script.</span>
            </h1>
            <p className="landing-lede">
              Get an unexpected topic. Think it through. Then speak about it for two
              minutes — in your own words.
            </p>
            <div className="landing-hero-buttons">
              <Link href="/dashboard" className="landing-primary-cta">
                Get a Topic <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="landing-secondary-cta">
                How it works
              </a>
            </div>
          </div>
        </div>

        <div className="challenge-badge">
          <span className="challenge-time">02:00</span>
          <span className="challenge-label">MINIMUM SPEAKING CHALLENGE</span>
        </div>
      </section>

      <main className="landing-main">
        <section id="practice" className="landing-section idea-section">
          <p className="section-kicker">THE IDEA</p>
          <h2 className="editorial-heading">
            <span>You don&apos;t need</span>
            <span>another communication course.</span>
          </h2>
          <p className="idea-emphasis">You need to speak.</p>
          <p className="section-copy">
            Most people want to become better communicators, but rarely practice
            speaking when they don&apos;t already know exactly what to say.
            <br />
            <br />
            OffScript gives you an unexpected topic and one simple challenge: think
            about it, then speak.
          </p>
        </section>

        <section id="how-it-works" className="landing-section process-section">
          <div className="section-intro">
            <p className="section-kicker">THE PROCESS</p>
            <h2 className="editorial-heading">Research → Think → Speak → Repeat</h2>
            <p className="process-line">
              Research <span>→</span> Think <span>→</span> Speak <span>→</span> Repeat
            </p>
          </div>
          <div className="steps-grid">
            {steps.map(([number, title, copy]) => (
              <article className="step" key={number}>
                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section challenge-section">
          <div className="timer-mark" aria-label="Two minute challenge timer">
            <span>02:00</span>
            <div className="timer-line">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <p className="section-kicker">THE TWO-MINUTE CHALLENGE</p>
          <h2>
            Just keep <em>speaking</em>.
          </h2>
          <p>
            There is no perfect answer. There is no correct opinion.
            <br />
            The only rule is simple: keep speaking for at least two minutes.
          </p>
        </section>

        <section id="progress" className="landing-section progress-section">
          <div className="progress-copy">
            <p className="section-kicker">CONSISTENCY</p>
            <h2 className="editorial-heading">Consistency is the goal.</h2>
            <p className="section-copy">
              One challenge today. Another tomorrow. Over time, the practice adds up.
            </p>
          </div>

          <div className="progress-panel">
            <div className="progress-stats">
              <div>
                <strong>🔥 14</strong>
                <span>day streak</span>
              </div>
              <div>
                <strong>23</strong>
                <span>speaking sessions</span>
              </div>
              <div>
                <strong>47</strong>
                <span>minutes spoken</span>
              </div>
            </div>

            <div className="heatmap-heading">
              <span>Speaking Activity</span>
              <span>
                Less <i className="heatmap-dot empty" /> <i className="heatmap-dot low" />
                <i className="heatmap-dot mid" /> <i className="heatmap-dot high" /> More
              </span>
            </div>

            <div className="landing-heatmap" aria-label="Speaking activity heatmap">
              {Array.from({ length: 42 }, (_, index) => (
                <i
                  key={index}
                  className={`heatmap-dot ${
                    [2, 5, 9, 10, 14, 17, 21, 24, 25, 29, 33, 36, 38, 41].includes(index)
                      ? "high"
                      : [1, 6, 12, 15, 20, 27, 31, 35].includes(index)
                        ? "mid"
                        : [4, 8, 13, 22, 30, 37].includes(index)
                          ? "low"
                          : "empty"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section archive-section">
          <p className="section-kicker">YOUTUBE ARCHIVE</p>
          <h2 className="editorial-heading">Keep the evidence.</h2>
          <p className="section-copy archive-copy">
            Record your session, upload it to YouTube as Unlisted, and keep a private
            archive of your progress.
            <br />
            <br />
            Day 1. Day 30. Hear the difference yourself.
          </p>
        </section>

        <section className="final-cta">
          <p className="section-kicker">OFFSCRIPT</p>
          <h2>
            You don&apos;t become
            <br />
            comfortable speaking
            <br />
            by thinking about it.
          </h2>
          <p>You speak.</p>
          <Link href="/dashboard" className="landing-primary-cta">
            Start practicing <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <footer className="landing-footer">
        <span>OFFSCRIPT</span>
        <span>Research · Think · Speak · Repeat</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
