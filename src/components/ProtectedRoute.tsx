import { useWalletState } from '@getpara/react-sdk';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { selectedWallet } = useWalletState();
  const isAuthenticated = !!selectedWallet?.address;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
