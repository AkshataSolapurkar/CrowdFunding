import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthProvider } from '@/context/AuthContext';

const WalletConnection: React.FC = () => {
  const { walletConnected, walletAddress } = useAuth();

  return (
    <nav>
      <AuthProvider>
      <p>My Navbar</p>
      {walletConnected ? (
        <p>Wallet Connected: {walletAddress}</p>
      ) : (
        <p>Wallet not connected</p>
      )}
      </AuthProvider>
      
    </nav>
  );
};

export default WalletConnection;
