import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faBan, faCoins, faLock, faCheck, faPen } from '@fortawesome/free-solid-svg-icons';

function RuleCard({ icon, title, description, value, unit, color = 'var(--c-accent)' }: {
  icon: any; title: string; description: string; value: string; unit: string; color?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  return (
    <motion.div
      className="panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon icon={icon} style={{ color, fontSize: '0.9rem' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 500 }}>{title}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--c-text2)', marginTop: '2px' }}>{description}</p>
          </div>
        </div>
        <motion.button
          onClick={() => setEditing(!editing)}
          whileTap={{ scale: 0.9 }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text2)', padding: '4px 8px' }}
        >
          <FontAwesomeIcon icon={editing ? faCheck : faPen} style={{ fontSize: '0.8rem' }} />
        </motion.button>
      </div>

      {editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            value={val}
            onChange={e => setVal(e.target.value)}
            style={{
              flex: 1, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--c-accent)',
              borderRadius: '8px', padding: '8px 12px', color: 'var(--c-text)',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', outline: 'none',
            }}
          />
          <span style={{ color: 'var(--c-text2)', fontSize: '0.85rem' }}>{unit}</span>
        </div>
      ) : (
        <p className="t-mono" style={{ fontSize: '1.6rem', fontWeight: 700, color, letterSpacing: '-0.02em' }}>
          {val} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--c-text2)' }}>{unit}</span>
        </p>
      )}
    </motion.div>
  );
}

export default function RiskRules() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="t-headline" style={{ fontSize: '2rem', marginBottom: '4px' }}>Risk Rules</h1>
        <p style={{ color: 'var(--c-text2)', fontSize: '0.9rem' }}>These rules are baked into the vault smart contract. Once deployed, they're immutable — the agent cannot override them.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <RuleCard
          icon={faBolt}
          title="Max Swap Size"
          description="Max USDC value per single trade"
          value="500"
          unit="USDC / trade"
          color="var(--c-accent)"
        />
        <RuleCard
          icon={faBan}
          title="Daily Loss Limit"
          description="Vault freezes automatically when hit"
          value="1,000"
          unit="USDC / day"
          color="#ff4444"
        />
        <RuleCard
          icon={faCoins}
          title="Slippage Tolerance"
          description="Max allowed slippage per trade"
          value="1"
          unit="% max"
          color="#00ff88"
        />
        <RuleCard
          icon={faLock}
          title="Trade Cooldown"
          description="Minimum time between agent trades"
          value="30"
          unit="seconds"
          color="#8888ff"
        />
      </div>

      {/* Whitelist */}
      <motion.div className="panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon icon={faCoins} style={{ color: '#00ff88', fontSize: '0.9rem' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 500 }}>Whitelisted Tokens</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--c-text2)', marginTop: '2px' }}>Agent can only trade these tokens. Any other token = instant rejection.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ETH', 'BTC', 'SOL', 'USDC'].map(tok => (
            <span key={tok} style={{
              padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
              color: '#00ff88', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)',
              fontFamily: 'JetBrains Mono, monospace',
            }}>{tok}</span>
          ))}
          <span style={{
            padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem',
            color: 'var(--c-text2)', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--c-border)',
            cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
          }}>+ Add token</span>
        </div>

        <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(255,68,68,0.05)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--c-text2)', lineHeight: 1.6 }}>
          <FontAwesomeIcon icon={faTriangleExclamation} /> <strong style={{ color: 'var(--c-text)' }}>Rules are immutable once deployed.</strong> Changes here apply to your <em>next</em> vault deployment only, not the currently active contract.
        </div>
      </motion.div>
    </div>
  );
}
