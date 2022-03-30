//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Dao is AccessControl {
    using SafeERC20 for IERC20;
    bytes32 public constant CHAIRMAN_ROLE = keccak256("CHAIRMAN_ROLE");
    address voteToken;
    uint256 minimumQuorum;
    uint256 debatingDuration; //minutes

    mapping(address => uint256) members;
    mapping(uint256 => Proposal) public proposals;

    struct Proposal {
        uint256 against;
        uint256 support;
        uint256 startTime;
        string description;
        uint256 memberCounter;
        address recipient;
        mapping(address => bool) shares;
    }

    constructor(
        address _voteToken,
        uint256 _minimumQuorum,
        uint256 _debatingDuration
    ) {
        voteToken = _voteToken;
        minimumQuorum = _minimumQuorum;
        debatingDuration = _debatingDuration * 60;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function deposit(uint256 _amount) external {
        IERC20(voteToken).safeTransferFrom(msg.sender, address(this), _amount);
        members[msg.sender] += _amount;
    }

    function addProposal(
        uint256 _id,
        string memory _description,
        address _recipient
    ) public onlyRole(CHAIRMAN_ROLE) {
        Proposal storage p = proposals[_id];
        p.against = 0;
        p.support = 0;
        p.startTime = block.timestamp;
        p.description = _description;
        p.memberCounter = 0;
        p.recipient = _recipient;
    }

    function vote(uint256 _id, bool _suffrage) public {
        require(members[msg.sender] > 0, "You have not suffrage");
        require(
            block.timestamp < proposals[_id].startTime + debatingDuration,
            "Voting time has expired"
        );
        if (_suffrage) {
            proposals[_id].support += members[msg.sender];
        } else {
            proposals[_id].against += members[msg.sender];
        }
        proposals[_id].memberCounter += 1;
    }

    function finishProposal(uint256 _id) public {}
}
