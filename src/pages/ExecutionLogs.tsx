import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTriangleExclamation, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { useLogs } from '../context/LogContext';

export default function ExecutionLogs() {
  const { logs } = useLogs();
  const displayLogs = logs.filter(l => l.result !== 'info');
  const approved = displayLogs.filter(l => l.result === 'approved').length;
  const blocked = displayLogs.filter(l => l.result === 'blocked').length;
  const blockRate = displayLogs.length > 0 ? `${Math.round((blocked / displayLogs.length) * 100)}%` : '0%';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 className="t-headline" style={{ fontSize: '2rem', marginBottom: '4px' }}>Execution Logs</h1>
        <p style={{ color: 'var(--c-text2)', fontSize: '0.9rem' }}>Every trade intent your agent submitted — approved or blocked by the vault.</p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Intents', value: displayLogs.length, color: 'var(--c-text)' },
          { label: 'Approved', value: approved, color: '#00ff88' },
          { label: 'Blocked', value: blocked, color: '#ff4444' },
          { label: 'Block Rate', value: blockRate, color: 'var(--c-accent)' },
        ].map((s, i) => (
          <motion.div key={i} className="panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ flex: '1 1 140px', padding: '16px 20px' }}>
            <p className="t-mono" style={{ fontSize: '0.65rem', color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{s.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Log table */}
      <motion.div className="panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 100px 1fr 100px 1fr', gap: '0', padding: '10px 20px', borderBottom: '1px solid var(--c-border)', background: 'rgba(0,0,0,0.2)' }}>
          {['Time', 'Vault', 'Action', 'Result', 'Reason'].map(h => (
            <p key={h} className="t-mono" style={{ fontSize: '0.65rem', color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</p>
          ))}
        </div>

        {displayLogs.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--c-text2)' }}>
            No trades executed yet in this session.
          </div>
        )}
        {displayLogs.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.04 }}
            style={{
              display: 'grid', gridTemplateColumns: '90px 100px 1fr 100px 1fr', gap: '0',
              padding: '12px 20px', borderBottom: '1px solid var(--c-border)',
              alignItems: 'center',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
            }}
          >
            <span className="t-mono" style={{ fontSize: '0.78rem', color: 'var(--c-text2)' }}>{log.time}</span>
            <span className="t-mono" style={{ fontSize: '0.78rem', color: 'var(--c-text2)' }}>{log.vault.replace('Vault ', '')}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ fontSize: '0.65rem', color: 'var(--c-text2)' }} />
              <span className="t-mono" style={{ fontSize: '0.78rem', color: 'var(--c-text)' }}>{log.action}</span>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FontAwesomeIcon
                icon={log.result === 'approved' ? faCircleCheck : faTriangleExclamation}
                style={{ color: log.result === 'approved' ? '#00ff88' : '#ff4444', fontSize: '0.75rem' }}
              />
              <span className="t-mono" style={{ fontSize: '0.75rem', color: log.result === 'approved' ? '#00ff88' : '#ff4444', fontWeight: 600, textTransform: 'uppercase' }}>
                {log.result}
              </span>
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--c-text2)' }}>{log.reason}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
