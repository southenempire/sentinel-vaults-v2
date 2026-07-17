import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faGear, faRocket, faSkull, faLock } from '@fortawesome/free-solid-svg-icons';
import Reveal from '../components/Reveal';
import HowItWorksBackground from '../components/HowItWorksBackground';

export default function HowItWorks() {
  return (
    <>
      <HowItWorksBackground />
      <section className="section" style={{ paddingTop: '10vh' }}>
        <div className="wrap">
          <Reveal>
            <div style={{ marginBottom: 'clamp(2rem, 5vw, 4rem)' }}>
              <p className="t-mono" style={{ color: 'var(--c-accent)', marginBottom: '12px' }}>Protocol</p>
              <h2 className="t-headline">Three transactions to secure autonomy.</h2>
            </div>
          </Reveal>

          <div className="steps-grid">
            <Reveal>
              <div className="step-card">
                <div className="step-num">Step 01 — Authenticate</div>
                <h3>Connect your wallet</h3>
                <p>
                  Sign in with your existing wallet or email. This address becomes the <strong>Operator</strong>—the only key that can pause or kill the vault. No one else, ever.
                </p>
                <div style={{ marginTop: '1.5rem' }}>
                  <FontAwesomeIcon icon={faWallet} style={{ fontSize: '1.5rem', color: 'var(--c-accent)', opacity: 0.5 }} />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="step-card">
                <div className="step-num">Step 02 — Configure</div>
                <h3>Set your risk parameters</h3>
                <p>
                  Define maximum trade size, daily loss cap, and token whitelist. These constraints are baked into the smart contract at deploy time—immutable.
                </p>
                <div style={{ marginTop: '1.5rem' }}>
                  <FontAwesomeIcon icon={faGear} style={{ fontSize: '1.5rem', color: 'var(--c-accent)', opacity: 0.5 }} />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="step-card">
                <div className="step-num">Step 03 — Deploy</div>
                <h3>Launch your agent vault</h3>
                <p>
                  The factory deploys your vault contract on Monad. Hand the address to your AI agent—it can only operate within the guardrails you defined.
                </p>
                <div style={{ marginTop: '1.5rem' }}>
                  <FontAwesomeIcon icon={faRocket} style={{ fontSize: '1.5rem', color: 'var(--c-accent)', opacity: 0.5 }} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Code Block Section */}
      <section className="section">
        <div className="wrap">
          <div className="bento" style={{ gridTemplateColumns: '1fr', gap: '32px' }}>
            <Reveal>
              <div className="panel bento-item" style={{ padding: '0', overflow: 'hidden' }}>
                <div className="code-block" style={{ height: '100%', borderRadius: '16px', border: 'none', padding: '32px' }}>
                  <div className="cm">{'// AgentVault.sol — Hardcoded Risk Layer'}</div>
                  <br />
                  <span className="kw">function</span>{' '}<span className="fn">executeSwap</span>{'(\n'}
                  {'    '}<span className="tp">address</span>{' tokenIn,\n'}
                  {'    '}<span className="tp">address</span>{' tokenOut,\n'}
                  {'    '}<span className="tp">uint256</span>{' amount\n'}
                  {')'} <span className="kw">external</span> <span className="kw">onlyAgent</span> {'{\n'}
                  {'    '}<span className="kw">require</span>{'(amount <= maxTradeSize, '}<span style={{ color: '#a78bfa' }}>"EXCEEDS_LIMIT"</span>{');\n'}
                  {'    '}<span className="kw">require</span>{'(whitelisted[tokenOut], '}<span style={{ color: '#a78bfa' }}>"TOKEN_NOT_ALLOWED"</span>{');\n'}
                  {'    '}<span className="kw">require</span>{'(dailyLoss + amount <= dailyMax, '}<span style={{ color: '#a78bfa' }}>"DAILY_CAP"</span>{');\n\n'}
                  {'    '}<span className="cm">{'// Execute swap through DEX router'}</span>{'\n'}
                  {'    '}router.swap(tokenIn, tokenOut, amount);{'\n'}
                  {'}'}
                </div>
              </div>
            </Reveal>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Reveal delay={0.1}>
                <div className="panel panel--marked bento-item">
                  <div>
                    <div className="bento-label">Kill Switch</div>
                    <div className="bento-number" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FontAwesomeIcon icon={faSkull} /> 1-TX
                    </div>
                  </div>
                  <p style={{ color: 'var(--c-text2)', fontSize: '0.85rem' }}>
                    Freeze all agent operations with a single transaction. Funds return to your wallet instantly.
                  </p>
                </div>
              </Reveal>
              
              <Reveal delay={0.2}>
                <div className="panel panel--marked bento-item" style={{ background: 'var(--c-accent-soft)', borderColor: 'color-mix(in srgb, var(--c-accent) 20%, transparent)' }}>
                  <div>
                    <div className="bento-label" style={{ color: 'var(--c-accent)' }}>Immutable</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 500, marginTop: '8px' }}>
                      Risk parameters are set at deployment and cannot be changed—not even by you.
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faLock} style={{ fontSize: '2rem', color: 'var(--c-accent)', opacity: 0.4 }} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
