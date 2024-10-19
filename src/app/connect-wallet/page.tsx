// src/app/connect-wallet/page.tsx

"use client"
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const ConnectWallet = () => {
    const { connectWallet, walletConnected } = useAuth();
    const router = useRouter();

    const handleConnect = async () => {
        console.log("clicked")
        await connectWallet();
        if (walletConnected) {
            router.push('/'); // Redirect to the dashboard/main page
        }
    };

    return (
        <div>
            <h1>Connect Your Wallet</h1>
            <button onClick={handleConnect}>Connect MetaMask</button>
        </div>
    );
};

export default ConnectWallet;
