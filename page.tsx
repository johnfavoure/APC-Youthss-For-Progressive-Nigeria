import Link from "next/link";

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">APC</span><span>YOUTH FOR<br />PROGRESSIVE NIGERIA</span></Link>
        <nav><Link href="#about">About</Link><Link href="#membership">Membership</Link><Link href="#contact">Contact</Link></nav>
        <Link className="nav-login" href="/register">Join / Register</Link>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">NATIONAL MEMBERSHIP PORTAL</span>
          <h1>Building a platform for <em>youth participation.</em></h1>
          <p>This is the proposed digital home for membership information, organizational updates and approved community programmes.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/register">Start membership registration <span>→</span></Link>
            <Link className="button button-outline" href="#about">Learn about the platform</Link>
          </div>
          <p className="small-note">Membership applications are subject to eligibility checks and manual review.</p>
        </div>
        <div className="hero-panel">
          <div className="panel-top"><span className="dot"></span> MEMBERSHIP PORTAL <span className="panel-line"></span></div>
          <div className="panel-emblem">APC</div>
          <h2>One platform.<br />Nationwide access.</h2>
          <p>Designed to support an organized membership experience across Nigeria.</p>
          <div className="panel-bottom"><span>36 STATES + FCT</span><span>18+ MEMBERSHIP</span></div>
        </div>
      </section>

      <section className="feature-section" id="about">
        <div className="section-heading"><span className="eyebrow">THE PLATFORM</span><h2>Clear information. Responsible administration.</h2><p>The initial release focuses on secure registration and transparent application review.</p></div>
        <div className="feature-grid">
          <article className="feature-card"><span className="feature-number">01</span><h3>Membership registration</h3><p>Submit your details through a guided registration process with an age requirement of 18 years and above.</p></article>
          <article className="feature-card"><span className="feature-number">02</span><h3>Manual verification</h3><p>Applications remain pending until an authorized administrator reviews and records a decision.</p></article>
          <article className="feature-card"><span className="feature-number">03</span><h3>Membership identification</h3><p>Approved members can receive a digital and printable membership card with a secure verification reference.</p></article>
        </div>
      </section>

      <section className="join-band" id="membership"><div><span className="eyebrow">MEMBERSHIP</span><h2>Ready to begin registration?</h2><p>Prepare your contact and location information before starting. Only submit information you are authorized to provide.</p></div><Link className="button button-light" href="/register">Create an account <span>→</span></Link></section>
      <footer id="contact"><div className="footer-brand">APC YOUTH FOR PROGRESSIVE NIGERIA</div><p>Official platform information should be confirmed by the organization before public launch.</p><span>© {new Date().getFullYear()} APC Youth For Progressive Nigeria. All rights reserved.</span></footer>
    </main>
  );
}
