"use client"
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Client, Account, ID } from 'appwrite';
import { ethers } from 'ethers';
import { destroyCookie } from 'nookies';


// Initialize Appwrite client
const client = new Client();
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Create a new account instance
const account = new Account(client);

interface User {
    email: string;
    id?: string;
}

interface AuthContextType {
    user: User | null;
    walletAddress: string | null; // Add this to store the wallet address
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    connectWallet: () => Promise<void>;
    walletConnected: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to generate a valid user ID from email
const generateValidUserId = (email: string): string => {
    // Remove all special characters and limit to 36 characters
    return email
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters
        .slice(0, 36);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null); 
    const [walletLoading, setWalletLoading] = useState(false);// State for wallet address

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const userData = await account.get();
            setUser({ email: userData.email, id: userData.$id });
        } catch (error) {
            console.error('User not logged in', error);
            setUser(null);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            // First, try to delete any existing session
            try {
                await account.deleteSession('current');
            } catch (error) {
                // Ignore error if no session exists
                console.log('No existing session to delete');
            }
    
            // Now create a new session
            const session = await account.createEmailPasswordSession(email, password);
            
            // If successful, get the user data
            const userData = await account.get();
            document.cookie = `token=${session.$id}; path=/; secure; samesite=strict`;

            setUser({ email: userData.email, id: userData.$id });
            alert('login successful')
            console.log('Login successful');
        } catch (error: any) {
            console.error('Full login error:', error);
            
            let errorMessage = 'An unknown error occurred';
            if (error.code === 401) {
                errorMessage = 'Invalid email or password';
            } else if (error.code === 404) {
                errorMessage = 'User does not exist. Please sign up.';
            } else {
                errorMessage = error.message || 'Login failed';
            }
            
            alert(`Login failed: ${errorMessage}`);
            throw error;
        }
    };

    const signup = async (email: string, password: string) => {
        try {
            // Create the user account with email
            const newUser = await account.create(ID.unique(), email, password);
            console.log(newUser)
            
            // Try to delete any existing session before login
            try {
                await account.deleteSession('current');
            } catch (error) {
                // Ignore error if no session exists
            }
    
            // Automatically log in after successful signup
            await login(email, password);
            
            console.log('Signup successful:', newUser);
        } catch (error: any) {
            console.error('Full signup error:', error);
            alert(`Signup failed: ${error.message || 'An error occurred'}`);
            throw error;
        }
    };

    const connectWallet = async () => {
        if (typeof window === 'undefined' || !window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        // Prevent multiple requests
        if (walletLoading) {
            return; // Exit if already connecting
        }

        setWalletLoading(true); // Set loading state

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            // Check if already connected
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
                // If accounts exist, set the address and connected state
                setWalletAddress(accounts[0]);
                setWalletConnected(true);
                return;
            }

            // Request account access if no accounts are connected
            await provider.send("eth_requestAccounts", []);

            // Get the connected account address
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setWalletConnected(true);
            setWalletAddress(address);
        } catch (error: any) {
            console.error('Wallet connection error:', error);
            alert('Could not connect wallet: ' + error.message);
        } finally {
            setWalletLoading(false); // Reset loading state
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            setWalletConnected(false);
            setWalletAddress(null);
            destroyCookie(null, 'token'); // Clears the 'token' cookie
            
            console.log('User logged out');
        } catch (error: any) {
            console.error('Logout error', error);
            alert('Logout failed: ' + error.message);
        }
    };



    const contextValue: AuthContextType = {
        user,
        walletAddress,
        login,
        signup,
        connectWallet,
        walletConnected,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};