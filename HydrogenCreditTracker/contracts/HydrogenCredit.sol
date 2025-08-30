// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract HydrogenCredit is ERC20, AccessControl, Pausable {
    bytes32 public constant CERTIFIER_ROLE = keccak256("CERTIFIER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    struct CreditBatch {
        uint256 id;
        string productionFacility;
        uint256 hydrogenAmount; // in kg
        uint256 timestamp;
        string verificationHash;
        bool isRetired;
        address certifier;
    }

    mapping(uint256 => CreditBatch) public creditBatches;
    mapping(address => uint256[]) public userCredits;
    uint256 public nextBatchId;
    uint256 public totalHydrogenProduced;

    event CreditIssued(
        uint256 indexed batchId,
        address indexed recipient,
        uint256 amount,
        string facility,
        uint256 hydrogenAmount
    );

    event CreditRetired(
        uint256 indexed batchId,
        address indexed retiree,
        uint256 amount
    );

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // Grant roles using _grantRole (v5.x compatible)
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(CERTIFIER_ROLE, _msgSender());
        _grantRole(PAUSER_ROLE, _msgSender());
        
        nextBatchId = 1;
    }

    function issueCredits(
        address to,
        uint256 amount,
        string memory productionFacility,
        uint256 hydrogenAmount,
        string memory verificationHash
    ) public onlyRole(CERTIFIER_ROLE) whenNotPaused {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        require(hydrogenAmount > 0, "Hydrogen amount must be greater than 0");

        uint256 batchId = nextBatchId++;
        
        creditBatches[batchId] = CreditBatch({
            id: batchId,
            productionFacility: productionFacility,
            hydrogenAmount: hydrogenAmount,
            timestamp: block.timestamp,
            verificationHash: verificationHash,
            isRetired: false,
            certifier: _msgSender()
        });

        userCredits[to].push(batchId);
        totalHydrogenProduced += hydrogenAmount;

        _mint(to, amount);

        emit CreditIssued(batchId, to, amount, productionFacility, hydrogenAmount);
    }

    function retireCredits(uint256 batchId, uint256 amount) public whenNotPaused {
        require(creditBatches[batchId].id != 0, "Batch does not exist");
        require(!creditBatches[batchId].isRetired, "Credits already retired");
        require(balanceOf(_msgSender()) >= amount, "Insufficient balance");

        creditBatches[batchId].isRetired = true;
        _burn(_msgSender(), amount);

        emit CreditRetired(batchId, _msgSender(), amount);
    }

    function getCreditBatch(uint256 batchId) public view returns (CreditBatch memory) {
        require(creditBatches[batchId].id != 0, "Batch does not exist");
        return creditBatches[batchId];
    }

    function getUserCredits(address user) public view returns (uint256[] memory) {
        return userCredits[user];
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // Required override for AccessControl
    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}