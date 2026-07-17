import { useModal, useWalletState, useLogout } from '@getpara/react-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faSun, faMoon, faTableColumns, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const { selectedWallet } = useWalletState();
  const { logout } = useLogout();
  const { openModal } = useModal();
  const isConnected = !!selectedWallet?.address;
  
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = () => {
    openModal();
  };

  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,255,136,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(0,255,136,0.2)', overflow: 'hidden' }}>
              <img src="/sentinel-logo.jpg" alt="Sentinel Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600, letterSpacing: '0.15em' }}>SENTINEL</span>
          </Link>

          <nav className="header-nav">
            <Link to="/features">Features</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/docs">Docs</Link>
          </nav>

          <div className="header-actions">
            <motion.button
              className="btn-icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
            </motion.button>

            {isConnected ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <motion.button className="btn btn-fill" onClick={() => navigate('/dashboard')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <FontAwesomeIcon icon={faTableColumns} /> Dashboard
                </motion.button>
                <motion.button className="btn btn-ghost" onClick={() => logout()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Disconnect</motion.button>
              </div>
            ) : (
              <motion.button className="btn btn-fill" onClick={handleLogin} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FontAwesomeIcon icon={faWallet} /> Connect
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <main style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative', zIndex: 10 }}>
        <Outlet />
      </main>
    </>
  );
}
