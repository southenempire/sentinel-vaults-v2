import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Environment, ParaProvider } from '@getpara/react-sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'wagmi'
import { monad, monadTestnet } from 'wagmi/chains'
import { ThemeProvider } from './context/ThemeContext'
import '@getpara/react-sdk/styles.css'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()

const PARA_KEY = import.meta.env.VITE_PARA_API_KEY || 'MISSING_KEY'

function Root() {
  if (PARA_KEY === 'MISSING_KEY') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0f', color: '#ff4444', fontFamily: 'Inter, sans-serif', padding: '2rem',
        textAlign: 'center', flexDirection: 'column', gap: '1rem'
      }}>
        <h1 style={{ fontSize: '1.5rem' }}>Configuration Error</h1>
        <p style={{ color: '#888', maxWidth: '500px' }}>
          VITE_PARA_API_KEY environment variable is not set. 
          Please add it to your hosting provider's environment variables and redeploy.
        </p>
      </div>
    )
  }

  return (
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ParaProvider
            paraClientConfig={{
              apiKey: PARA_KEY,
              env: Environment.BETA,
            }}
            config={{ appName: 'Sentinel Vaults' }}
            externalWalletConfig={{
              evmConnector: {
                config: {
                  chains: [monadTestnet, monad],
                  transports: {
                    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
                    [monad.id]: http('https://rpc.monad.xyz'),
                  },
                },
              }
            }}
          >
            <App />
          </ParaProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
