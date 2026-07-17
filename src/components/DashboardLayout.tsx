import { Link, Outlet, useLocation } from 'react-router-dom';
import { useWalletState, useLogout, useModal } from '@getpara/react-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faRightFromBracket, faArrowLeft, faCopy, faCheck, faChartLine, faTerminal, faRobot } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { createPublicClient, http, formatEther } from 'viem';
import { monadTestnet } from 'wagmi/chains';
import { motion } from 'framer-motion';

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz'),
});

export default function DashboardLayout() {
  const { selectedWallet } = useWalletState();
  const { logout } = useLogout();
  const { openModal } = useModal();
  const location = useLocation();
  const address = selectedWallet?.address;

  const [balance, setBalance] = useState<string>('...');
  const [copied, setCopied] = useState(false);

  const displayName = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : 'Connected';

  useEffect(() => {
    if (!address) return;
    const fetch = async () => {
      try {
        const bal = await publicClient.getBalance({ address: address as `0x${string}` });
        setBalance(Number(formatEther(bal)).toFixed(4));
      } catch { setBalance('0.00'); }
    };
    fetch();
    const iv = setInterval(fetch, 10000);
    return () => clearInterval(iv);
  }, [address]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: faChartLine },
    { name: 'Risk Rules', path: '/dashboard/rules', icon: faShieldHalved },
    { name: 'Execution Logs', path: '/dashboard/logs', icon: faTerminal },
    { name: 'AI Terminal', path: '/dashboard/agent', icon: faRobot },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--c-bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        borderRight: '1px solid var(--c-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        background: 'rgba(10, 10, 10, 0.4)',
        backdropFilter: 'blur(12px)',
        flexShrink: 0,
      }}>
        {/* Top: Logo */}
        <div style={{ padding: '0 12px', marginBottom: '32px' }}>
          <button
            onClick={() => { window.location.href = '/'; }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 0', marginBottom: '20px',
              color: 'var(--c-text2)', fontSize: '0.8rem',
              background: 'none', border: 'none', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-text2)')}
          >
            <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '0.75rem' }} />
            Back to home
          </button>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,255,136,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(0,255,136,0.2)', overflow: 'hidden' }}>
              <img src="/sentinel-logo.jpg" alt="Sentinel Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600, letterSpacing: '0.15em' }}>SENTINEL</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 4px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} style={{ position: 'relative', textDecoration: 'none' }}>
                <motion.div 
                  whileHover={{ x: 4 }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: isActive ? 'var(--c-text)' : 'var(--c-text2)',
                    background: isActive ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} style={{ width: '16px', color: isActive ? 'var(--c-accent)' : 'inherit' }} />
                  {item.name}
                </motion.div>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '10%',
                      bottom: '10%',
                      width: '2px',
                      background: 'var(--c-accent)',
                      borderRadius: '4px'
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Middle: Wallet Card */}
        <div style={{
          margin: '24px 4px 16px 4px',
          padding: '20px 16px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--c-border)',
        }}>
          <p style={{ fontSize: '0.65rem', color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Your Wallet</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <p className="t-mono" style={{ fontSize: '0.82rem', color: 'var(--c-text)', flex: 1 }}>{displayName}</p>
            <button 
              onClick={copyAddress}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#00ff88' : 'var(--c-text2)', padding: '4px', fontSize: '0.75rem' }}
            >
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="t-mono" style={{ fontSize: '1.3rem', fontWeight: 600, color: '#00ff88' }}>{balance}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--c-text2)' }}>MON</span>
          </div>
        </div>

        {/* Bottom: Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={openModal}
            style={{
              width: '100%', padding: '10px 16px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '10px',
              color: 'var(--c-text2)', background: 'transparent', border: 'none',
              cursor: 'pointer', fontSize: '0.85rem', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-text2)')}
          >
            <FontAwesomeIcon icon={faShieldHalved} style={{ width: '16px' }} />
            Wallet Details
          </button>
          <button
            onClick={() => logout()}
            style={{
              width: '100%', padding: '10px 16px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '10px',
              color: 'var(--c-text2)', background: 'transparent', border: 'none',
              cursor: 'pointer', fontSize: '0.85rem', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ff4444')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-text2)')}
          >
            <FontAwesomeIcon icon={faRightFromBracket} style={{ width: '16px' }} />
            Disconnect
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
