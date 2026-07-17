import { useEffect } from 'react';
import { useModal, useWalletState } from '@getpara/react-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal';
import VaultVisualizer from '../components/ThreeBackground';

export default function Home() {
  const { openModal } = useModal();
  const { selectedWallet } = useWalletState();
  const navigate = useNavigate();

  return (
    <>
      <VaultVisualizer />
      <section className="hero">
        <div className="wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>


          <Reveal delay={0.1}>
            <h1 className="t-display text-gradient" style={{ maxWidth: '900px', margin: '0 auto 24px auto' }}>
              Your AI trades.<br />
              Your vault enforces the rules.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="t-body" style={{ fontSize: '1.25rem', margin: '0 auto 40px auto' }}>
              Sentinel Vaults are immutable smart contracts that wrap your autonomous trading agent in hardcoded risk limits, whitelisted tokens, and a kill switch only you control.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="hero-cta" style={{ justifyContent: 'center' }}>
              <motion.button className="btn btn-accent btn-glow" onClick={() => selectedWallet?.address ? navigate('/dashboard') : openModal()} style={{ padding: '16px 32px', fontSize: '1.1rem' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Launch App <FontAwesomeIcon icon={faArrowRight} />
              </motion.button>
              <Link to="/how-it-works" className="btn btn-ghost" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>How it works</motion.div>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div style={{
              display: 'flex',
              gap: '40px',
              justifyContent: 'center',
              marginTop: '56px',
              paddingTop: '32px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              color: 'var(--c-text2)',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--c-text)', marginBottom: '4px' }}>$2.4M+</div>
                <div style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }} className="t-mono">TVL PROTECTED</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.05)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--c-text)', marginBottom: '4px' }}>1,204</div>
                <div style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }} className="t-mono">ACTIVE VAULTS</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.05)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--c-text)', marginBottom: '4px' }}>0.05 MON</div>
                <div style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }} className="t-mono">PLATFORM FEE</div>
              </div>
            </div>
            <p style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--c-text2)', opacity: 0.8 }}>
              Transparent Pricing: Sentinel charges a flat 0.05 MON deployment fee. No hidden percentage cuts on your trades.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
