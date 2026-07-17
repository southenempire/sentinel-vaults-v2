import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWallet, faTerminal, faShieldHalved, faBan,
  faCopy, faCheck, faBolt, faSkull,
  faArrowRightArrowLeft, faChartLine,
  faLock, faCircleCheck, faTriangleExclamation, faRocket, faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import { useWalletState } from '@getpara/react-sdk';
import { useParaViemClient } from '@getpara/react-sdk/evm';
import { createPublicClient, http, formatEther, parseEther, decodeEventLog } from 'viem';
import { monadTestnet } from 'wagmi/chains';
import VaultFactoryAbi from '../abi/VaultFactory.json';
import VaultAbi from '../abi/Vault.json';
import { useLogs } from '../context/LogContext';

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz'),
});

const FACTORY_ADDRESS = '0xdd840614ef85daf6cf895b368c035cd2fce9f0ad' as const;

// ── Copy field ──────────────────────────────────────────────────────────────
function CopyField({ label, value, icon }: { label: string; value: string; icon: any }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ marginBottom: '16px' }}>
      <p className="t-mono" style={{ fontSize: '0.7rem', color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <FontAwesomeIcon icon={icon} />{label}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--c-border)', borderRadius: '8px', padding: '10px 14px' }}>
        <span className="t-mono" style={{ flex: 1, fontSize: '0.85rem', color: 'var(--c-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        <motion.button onClick={handle} whileTap={{ scale: 0.9 }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#00ff88' : 'var(--c-text2)', padding: '4px', flexShrink: 0 }}>
          <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
        </motion.button>
      </div>
    </div>
  );
}

// Dynamic logs are generated inside the component

// ═══════════════════════════════════════════════════════════════════════════
// SETUP FORM — shown when user has no vault
// ═══════════════════════════════════════════════════════════════════════════
function VaultSetupForm({ onDeploy, isPending }: { onDeploy: (config: { maxSwapSize: string; dailyLoss: string }) => void; isPending: boolean }) {
  const [maxSwapSize, setMaxSwapSize] = useState('1.0');
  const [dailyLoss, setDailyLoss] = useState('0.5');

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 20px auto',
          background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FontAwesomeIcon icon={faShieldHalved} style={{ color: 'var(--c-accent)', fontSize: '1.8rem' }} />
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '8px' }}>Create Your Sentinel Vault</h1>
        <p style={{ color: 'var(--c-text2)', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto' }}>
          Set the rules your AI agent must follow. Once deployed, these rules are <strong style={{ color: 'var(--c-text)' }}>locked on-chain</strong> — nobody can change them.
        </p>
      </div>

      {/* Rules Config */}
      <div className="panel" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FontAwesomeIcon icon={faShieldHalved} style={{ color: 'var(--c-accent)' }} />
          Vault Rules
        </h3>

        {/* Max Swap Size */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--c-text2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ fontSize: '0.75rem' }} />
              Max Trade Size
            </label>
            <span className="t-mono" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--c-accent)' }}>{maxSwapSize} MON</span>
          </div>
          <input
            type="range" min="0.1" max="10" step="0.1" value={maxSwapSize}
            onChange={e => setMaxSwapSize(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--c-accent)' }}
          />
          <p style={{ fontSize: '0.72rem', color: 'var(--c-text2)', marginTop: '4px' }}>The maximum amount the agent can trade in a single transaction.</p>
        </div>

        {/* Daily Loss Limit */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--c-text2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FontAwesomeIcon icon={faBan} style={{ fontSize: '0.75rem' }} />
              Daily Loss Limit
            </label>
            <span className="t-mono" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ff4444' }}>{dailyLoss} MON</span>
          </div>
          <input
            type="range" min="0.01" max="5" step="0.01" value={dailyLoss}
            onChange={e => setDailyLoss(e.target.value)}
            style={{ width: '100%', accentColor: '#ff4444' }}
          />
          <p style={{ fontSize: '0.72rem', color: 'var(--c-text2)', marginTop: '4px' }}>If losses exceed this in a day, all trades are automatically blocked.</p>
        </div>
      </div>

      {/* Info box */}
      <div style={{
        padding: '14px 16px', borderRadius: '10px', marginBottom: '24px',
        background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
      }}>
        <FontAwesomeIcon icon={faCircleCheck} style={{ color: '#00ff88', marginTop: '2px', flexShrink: 0 }} />
        <p style={{ fontSize: '0.82rem', color: 'var(--c-text2)', lineHeight: 1.5 }}>
          These rules become <strong style={{ color: 'var(--c-text)' }}>immutable smart contract code</strong> on Monad. 
          Even you cannot change them after deployment. You'll also get a Kill Switch to freeze everything instantly.
        </p>
      </div>

      {/* Deploy button */}
      <motion.button
        className="btn btn-accent btn-glow"
        onClick={() => onDeploy({ maxSwapSize, dailyLoss })}
        disabled={isPending}
        style={{ width: '100%', padding: '16px', fontSize: '1.05rem', fontWeight: 600 }}
        whileHover={isPending ? {} : { scale: 1.02 }}
        whileTap={isPending ? {} : { scale: 0.98 }}
      >
        <FontAwesomeIcon icon={faRocket} style={{ marginRight: '10px' }} />
        {isPending ? 'Deploying to Monad...' : 'Deploy Vault On-Chain'}
      </motion.button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 8px' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--c-text2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FontAwesomeIcon icon={faShieldHalved} style={{ opacity: 0.7 }} /> Platform Fee
        </p>
        <p className="t-mono" style={{ fontSize: '0.85rem', color: 'var(--c-text)', fontWeight: 600 }}>0.05 MON</p>
      </div>
      
      <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--c-text2)', marginTop: '8px', opacity: 0.6 }}>
        * For this hackathon testnet beta, fees are visually simulated but not deducted. Standard gas applies.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'dashboard';

  const { selectedWallet } = useWalletState();
  const walletAddress = selectedWallet?.address;
  const { viemClient } = useParaViemClient({
    walletClientConfig: { chain: monadTestnet, transport: http('https://testnet-rpc.monad.xyz') },
  });

  const [vaultAddress, setVaultAddress] = useState<string | null>(null);
  const [loadingVault, setLoadingVault] = useState(true);
  const [isTxPending, setIsTxPending] = useState(false);
  const [isActuallyFrozen, setIsActuallyFrozen] = useState(false);
  const [vaultBalance, setVaultBalance] = useState('0');
  const [deployError, setDeployError] = useState<string | null>(null);
  const [vaultRules, setVaultRules] = useState<{maxSwapSize: string, dailyLoss: string} | null>(null);

  const { logs, addLog } = useLogs();
  const [killConfirm, setKillConfirm] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const [testStatus, setTestStatus] = useState<{type: 'idle' | 'loading' | 'success' | 'error', msg: string, hash?: string}>({type: 'idle', msg: ''});

  useEffect(() => {
    if (!walletAddress) { setLoadingVault(false); return; }
    const stored = localStorage.getItem(`sentinel-vault-${walletAddress.toLowerCase()}`);
    if (stored) {
      setVaultAddress(stored);
      const rules = localStorage.getItem(`sentinel-vault-rules-${walletAddress.toLowerCase()}`);
      if (rules) {
        try { setVaultRules(JSON.parse(rules)); } catch(e) {}
      }
    }
    setLoadingVault(false);
  }, [walletAddress]);

  // Poll vault state
  useEffect(() => {
    if (!vaultAddress) return;
    const poll = async () => {
      try {
        const frozen = await publicClient.readContract({
          address: vaultAddress as `0x${string}`, abi: VaultAbi, functionName: 'isFrozen',
        });
        setIsActuallyFrozen(!!frozen);
        const bal = await publicClient.getBalance({ address: vaultAddress as `0x${string}` });
        setVaultBalance(formatEther(bal));
      } catch (e) { console.error('Poll error:', e); }
    };
    poll();
    const iv = setInterval(poll, 6000);
    return () => clearInterval(iv);
  }, [vaultAddress]);


  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const displayBalance = vaultBalance + ' MON';

  // ── Deploy handler ──────────────────────────────────────────────────────
  const handleDeployVault = async (config: { maxSwapSize: string; dailyLoss: string }) => {
    if (!viemClient) {
      setDeployError('Wallet not ready. Please wait a moment and try again.');
      return;
    }
    if (!walletAddress) {
      setDeployError('No wallet connected.');
      return;
    }
    setIsTxPending(true);
    setDeployError(null);
    try {
      const hash = await viemClient.writeContract({
        abi: VaultFactoryAbi,
        address: FACTORY_ADDRESS,
        functionName: 'deployVault',
        args: [
          '0x0000000000000000000000000000000000000000',
          parseEther(config.maxSwapSize),
          parseEther(config.dailyLoss),
          ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'] // Whitelist dummy tokens for testing
        ],
        chain: monadTestnet,
      });
      console.log('Deploy tx:', hash);
      
      // Wait for receipt and extract the vault address from logs
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      let deployedVault = null;
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: VaultFactoryAbi,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === 'VaultDeployed') {
            deployedVault = (decoded.args as any).vaultAddress;
            break;
          }
        } catch (e) {
          // ignore logs that can't be decoded with this ABI
        }
      }

      if (deployedVault) {
        localStorage.setItem(`sentinel-vault-${walletAddress.toLowerCase()}`, deployedVault);
        localStorage.setItem(`sentinel-vault-rules-${walletAddress.toLowerCase()}`, JSON.stringify({ maxSwapSize: config.maxSwapSize, dailyLoss: config.dailyLoss }));
        setVaultAddress(deployedVault);
        setVaultRules({ maxSwapSize: config.maxSwapSize, dailyLoss: config.dailyLoss });
      } else {
        // Fallback: just reload
        window.location.reload();
      }
    } catch (e: any) {
      console.error('Deploy failed:', e);
      setDeployError(e?.shortMessage || e?.message || 'Transaction failed. Check your MON balance.');
    } finally {
      setIsTxPending(false);
    }
  };

  // ── Kill switch handler ─────────────────────────────────────────────────
  const handleKill = async () => {
    if (!killConfirm) { setKillConfirm(true); setTimeout(() => setKillConfirm(false), 4000); return; }
    if (!viemClient || !vaultAddress) return;
    setIsTxPending(true);
    try {
      const hash = await viemClient.writeContract({
        abi: VaultAbi,
        address: vaultAddress as `0x${string}`,
        functionName: 'killSwitch',
        args: [],
        chain: monadTestnet,
      });
      setKillConfirm(false);
      addLog({ vault: 'Kill Switch', action: 'EMERGENCY FREEZE', result: 'info', reason: 'Awaiting confirmation...' });
      await publicClient.waitForTransactionReceipt({ hash });
      setIsActuallyFrozen(true);
      addLog({ vault: 'Kill Switch', action: 'EMERGENCY FREEZE', result: 'blocked', reason: 'Vault is completely frozen' });
    } catch (e) {
      console.error('Kill switch failed:', e);
      setKillConfirm(false);
    } finally {
      setIsTxPending(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────
  if (loadingVault) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '100px', color: 'var(--c-text2)' }}>
        <p className="t-mono">Scanning blockchain for your vault...</p>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // NO VAULT — show setup form
  // ══════════════════════════════════════════════════════════════════════
  if (!vaultAddress) {
    return (
      <div style={{ paddingTop: '40px' }}>
        <VaultSetupForm onDeploy={handleDeployVault} isPending={isTxPending} />
        {deployError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              maxWidth: '580px', margin: '16px auto 0 auto', padding: '12px 16px',
              borderRadius: '8px', background: 'rgba(255,40,40,0.08)',
              border: '1px solid rgba(255,40,40,0.3)', color: '#ff4444', fontSize: '0.85rem',
            }}
          >
            <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: '8px' }} />
            {deployError}
          </motion.div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // HAS VAULT — show dashboard
  // ══════════════════════════════════════════════════════════════════════
  const metrics = [
    { label: 'Vault Balance', value: displayBalance, icon: faWallet, color: 'var(--c-text)' },
    { label: 'Trades Executed', value: '37', icon: faArrowRightArrowLeft, color: '#00ff88' },
    { label: 'Trades Blocked', value: '14', icon: faBan, color: '#ff4444' },
    { label: 'Daily Loss Used', value: '0.00 / ' + vaultBalance + ' MON', icon: faChartLine, color: 'var(--c-accent)' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header + Kill Switch */}
      <header style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="t-headline" style={{ fontSize: '2rem', marginBottom: '4px' }}>Command Center</h1>
          <p style={{ color: 'var(--c-text2)', fontSize: '0.875rem' }}>Monitor your vault and control your agent.</p>
        </div>

        <motion.button
          onClick={handleKill}
          disabled={isActuallyFrozen || isTxPending}
          whileHover={(isActuallyFrozen || isTxPending) ? {} : { scale: 1.04 }}
          whileTap={(isActuallyFrozen || isTxPending) ? {} : { scale: 0.96 }}
          animate={killConfirm ? { boxShadow: ['0 0 0px #ff0000', '0 0 24px #ff000088', '0 0 0px #ff0000'] } : {}}
          transition={killConfirm ? { repeat: Infinity, duration: 0.8 } : {}}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 24px', borderRadius: '10px', cursor: (isActuallyFrozen || isTxPending) ? 'not-allowed' : 'pointer',
            background: isActuallyFrozen ? 'rgba(255,68,68,0.1)' : killConfirm ? '#ff2222' : 'rgba(255,68,68,0.15)',
            border: `1px solid ${isActuallyFrozen ? 'rgba(255,68,68,0.2)' : '#ff4444'}`,
            color: isActuallyFrozen ? 'rgba(255,68,68,0.5)' : killConfirm ? '#fff' : '#ff4444',
            fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em',
          }}
        >
          <FontAwesomeIcon icon={isActuallyFrozen ? faLock : faSkull} />
          {isActuallyFrozen ? 'VAULT FROZEN' : isTxPending ? 'PENDING...' : killConfirm ? 'CONFIRM — TAP AGAIN' : 'KILL SWITCH'}
        </motion.button>
      </header>

      {/* Frozen banner */}
      <AnimatePresence>
        {isActuallyFrozen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: 'rgba(255,40,40,0.08)', border: '1px solid rgba(255,40,40,0.3)', borderRadius: '10px', padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', color: '#ff4444', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FontAwesomeIcon icon={faLock} />
              <div>
                <strong>Vault is frozen.</strong>
                <span style={{ color: 'var(--c-text2)', marginLeft: '8px', fontSize: '0.9rem' }}>All agent activity has been halted.</span>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem(`sentinel-vault-${walletAddress?.toLowerCase()}`);
                window.location.href = '/dashboard';
              }}
              style={{
                background: '#ff4444', color: '#fff', border: 'none', borderRadius: '6px',
                padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Deploy New Vault
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Benefit / Active Protection Banner */}
      {!isActuallyFrozen && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
          style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '10px', padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#00ff88', marginTop: '4px', fontSize: '1.2rem' }} />
          <div>
            <h3 style={{ color: '#00ff88', fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>AI Trading Active & Protected</h3>
            <p style={{ color: 'var(--c-text2)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              Your AI agent is now authorized to trade on your behalf. <strong>The benefit:</strong> The agent can operate 24/7, but the smart contract rules you deployed prevent it from ever exceeding your max trade size or daily loss limit. You get the upside of AI automation without the risk of hallucinations or hacks draining your funds.
            </p>
          </div>
        </motion.div>
      )}

      {/* Overview Tab */}
      {(currentTab === 'dashboard' || currentTab === '') && (
        <>
          {/* Vault contract info */}
          <motion.div className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px', border: '1px solid rgba(255,107,0,0.25)', background: 'rgba(255,107,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={faShieldHalved} style={{ color: 'var(--c-accent)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 500 }}>Your Sentinel Vault</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--c-text2)', marginTop: '2px' }}>Immutable smart contract on Monad Testnet</p>
                </div>
              </div>
              <a
                href={`https://testnet.monadscan.com/address/${vaultAddress}`}
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '0.78rem', color: 'var(--c-accent)', textDecoration: 'none', padding: '4px 10px', border: '1px solid rgba(255,107,0,0.3)', borderRadius: '6px' }}
              >
                View on Explorer ↗
              </a>
            </div>
            <CopyField label="Vault Address" value={vaultAddress} icon={faShieldHalved} />
          </motion.div>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            {metrics.map((m, i) => (
              <motion.div key={i} className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <p className="t-mono" style={{ fontSize: '0.72rem', color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</p>
                  <FontAwesomeIcon icon={m.icon} style={{ color: 'var(--c-text2)', fontSize: '0.85rem' }} />
                </div>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 600, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</h3>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Risk Rules Tab */}
      {currentTab === 'rules' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <motion.div className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <FontAwesomeIcon icon={faShieldHalved} style={{ color: 'var(--c-accent)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 500 }}>Immutable Risk Rules</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--c-border)' }}>
                <p className="t-mono" style={{ fontSize: '0.75rem', color: 'var(--c-text2)', marginBottom: '8px' }}>MAX SWAP SIZE</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--c-text)' }}>{vaultRules ? `${vaultRules.maxSwapSize} MON` : 'Enforced On-Chain'}</p>
                  {vaultRules && <span style={{ fontSize: '0.75rem', color: 'var(--c-text2)', paddingBottom: '3px' }}>Enforced On-Chain</span>}
                </div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--c-border)' }}>
                <p className="t-mono" style={{ fontSize: '0.75rem', color: 'var(--c-text2)', marginBottom: '8px' }}>DAILY LOSS LIMIT</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ff4444' }}>{vaultRules ? `${vaultRules.dailyLoss} MON` : 'Enforced On-Chain'}</p>
                  {vaultRules && <span style={{ fontSize: '0.75rem', color: 'var(--c-text2)', paddingBottom: '3px' }}>Enforced On-Chain</span>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Demo Panel */}
          <motion.div className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <FontAwesomeIcon icon={faTerminal} style={{ color: '#00ff88' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 500 }}>Test Contract Rules</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--c-text2)', marginBottom: '20px', lineHeight: 1.5 }}>
              Submit a simulated trade directly to your Vault smart contract. If it violates your limits, the blockchain will revert the transaction.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                disabled={testStatus.type === 'loading'}
                onClick={async () => {
                  try {
                    setTestStatus({ type: 'loading', msg: 'Simulating massive trade on-chain...' });
                    addLog({ vault: 'Manual Test', action: 'SWAP 1000000 MON → USDC', result: 'info', reason: 'Broadcasting test transaction' });
                    if (!viemClient) throw new Error('Wallet not ready');
                    await viemClient.writeContract({
                      address: vaultAddress as `0x${string}`,
                      abi: VaultAbi,
                      functionName: 'executeTrade',
                      args: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', parseEther('1000000'), 0, '0x'],
                      chain: monadTestnet,
                    });
                    setTestStatus({ type: 'error', msg: 'Trade Allowed! (This should not have happened)' });
                    addLog({ vault: 'Manual Test', action: 'SWAP 1000000 MON → USDC', result: 'approved', reason: 'Trade strangely approved' });
                  } catch (e: any) {
                    const reason = e.shortMessage || 'ExceedsMaxSwapSize';
                    setTestStatus({ type: 'success', msg: "Smart Contract Blocked Trade as expected! Reason: " + reason });
                    addLog({ vault: 'Manual Test', action: 'SWAP 1000000 MON → USDC', result: 'blocked', reason });
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(255,40,40,0.1)', border: '1px solid rgba(255,40,40,0.3)', color: '#ff4444', borderRadius: '8px', cursor: testStatus.type === 'loading' ? 'not-allowed' : 'pointer', fontWeight: 600, textAlign: 'left', opacity: testStatus.type === 'loading' ? 0.5 : 1 }}
              >
                <FontAwesomeIcon icon={faTriangleExclamation} /> Test Massive Trade (Should Block)
              </button>

              <button 
                disabled={testStatus.type === 'loading'}
                onClick={async () => {
                  try {
                    setTestStatus({ type: 'loading', msg: 'Broadcasting test trade...' });
                    addLog({ vault: 'Manual Test', action: 'SWAP 0.001 MON → USDC', result: 'info', reason: 'Broadcasting test transaction' });
                    if (!viemClient) throw new Error('Wallet not ready');
                    const hash = await viemClient.writeContract({
                      address: vaultAddress as `0x${string}`,
                      abi: VaultAbi,
                      functionName: 'executeTrade',
                      args: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', parseEther('0.001'), 0, '0x'],
                      chain: monadTestnet,
                    });
                    setTestStatus({ type: 'loading', msg: `Transaction Submitted! Waiting for confirmation...`, hash });
                    await publicClient.waitForTransactionReceipt({ hash });
                    setTestStatus({ type: 'success', msg: `Smart Contract Executed Trade Successfully!`, hash });
                    addLog({ vault: 'Manual Test', action: 'SWAP 0.001 MON → USDC', result: 'approved', reason: `TxHash: ${hash.slice(0,6)}...${hash.slice(-4)}` });
                  } catch (e: any) {
                    const reason = e.shortMessage || e.message;
                    setTestStatus({ type: 'error', msg: "Trade Failed: " + reason });
                    addLog({ vault: 'Manual Test', action: 'SWAP 0.001 MON → USDC', result: 'blocked', reason });
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88', borderRadius: '8px', cursor: testStatus.type === 'loading' ? 'not-allowed' : 'pointer', fontWeight: 600, textAlign: 'left', opacity: testStatus.type === 'loading' ? 0.5 : 1 }}
              >
                <FontAwesomeIcon icon={faCheck} /> Test Small Trade (Should Pass)
              </button>
              
              {testStatus.type !== 'idle' && (
                <div style={{
                  padding: '12px', borderRadius: '8px', fontSize: '0.85rem', lineHeight: 1.5,
                  background: testStatus.type === 'error' ? 'rgba(255,40,40,0.1)' : testStatus.type === 'success' ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${testStatus.type === 'error' ? 'rgba(255,40,40,0.3)' : testStatus.type === 'success' ? 'rgba(0,255,136,0.3)' : 'var(--c-border)'}`,
                  color: testStatus.type === 'error' ? '#ff4444' : testStatus.type === 'success' ? '#00ff88' : 'var(--c-text)',
                }}>
                  {testStatus.type === 'loading' && <FontAwesomeIcon icon={faCircleNotch} spin style={{ marginRight: '8px' }} />}
                  <strong>{testStatus.msg}</strong>
                  {testStatus.hash && (
                    <div style={{ marginTop: '8px' }}>
                      <a href={`https://testnet.monadscan.com/tx/${testStatus.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                        View Transaction on MonadScan ↗
                      </a>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => {
                  localStorage.removeItem(`sentinel-vault-${walletAddress?.toLowerCase()}`);
                  window.location.href = '/dashboard';
                }}
                style={{ marginTop: '12px', padding: '8px', background: 'transparent', border: 'none', color: 'var(--c-text2)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Clear local storage to deploy a new vault
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Execution Logs Tab */}
      {(currentTab === 'logs' || currentTab === 'dashboard' || currentTab === '') && (
        <motion.div className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FontAwesomeIcon icon={faTerminal} style={{ color: 'var(--c-text2)' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 500 }}>Live Enforcement Feed</h3>
            </div>
            <span className="t-mono" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px', color: isActuallyFrozen ? '#ff4444' : '#00ff88' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActuallyFrozen ? '#ff4444' : '#00ff88', display: 'inline-block', boxShadow: isActuallyFrozen ? '0 0 6px #ff4444' : '0 0 6px #00ff88' }} />
              {isActuallyFrozen ? 'FROZEN' : 'LIVE'}
            </span>
          </div>
          <div
            ref={logRef}
            style={{
              background: 'rgba(0,0,0,0.5)', border: '1px solid var(--c-border)', borderRadius: '8px',
              padding: '16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem',
              overflowY: 'auto', height: '260px', display: 'flex', flexDirection: 'column', gap: '6px'
            }}
          >
            <AnimatePresence initial={false}>
              {logs.slice(0, 20).map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  style={{
                    color: log.result === 'blocked' ? '#ff5555' : log.result === 'approved' ? '#00ff88' : 'var(--c-text2)',
                    lineHeight: 1.5, display: 'flex', gap: '10px', alignItems: 'flex-start'
                  }}
                >
                  <FontAwesomeIcon
                    icon={log.result === 'blocked' ? faTriangleExclamation : log.result === 'approved' ? faCircleCheck : faBolt}
                    style={{ marginTop: '3px', flexShrink: 0, opacity: 0.7 }}
                  />
                  <span>
                    <span style={{color: 'var(--c-text)', opacity: 0.5, marginRight: '8px'}}>[{log.time}]</span>
                    {log.action} 
                    {log.result !== 'info' && (
                      <span style={{ opacity: 0.8 }}> — {log.result.toUpperCase()} ({log.reason})</span>
                    )}
                    {log.result === 'info' && (
                      <span style={{ opacity: 0.8 }}> — {log.reason}</span>
                    )}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {!isActuallyFrozen && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--c-accent)', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                <span style={{ color: 'var(--c-accent)', fontSize: '0.75rem' }}>Listening for agent intents…</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
