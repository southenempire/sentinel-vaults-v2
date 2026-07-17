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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ParaProvider
          paraClientConfig={{
            apiKey: import.meta.env.VITE_PARA_API_KEY as string,
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
  </StrictMode>,
)
