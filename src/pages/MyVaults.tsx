import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faBolt, faCoins, faBan, faPlus, faTimes, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

const initialVaults = [
  {
    name: 'Vault Alpha',
    agent: 'GPT-4o Trader',
    status: 'active',
    balance: '$8,200.00',
    pnl: '+$1,340',
    pnlColor: '#00ff88',
    rules: { maxSwap: '$500', dailyLoss: '$1,000', tokens: 'ETH, BTC, USDC' },
  },
  {
    name: 'Vault Beta',
    agent: 'Claude Scalper',
    status: 'active',
    balance: '$4,200.00',
    pnl: '+$290',
    pnlColor: '#00ff88',
    rules: { maxSwap: '$200', dailyLoss: '$500', tokens: 'SOL, USDC' },
  },
  {
    name: 'Vault Gamma',
    agent: 'Gemini Arbitrage',
    status: 'frozen',
    balance: '$0.00',
    pnl: '-$180',
    pnlColor: '#ff4444',
    rules: { maxSwap: '$1,000', dailyLoss: '$2,000', tokens: 'ETH, ARB, OP' },
  },
];

export default function MyVaults() {
  const [vaults, setVaults] = useState(initialVaults);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  // Form State
  const [newVault, setNewVault] = useState({
    name: 'My New Vault',
    agent: 'Custom Agent',
    maxSwap: '1000',
    dailyLoss: '5000',
    tokens: 'USDC, WMON',
  });

  const handleDeploy = () => {
    setIsDeploying(true);
    // Fake deployment delay
    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      setTimeout(() => {
        setVaults([
          {
            name: newVault.name,
            agent: newVault.agent,
            status: 'active',
            balance: '$0.00',
            pnl: '$0.00',
            pnlColor: 'var(--c-text2)',
            rules: { maxSwap: `$${newVault.maxSwap}`, dailyLoss: `$${newVault.dailyLoss}`, tokens: newVault.tokens },
          },
          ...vaults
        ]);
        closeModal();
      }, 1500);
    }, 3000);
  };

  const closeModal = () => {
    setIsDeployModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setDeploySuccess(false);
      setIsDeploying(false);
      setNewVault({ name: 'My New Vault', agent: 'Custom Agent', maxSwap: '1000', dailyLoss: '5000', tokens: 'USDC, WMON' });
    }, 300);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="t-headline" style={{ fontSize: '2rem', marginBottom: '4px' }}>My Vaults</h1>
          <p style={{ color: 'var(--c-text2)', fontSize: '0.9rem' }}>Each vault is an isolated smart contract with its own rules and agent.</p>
        </div>
        <motion.button
          onClick={() => setIsDeployModalOpen(true)}
          className="btn btn-fill"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FontAwesomeIcon icon={faPlus} /> Deploy New Vault
        </motion.button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnimatePresence>
          {vaults.map((v, i) => (
            <motion.div
              key={v.name}
              className="panel"
              initial={{ opacity: 0, y: 16, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              transition={{ delay: i * 0.08 }}
              style={{ border: v.status === 'frozen' ? '1px solid rgba(255,68,68,0.2)' : '1px solid var(--c-border)', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                {/* Left */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: v.status === 'frozen' ? 'rgba(255,68,68,0.08)' : 'rgba(255,107,0,0.08)',
                    border: `1px solid ${v.status === 'frozen' ? 'rgba(255,68,68,0.2)' : 'rgba(255,107,0,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FontAwesomeIcon icon={faShieldHalved} style={{ color: v.status === 'frozen' ? '#ff4444' : 'var(--c-accent)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{v.name}</h3>
                      <span className="t-mono" style={{
                        fontSize: '0.65rem', padding: '2px 8px', borderRadius: '20px',
                        color: v.status === 'frozen' ? '#ff4444' : '#00ff88',
                        background: v.status === 'frozen' ? 'rgba(255,68,68,0.08)' : 'rgba(0,255,136,0.08)',
                        border: `1px solid ${v.status === 'frozen' ? 'rgba(255,68,68,0.25)' : 'rgba(0,255,136,0.25)'}`,
                      }}>
                        <FontAwesomeIcon icon={v.status === 'frozen' ? faLock : faCircleCheck} style={{ marginRight: '6px' }} />
                        {v.status === 'frozen' ? 'FROZEN' : 'Active'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--c-text2)' }}>Agent: {v.agent}</p>
                  </div>
                </div>

                {/* Right — stats */}
                <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p className="t-mono" style={{ fontSize: '0.65rem', color: 'var(--c-text2)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Balance</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{v.balance}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="t-mono" style={{ fontSize: '0.65rem', color: 'var(--c-text2)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>7D PnL</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, color: v.pnlColor }}>{v.pnl}</p>
                  </div>
                </div>
              </div>

              {/* Rules strip */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
                {[
                  { icon: faBolt, label: `Max swap: ${v.rules.maxSwap}` },
                  { icon: faBan, label: `Daily loss: ${v.rules.dailyLoss}` },
                  { icon: faCoins, label: v.rules.tokens },
                ].map((tag, j) => (
                  <span key={j} style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
                    borderRadius: '6px', fontSize: '0.75rem', color: 'var(--c-text2)',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--c-border)'
                  }}>
                    <FontAwesomeIcon icon={tag.icon} style={{ fontSize: '0.65rem' }} />
                    {tag.label}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Deployment Modal Overlay */}
      <AnimatePresence>
        {isDeployModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="panel"
              style={{ width: '100%', maxWidth: '500px', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}
            >
              <button 
                onClick={closeModal} 
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--c-text2)', cursor: 'pointer', fontSize: '1.1rem' }}
                disabled={isDeploying}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              <div style={{ padding: '24px 8px 16px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px' }}>Deploy New Vault</h2>
                <p style={{ color: 'var(--c-text2)', fontSize: '0.9rem', marginBottom: '24px' }}>Configure onchain guardrails for your agent.</p>

                {/* Wizard Steps */}
                {!isDeploying && !deploySuccess && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {step === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-text2)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vault Name</label>
                          <input type="text" value={newVault.name} onChange={e => setNewVault({ ...newVault, name: e.target.value })} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--c-border)', borderRadius: '8px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-text2)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent Identity</label>
                          <input type="text" value={newVault.agent} onChange={e => setNewVault({ ...newVault, agent: e.target.value })} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--c-border)', borderRadius: '8px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <button className="btn btn-fill" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} onClick={() => setStep(2)}>Next Step</button>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-text2)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Swap Size ($)</label>
                          <input type="number" value={newVault.maxSwap} onChange={e => setNewVault({ ...newVault, maxSwap: e.target.value })} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--c-border)', borderRadius: '8px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-text2)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Loss Limit ($)</label>
                          <input type="number" value={newVault.dailyLoss} onChange={e => setNewVault({ ...newVault, dailyLoss: e.target.value })} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--c-border)', borderRadius: '8px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-text2)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Whitelisted Tokens (Comma separated)</label>
                          <input type="text" value={newVault.tokens} onChange={e => setNewVault({ ...newVault, tokens: e.target.value })} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--c-border)', borderRadius: '8px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>Back</button>
                          <button className="btn btn-accent btn-glow" style={{ flex: 2, justifyContent: 'center' }} onClick={handleDeploy}>Deploy to Monad</button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Deploying State */}
                {isDeploying && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '32px 0' }}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '2rem', color: 'var(--c-accent)', marginBottom: '24px' }} />
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Deploying Vault...</h3>
                    <p style={{ color: 'var(--c-text2)', fontSize: '0.9rem' }} className="t-mono">Compiling rules to bytecode...</p>
                  </motion.div>
                )}

                {/* Success State */}
                {deploySuccess && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '32px 0' }}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '2.5rem', color: '#00ff88', marginBottom: '20px' }} />
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Vault Deployed Successfully!</h3>
                    <p style={{ color: 'var(--c-text2)', fontSize: '0.9rem', marginBottom: '16px' }} className="t-mono">Transaction confirmed on Monad Testnet.</p>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
