import React from "react";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full">
        {/* Heading Section */}
        <h1 className="text-4xl font-bold text-center text-purple-700 mb-6">
          About Us
        </h1>

        {/* Introduction Section */}
        <div className="bg-white shadow-md rounded-lg p-8">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Our platform is a **decentralized crowdfunding solution** built for a single entity like an NGO. It empowers organizations to create and manage multiple fundraising campaigns while enabling users to contribute securely and transparently.  
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The platform operates as a single-entity system. This means only one organization, such as an NGO, can manage the platform and create multiple campaigns for their various initiatives. However, multiple stakeholders, such as donors, volunteers, and campaign managers, can participate and interact with these campaigns.
          </p>

          {/* List of Stakeholders */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Stakeholders
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-4 mb-6">
            <li>
              <span className="font-semibold">NGO (Platform Admin):</span> The primary entity that creates and manages campaigns, sets fundraising goals, and monitors donations.
            </li>
            <li>
              <span className="font-semibold">Donors:</span> Users who contribute funds to the campaigns securely using blockchain-powered transactions.
            </li>
            <li>
              <span className="font-semibold">Campaign Managers:</span> Individuals within the NGO who handle campaign-specific details and provide updates to donors.
            </li>
            <li>
              <span className="font-semibold">Beneficiaries:</span> Individuals or groups who benefit directly from the funds raised through the campaigns.
            </li>
          </ul>

          {/* How It Works for Other Institutions */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            For Other Institutions
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            While this platform is currently tailored for a single entity, such as an NGO, it can be adapted for other institutions like educational organizations, hospitals, or social groups by updating the smart contract.  
            Each institution can:  
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-4 mb-6">
            <li>Create customized campaigns for their unique goals.</li>
            <li>Manage multiple stakeholders within their organization.</li>
            <li>Leverage blockchain technology to ensure transparency and secure transactions.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Why Blockchain?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Blockchain ensures that every donation is secure, traceable, and tamper-proof. Donors can see how their contributions are being used, fostering trust and transparency between the organization and its supporters.
          </p>
        </div>

        {/* Footer Section */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Have questions or need assistance? Reach out to us at{" "}
            <a href="mailto:support@crowdfundingplatform.com" className="text-purple-700 underline">
              support@crowdfundingplatform.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
