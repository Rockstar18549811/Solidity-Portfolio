"use client";

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--dark)' }}>
      <style>{`
        @media (max-width: 768px) {
          .nav { padding: 20px 24px !important; }
          .nav-links { gap: 16px !important; }
          .nav-links a { font-size: 13px !important; }
          .hero { padding: 60px 24px !important; }
          .hero-subtitle { font-size: 13px !important; }
          .stats { grid-template-columns: 1fr !important; }
          .stat-item { border-right: none !important; border-bottom: 1px solid var(--border); padding: 32px 24px !important; }
          .projects { padding: 60px 24px !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .about { padding: 60px 24px !important; grid-template-columns: 1fr !important; gap: 40px !important; }
          .contact { padding: 60px 24px !important; }
          .contact-buttons { flex-direction: column !important; align-items: center !important; }
          .contact-buttons a { width: 100% !important; text-align: center !important; }
          .footer { padding: 24px !important; flex-direction: column !important; gap: 8px !important; text-align: center !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 60px', borderBottom: '1px solid var(--border)' }}>
        <span className="mono" style={{ color: 'var(--green)', fontSize: '18px', letterSpacing: '0.1em', fontWeight: '700' }}>
          ROCKSTAR
        </span>
        <div className="nav-links" style={{ display: 'flex', gap: '32px' }}>
          <a href="#projects" style={{ color: '#aaa', fontSize: '15px', textDecoration: 'none' }}>Projects</a>
          <a href="#about" style={{ color: '#aaa', fontSize: '15px', textDecoration: 'none' }}>About</a>
          <a href="#contact" style={{ color: '#aaa', fontSize: '15px', textDecoration: 'none' }}>Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 60px', borderBottom: '1px solid var(--border)' }}>
        <p className="mono hero-subtitle" style={{ color: 'var(--green)', fontSize: '15px', letterSpacing: '0.25em', marginBottom: '32px' }}>
          DEVELOPER · CREATOR · BUILDER
        </p>
        <h1 style={{ fontSize: 'clamp(36px, 8vw, 110px)', fontWeight: '800', lineHeight: '1.0', marginBottom: '32px', letterSpacing: '-1px' }}>
          Building the <span style={{ color: 'var(--green)' }}>decentralized</span><br />
          future.
        </h1>
        <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#888', lineHeight: '1.9', marginBottom: '48px', maxWidth: '560px' }}>
          Full stack developer, Web3 builder, and content creator — turning ideas into real products across blockchain, software, and the internet.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#projects" style={{ backgroundColor: 'var(--green)', color: '#000', padding: '14px 36px', borderRadius: '4px', fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: '700', textDecoration: 'none', letterSpacing: '0.05em' }}>
            VIEW PROJECTS →
          </a>
          <a href="#contact" style={{ border: '1px solid var(--border)', color: '#fff', padding: '14px 36px', borderRadius: '4px', fontFamily: 'Space Mono, monospace', fontSize: '13px', textDecoration: 'none', letterSpacing: '0.05em' }}>
            GET IN TOUCH
          </a>
        </div>
      </section>

      {/* STATS */}
      <section className="stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid var(--border)' }}>
        {[
          { number: '10+', label: 'Smart Contracts Deployed' },
          { number: '3', label: 'DeFi Protocols Built' },
          { number: '100%', label: 'On-chain & Transparent' },
        ].map((s, i) => (
          <div className="stat-item" key={i} style={{ padding: '48px 60px', borderRight: i < 2 ? '1px solid var(--border)' : 'none', textAlign: 'center' }}>
            <div className="mono" style={{ fontSize: '42px', fontWeight: '700', color: 'var(--green)', marginBottom: '8px' }}>{s.number}</div>
            <div style={{ fontSize: '15px', color: '#666' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* PROJECTS */}
      <section id="projects" className="projects" style={{ padding: '100px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p className="mono" style={{ color: 'var(--green)', fontSize: '14px', letterSpacing: '0.2em', marginBottom: '12px' }}>PORTFOLIO</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '700' }}>Tools I've shipped</h2>
          <p style={{ color: '#666', fontSize: '15px', marginTop: '12px' }}>Real, working Solidity tools — click any to explore.</p>
        </div>
        <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: 'var(--border)' }}>
          {[
            { title: 'Token Economics Simulator', desc: 'Model token supply, burn rate, mint rate and visualize 5-year market cap projections in real time.', tag: 'DeFi Tool', href: '/simulator' },
            { title: 'Smart Contract Explainer', desc: 'Paste any Solidity contract and instantly get a plain-English breakdown of every function and variable.', tag: 'Analysis Tool', href: '/explainer' },
            { title: 'Audit Checklist Tool', desc: 'Step through a professional security checklist before deploying any smart contract to the blockchain.', tag: 'Security Tool', href: '/audit' },
          ].map((p, i) => (
            <div key={i}
              style={{ backgroundColor: 'var(--card)', padding: '40px 36px', cursor: 'pointer', transition: 'background 0.2s', textAlign: 'center' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#161616'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--card)'}
            >
              <span className="mono" style={{ fontSize: '12px', color: 'var(--green)', letterSpacing: '0.15em' }}>{p.tag}</span>
              <h3 style={{ fontSize: '22px', fontWeight: '600', margin: '16px 0 12px' }}>{p.title}</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7', marginBottom: '28px' }}>{p.desc}</p>
              <a href={p.href} className="mono" style={{ fontSize: '13px', color: 'var(--green)', textDecoration: 'none' }}>OPEN PROJECT →</a>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about" style={{ padding: '100px 60px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        <div>
          <p className="mono" style={{ color: 'var(--green)', fontSize: '14px', letterSpacing: '0.2em', marginBottom: '16px' }}>ABOUT</p>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '700', marginBottom: '24px', lineHeight: '1.2' }}>More than just a developer</h2>
          <p style={{ fontSize: '16px', color: '#888', lineHeight: '1.9', marginBottom: '20px' }}>
            I'm Godwin — a full stack developer, blockchain builder, and content creator. I work across the entire stack: from writing smart contracts in Solidity to building sleek frontends, designing APIs, and shipping products people actually use.
          </p>
          <p style={{ fontSize: '16px', color: '#888', lineHeight: '1.9', marginBottom: '20px' }}>
            I'm still learning and growing every day — but what sets me apart is that I build in public, document my journey, and create content around everything I make. I don't just write code, I tell the story behind it.
          </p>
          <p style={{ fontSize: '16px', color: '#888', lineHeight: '1.9' }}>
            Open to freelance projects, full-time roles, collaborations, and anything in between. If you're building something interesting — let's talk.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { skill: 'Solidity / Smart Contracts', level: '75%' },
            { skill: 'Frontend — React & Next.js', level: '70%' },
            { skill: 'Backend — Node.js', level: '65%' },
            { skill: 'Python', level: '60%' },
            { skill: 'UI/UX Design', level: '70%' },
            { skill: 'DevOps / Cloud', level: '55%' },
            { skill: 'Content Creation', level: '85%' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '14px', color: '#ccc' }}>{s.skill}</span>
                <span className="mono" style={{ fontSize: '12px', color: 'var(--green)' }}>{s.level}</span>
              </div>
              <div style={{ backgroundColor: 'var(--border)', borderRadius: '2px', height: '3px' }}>
                <div style={{ height: '100%', width: s.level, backgroundColor: 'var(--green)', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact" style={{ padding: '100px 60px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p className="mono" style={{ color: 'var(--green)', fontSize: '14px', letterSpacing: '0.2em', marginBottom: '16px' }}>CONTACT</p>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '700', marginBottom: '16px' }}>Got an idea? Let's build it.</h2>
        <p style={{ fontSize: '16px', color: '#888', marginBottom: '48px', maxWidth: '520px', margin: '0 auto 48px', lineHeight: '1.8' }}>
          Whether it's a smart contract, a web app, a content collab, or just a conversation about what's possible — I'm open. Reach out and let's make something real.
        </p>
        <div className="contact-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:your@email.com" style={{ backgroundColor: 'var(--green)', color: '#000', padding: '14px 36px', borderRadius: '4px', fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: '700', textDecoration: 'none', letterSpacing: '0.05em' }}>
            EMAIL ME →
          </a>
          <a href="https://github.com/Rockstar18549811" target="_blank" style={{ border: '1px solid var(--border)', color: '#fff', padding: '14px 36px', borderRadius: '4px', fontFamily: 'Space Mono, monospace', fontSize: '13px', textDecoration: 'none', letterSpacing: '0.05em' }}>
            GITHUB
          </a>
          <a href="https://twitter.com/" target="_blank" style={{ border: '1px solid var(--border)', color: '#fff', padding: '14px 36px', borderRadius: '4px', fontFamily: 'Space Mono, monospace', fontSize: '13px', textDecoration: 'none', letterSpacing: '0.05em' }}>
            TWITTER
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" style={{ borderTop: '1px solid var(--border)', padding: '32px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ color: 'var(--muted)', fontSize: '14px' }}>ROCKSTAR © 2026</span>
        <span className="mono" style={{ color: 'var(--muted)', fontSize: '14px' }}>Built with Next.js</span>
      </footer>

    </main>
  );
}