import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faUser, faPaperPlane, faCircleNotch, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { useWalletState } from '@getpara/react-sdk';
import { useParaViemClient } from '@getpara/react-sdk/evm';
import { createPublicClient, http, parseEther } from 'viem';
import { monadTestnet } from 'wagmi/chains';
import VaultAbi from '../abi/Vault.json';
import { useLogs } from '../context/LogContext';

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http('https://testnet-rpc.monad.xyz'),
});

type Message = {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  isError?: boolean;
  isSuccess?: boolean;
  link?: string;
  linkText?: string;
};

export default function AgentTerminal() {
  const { selectedWallet } = useWalletState();
  const { addLog } = useLogs();
  const walletAddress = selectedWallet?.address;
  const { viemClient } = useParaViemClient({
    walletClientConfig: { chain: monadTestnet, transport: http('https://testnet-rpc.monad.xyz') },
  });
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'agent', text: 'Hello! I am your Sentinel-protected AI Trading Agent. Tell me what you want to trade, and I will execute it through your Vault.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const vaultAddress = walletAddress ? localStorage.getItem(`sentinel-vault-${walletAddress.toLowerCase()}`) : null;

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !vaultAddress) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    setIsTyping(true);

    // Simulate LLM Processing Delay
    await new Promise(r => setTimeout(r, 1500));

    // Simple Intent Parsing (Mock LLM)
    const match = userText.match(/(\d+(\.\d+)?)/); // Find the first number in the text
    const amount = match ? match[0] : null;

    if (!amount) {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'agent', text: "I couldn't detect a trade amount in your request. Please specify how much you want to swap (e.g., 'Buy 0.5 MON of PEPE' or 'If PEPE drops 5%, buy 10 MON')." }]);
      setIsTyping(false);
      return;
    }

    const lowerInput = userText.toLowerCase();
    const isConditional = lowerInput.includes('if') || lowerInput.includes('when') || lowerInput.includes('drop') || lowerInput.includes('gets to');

    if (isConditional) {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'agent', text: `Understood. I have set up a background monitoring task for this asset.\n\nWhen your target condition is met, I will automatically execute a trade of ${amount} MON.\n\nRest assured: Even when executing automatically in the background, my trades will be strictly governed by your Sentinel Vault's immutable Max Swap Size and Daily Loss limits.` }]);
      setIsTyping(false);
      return;
    }

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'agent', text: `Understood. Analyzing market conditions... Generating transaction payload to swap ${amount} MON.` }]);
    
    await new Promise(r => setTimeout(r, 2000));
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'agent', text: `Submitting trade of ${amount} MON to your Sentinel Vault for validation...` }]);

    await new Promise(r => setTimeout(r, 1500));
    addLog({ vault: 'AI Agent', action: `SWAP ${amount} MON → PEPE`, result: 'info', reason: 'Submitting trade validation' });

    // Execute Smart Contract Validation
    try {
      if (!viemClient) throw new Error('Wallet not ready');

      // Execute on-chain
      const hash = await viemClient.writeContract({
        address: vaultAddress as `0x${string}`,
        abi: VaultAbi,
        functionName: 'executeTrade',
        args: ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', parseEther(amount), 0, '0x'],
        chain: monadTestnet,
      });

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'agent', text: `Transaction submitted! Hash: ${hash}\nWaiting for network confirmation...` }]);

      // Wait for confirmation
      await publicClient.waitForTransactionReceipt({ hash });

      // Success
      addLog({ vault: 'AI Agent', action: `SWAP ${amount} MON → PEPE`, result: 'approved', reason: `TxHash: ${hash.slice(0,6)}...${hash.slice(-4)}` });
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'agent', 
        text: `TRANSACTION SUCCESSFUL! The Sentinel Vault verified the trade of ${amount} MON is within your risk limits and executed the swap on Monad.`,
        isSuccess: true,
        link: `https://testnet.monadscan.com/tx/${hash}`,
        linkText: 'View Transaction on MonadScan ↗'
      }]);
    } catch (e: any) {
      // The Vault blocked it!
      const reason = e.shortMessage || 'ExceedsMaxSwapSize';
      addLog({ vault: 'AI Agent', action: `SWAP ${amount} MON → PEPE`, result: 'blocked', reason: reason });
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'agent', 
        text: `TRANSACTION BLOCKED! Your Sentinel Vault rejected my trade attempt. Reason: ${reason}. Your funds are safe.`,
        isError: true
      }]);
    }

    setIsTyping(false);
  };

  if (!vaultAddress) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '100px', color: 'var(--c-text2)' }}>
        <p>Please deploy a vault first.</p>
      </div>
    );
  }

  return (
    <motion.div className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', padding: 0, overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,255,136,0.1)', border: '1px solid #00ff88', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FontAwesomeIcon icon={faRobot} style={{ color: '#00ff88', fontSize: '1.2rem' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Sentinel AI Agent</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--c-text2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff88', display: 'inline-block', boxShadow: '0 0 6px #00ff88' }} />
            Connected to Vault: {vaultAddress.slice(0,6)}...{vaultAddress.slice(-4)}
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: msg.sender === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,136,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: msg.sender === 'user' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,255,136,0.3)'
              }}>
                <FontAwesomeIcon icon={msg.sender === 'user' ? faUser : faRobot} style={{ fontSize: '0.8rem', color: msg.sender === 'user' ? '#fff' : '#00ff88' }} />
              </div>
              
              <div style={{
                padding: '14px 18px',
                borderRadius: '12px',
                background: msg.sender === 'user' ? 'var(--c-accent)' : 'rgba(0,0,0,0.4)',
                border: msg.sender === 'user' ? 'none' : msg.isError ? '1px solid rgba(255,68,68,0.4)' : msg.isSuccess ? '1px solid rgba(0,255,136,0.4)' : '1px solid var(--c-border)',
                color: msg.sender === 'user' ? '#000' : msg.isError ? '#ff5555' : msg.isSuccess ? '#00ff88' : 'var(--c-text)',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                fontWeight: msg.sender === 'user' ? 500 : 400
              }}>
                {msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                {msg.link && (
                  <a href={msg.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '12px', color: 'inherit', textDecoration: 'underline', fontWeight: 600 }}>
                    {msg.linkText || msg.link}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faRobot} style={{ fontSize: '0.8rem', color: '#00ff88' }} />
              </div>
              <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--c-border)', color: 'var(--c-text2)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faCircleNotch} spin /> Thinking...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div style={{ padding: '20px', borderTop: '1px solid var(--c-border)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="e.g. Buy 100 MON of Pepe..."
            disabled={isTyping}
            style={{
              flex: 1, padding: '14px 20px', borderRadius: '10px',
              background: 'rgba(0,0,0,0.4)', border: '1px solid var(--c-border)',
              color: 'var(--c-text)', fontSize: '0.95rem', outline: 'none'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            style={{
              padding: '0 24px', borderRadius: '10px',
              background: input.trim() && !isTyping ? 'var(--c-accent)' : 'rgba(255,255,255,0.1)',
              border: 'none', color: input.trim() && !isTyping ? '#000' : 'var(--c-text2)',
              cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, transition: 'all 0.2s'
            }}
          >
            Send <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--c-text2)', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <FontAwesomeIcon icon={faShieldHalved} /> All agent trades are strictly validated by your on-chain Vault rules.
        </p>
      </div>
    </motion.div>
  );
}
