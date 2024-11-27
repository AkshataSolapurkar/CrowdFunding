'use client'

import { useEffect, useState } from "react"
import { Client, Databases, ID, Account } from "appwrite"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { title } from "process"
import { ethers } from 'ethers';

const erc20ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) public returns (bool)",
];
const crowdfundingABI = [
  "function createCampaign(string memory _title, string memory _description, uint256 _goalAmount, uint256 _endDate)",
  "function donateTokens(uint256 _campaignId, uint256 _amount)",
  "function getCampaignDetails(uint256 _campaignId) public view returns (string memory, uint256, uint256, uint256, address[] memory)",
  "event CampaignCreated(uint256 campaignId, address creator, uint256 goalAmount)",
  "event TokenDonationReceived(uint256 campaignId, address donor, uint256 amount)"
];


const client = new Client()
const databases = new Databases(client)
const account = new Account(client)

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "67061d6800072580b1bb")

interface Campaign {
  $id: string
  title:string
  description: string
  imageUrl: string
  videoLink: string
  endDate: string
  status: boolean
  fundGoal: number
  fundRaised: number
  user_id: string
  donations:[]
}

export default function CampaignsPage() {
  const dummycampaigns = [
    {
      $id: "1",
      title: "Save the Oceans",
      description: "Help us clean the ocean and protect marine life.",
      status: true,
      endDate: "2024-12-31",
      user_id: "User123",
      fundRaised: 0.1,
      fundGoal: 1,
      donations: [
        { walletAddress: '0x1234...abcd', amount: 0.1, currency: 'MATIC' },
      ],
    },
  ]

  const [donationAmount, setDonationAmount] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isPopupOpen, setPopupOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    imageUrl: "",
    videoLink: "",
    endDate: "",
    status: true,
    fundGoal: 0,
    fundRaised: 0,
  })
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaigns = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6715ed850034211f02c1",
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || "671648ff00049491b3bf"
      )
      setCampaigns(response.documents)
    } catch (err) {
      console.error("Error fetching campaigns:", err)
      setError("Failed to load campaigns.")
    }
  }

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await account.get()
        setUserId(user.$id)
        fetchCampaigns()
      } catch (error) {
        console.error("Error fetching user:", error)
        setError("Failed to get user.")
      }
    }
    getCurrentUser()
  }, [])

  const createCampaign = async () => {
    try {
      if (!userId) {
        alert('User is not logged in.')
        return
      }
  
  
      const campaignData = {
        title: newCampaign.title,
        description: newCampaign.description,
        endDate: newCampaign.endDate,
        status: newCampaign.status,
        fundGoal: newCampaign.fundGoal,
        fundRaised: newCampaign.fundRaised,
        user_id: userId
      }
  
      await databases.createDocument(
        '6715ed850034211f02c1',
        '671648ff00049491b3bf',
        ID.unique(),
        campaignData
      )
  
      fetchCampaigns()
      setNewCampaign({
        title:"",
        description: "",
        imageUrl: "",
        videoLink: "",
        endDate: "",
        status: true,
        fundGoal: 0,
        fundRaised: 0,
      })
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setPopupOpen(true)
  }

  const closePopup = () => {
    setPopupOpen(false)
  }

  async function fundCampaign(campaignId, amount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const crowdfundingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
    const crowdfundingContract = new ethers.Contract(crowdfundingAddress, crowdfundingABI, signer);

    const tokenAddress = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844"; // Replace with your token address
    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);

    try {
        // Approve the token transfer
        const approveTx = await tokenContract.approve(crowdfundingAddress, ethers.utils.parseUnits(amount, 18));
        await approveTx.wait();

        // Fund the campaign
        const fundTx = await crowdfundingContract.donateTokens(campaignId, ethers.utils.parseUnits(amount, 18));
        await fundTx.wait();

        console.log("Successfully funded the campaign!");
        // Optionally, you can show a success message or close the popup
    } catch (error) {
        console.error("Error funding campaign:", error);
    }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 mb-4 text-center font-bold"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-12"
        >
          <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Create a Campaign
          </h1>
          <div className="space-y-6">
          <input
              type="text"
              placeholder="Title"
              value={newCampaign.title}
              onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
            <input
              type="text"
              placeholder="Description"
              value={newCampaign.description}
              onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
            <input
              type="datetime-local"
              placeholder="End Date"
              value={newCampaign.endDate}
              onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={newCampaign.status}
                onChange={(e) => setNewCampaign({ ...newCampaign, status: e.target.checked })}
                className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500 transition duration-200"
              />
              <span className="text-gray-700 font-medium">Active</span>
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Fund Goal"
              value={newCampaign.fundGoal}
              onChange={(e) => setNewCampaign({ ...newCampaign, fundGoal: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createCampaign}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-600 transition duration-300 shadow-lg hover:shadow-xl"
            >
              Create Campaign
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <motion.div
              key={campaign.$id}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition duration-300 border border-gray-200 border-opacity-50"
              onClick={() => handleCampaignClick(campaign)}
              whileHover={{ scale: 1.03, rotateY: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{campaign.title}</h2>
              <p className="text-2xl font-bold text-gray-800 mb-3">{campaign.description}</p>
              <p className={`text-sm ${campaign.status ? "text-green-500" : "text-red-500"} font-medium mb-2`}>
                {campaign.status ? "Active" : "Inactive"}
              </p>
              <p className="text-gray-600 mb-2">Ends: {new Date(campaign.endDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Created by: {campaign.user_id}</p>
              <p className="text-gray-600">Created by: {campaign.$id}</p>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  style={{ width: `${(campaign.fundRaised / campaign.fundGoal) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                ${campaign.fundRaised.toFixed(2)} / ${campaign.fundGoal.toFixed(2)} raised
              </p>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {dummycampaigns.map((campaign) => (
        <motion.div
          key={campaign.$id}
          className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition duration-300 border border-gray-200 border-opacity-50"
          onClick={() => handleCampaignClick(campaign)}
          whileHover={{ scale: 1.03, rotateY: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{campaign.title}</h2>
          <p className="text-2xl font-bold text-gray-800 mb-3">{campaign.description}</p>
          <p className={`text-sm ${campaign.status ? "text-green-500" : "text-red-500"} font-medium mb-2`}>
            {campaign.status ? 'Active' : 'Inactive'}
          </p>
          <p className="text-gray-600 mb-2">Ends: {new Date(campaign.endDate).toLocaleDateString()}</p>
          <p className="text-gray-600">Created by: {campaign.user_id}</p>
          <p className="text-gray-600">Campaign ID: {campaign.$id}</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              style={{ width: `${(campaign.fundRaised / campaign.fundGoal) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            ${campaign.fundRaised.toFixed(2)} / ${campaign.fundGoal.toFixed(2)} raised
          </p>
        </motion.div>
      ))}
       </div>
        
      </div>

      <AnimatePresence>
  {isPopupOpen && selectedCampaign && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotateX: 15 }}
        className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-2xl"
      >
        <button onClick={closePopup} className="float-right text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedCampaign.description}</h2>
        <p className={`text-sm ${selectedCampaign.status ? "text-green-500" : "text-red-500"} font-medium mb-3`}>
          {selectedCampaign.status ? "Active" : "Inactive"}
        </p>
        <p className="text-gray-700 mb-3">
          <span className="font-medium">End Date:</span> {new Date(selectedCampaign.endDate).toLocaleDateString()}
        </p>
        <p className="text-gray-700 mb-3">
          <span className="font-medium">Fund Goal:</span> {selectedCampaign.fundGoal.toFixed(2)}
        </p>
        <p className="text-gray-700 mb-3">
          <span className="font-medium">Fund Raised:</span> {selectedCampaign.fundRaised.toFixed(2)}
        </p>
        <p className="text-gray-700 mb-4">
          <span className="font-medium">Created by:</span> {selectedCampaign.user_id}
        </p>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            style={{ width: `{(selectedCampaign.fundRaised / selectedCampaign.fundGoal) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          {((selectedCampaign.fundRaised / selectedCampaign.fundGoal) * 100).toFixed(2)}% funded
        </p>

        {/* Fund this Campaign Section */}
        <div className="mt-6">
          <label className="block mb-2 text-gray-700">Donation Amount:</label>
          <input 
            type="number"
            placeholder="Enter amount"
            value={donationAmount} // Assume you have this state
            onChange={(e) => setDonationAmount(e.target.value)} // Update the state on change
            className="w-full p-2 border border-gray-300 rounded"
          />
          <label className="flex items-center mb-4 mt-4">
            <input type="checkbox" className="mr-2" />
            <span className="text-gray-700">I believe in this campaign</span>
          </label>
          <button 
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition duration-300"
            onClick={() => fundCampaign(selectedCampaign.$id, donationAmount)}
          >
            Fund this Campaign
          </button>
        </div>

        {/* Donations Table */}
        {selectedCampaign.donations && selectedCampaign.donations.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Donations</h3>
            <div className="overflow-x-auto">
              {/* Scrollable Container */}
              <div className="max-h-48 overflow-y-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wallet Address
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount Donated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCampaign.donations.map((donation, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {donation.walletAddress}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donation.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


    </div>
  )
}