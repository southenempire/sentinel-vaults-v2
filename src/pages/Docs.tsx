import { useState, useEffect } from 'react';
import Reveal from '../components/Reveal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faCircleCheck, faTriangleExclamation, faSkull } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import DocsBackground from '../components/DocsBackground';

const LOG_MESSAGES = [
  { text: 'Initializing Sentinel Vault [monad_testnet]', type: 'info', icon: faTerminal, color: 'var(--c-text2)' },
  { text: 'Vault active. Guardrails enforcing...', type: 'success', icon: faCircleCheck, color: '#34d399' },
  { text: 'Agent executing swap: 100 USDC -> WMON', type: 'info', icon: faTerminal, color: 'var(--c-text2)' },
  { text: 'Trade successful. PnL: +$14.20', type: 'success', icon: faCircleCheck, color: '#34d399' },
  { text: 'Agent executing swap: 5000 USDC -> PEPE', type: 'warn', icon: faTriangleExclamation, color: '#fbbf24' },
  { text: 'BLOCKED: Exceeds maxTradeSize (1000 USDC).', type: 'error', icon: faSkull, color: 'var(--c-accent)' },
  { text: 'Agent attempting to withdraw funds...', type: 'warn', icon: faTriangleExclamation, color: '#fbbf24' },
  { text: 'BLOCKED: Agent address lacks withdrawal roles.', type: 'error', icon: faSkull, color: 'var(--c-accent)' },
  { text: 'Risk limits intact. Resuming normal operations.', type: 'success', icon: faCircleCheck, color: '#34d399' },
];

export default function Docs() {
  const [logs, setLogs] = useState<typeof LOG_MESSAGES>([]);

  useEffect(() => {
    let currentIndex = 0;
    let isWaiting = false;
    
    const interval = setInterval(() => {
      if (isWaiting) return;
      
      if (currentIndex < LOG_MESSAGES.length) {
        const nextLog = LOG_MESSAGES[currentIndex];
        if (nextLog) {
          setLogs((prev) => [...prev, nextLog]);
        }
        currentIndex++;
      } else {
        isWaiting = true;
        setTimeout(() => {
          setLogs([]);
          currentIndex = 0;
          isWaiting = false;
        }, 2000);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <DocsBackground />
      <section className="section" style={{ height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: '60px' }}>
      <div className="wrap" style={{ width: '100%' }}>
        <Reveal>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <p className="t-mono" style={{ color: 'var(--c-accent)', marginBottom: '8px' }}>Documentation</p>
            <h2 className="t-headline" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>How to secure your AI.</h2>
            <p className="t-body" style={{ margin: '8px auto', maxWidth: '600px', fontSize: '0.9rem' }}>
              Learn how to deploy your vault, configure risk limits, and monitor your agent's activity in real-time. Below is a simulation of the Sentinel Vault enforcing constraints on an aggressive AI agent.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto', alignItems: 'start' }}>
          <Reveal delay={0.1}>
            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid var(--c-border)', padding: '12px 24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                <span className="t-mono" style={{ marginLeft: '12px', fontSize: '0.8rem', color: 'var(--c-text2)' }}>vault_execution.log</span>
              </div>
              <div style={{ padding: '16px 24px', minHeight: '240px', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>
                <AnimatePresence>
                  {logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'center' }}
                    >
                      <span style={{ color: '#888' }}>[{new Date().toLocaleTimeString()}]</span>
                      {log?.icon && <FontAwesomeIcon icon={log.icon} style={{ color: log?.color || '#fff', width: '16px' }} />}
                      <span style={{ color: log?.color === 'var(--c-text2)' ? '#ccc' : (log?.color || '#fff') }}>
                        {log?.text || ''}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div>
              <h3 className="t-headline" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Quick Start: CLI Deployment</h3>
              <p className="t-body" style={{ marginBottom: '24px', fontSize: '0.9rem' }}>
                You can deploy and configure your Sentinel Vault directly from your terminal using the official CLI tool.
              </p>

              <div className="panel" style={{ padding: '0', background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px', padding: '12px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--c-border)' }}>
                  <span className="t-mono" style={{ color: 'var(--c-text2)', fontSize: '0.8rem' }}>terminal</span>
                </div>
                <pre className="code-block" style={{ border: 'none', margin: 0, borderRadius: 0, background: 'transparent', padding: '16px', fontSize: '0.85rem', overflowX: 'auto' }}>
<span className="cm"># 1. Install the Sentinel CLI</span>
npm install -g @sentinel-vaults/cli

<span className="cm"># 2. Authenticate with your operator wallet</span>
sentinel login

<span className="cm"># 3. Initialize a new vault configuration</span>
sentinel init my-agent-vault

<span className="cm"># 4. Deploy to Monad</span>
sentinel deploy --network monad-testnet
                </pre>
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: 500, marginBottom: '12px' }}>Integrating with your AI</h4>
              <p className="t-body" style={{ marginBottom: '16px', fontSize: '0.9rem' }}>
                Once deployed, the CLI outputs your Vault Contract Address. Pass this address into your agent's configuration. When your agent wants to execute a trade, it will submit the intent to the vault rather than the DEX router directly.
              </p>
              
              <div className="panel" style={{ padding: '0', background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: '8px', padding: '12px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--c-border)' }}>
                  <span className="t-mono" style={{ color: 'var(--c-text2)', fontSize: '0.8rem' }}>agent.ts</span>
                </div>
                <pre className="code-block" style={{ border: 'none', margin: 0, borderRadius: 0, background: 'transparent', padding: '16px', fontSize: '0.85rem', overflowX: 'auto' }}>
<span className="kw">import</span> {'{'} SentinelClient {'}'} <span className="kw">from</span> <span style={{ color: '#a78bfa' }}>'@sentinel-vaults/sdk'</span>;

<span className="kw">const</span> vault = <span className="kw">new</span> <span className="fn">SentinelClient</span>(VAULT_ADDRESS);

<span className="cm">// The agent requests a trade</span>
<span className="kw">await</span> vault.<span className="fn">executeTrade</span>({'{'}
  tokenIn: USDC_ADDRESS,
  amount: <span style={{ color: '#a78bfa' }}>'5000'</span>,
  path: [USDC_ADDRESS, WMON_ADDRESS]
{'}'});
                </pre>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
    </>
  );
}
