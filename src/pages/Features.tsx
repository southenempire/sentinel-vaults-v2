import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faLock, faShieldHalved, faCode, faChartLine, faLayerGroup, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import FeaturesBackground from '../components/FeaturesBackground';

const features = [
  {
    icon: faShieldHalved,
    tag: 'ISOLATION',
    title: 'Sandboxed execution',
    desc: "Each agent lives inside its own vault contract. One agent's mistake can never bleed into another — they're structurally isolated at the bytecode level.",
    size: 'large',
    accent: 'rgba(255,69,0,0.12)',
    accentBorder: 'rgba(255,69,0,0.25)',
    accentColor: '#FF4500',
  },
  {
    icon: faCode,
    tag: 'IMMUTABLE',
    title: 'Fully onchain',
    desc: 'No backend servers. No API keys to leak. Every guardrail lives in immutable bytecode.',
    size: 'small',
    accent: 'rgba(0,255,136,0.06)',
    accentBorder: 'rgba(0,255,136,0.2)',
    accentColor: '#00ff88',
  },
  {
    icon: faBolt,
    tag: 'PERFORMANCE',
    title: 'Sub-second finality',
    desc: "Monad's parallel EVM processes agent transactions in under a second. No stuck trades.",
    size: 'small',
    accent: 'rgba(136,136,255,0.06)',
    accentBorder: 'rgba(136,136,255,0.2)',
    accentColor: '#8888ff',
  },
  {
    icon: faToggleOn,
    tag: 'CONTROL',
    title: 'One-click kill switch',
    desc: "Panic button that freezes the vault immediately. Your funds, your control — not the agent's, not ours.",
    size: 'small',
    accent: 'rgba(255,68,68,0.06)',
    accentBorder: 'rgba(255,68,68,0.2)',
    accentColor: '#ff4444',
  },
  {
    icon: faChartLine,
    tag: 'VISIBILITY',
    title: 'Real-time monitoring',
    desc: 'Track every trade intent, approval, rejection, P&L, and daily limits from the command center. Nothing is hidden.',
    size: 'small',
    accent: 'rgba(255,200,0,0.06)',
    accentBorder: 'rgba(255,200,0,0.2)',
    accentColor: '#ffc800',
  },
  {
    icon: faLayerGroup,
    tag: 'SCALE',
    title: 'Multi-vault support',
    desc: 'Run multiple agents with different strategies, each in its own vault with its own risk profile.',
    size: 'small',
    accent: 'rgba(0,200,255,0.06)',
    accentBorder: 'rgba(0,200,255,0.2)',
    accentColor: '#00c8ff',
  },
  {
    icon: faLock,
    tag: 'TRUSTLESS',
    title: 'Zero trust required',
    desc: "You don't have to trust your agent — or us. The math enforces the rules. The contract cannot be overridden.",
    size: 'large',
    accent: 'rgba(255,69,0,0.06)',
    accentBorder: 'rgba(255,69,0,0.15)',
    accentColor: '#FF4500',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' } }),
};

export default function Features() {
  return (
    <>
      <FeaturesBackground />
      <section className="section" style={{ paddingTop: '12vh' }}>
        <div className="wrap">

          {/* Header */}
          <Reveal>
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 64px' }}>
              <p className="t-mono" style={{ color: 'var(--c-accent)', marginBottom: '14px', letterSpacing: '0.12em', fontSize: '0.75rem' }}>
                ARCHITECTURE
              </p>
              <h2 className="t-headline" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', marginBottom: '16px' }}>
                Power without compromise.
              </h2>
              <p style={{ color: 'var(--c-text2)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                Every rule baked into the contract. Every trade checked before it executes.
                No exceptions, no overrides, no trust required.
              </p>
            </div>
          </Reveal>

          {/* Bento Grid */}
          <div className="features-bento" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'auto',
            gap: '16px',
          }}>
            {features.map((f, i) => {
              const isLarge = f.size === 'large';
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  style={{
                    gridColumn: isLarge ? 'span 2' : 'span 1',
                    background: f.accent,
                    border: `1px solid ${f.accentBorder}`,
                    borderRadius: '16px',
                    padding: isLarge ? '40px' : '32px',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'default',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Glow */}
                  <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '160px', height: '160px', borderRadius: '50%',
                    background: f.accentColor,
                    opacity: 0.06,
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                  }} />

                  {/* Tag */}
                  <span className="t-mono" style={{
                    fontSize: '0.62rem', letterSpacing: '0.12em',
                    color: f.accentColor, display: 'block', marginBottom: '20px',
                  }}>
                    {f.tag}
                  </span>

                  {/* Icon */}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: `${f.accentColor}18`,
                    border: `1px solid ${f.accentColor}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                  }}>
                    <FontAwesomeIcon icon={f.icon} style={{ color: f.accentColor, fontSize: '1.1rem' }} />
                  </div>

                  <h3 style={{
                    fontSize: isLarge ? '1.5rem' : '1.1rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    marginBottom: '12px',
                    color: 'var(--c-text)',
                  }}>
                    {f.title}
                  </h3>
                  <p style={{
                    color: 'var(--c-text2)',
                    fontSize: isLarge ? '1rem' : '0.875rem',
                    lineHeight: 1.7,
                    maxWidth: isLarge ? '480px' : 'none',
                  }}>
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
