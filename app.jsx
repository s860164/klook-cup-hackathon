// ────────────────────────────────────────────────────────────────
// AI Hackathon — Season 2 · Taipei
// Landing page React app
// ────────────────────────────────────────────────────────────────

const { useState, useEffect, useRef, useMemo } = React;

const p = (path) => path ? path.replace(/ /g, '%20') : path;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "taipei-night",
  "accentColor": "#FF5722",
  "confetti": true,
  "showVideoBg": true,
  "bgPalette": "warm"
}/*EDITMODE-END*/;

const HERO_VARIANTS = [
  { id: 'taipei-night',  label: 'Taipei Night' },
  { id: 'daylight',      label: 'Daylight' },
  { id: 'burst',         label: 'Confetti Burst' },
];

const ACCENT_OPTIONS = [
  '#FF5722',
  '#5533FF',
  '#00A5A0',
];

// ─── deadline: June 15 2026 12:00 Taiwan time (UTC+8) → 04:00 UTC
const DEADLINE = new Date('2026-06-15T04:00:00Z');

const MEDAL = {
  champion: { emoji: '🏆', label: 'Champion',   color: '#D4A017' },
  second:   { emoji: '🥈', label: '2nd Place',  color: '#8E9AAA' },
  third:    { emoji: '🥉', label: '3rd Place',  color: '#CC6600' },
};

// ─── Video Player Component ──────────────────────────────────────
function VideoPlayer({ src, autoPlay = false, style = {} }) {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [src]);

  if (!src) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#0D0B3E', ...style }}>
      {loading && !error && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'rgba(255,255,255,.7)',
          zIndex: 2
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '3px solid rgba(255,87,34,.3)', borderTopColor: '#FF5722',
            animation: 'spin 0.8s linear infinite'
          }} />
          <div style={{ fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700 }}>Loading…</div>
        </div>
      )}
      {error && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'rgba(255,255,255,.7)',
          zIndex: 2, padding: 24, textAlign: 'center'
        }}>
          <div style={{ fontSize: 32 }}>⚠️</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Video unavailable</div>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        onLoadedMetadata={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true); }}
        autoPlay={autoPlay}
      >
        <source src={src} type="video/mp4" />
      </video>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Top Bar ────────────────────────────────────────────────────
function TopBar() {
  return (
    <header className="topbar" data-screen-label="Top Bar">
      <div className="topbar-logo">
        <img src="assets/klook/klook-logo-white.png" alt="Klook" />
        <span className="topbar-pill">🤖 AI HACKATHON · SEASON 2</span>
      </div>
      <nav className="topbar-nav">
        <a href="#schedule">Schedule</a>
        <a href="#judges">Judges</a>
        <a href="#faq">FAQ</a>
        <a href="#season-1" className="topbar-lookback">Season 1 Lookback ↑</a>
        <a href="#submit" className="topbar-cta">Submit Your Idea →</a>
      </nav>
    </header>
  );
}

// ─── Confetti layer ─────────────────────────────────────────────
function ConfettiLayer({ enabled }) {
  const layerRef = useRef(null);
  useEffect(() => {
    if (!enabled || !layerRef.current) return;
    const colors = ['#FF5722','#FFB800','#00CCD1','#5533FF','#FFB74D','#FF7B33'];
    const layer = layerRef.current;
    const N = 32;
    const alive = [];
    function spawn() {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const shape = Math.random();
      let w, h, br;
      if (shape < .3) { w = 6 + Math.random()*5; h = w; br = '50%'; }
      else if (shape < .7) { w = 5 + Math.random()*4; h = 9 + Math.random()*8; br = '2px'; }
      else { w = 4 + Math.random()*3; h = 10 + Math.random()*12; br = '2px'; }
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      el.style.borderRadius = br;
      el.style.background = colors[Math.floor(Math.random()*colors.length)];
      el.style.left = (Math.random()*100) + '%';
      el.style.opacity = 0;
      layer.appendChild(el);

      const dur = 6 + Math.random()*7;
      const drift = (Math.random() - .5) * 280;
      const rot0 = Math.random()*360;
      const rotEnd = rot0 + (Math.random() - .5) * 1080;
      const maxOpacity = .25 + Math.random()*.35;
      const startTime = performance.now();

      function tick(t) {
        const p = (t - startTime) / (dur * 1000);
        if (p >= 1) { el.remove(); spawn(); return; }
        const y = p * (window.innerHeight + 60);
        const x = p * drift;
        const r = rot0 + (rotEnd - rot0) * p;
        let op = maxOpacity;
        if (p < .15) op *= p / .15;
        else if (p > .75) op *= (1 - p) / .25;
        el.style.opacity = op;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      alive.push(el);
    }
    for (let i = 0; i < N; i++) setTimeout(spawn, i * 140);
    return () => { alive.forEach(e => e.remove()); };
  }, [enabled]);

  if (!enabled) return null;
  return <div className="confetti-layer" ref={layerRef} aria-hidden="true" />;
}

// ─── Hero ───────────────────────────────────────────────────────
function Hero({ variant, showVideoBg }) {
  const isDefault = variant !== 'daylight' && variant !== 'burst';
  return (
    <section className={`hero${isDefault ? ' hero--banner' : ''}`} data-screen-label="Hero" id="hero"
      style={
        variant === 'daylight' ? {
          background: 'linear-gradient(160deg, #FFF8F3 0%, #FFF3E0 60%, #FFE0CC 100%)',
          color: 'var(--klook-navy)',
        } : variant === 'burst' ? {
          background: 'linear-gradient(160deg, #FF5722 0%, #FF7B33 50%, #FFB800 100%)',
        } : {
          backgroundImage: 'url(assets/hero-banner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }
      }
    >
      <img className="hero-sparkle" src="assets/klook/illos/FI005-sparkles-stars.png" alt=""
        style={{ top: 70, left: '10%', width: 70, animationDelay: '0s' }} />
      <img className="hero-sparkle" src="assets/klook/illos/FI019-stars.png" alt=""
        style={{ top: 200, right: '6%', width: 60, animationDelay: '.8s' }} />
      <img className="hero-sparkle" src="assets/klook/illos/FI005-sparkles-stars.png" alt=""
        style={{ bottom: 80, left: '45%', width: 50, animationDelay: '1.4s' }} />

      <div className="container hero-inner">
        <div>
          {!isDefault && (
            <span className="hero-badge">
              Season 2 · Taipei · June 24 – 29 · 2026
            </span>
          )}
          <h1>
            Your Idea.<br/>
            <span className="accent-orange">Built with AI.</span><br/>
            <span className="accent-taipei">In Taipei.</span>
          </h1>
          <p className="hero-tagline">
            Season 2 of the <em>AI Hackathon</em> heads to <em>Taipei</em>. Five days, an AI co-pilot, a roomful of mentors, and a problem from <em>your own life</em>. Zero making experience needed.
          </p>
          <div className="hero-cta-row">
            <a href="#submit" className="btn btn--primary">
              Submit Your Idea
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10m0 0L8 3m4 4L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="#season-1" className="btn btn--ghost">See Season 1 Demos</a>
          </div>

          <div className="hero-dates">
            <div className="hero-date">
              <div className="d">Jun 24 · Wed</div>
              <div className="t">On-site Training</div>
              <div className="sub">Closed-door</div>
            </div>
            <div className="hero-date">
              <div className="d">Jun 25 — 28</div>
              <div className="t">Build</div>
              <div className="sub">+ mentor 1:1s</div>
            </div>
            <div className="hero-date">
              <div className="d">Jun 29 · Mon</div>
              <div className="t">Demo Day</div>
              <div className="sub">Open · Hybrid</div>
            </div>
          </div>
        </div>

        {!isDefault && <HeroVisual variant={variant} showVideoBg={showVideoBg} />}
      </div>
    </section>
  );
}

function HeroVisual({ variant, showVideoBg }) {
  if (variant === 'burst') {
    return (
      <div className="hero-visual" style={{ background: 'transparent', border: 0, boxShadow: 'none' }}>
        <img src="assets/klook/illos/C374-joyful-jumping.png" alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
                   filter: 'drop-shadow(0 16px 40px rgba(0,0,0,.35))' }} />
        <img src="assets/klook/illos/FI001-confetti.png" alt=""
          style={{ position: 'absolute', top: '8%', right: '12%', width: '50%', opacity: .85, transform: 'rotate(-12deg)' }} />
      </div>
    );
  }

  return (
    <div className="hero-visual">
      {showVideoBg ? <div className="video-bg" /> : null}
      <img className="taipei-illo" src="assets/klook/illos/D013-taipei.png" alt="Chiang Kai-shek Memorial Hall, Taipei" />
      <div className="hero-visual-overlay">
        <div className="hero-visual-tag">● LIVE FROM TAIPEI</div>
        <div className="hero-visual-foot">
          <div className="col">
            <div className="lbl">Where we'll be</div>
            <strong>Taipei Business Office</strong>
          </div>
          <div className="col" style={{textAlign: 'right'}}>
            <div className="lbl">Apply by</div>
            <strong style={{color: 'var(--klook-gold-sun)'}}>Jun 15 · 12 PM Taiwan time</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Personal Ideas Only ───────────────────────────────
function RulesSection() {
  return (
    <section className="section section--cream" data-screen-label="Personal Ideas Only" id="rules">
      <img src="assets/klook/illos/FI006-pattern-confetti-circle.png" alt="" className="deco deco--right"
        style={{ top: 40, width: 220, opacity: .35 }} />

      <div className="container">
        <div className="section-head">
          <span className="kicker">📣 Read first</span>
          <h2 className="s-title">Bring a Personal Idea — Not a Work Idea</h2>
          <p>This is a friendly space to learn AI building. To keep things safe for everyone, all ideas must be about your <em>personal life</em>.</p>
        </div>

        <div className="rules-card">
          <img className="illo" src="assets/klook/illos/C417-announcement.png" alt="" />
          <div>
            <span className="tag">⚠️ Important · Please Read</span>
            <h2>Your idea must be <mark>completely unrelated to Klook work.</mark></h2>
            <p>
              The AI Hackathon is a personal-life building event. We don't want anyone to worry about accidentally leaking company information, customer data, or unreleased work. Pick a problem from <strong>your own life</strong> — your cat, your commute, your weekend, your money. If you can't tell your idea to a friend over coffee without an NDA, it doesn't belong here.
            </p>
          </div>
        </div>

        <div className="rules-grid">
          <div className="rule-tile t-orange">
            <div className="icn">🗓️</div>
            <h4>Deadline</h4>
            <p>June 15 · 12 PM Taiwan time. Hard cut-off — late submissions don't enter the pool.</p>
          </div>
          <div className="rule-tile t-purple">
            <div className="icn">♾️</div>
            <h4>Unlimited ideas</h4>
            <p>Submit as many ideas as you like. We only select <b>one per person</b>, so pick your favourites.</p>
          </div>
          <div className="rule-tile t-teal">
            <div className="icn">⏱️</div>
            <h4>Commit the time</h4>
            <p>You must be available Jun 24 – 28 (~4–12 hrs total) before submitting an idea.</p>
          </div>
          <div className="rule-tile t-gold">
            <div className="icn">🎥</div>
            <h4>Demo Day backup</h4>
            <p>Can't make Jun 29 in person? Submit a pre-recorded video — we'll play it live.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: 5-day Schedule ────────────────────────────────────
function ScheduleSection() {
  const items = window.S2_SCHEDULE;
  return (
    <section className="section section--white" data-screen-label="Schedule" id="schedule">
      <div className="container">
        <div className="section-head">
          <span className="kicker">📅 The week of</span>
          <h2 className="s-title">5 Days. Built Together in Taipei.</h2>
          <p>One short kick-off, four days of building with mentors on standby, and a public Demo Day. That's the whole thing.</p>
        </div>

        <div className="schedule-grid">
          {items.map((it, i) => (
            <article key={i} className={`sched-card tone-${it.accent}`}>
              <img className="illo" src={it.illo} alt="" />
              <div className="header-row">
                <div className={`date-pill tone-${it.accent}`}>
                  <div className="d">{it.day}</div>
                  <div className="big">{it.date}</div>
                </div>
                <span className="tag">{it.tag}</span>
              </div>
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: How It Works (3 steps) ────────────────────────────
function HowItWorks() {
  const steps = [
    { num: 1, illo: 'assets/klook/illos/EBG015-idea.png', title: 'You bring an idea', desc: 'Any personal-life problem. Tracking time, learning a language, taming your inbox, planning meals — anything that isn\'t work.' },
    { num: 2, illo: 'assets/klook/illos/EBG001-team-highfive.png', title: 'We teach you to build with AI', desc: 'A short kick-off, then async building with daily mentor office hours. Tools, API keys and Claude access are all on us.' },
    { num: 3, illo: 'assets/klook/illos/C031-celebrate.png', title: 'You demo on Jun 29', desc: 'A 5-minute live demo + Q&A. The best run takes the trophy. Everyone leaves with a working personal tool.' },
  ];
  return (
    <section className="section section--cool" data-screen-label="How It Works" id="how">
      <img src="assets/klook/illos/Fl046-splash.png" alt="" className="deco deco--left"
        style={{ top: -20, width: 160, opacity: .5 }} />
      <div className="container">
        <div className="section-head">
          <span className="kicker" style={{color: 'var(--klook-purple-accent)'}}>How it works</span>
          <h2 className="s-title">Anyone Can Join. Seriously.</h2>
          <p>You don't need to code. You need a problem and a willingness to spend an afternoon with Claude.</p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22}} className="how-grid">
          {steps.map(s => (
            <div key={s.num} style={{
              background: '#fff', borderRadius: 20, padding: '28px 24px 26px',
              border: '1px solid var(--border-purple)', textAlign: 'center'
            }}>
              <img src={s.illo} alt="" style={{height: 130, width: '100%', objectFit: 'contain', marginBottom: 16}} />
              <div style={{
                display: 'inline-block', background: 'var(--klook-purple-soft)', color: 'var(--klook-purple-accent)',
                width: 32, height: 32, borderRadius: '50%', lineHeight: '32px', fontWeight: 800, marginBottom: 12
              }}>{s.num}</div>
              <h3 style={{margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: 'var(--klook-navy)'}}>{s.title}</h3>
              <p style={{margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-body)'}}>{s.desc}</p>
            </div>
          ))}
        </div>
        <style>{`
          @media (max-width: 800px) {
            .how-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

// ─── Season 1 Finalists ─────────────────────────────────────────
function S1Finalists({ onOpen }) {
  return (
    <section className="section section--white" data-screen-label="Season 1 Finalists" id="season-1">
      <div className="container">
        <div className="section-head">
          <span className="kicker">🏆 Season 1 · 10 Finalists</span>
          <h2 className="s-title">Look What 10 Klookers Built Last Round</h2>
          <p>10 projects shipped in 2 weeks. Click any card to watch the Demo Day playback. Top 3 medals shown — judges' special picks are highlighted below.</p>
        </div>

        <div className="finalist-grid">
          {window.S1_FINALISTS.map(f => (
            <article key={f.id} className={`finalist-card ${f.award ? 'is-winner award-' + f.award : ''}`}
              onClick={() => onOpen(f)} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onOpen(f); }}>
              <div className={`finalist-thumb t-${f.accent}`}>
                {f.award && (
                  <div className={`medal-ribbon medal-${f.award}`}>
                    <span className="medal-emoji">{MEDAL[f.award].emoji}</span>
                    <span>{MEDAL[f.award].label}</span>
                  </div>
                )}
                {!f.award && <span className="badge">S1 Finalist</span>}
                <img src={f.illo} alt="" />
                <div className="play-overlay">
                  <div className="play-btn">▶</div>
                  <div className="play-label">Watch Demo</div>
                </div>
              </div>
              <div className="finalist-body">
                <h4><span className="em">{f.emoji}</span> {f.title}</h4>
                <p className="builder">Built by {f.builder}</p>
                <p>{f.summary}</p>
                {f.specialAwards && f.specialAwards.length > 0 && (
                  <div className="special-row">
                    {f.specialAwards.map(s => {
                      const judge = window.S1_JUDGES.find(j => j.key === s);
                      return judge ? (
                        <span key={s} className="special-chip" title={`${judge.name}'s Special Pick`}>
                          ⭐ {judge.name}'s Pick
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalistModal({ project, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    function esc(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', esc);
    document.body.style.overflow = project ? 'hidden' : '';
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [project, onClose]);

  // Pause video when modal closes
  useEffect(() => {
    if (!project && videoRef.current) {
      videoRef.current.pause();
    }
  }, [project]);

  return (
    <div className={`modal-overlay ${project ? 'open' : ''}`} onClick={onClose}>
      {project && (
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          <div className="modal-video" style={{background: '#000', padding: 0}}>
            <video
              ref={videoRef}
              controls
              preload="metadata"
              autoPlay
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            >
              <source src={project.videoUrl} type="video/mp4" />
            </video>
          </div>
          <div className="modal-body">
            <h2>
              <span style={{fontSize: 30}}>{project.emoji}</span>
              {project.title}
              {project.award && (
                <span style={{
                  fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase',
                  background: MEDAL[project.award].color, color: '#fff',
                  padding: '4px 10px', borderRadius: 6, marginLeft: 8
                }}>
                  {MEDAL[project.award].emoji} {MEDAL[project.award].label}
                </span>
              )}
            </h2>
            <div className="builder-row">
              <span style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--klook-orange-cream)', display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'var(--klook-orange)', fontWeight: 800, fontSize: 11
              }}>{project.builder.charAt(0)}</span>
              Built by {project.builder} · Season 1
            </div>
            <p style={{fontSize: 14, color: 'var(--text-muted)', marginBottom: 18, fontStyle: 'italic'}}>
              {project.summary}
            </p>
            <p>{project.description}</p>

            {project.specialAwards && project.specialAwards.length > 0 && (
              <div style={{
                marginTop: 20, padding: '14px 18px',
                background: 'var(--klook-purple-bg)', border: '1px solid var(--border-purple)',
                borderRadius: 12, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center'
              }}>
                <strong style={{fontSize: 13, color: 'var(--klook-purple-accent)', letterSpacing: .5}}>⭐ Judges' Special Picks:</strong>
                {project.specialAwards.map(s => {
                  const j = window.S1_JUDGES.find(jj => jj.key === s);
                  return j ? (
                    <span key={s} style={{
                      fontSize: 12, fontWeight: 700, color: 'var(--klook-navy)',
                      background: '#fff', padding: '4px 10px', borderRadius: 20
                    }}>{j.name}</span>
                  ) : null;
                })}
              </div>
            )}

            {project.speechVideoUrl && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--klook-orange)', marginBottom: 10 }}>
                  {MEDAL[project.award]?.emoji} Winner Speech
                </div>
                <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
                  <video controls preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}>
                    <source src={project.speechVideoUrl} type="video/mp4" />
                  </video>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Video Modal (for judges / speeches) ─────────────────────────
function VideoModal({ title, src, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    function esc(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', esc);
    document.body.style.overflow = src ? 'hidden' : '';
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [src, onClose]);

  useEffect(() => {
    if (!src && videoRef.current) videoRef.current.pause();
  }, [src]);

  return (
    <div className={`modal-overlay ${src ? 'open' : ''}`} onClick={onClose}>
      {src && (
        <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 860 }}>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          <div className="modal-video" style={{ background: '#000', padding: 0 }}>
            <video
              ref={videoRef}
              controls
              preload="metadata"
              autoPlay
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            >
              <source src={src} type="video/mp4" />
            </video>
          </div>
          {title && (
            <div className="modal-body" style={{ padding: '20px 28px' }}>
              <h2 style={{ fontSize: 20, margin: 0 }}>{title}</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Winner Speeches (Champion → 2nd → 3rd) ─────────────────────
function WinnerSpeechesSection({ onOpen, onOpenVideo }) {
  const speeches = [...window.S1_WINNER_SPEECHES].reverse();

  function findProject(id) {
    return window.S1_FINALISTS.find(f => f.id === id);
  }

  return (
    <section className="section section--orange" data-screen-label="Winner Speeches" id="winners"
      style={{background: 'linear-gradient(160deg, #1A1462 0%, #2D2080 50%, #4D40CC 100%)', color: '#fff'}}>
      <img src="assets/klook/illos/FI005-sparkles-stars.png" alt="" className="deco deco--right"
        style={{ top: 60, width: 120, opacity: .5 }} />
      <img src="assets/klook/illos/FI019-stars.png" alt="" className="deco deco--left"
        style={{ bottom: 40, width: 100, opacity: .4 }} />

      <div className="container">
        <div className="section-head">
          <span className="kicker kicker--gold">🏆 Season 1 Winners</span>
          <h2 className="s-title s-title--white">The Top 3 — In Their Own Words</h2>
          <p style={{color: 'var(--text-light-purple)'}}>Champion, 2nd, 3rd — from Demo Day. Click any card to watch the acceptance speech.</p>
        </div>

        <div className="winners-stack">
          {speeches.map((sp, i) => {
            const project = findProject(sp.projectId);
            return (
              <article key={sp.rank} className={`winner-card winner-${sp.rank}`} style={{'--medal-c': sp.color}}>
                <div className="winner-medal" aria-hidden="true">
                  <span className="ribbon">{sp.medal}</span>
                  <span className="rank-label">{sp.label}</span>
                </div>
                <div className="winner-video"
                  onClick={() => onOpenVideo(sp.speechVideoUrl, `${sp.medal} ${sp.label} Speech — ${sp.builder}`)}
                  role="button" tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onOpenVideo(sp.speechVideoUrl, `${sp.medal} ${sp.label} Speech — ${sp.builder}`); }}
                >
                  <div className="winner-video-inner">
                    <button className="play-btn-lg" type="button" aria-label="Play speech">▶</button>
                    <div className="vp-label">Acceptance Speech · click to play</div>
                  </div>
                </div>
                <div className="winner-body">
                  <div className="winner-builder">
                    {sp.medal} {sp.label} — {sp.builder}
                  </div>
                  <h3>{sp.project}</h3>
                  <blockquote>"{sp.quote}"</blockquote>
                  <button className="winner-more" type="button" onClick={() => project && onOpen(project)}>
                    See project demo →
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* S1 Judge feedback — subdued, inside the same blue section */}
        <div className="s1-feedback-block">
          <div className="s1-feedback-block-label">🎙 What the Season 1 judges said</div>
          <div className="s1-feedback-row">
            {window.S1_JUDGES.map((j) => (
              <div key={j.key} className="s1-feedback-card">
                <img src={p(j.photo)} alt={j.name} className="s1-feedback-photo" />
                <div className="s1-feedback-body">
                  <div className="s1-feedback-name">{j.name}</div>
                  <p className="s1-feedback-quote">"{j.quote}"</p>
                  {j.videoUrl && (
                    <button
                      onClick={() => onOpenVideo(j.videoUrl, `${j.name}'s Demo Day Feedback`)}
                      className="s1-feedback-btn"
                    >
                      ▶ Watch feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Judges (Season 2 panel only) ─────────────────────────────
function JudgesSection() {
  return (
    <section className="section section--cool" data-screen-label="Judges" id="judges">
      <div className="container">
        <div className="section-head">
          <span className="kicker">The judging panel · Season 2</span>
          <h2 className="s-title">Who's Watching Your Demo</h2>
          <p>Meet the four judges scoring Demo Day on Jun 29. Each picks a personal Special Award on top of the leaderboard.</p>
        </div>

        <div className="judges-grid">
          {window.S2_JUDGES.map((j) => (
            <div key={j.key} className="judge-card">
              <div className="photo-wrap">
                <img src={p(j.photo)} alt={j.name} />
              </div>
              <div>
                <h4>{j.name}</h4>
                <p className="quote">{j.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Mentors ────────────────────────────────────────────────────
function MentorsSection() {
  return (
    <section className="section section--warm-light" data-screen-label="Mentors" id="mentors">
      <div className="container">
        <div className="section-head">
          <span className="kicker">A huge thank-you to · Season 1 mentors</span>
          <h2 className="s-title">You're Never Stuck Alone</h2>
          <p>The Season 1 mentor crew returns. Daily office hours during the build week + bookable 1:1s. Season 1 wouldn't have worked without them.</p>
        </div>

        <div className="mentor-grid">
          {window.S1_MENTORS.map((m, i) => (
            <div key={i} className="mentor-card">
              <div className="photo">
                {m.photo ? <img src={p(m.photo)} alt={m.name} /> : <span>{m.name.charAt(0)}</span>}
              </div>
              <h5>{m.name}</h5>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Awards (Season 2 trophies) ────────────────────────────────
function AwardsSection() {
  return (
    <section className="section section--white" data-screen-label="Awards" id="awards">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Demo Day awards · Jun 29</span>
          <h2 className="s-title">Trophies to Take Home</h2>
          <p>Top 3 by combined judge score, plus a personal Special Award from each judge. Your project doesn't need to be perfect — a half-finished tool with a great story scores well.</p>
        </div>

        <div className="awards-podium">
          <div className="podium-card podium-2">
            <img src="assets/klook/illos/C374-joyful-jumping.png" alt="" />
            <div className="podium-emoji">🥈</div>
            <h4>2nd Place</h4>
            <p>Silver. Strong execution + a clear personal story.</p>
          </div>
          <div className="podium-card podium-1">
            <img src="assets/klook/illos/C372-partner-award.png" alt="" />
            <div className="podium-emoji">🏆</div>
            <h4>Champion</h4>
            <p>Highest combined score across all four judges. Take home the AI Hackathon trophy.</p>
          </div>
          <div className="podium-card podium-3">
            <img src="assets/klook/illos/C091-promotion.png" alt="" />
            <div className="podium-emoji">🥉</div>
            <h4>3rd Place</h4>
            <p>Bronze. A working demo with a clear "this changed my life" moment.</p>
          </div>
        </div>

        <div className="special-awards">
          <div className="special-head">
            <span className="kicker" style={{color: 'var(--klook-purple-accent)'}}>⭐ Plus · 4 personal picks</span>
            <h3>Judges' Special Awards</h3>
            <p>Each Season 2 judge picks their own favourite project — separate from the leaderboard. Four extra trophies given out on Demo Day.</p>
          </div>
          <div className="special-grid">
            {window.S2_JUDGES.map(j => (
              <div key={j.key} className="special-card">
                <img src={p(j.photo)} alt={j.name} />
                <h5>{j.name}'s Pick</h5>
                <p className="prev">
                  Personal favourite —
                  <br/>
                  <strong>announced on Demo Day</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────
function FAQSection() {
  const items = [
    { q: "I've never made anything with AI. Can I really do this?", a: "Yes. AI tools like Claude are designed so you just describe what you want — in whatever language feels natural to you — and it builds for you. Your job is to be clear about what you want, not to understand how it's made. Season 1 had several first-time builders make working demos." },
    { q: "How many hours will this actually take?", a: "The kick-off training on Jun 24 is 2 hours. Demo Day on Jun 29 is 1.5 hours. The build days in between (Jun 25–28) are fully async — plan for roughly 2–8 hours depending on your scope. Schedule it however you want." },
    { q: "What if my idea isn't accepted?", a: "You can submit as many ideas as you like — but we only select one per person. We notify everyone (accepted or not) before Jun 24. Not selected this round? Your ideas roll forward to Season 3." },
    { q: "Do I have to be in Taipei?", a: "On-site training (Jun 24) is closed-door in the Taipei Business Office and we strongly prefer you attend in person. Build days are async from anywhere. Demo Day is hybrid — on-site preferred, but if you can't fly in you can submit a pre-recorded 5-min video." },
    { q: "Can my idea be related to Klook?", a: <span><strong style={{color: 'var(--klook-orange)'}}>No.</strong> All ideas must be about your personal life. We don't want anyone worrying about leaking work-related information. If in doubt — could you describe this idea to a friend without an NDA? If not, don't submit it.</span> },
    { q: "Does my project have to be an app?", a: "No. It can be a bot (LINE, Slack, Telegram), a web dashboard, a voice tool, a CLI, or even a smart spreadsheet. What matters is that it solves a real personal-life problem for you." },
    { q: "Will there be a Season 3?", a: "We hope so! If everyone participates enthusiastically — the more people join, the more Klook offices we can bring it to!" },
  ];
  const [open, setOpen] = useState(null);
  return (
    <section className="section section--white" data-screen-label="FAQ" id="faq">
      <div className="container">
        <div className="section-head">
          <span className="kicker">FAQ</span>
          <h2 className="s-title">Common Questions</h2>
        </div>
        <div className="faq-list">
          {items.map((it, i) => (
            <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                {it.q}
                <span className="arr">▼</span>
              </button>
              <div className="faq-a"><p>{it.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Google sign-in status chip ─────────────────────────────────
// Compact box that sits above the idea / RSVP form. Detects whether the
// visitor is signed in with their Klook Google account; shows their email
// if yes, or a "Sign in" button if no.
function GoogleSignInStatus({ user, onSignIn, onSignOut, prompt = 'Sign in with your Klook Google account' }) {
  return (
    <div className="gis-status" style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
      borderRadius: 12, marginBottom: 14,
      background: user ? '#F0FAF4' : '#FFF8F0',
      border: `1px solid ${user ? '#B7E1C7' : '#FFD6B8'}`,
      fontSize: 14,
    }}>
      {user ? (
        <>
          {user.picture && (
            <img src={user.picture} alt="" referrerPolicy="no-referrer"
              style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: '#1a7e3e', fontSize: 13 }}>
              ✓ Signed in
            </div>
            <div style={{ color: '#444', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>
          <button type="button" onClick={onSignOut}
            style={{
              background: 'transparent', border: '1px solid #ccc', color: '#666',
              padding: '6px 10px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
            }}>
            Sign out
          </button>
        </>
      ) : (
        <>
          <div style={{ flex: 1, color: '#7a3d00', lineHeight: 1.4 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Not signed in</div>
            <div style={{ fontSize: 12, color: '#8a5a2a' }}>{prompt}</div>
          </div>
          <button type="button" onClick={onSignIn}
            style={{
              background: '#FF5722', border: 'none', color: '#fff', fontWeight: 700,
              padding: '8px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              flexShrink: 0,
            }}>
            Sign in with Google
          </button>
        </>
      )}
    </div>
  );
}

// ─── Submission form ───────────────────────────────────────────
function SubmitSection({ onSubmit, submitted, onRemove, user, onSignIn, onSignOut }) {
  const [idea, setIdea] = useState('');
  const [committed, setCommitted] = useState(false);
  const [error, setError] = useState('');

  function handle(e) {
    e.preventDefault();
    setError('');
    if (idea.trim().length < 12) { setError('Tell us a bit more about your idea (12+ chars)'); return; }
    if (idea.trim().length > 2000) { setError('Idea too long — please keep it under 2000 characters'); return; }
    if (!committed) { setError('Please commit to the Jun 24–28 build window'); return; }
    // Client-side rate limit: one submission per 30 seconds
    const lastSubmit = parseInt(localStorage.getItem('_hs_last_submit') || '0', 10);
    if (Date.now() - lastSubmit < 30000) { setError('Please wait a moment before submitting again'); return; }
    localStorage.setItem('_hs_last_submit', String(Date.now()));
    onSubmit({ idea: idea.trim() });
    setIdea('');
    setError('');
  }

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);
  const diffMs = DEADLINE.getTime() - now;
  const daysLeft = Math.max(0, Math.floor(diffMs / (1000*60*60*24)));
  const hoursLeft = Math.max(0, Math.floor((diffMs % (1000*60*60*24)) / (1000*60*60)));
  const expired = diffMs <= 0;

  return (
    <section className="section section--cream" data-screen-label="Submit" id="submit">
      <img src="assets/klook/illos/Fl047-bloom.png" alt="" className="deco deco--right"
        style={{ top: -10, width: 180, opacity: .55 }} />
      <img src="assets/klook/illos/Fl058-sun.png" alt="" className="deco deco--left"
        style={{ bottom: 30, width: 120, opacity: .35 }} />

      <div className="container">
        <div className="section-head">
          <span className="kicker">🚀 Take part</span>
          <h2 className="s-title">Submit Your Idea</h2>
          <p>Two fields. One commitment box. That's the whole form.</p>
        </div>

        <div style={{maxWidth: 720, margin: '0 auto'}}>
          <div className="deadline-banner">
            <div className="left">
              <div className="icon">⏰</div>
              <div>
                <div className="lbl">Submissions close</div>
                <div className="big">Jun 15 · 12:00 PM Taiwan time</div>
              </div>
            </div>
            <div className="countdown">
              {expired
                ? <strong>Closed</strong>
                : <span><strong>{daysLeft}d {hoursLeft}h</strong> left</span>}
            </div>
          </div>

          <form className="form-wrap" onSubmit={handle}>
            <h3>Your idea, please</h3>
            <p className="sub">Personal-life problem only. Submit multiple times if you have multiple ideas. We pick at most one per person.</p>

            <GoogleSignInStatus
              user={user}
              onSignIn={onSignIn}
              onSignOut={onSignOut}
              prompt="Sign in once and your Klook email is auto-attached to every idea you submit."
            />

            <div className="form-row">
              <label>What's the personal-life problem you want to solve? <span className="req">*</span></label>
              <textarea className="form-textarea" value={idea} onChange={(e) => setIdea(e.target.value)}
                maxLength={2000}
                placeholder="e.g. I want a tool that watches our family WhatsApp for school deadlines and adds them to my calendar…" />
              <p className="form-hint"><b>Reminder:</b> nothing related to Klook work, customers, partners, or internal systems. Stick to <em>your</em> life.</p>
            </div>

            <label className={`commit-box ${committed ? 'checked' : ''}`}>
              <input type="checkbox" checked={committed} onChange={(e) => setCommitted(e.target.checked)} />
              <div className="txt">
                I commit to keeping <strong>Jun 24 – 28</strong> available for the on-site training and build week (~4–12 hours total). If I can't make Demo Day on Jun 29 in person, I'll send a pre-recorded 5-min video.
              </div>
            </label>

            {error && (
              <div style={{
                background: '#FFF0EC', color: 'var(--strike-red)', border: '1px solid #FFCCBE',
                padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 14
              }}>{error}</div>
            )}

            <button type="submit" className="btn-submit" disabled={expired}>
              {expired ? 'Submissions closed' : 'Submit this idea →'}
            </button>

            {submitted.length > 0 && (
              <>
                <div className="submitted-list">
                  {submitted.map((s, i) => (
                    <span key={i} className="submitted-chip" title={s.idea}>
                      Idea #{i+1} · {s.idea.slice(0, 28)}{s.idea.length > 28 ? '…' : ''}
                      <button type="button" className="x" onClick={() => onRemove(i)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="submit-counter">
                  <strong>{submitted.length}</strong> idea{submitted.length === 1 ? '' : 's'} submitted from this device. Submit more — we pick the favourite.
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── Demo Day RSVP ──────────────────────────────────────────────
function DemoDaySection({ onRSVP, user, onSignIn, onSignOut }) {
  const [done, setDone]   = useState(false);
  const [pressed, setPressed] = useState(false);

  function handle(e) {
    e.preventDefault();
    setPressed(true);
    onRSVP();
  }

  // Show the "You're on the list!" card once the RSVP has actually fired —
  // which is either immediately (user was signed in), or right after the
  // post-click sign-in popup completes (user becomes truthy).
  useEffect(() => {
    if (pressed && user) setDone(true);
  }, [pressed, user]);

  return (
    <section className="section section--demoday" id="demoday">
      <div className="container">
        <div className="demoday-card">

          <div className="demoday-info">
            <div className="demoday-badge">📅 Open to all Klookers</div>
            <h3>Watch the Demo Day</h3>
            <p>Not building this time? Come see what your colleagues shipped in 5 days. Hybrid — join in person or hop on Google Meet.</p>
            <div className="demoday-details">
              <span>📆 Mon Jun 29 · 3:00 – 4:30 PM Taiwan time</span>
              <span>📍 Taipei Business Office + Google Meet</span>
            </div>
          </div>

          <div className="demoday-form-wrap">
            {done ? (
              <div className="demoday-success">
                <div className="demoday-success-icon">🎉</div>
                <div className="demoday-success-title">You're on the list!</div>
                <div className="demoday-success-sub">Google Calendar opened in a new tab — click Save to add it to your calendar.</div>
              </div>
            ) : (
              <form onSubmit={handle}>
                <p className="demoday-form-label">Get a calendar invite</p>
                <GoogleSignInStatus
                  user={user}
                  onSignIn={onSignIn}
                  onSignOut={onSignOut}
                  prompt="Sign in to get the calendar invite mailed to your inbox."
                />
                <button type="submit" className="btn-demoday">
                  {user ? 'Get Demo Day Invite →' : 'Sign in & Get Demo Day Invite →'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="foot" data-screen-label="Footer">
      <img src="assets/klook/klook-logo-white.png" alt="Klook" />
      <h4>AI Hackathon · Season 2 · Taipei</h4>
      <p>Organized by Klook Planning &amp; Operations. Questions? Reach out to your Team Lead or <a href="#mentors">Page Deng</a> in #ai-hackathon.</p>
      <div className="micro">© 2026 Klook. Personal hackathon · Not for production work.</div>
    </footer>
  );
}

// ─── Google Sign-In config ──────────────────────────────────────
const OAUTH_CLIENT_ID = '197615659400-p4mq9p4ijh49hg6k0hsjh26j8d1ftlgc.apps.googleusercontent.com';
const SCRIPT_URL = 'https://script.google.com/a/macros/klook.com/s/AKfycbzheDtqf_2HR9Ds2JiHfG4kdz3DkkaQ6s4lB5nTTQqDUhy29eD7l-lx3YpO8oUoNuoItQ/exec';

// Decode a base64url-encoded JWT payload (no signature verification — we only
// use it to extract the email from Google's signed token client-side; the
// server-side GAS validates the user via their Google session cookie).
function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    return JSON.parse(decodeURIComponent(atob(padded).split('').map(
      (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')));
  } catch (_) { return null; }
}

// ─── App ────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [openProject, setOpenProject] = useState(null);
  const [videoModal, setVideoModal] = useState(null); // { src, title }
  const [submitted, setSubmitted] = useState([]);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);              // { email, name, picture }
  const [gisReady, setGisReady] = useState(false);     // GIS script loaded
  // Action queued while waiting for sign-in. Once user signs in, we run it.
  const pendingActionRef = useRef(null);

  function showToast(msg, kind = 'default') {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3000);
  }

  // Hidden-iframe form POST. Carries Google session cookies (top-level
  // navigation semantics from the iframe's perspective), so the Klook GAS
  // deployed as "Anyone within Klook" can validate the signed-in user.
  function iframePost(fields) {
    let iframe = document.getElementById('__submit_frame');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id   = '__submit_frame';
      iframe.name = '__submit_frame';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = SCRIPT_URL;
    form.target = '__submit_frame';
    Object.entries(fields).forEach(([n, v]) => {
      const inp = document.createElement('input');
      inp.type  = 'hidden';
      inp.name  = n;
      inp.value = v;
      form.appendChild(inp);
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  // GIS callback — fires after user picks an account in the popup, or on
  // page-load silent sign-in if they previously consented.
  function handleCredential(response) {
    const payload = decodeJwt(response.credential);
    if (!payload) { showToast('Sign-in failed. Please try again.', 'error'); return; }
    if (payload.hd !== 'klook.com') {
      showToast('Please use your @klook.com Google account', 'error');
      return;
    }
    const u = { email: payload.email, name: payload.name, picture: payload.picture };
    setUser(u);
    // Drain pending action if any
    const pending = pendingActionRef.current;
    if (pending) {
      pendingActionRef.current = null;
      if (pending.type === 'submit') {
        runSubmit(u.email, pending.idea);
      } else if (pending.type === 'demo_day') {
        runDemoDay(u.email);
      }
    }
  }

  // Wait for GIS script (loaded async in index.html), then initialise.
  useEffect(() => {
    let cancelled = false;
    const tryInit = () => {
      if (cancelled) return;
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: OAUTH_CLIENT_ID,
          callback: handleCredential,
          auto_select: true,
          cancel_on_tap_outside: false,
          hd: 'klook.com',
          use_fedcm_for_prompt: true,
        });
        setGisReady(true);
        // Silent sign-in attempt — only displays UI if user has consented before.
        try { window.google.accounts.id.prompt(() => {}); } catch (_) {}
      } else {
        setTimeout(tryInit, 150);
      }
    };
    tryInit();
    return () => { cancelled = true; };
  }, []);

  // Trigger an interactive sign-in popup. Used when the user clicks the
  // sign-in chip, or on submit when not yet signed in.
  function requestSignIn() {
    if (!window.google || !window.google.accounts) {
      showToast('Google Sign-In is loading…', 'error');
      return;
    }
    // Cancel any previous prompt state, then re-prompt
    try { window.google.accounts.id.cancel(); } catch (_) {}
    window.google.accounts.id.prompt((notification) => {
      // If One Tap can't display (e.g. blocked, dismissed too many times),
      // fall back to the Sign In With Google button by clicking the hidden one.
      if (notification && (notification.isNotDisplayed?.() || notification.isSkippedMoment?.())) {
        const hidden = document.querySelector('#__gis_hidden_button div[role="button"]');
        if (hidden) hidden.click();
      }
    });
  }

  function signOut() {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try { window.google.accounts.id.disableAutoSelect(); } catch (_) {}
    }
    setUser(null);
  }

  // Core submit — assumes signed-in.
  function runSubmit(email, idea) {
    iframePost({ action: 'submit', email, idea });
    setSubmitted((p) => [...p, { email, idea }]);
    showToast(`✨ Idea submitted as ${email} — check your inbox!`, 'success');
  }

  function runDemoDay(email) {
    iframePost({ action: 'demo_day', email });
    // Open the canonical Demo Day event template owned by page.deng@klook.com
    // so users get the exact same event (title, description, Meet link, attendees)
    // that the organiser maintains.
    const calUrl = 'https://calendar.google.com/calendar/event?action=TEMPLATE' +
      '&tmeid=NXNyaGE5bmFqNXF2cmp2MzI5ZTlpOHVlajYgcGFnZS5kZW5nQGtsb29rLmNvbQ' +
      '&tmsrc=page.deng%40klook.com';
    window.open(calUrl, '_blank');
    showToast(`🎉 RSVP'd as ${email} — calendar opened in new tab`, 'success');
  }

  // Public handlers called by SubmitSection / DemoDaySection
  function onSubmit({ idea }) {
    if (user) {
      runSubmit(user.email, idea);
    } else {
      pendingActionRef.current = { type: 'submit', idea };
      showToast('Please sign in with your Klook Google account to submit', 'default');
      requestSignIn();
    }
  }

  function onDemoDayRSVP() {
    if (user) {
      runDemoDay(user.email);
    } else {
      pendingActionRef.current = { type: 'demo_day' };
      showToast('Please sign in with your Klook Google account to RSVP', 'default');
      requestSignIn();
    }
  }
  function onRemove(i) {
    setSubmitted((p) => p.filter((_, idx) => idx !== i));
  }
  function openVideo(src, title) {
    setVideoModal({ src, title });
  }

  // Hidden Sign In With Google button — fallback when One Tap is blocked.
  // We programmatically click it from `requestSignIn` when needed.
  const hiddenBtnRef = useRef(null);
  useEffect(() => {
    if (!gisReady || !hiddenBtnRef.current) return;
    if (hiddenBtnRef.current.childElementCount > 0) return;
    try {
      window.google.accounts.id.renderButton(hiddenBtnRef.current, {
        type: 'standard', theme: 'outline', size: 'large', text: 'signin_with',
      });
    } catch (_) {}
  }, [gisReady]);

  const accentStyle = useMemo(() => {
    if (t.accentColor === '#FF5722') return {};
    return {
      '--klook-orange': t.accentColor,
      '--klook-orange-light': t.accentColor,
    };
  }, [t.accentColor]);

  return (
    <div style={accentStyle}>
      <ConfettiLayer enabled={t.confetti} />

      <TopBar />
      <Hero variant={t.heroVariant} showVideoBg={t.showVideoBg} />
      <RulesSection />
      <ScheduleSection />
      <HowItWorks />
      <S1Finalists onOpen={setOpenProject} />
      <WinnerSpeechesSection onOpen={setOpenProject} onOpenVideo={openVideo} />
      <JudgesSection />
      <MentorsSection />
      <AwardsSection />
      <FAQSection />
      <SubmitSection
        onSubmit={onSubmit}
        submitted={submitted}
        onRemove={onRemove}
        user={user}
        onSignIn={requestSignIn}
        onSignOut={signOut}
      />
      <DemoDaySection
        onRSVP={onDemoDayRSVP}
        user={user}
        onSignIn={requestSignIn}
        onSignOut={signOut}
      />
      <Footer />

      <FinalistModal project={openProject} onClose={() => setOpenProject(null)} />
      <VideoModal src={videoModal?.src} title={videoModal?.title} onClose={() => setVideoModal(null)} />

      {/* Hidden Sign In With Google button — used as click-fallback when One Tap is blocked */}
      <div id="__gis_hidden_button" ref={hiddenBtnRef} style={{ position: 'absolute', left: -9999, top: -9999 }} />

      {toast && (
        <div className={`toast show ${toast.kind === 'success' ? 'success' : ''}`}>{toast.msg}</div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero" />
        <TweakRadio label="Hero variant" value={t.heroVariant}
          options={HERO_VARIANTS.map(v => v.id)}
          onChange={(v) => setTweak('heroVariant', v)} />
        <TweakToggle label="Video bg placeholder" value={t.showVideoBg}
          onChange={(v) => setTweak('showVideoBg', v)} />

        <TweakSection label="Theme" />
        <TweakColor label="Accent color" value={t.accentColor}
          options={ACCENT_OPTIONS}
          onChange={(v) => setTweak('accentColor', v)} />
        <TweakToggle label="Floating confetti" value={t.confetti}
          onChange={(v) => setTweak('confetti', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
