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
  return <div className="offscript-landing">
    <section className="landing-hero" style={{ backgroundImage: "url('/landing.png')" }}>
      <div className="landing-overlay" />
      <header className="landing-nav"><Link href="/" className="landing-logo">OFFSCRIPT</Link><nav className="landing-links"><a href="#practice">Practice</a><a href="#progress">Progress</a><a href="#how-it-works">How it works</a></nav><div className="landing-actions"><Link href="/dashboard" className="landing-signin">Sign in</Link><Link href="/dashboard" className="landing-nav-cta">Get started <ArrowRight size={15}/></Link></div><button className="landing-menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button></header>
      {menuOpen && <nav className="landing-mobile-menu"><a href="#practice" onClick={() => setMenuOpen(false)}>Practice</a><a href="#progress" onClick={() => setMenuOpen(false)}>Progress</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><Link href="/dashboard">Get started <ArrowRight size={15}/></Link></nav>}
      <div className="landing-hero-content"><p className="landing-eyebrow">RESEARCH <span>·</span> THINK <span>·</span> SPEAK <span>·</span> REPEAT</p><h1>Speak<br/>without a<br/><em>script.</em></h1><p className="landing-lede">Get an unexpected topic. Think it through.<br className="desktop-break"/> Then speak for two minutes.</p><div className="landing-hero-buttons"><Link href="/dashboard" className="landing-primary-cta">Get a topic <ArrowRight size={18}/></Link><a href="#how-it-works" className="landing-secondary-cta">How it works</a></div></div><div className="challenge-badge"><strong>2:00</strong><span>MINIMUM SPEAKING<br/>CHALLENGE</span></div><a href="#practice" className="hero-scroll" aria-label="Scroll to learn more"><span /> Scroll to explore</a>
    </section>
    <main>
      <section id="practice" className="landing-section idea-section"><p className="section-kicker">THE PRACTICE</p><h2>You don&apos;t need another<br className="desktop-break"/> communication course.</h2><p className="idea-emphasis">You need to speak.</p><p className="section-copy">Communication improves through practice. OffScript gives you something unexpected to talk about, so you learn to organize your thoughts and express them without relying on a prepared script.</p></section>
      <section id="how-it-works" className="landing-section process-section"><div className="section-intro"><p className="section-kicker">HOW IT WORKS</p><h2>Make room for the<br/> unexpected.</h2><p className="process-line">Research <span>→</span> Think <span>→</span> Speak <span>→</span> Repeat</p></div><div className="steps-grid">{steps.map(([number, title, copy]) => <article className="step" key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
      <section className="challenge-section"><div className="timer-mark"><span>02:00</span><div className="timer-line"><i /><i /><i /><i /><i /><i /><i /></div></div><p className="section-kicker">THE TWO-MINUTE CHALLENGE</p><h2>Just keep speaking.</h2><p>There is no perfect answer. There is no correct opinion.<br className="desktop-break"/> Just speak in your own words for at least two minutes.</p></section>
      <section id="progress" className="landing-section progress-section"><div><p className="section-kicker">YOUR PROGRESS</p><h2>Consistency<br/>is the goal.</h2><p className="section-copy">Small, repeated efforts become a voice you trust. Keep showing up, one unexpected topic at a time.</p></div><div className="progress-panel"><div className="progress-stats"><div><strong>14</strong><span>day streak</span></div><div><strong>23</strong><span>speaking sessions</span></div><div><strong>47</strong><span>minutes spoken</span></div></div><div className="heatmap-heading"><span>Speaking activity</span><span>Less <i className="heatmap-dot empty"/> <i className="heatmap-dot low"/> <i className="heatmap-dot mid"/> <i className="heatmap-dot high"/> More</span></div><div className="landing-heatmap">{Array.from({ length: 42 }, (_, index) => <i key={index} className={`heatmap-dot ${[2, 5, 9, 10, 14, 17, 21, 24, 25, 29, 33, 36, 38, 41].includes(index) ? "high" : [1, 6, 12, 15, 20, 27, 31, 35].includes(index) ? "mid" : [4, 8, 13, 22, 30, 37].includes(index) ? "low" : "empty"}`} />)}</div></div></section>
      <section className="final-cta"><p className="section-kicker">OFFSCRIPT</p><h2>You don&apos;t become<br/> comfortable speaking<br/> by thinking about it.</h2><p>You speak.</p><Link href="/dashboard" className="landing-primary-cta">Start practicing <ArrowRight size={18}/></Link></section>
    </main><footer className="landing-footer"><span>OFFSCRIPT</span><span>Research · Think · Speak · Repeat</span><span>© 2026</span></footer>
  </div>;
}
