import React from "react";
import "./Landing.css";

const ELEMENTS = [
  {
    name: "Void",
    color: "#9b59b6",
    symbol: "⚫",
    desc: "The primordial nothingness",
  },
  {
    name: "Earth",
    color: "#27ae60",
    symbol: "🌍",
    desc: "Solid and unyielding",
  },
  {
    name: "Water",
    color: "#2980b9",
    symbol: "💧",
    desc: "Fluid and adaptable",
  },
  {
    name: "Fire",
    color: "#e74c3c",
    symbol: "🔥",
    desc: "Destructive and passionate",
  },
  { name: "Wind", color: "#00bcd4", symbol: "💨", desc: "Swift and invisible" },
];

function Landing({ onPlay }) {
  return (
    <div className="landing">
      <div className="landing-bg">
        <div className="grid-floor" />
      </div>

      <nav className="nav">
        <div className="logo">
          <span className="logo-icon">🐍</span>
          <span>Godai</span>
        </div>
        <div className="nav-links">
          <a href="#how-to-play">How to Play</a>
          <a href="#elements">Elements</a>
          <button className="btn-connect">Connect Wallet</button>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <h1 className="glitch" data-text="GODAI">
            <span className="gradient-text">GODAI</span>
          </h1>
          <h2>Elemental Serpent</h2>
          <p className="tagline">
            Command a serpent of pure elemental energy. Consume, grow, and
            dominate the 3D arena in this fully onchain strategy game.
          </p>

          <div className="cta-buttons">
            <button className="btn-primary" onClick={onPlay}>
              <span>▶</span> Play Now
            </button>
            <button className="btn-secondary">
              <span>📖</span> Read Docs
            </button>
          </div>

          <div className="stats">
            <div className="stat">
              <span className="stat-value">5</span>
              <span className="stat-label">Elements</span>
            </div>
            <div className="stat">
              <span className="stat-value">3D</span>
              <span className="stat-label">Battles</span>
            </div>
            <div className="stat">
              <span className="stat-value">∞</span>
              <span className="stat-label">Strategy</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="snake-preview">
            {ELEMENTS.map((el, i) => (
              <div
                key={el.name}
                className="snake-segment"
                style={{
                  backgroundColor: el.color,
                  animationDelay: `${i * 0.1}s`,
                  transform: `translate(${(i % 3) * 30}px, ${Math.floor(i / 3) * 30}px)`,
                }}
              >
                <span>{el.symbol}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <section id="how-to-play" className="section how-to-play">
        <h2>How to Play</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Spawn</h3>
            <p>
              Enter the arena as a serpent of elemental energy. Choose your
              starting position wisely.
            </p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>Consume</h3>
            <p>
              Absorb elemental orbs scattered across the 3D space to grow your
              serpent and gain power.
            </p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>Dominate</h3>
            <p>
              Collide with rival serpents. Higher elements shatter lower ones.
              Rule the Godai.
            </p>
          </div>
        </div>
      </section>

      <section id="elements" className="section elements-section">
        <h2>The Five Elements</h2>
        <p className="section-desc">
          Master the cycle of creation and destruction
        </p>

        <div className="elements-grid">
          {ELEMENTS.map((el) => (
            <div
              key={el.name}
              className="element-card"
              style={{ "--element-color": el.color }}
            >
              <div className="element-icon">{el.symbol}</div>
              <h3 style={{ color: el.color }}>{el.name}</h3>
              <p>{el.desc}</p>
            </div>
          ))}
        </div>

        <div className="hierarchy">
          <div className="hierarchy-title">Elemental Hierarchy</div>
          <div className="hierarchy-chain">
            {ELEMENTS.map((el, i) => (
              <React.Fragment key={el.name}>
                <span style={{ color: el.color }}>{el.name}</span>
                {i < ELEMENTS.length - 1 && <span className="arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="hierarchy-note">
            Each element defeats the one before it in the cycle
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">🐍</span>
            <span>Godai</span>
          </div>
          <p className="footer-tagline">
            Fully onchain. Forever persistent. Truly yours.
          </p>
          <div className="footer-links">
            <a href="https://github.com/broody/godai">GitHub</a>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Built with ⚡ Dojo Engine on Starknet</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
