"use client";
import { useEffect, useState } from "react";
import { Client, Databases, ID, Account } from "appwrite";
import Image from "next/image";

const client = new Client();
const databases = new Databases(client);
const account = new Account(client);

// Initialize Appwrite client with environment variables
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "67061d6800072580b1bb");

interface Campaign {
  $id: string;
  description: string;
  imageUrl: string;
  videoLink: string;
  endDate: string;
  status: boolean;
  fundGoal: number;
  fundRaised: number;
  user_id: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    description: "",
    imageUrl: "",
    videoLink: "",
    endDate: "",
    status: true,
    fundGoal: 0,
    fundRaised: 0,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaigns from Appwrite
  const fetchCampaigns = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6715ed850034211f02c1",
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || "671648ff00049491b3bf"
      );
      setCampaigns(response.documents);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError("Failed to load campaigns.");
    }
  };

  // Get current user and fetch campaigns
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id); // Set the logged-in user ID
        fetchCampaigns(); // Fetch campaigns after getting the user ID
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to get user.");
      }
    };
    getCurrentUser();
  }, []);

  const createCampaign = async () => {
    try {
      if (!userId) {
        alert('User is not logged in.');
        return;
      }
  
      // Validate URL inputs
      if (!newCampaign.imageUrl.startsWith('http://') && !newCampaign.imageUrl.startsWith('https://')) {
        alert('Please provide a valid image URL.');
        return;
      }
      if (!newCampaign.videoLink.startsWith('http://') && !newCampaign.videoLink.startsWith('https://')) {
        alert('Please provide a valid video URL.');
        return;
      }
  
      // Make sure the field names match exactly
      const campaignData = {
        description: newCampaign.description,  // string
        imageUrl: newCampaign.imageUrl,        // url
        videoLink: newCampaign.videoLink,      // url
        endDate: newCampaign.endDate,          // datetime
        status: newCampaign.status,            // boolean (make sure it's lowercase 'status')
        fundGoal: newCampaign.fundGoal,        // double
        fundRaised: newCampaign.fundRaised,    // double
        user_id: userId                        // string
      };
  
      // Create the new campaign document
      await databases.createDocument(
        '6715ed850034211f02c1',    // Replace with your actual database ID
        '671648ff00049491b3bf',  // Replace with your actual collection ID
        ID.unique(),           // Unique document ID
        campaignData           // The campaign data you're saving
      );
  
      fetchCampaigns(); // Refresh the campaigns list after creation
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };
  

  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div className="p-8">
      {error && <p className="text-red-500">{error}</p>}

      {/* Create Campaign Form */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Create a Campaign</h1>
        <input
          type="text"
          placeholder="Description"
          value={newCampaign.description}
          onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
          className="input-field"
        />
        <input
          type="datetime-local"
          placeholder="End Date"
          value={newCampaign.endDate}
          onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
          className="input-field"
        />
        <label className="inline-flex items-center mt-3">
          <input
            type="checkbox"
            checked={newCampaign.status}
            onChange={(e) => setNewCampaign({ ...newCampaign, status: e.target.checked })}
            className="form-checkbox"
          />
          <span className="ml-2">Active</span>
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="Fund Goal"
          value={newCampaign.fundGoal}
          onChange={(e) => setNewCampaign({ ...newCampaign, fundGoal: Number(e.target.value) })}
          className="input-field"
        />
        <button onClick={createCampaign} className="bg-purple-600 text-white p-2 rounded mt-4">
          Create Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.$id}
            className="p-4 border rounded shadow-lg cursor-pointer"
            onClick={() => handleCampaignClick(campaign)}
          >
            <h2 className="font-bold">{campaign.description}</h2>
            <p>Status: {campaign.status ? "Active" : "Inactive"}</p>
            <p>End Date: {new Date(campaign.endDate).toLocaleDateString()}</p>
            <p>Created by: {campaign.user_id}</p>
          </div>
        ))}
      </div>

      {/* Popup for Campaign Details */}
      {isPopupOpen && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <button onClick={closePopup} className="text-red-500 float-right">
              Close
            </button>
            <Image src={selectedCampaign.imageUrl} alt={selectedCampaign.description} width={200} height={200} />
            <h2 className="text-2xl font-bold">{selectedCampaign.description}</h2>
            <p>Status: {selectedCampaign.status ? "Active" : "Inactive"}</p>
            <p>
              Video Link:{" "}
              <a href={selectedCampaign.videoLink} target="_blank" className="text-blue-500">
                {selectedCampaign.videoLink}
              </a>
            </p>
            <p>End Date: {new Date(selectedCampaign.endDate).toLocaleDateString()}</p>
            <p>Fund Goal: ${selectedCampaign.fundGoal.toFixed(2)}</p>
            <p>Fund Raised: ${selectedCampaign.fundRaised.toFixed(2)}</p>
            <p>Created by: {selectedCampaign.user_id}</p>
          </div>
        </div>
      )}
    </div>
  );
}
