import React from 'react';
import { useAuth } from '@/context/AuthContext';

const WalletConnection: React.FC = () => {
  const { walletConnected, walletAddress } = useAuth();

  return (
    <nav>
      <p>My Navbar</p>
      {walletConnected ? (
        <p>Wallet Connected: {walletAddress}</p>
      ) : (
        <p>Wallet not connected</p>
      )}
    </nav>
  );
};

export default WalletConnection;
