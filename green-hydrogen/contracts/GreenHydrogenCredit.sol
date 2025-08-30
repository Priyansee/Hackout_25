// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GreenHydrogenCredits {
    uint public creditCount = 0;

    struct Credit {
        uint id;
        address owner;
        bool retired;
    }

    mapping(uint => Credit) public credits;

    event CreditIssued(uint id, address owner);
    event CreditTransferred(uint id, address from, address to);
    event CreditRetired(uint id, address retiredBy);

    function issueCredits(address _owner, uint _amount) public {
    for (uint i = 0; i < _amount; i++) {
        creditCount++;
        credits[creditCount] = Credit(creditCount, _owner, false);
        emit CreditIssued(creditCount, _owner);
    }
}

    function transferCredit(uint _id, address _to) public {
        require(credits[_id].owner == msg.sender, "Not owner");
        require(!credits[_id].retired, "Already retired");
        address prevOwner = credits[_id].owner;
        credits[_id].owner = _to;
        emit CreditTransferred(_id, prevOwner, _to);
    }

    function retireCredit(uint _id) public {
        require(credits[_id].owner == msg.sender, "Not owner");
        require(!credits[_id].retired, "Already retired");
        credits[_id].retired = true;
        emit CreditRetired(_id, msg.sender);
    }
}