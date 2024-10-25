"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Navbar: React.FC = () => {
    const { user, walletConnected, walletAddress, connectWallet, logout } = useAuth();
    const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
    const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);

    const toggleEmailPopup = () => {
        setIsEmailPopupOpen(prev => !prev);
    };

    const toggleWalletPopup = () => {
        setIsWalletPopupOpen(prev => !prev);
    };

    const closePopup = () => {
        setIsEmailPopupOpen(false);
        setIsWalletPopupOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg py-3 transition duration-300 ease-in-out">
            <div className="container mx-auto flex justify-between items-center px-4">
                {/* Logo */}
                <Link href="/">
                    <h1 className="text-2xl font-bold text-white cursor-pointer transform transition-transform duration-300 hover:scale-105">CrowdfundMe</h1>
                </Link>

                {/* Links */}
                <div className="flex space-x-6">
                    <Link href="/dashboard">
                        <p className="font-semibold text-[18px] text-white p-[5px] rounded-[5px] transition-colors duration-300 transform hover:scale-105">Dashboard</p>
                    </Link>
                    <Link href="/about">
                        <p className=" font-semibold text-[18px] text-white p-[5px] rounded-[5px] transition-colors duration-300 transform hover:scale-105">About</p>
                    </Link>
                </div>

                {/* User and Wallet Info */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center">
                            {/* Email badge */}
                            <div
                                className="w-12 h-12 bg-white p-2 text-gray-700  text-[16px] font-semibold flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300 hover:scale-110"
                                onClick={toggleEmailPopup}
                            >
                                {user.email.charAt(0).toUpperCase()}
                            </div>
                            {/* Email Popup */}
                            {isEmailPopupOpen && (
                                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                                    <div className="bg-white rounded-md p-4 relative transition-transform duration-300 transform hover:scale-105">
                                        <button 
                                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                            onClick={closePopup}
                                        >
                                            &times; {/* Close button */}
                                        </button>
                                        <p className="text-gray-800">Email: {user.email}</p>
                                        <button
                                            onClick={logout}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition-colors duration-300 focus:outline-none mt-4"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login">
                            <p className="text-white hover:text-gray-200 transition-colors duration-300 transform hover:scale-105">Login</p>
                        </Link>
                    )}

                    {/* Wallet Connection */}
                    {walletConnected ? (
                        <div className="flex items-center">
                            {/* Wallet badge */}
                            <div
                                className="bg-white p-2 text-gray-700 text-[16px] font-semibold flex items-center justify-center rounded-[5px] cursor-pointer transition-transform duration-300 hover:scale-110"
                                onClick={toggleWalletPopup}
                            >
                                {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)} {/* Displaying the first 6 and last 4 characters */}
                            </div>
                            {/* Wallet Popup */}
                            {isWalletPopupOpen && (
                                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                                    <div className="bg-white rounded-md p-4 relative transition-transform duration-300 transform hover:scale-105">
                                        <button 
                                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                            onClick={closePopup}
                                        >
                                            &times; {/* Close button */}
                                        </button>
                                        <p className="text-gray-800">Wallet: {walletAddress}</p>
                                        <button
                                            onClick={logout}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition-colors duration-300 focus:outline-none mt-4"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors duration-300 transform hover:scale-105"
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
