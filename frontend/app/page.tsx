import { auth } from "@clerk/nextjs/server";
import { LandingCta } from "@/components/landing-cta";
import { LandingHeader } from "@/components/landing-header";

const steps = [
  ["01", "Get a topic", "Receive a prompt that takes you somewhere unfamiliar."],
  ["02", "Research", "Gather enough context to form your own point of view."],
  ["03", "Think", "Find the thread between what you know and what you discover."],
  ["04", "Speak", "Put it into your own words. Keep going for two minutes."],
];

export default async function Home() {
  // Resolves on the server so the correct CTA ships in the initial HTML.
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  return (
    <div className="offscript-landing">
      <section className="landing-hero">
        <LandingHeader isSignedIn={isSignedIn} />

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
              AI can give you the words, but Offscript makes you find your own. Get an unexpected topic, research the facts, and speak spontaneously for two minutes.
            </p>
            <div className="landing-hero-buttons">
              <LandingCta
                isSignedIn={isSignedIn}
                className="landing-primary-cta"
                signedOutLabel="Get a Topic"
              />
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
            <span>We have never had more help finding the words.</span>
            <span>Maybe that&apos;s why we should practice finding our own.</span>
          </h2>
          <p className="idea-emphasis">Don&apos;t ask AI what to say. Find out what you think.</p>
          <p className="section-copy">
            When we constantly rely on AI to formulate our arguments, generate our presentations, and tell us what to say, we gradually lose the muscle of thinking on our feet.
            <br />
            <br />
            Offscript gives you an unexpected topic and one simple rule: research the facts, form your own perspective, and speak for two minutes — in your own words.
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

          {/* Illustrative only — not anybody's real activity. Real data lives
              behind sign-in on /progress. */}
          <div className="progress-panel" aria-label="Example progress panel">
            <p className="example-tag">Example</p>
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
              <span>Speaking Activity — example</span>
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
          <LandingCta
            isSignedIn={isSignedIn}
            className="landing-primary-cta"
            signedOutLabel="Start practicing"
            signedInLabel="Back to your dashboard"
          />
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
