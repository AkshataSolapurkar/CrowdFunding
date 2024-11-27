// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Crowdfunding {
    IERC20 public token;
    struct Campaign {
        address creator;
        string title;
        string description;
        uint256 goalAmount;
        uint256 fundsRaised;
        uint256 endDate;
        address[] donors;
        mapping(address => uint256) donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCounter;

    event CampaignCreated(uint256 campaignId, address creator, uint256 goalAmount);
    event TokenDonationReceived(uint256 campaignId, address donor, uint256 amount);

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress); // Initialize with the deployed token address
    }

    function createCampaign(string memory _title, string memory _description, uint256 _goalAmount, uint256 _endDate) public {
        campaignCounter++;
        Campaign storage newCampaign = campaigns[campaignCounter];
        newCampaign.creator = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.goalAmount = _goalAmount;
        newCampaign.endDate = _endDate;

        emit CampaignCreated(campaignCounter, msg.sender, _goalAmount);
    }

    function donateTokens(uint256 _campaignId, uint256 _amount) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.endDate, "Campaign has ended");

        token.transferFrom(msg.sender, campaign.creator, _amount);
        campaign.fundsRaised += _amount;
        campaign.donations[msg.sender] += _amount;
        campaign.donors.push(msg.sender);

        emit TokenDonationReceived(_campaignId, msg.sender, _amount);
    }

    function getCampaignDetails(uint256 _campaignId) public view returns (string memory, uint256, uint256, uint256, address[] memory) {
        Campaign storage campaign = campaigns[_campaignId];
        return (campaign.title, campaign.goalAmount, campaign.fundsRaised, campaign.endDate, campaign.donors);
    }
}
