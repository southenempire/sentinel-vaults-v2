import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faSkullCrossbones, faShieldHalved, faRocket } from '@fortawesome/free-solid-svg-icons';

const steps = [
  {
    icon: faRobot,
    color: '#00ff88',
    title: 'Your AI Agent',
    desc: 'Your AI trading agent is autonomous. It can execute swaps, manage positions, and interact with DeFi protocols — all without your input.',
  },
  {
    icon: faSkullCrossbones,
    color: '#ff4444',
    title: 'The Risk',
    desc: 'Without guardrails, a rogue agent can drain your entire wallet in seconds. Hallucinations, bugs, or exploits — the risk is real.',
  },
  {
    icon: faShieldHalved,
    color: '#ff6b00',
    title: 'The Sentinel Vault',
    desc: 'Sentinel deploys an immutable smart contract that wraps your agent. You set max trade size, daily loss limits, and token whitelists. The agent physically cannot break these rules.',
  },
  {
    icon: faRocket,
    color: '#ff6b00',
    title: 'Deploy Your Vault',
    desc: 'Create your on-chain vault on Monad Testnet. You\'ll need a small amount of testnet MON for gas. Once deployed, your agent is caged forever.',
  },
];

export default function VaultOnboarding({ onDeploy, isPending }: { onDeploy: () => void; isPending: boolean }) {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>

      {/* Visual */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 8 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '28px',
            background: `rgba(${current.color === '#ff4444' ? '255,68,68' : current.color === '#00ff88' ? '0,255,136' : '255,107,0'}, 0.08)`,
            border: `2px solid ${current.color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
            marginBottom: '32px',
            boxShadow: `0 0 40px ${current.color}15, 0 0 80px ${current.color}08`,
          }}
        >
          <FontAwesomeIcon icon={current.icon} style={{ color: current.color, fontSize: '3rem', filter: 'drop-shadow(0 0 12px currentColor)' }} />
        </motion.div>
      </AnimatePresence>

      {/* Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          style={{ textAlign: 'center', maxWidth: '480px', marginBottom: '36px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
            <FontAwesomeIcon icon={current.icon} style={{ color: current.color, fontSize: '1.1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{current.title}</h2>
          </div>
          <p style={{ color: 'var(--c-text2)', lineHeight: 1.7, fontSize: '0.95rem' }}>{current.desc}</p>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '28px' }}>
        {step > 0 && step < 3 && (
          <motion.button
            className="btn btn-ghost"
            onClick={() => setStep(s => s - 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back
          </motion.button>
        )}
        {step < 3 ? (
          <motion.button
            className="btn btn-accent btn-glow"
            onClick={() => setStep(s => s + 1)}
            style={{ minWidth: '140px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next →
          </motion.button>
        ) : (
          <motion.button
            className="btn btn-accent btn-glow"
            onClick={onDeploy}
            disabled={isPending}
            style={{ padding: '14px 36px', fontSize: '1.05rem', minWidth: '220px' }}
            whileHover={isPending ? {} : { scale: 1.05 }}
            whileTap={isPending ? {} : { scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faRocket} style={{ marginRight: '8px' }} />
            {isPending ? 'Deploying...' : 'Deploy Vault'}
          </motion.button>
        )}
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {steps.map((_, i) => (
          <motion.div
            key={i}
            onClick={() => setStep(i)}
            animate={{
              width: i === step ? '24px' : '8px',
              background: i === step ? current.color : 'rgba(255,255,255,0.15)',
            }}
            style={{
              height: '8px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'width 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
