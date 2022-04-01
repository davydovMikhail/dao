//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

contract Dao is AccessControl {
    using SafeERC20 for IERC20;
    bytes32 public constant CHAIRMAN_ROLE = keccak256("CHAIRMAN_ROLE");
    address voteToken;
    uint256 minimumQuorum;
    uint256 debatingDuration;

    mapping(address => uint256) public members;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) lastVotes;

    struct Proposal {
        uint256 against;
        uint256 support;
        uint256 startTime;
        string description;
        address recipient;
        bytes data;
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
        address _recipient,
        bytes memory _data
    ) public onlyRole(CHAIRMAN_ROLE) {
        Proposal storage p = proposals[_id];
        p.against = 0;
        p.support = 0;
        p.startTime = block.timestamp;
        p.description = _description;
        p.recipient = _recipient;
        p.data = _data;
    }

    function vote(uint256 _id, bool _suffrage) public {
        require(members[msg.sender] > 0, "You have not suffrage");
        require(
            block.timestamp < proposals[_id].startTime + debatingDuration,
            "Voting time has expired"
        );
        require(!proposals[_id].shares[msg.sender], "You already voted");
        if (_suffrage) {
            proposals[_id].support += members[msg.sender];
        } else {
            proposals[_id].against += members[msg.sender];
        }
        lastVotes[msg.sender] = block.timestamp;
        proposals[_id].shares[msg.sender] = true;
    }

    function finishProposal(uint256 _id) public {
        require(
            proposals[_id].recipient != address(0),
            "Voting completed successfully before you"
        );
        require(
            block.timestamp > proposals[_id].startTime + debatingDuration,
            "Voting is not over yet"
        );
        require(
            proposals[_id].against + proposals[_id].support >= minimumQuorum,
            "The number of tokens is less than the minimum quorum"
        );
        require(
            (proposals[_id].support * 100) /
                (proposals[_id].against + proposals[_id].support) >=
                51,
            "Vote scored less than 51%"
        );
        (bool success, ) = proposals[_id].recipient.call{value: 0}(
            proposals[_id].data
        );
        require(success, "ERROR call func");
        proposals[_id].recipient = address(0);
    }

    function withdraw() public {
        require(
            members[msg.sender] > 0,
            "You have not tokens on this contract"
        );
        require(
            block.timestamp > lastVotes[msg.sender] + debatingDuration,
            "The last vote in which you participated has not yet ended"
        );
        IERC20(voteToken).safeTransfer(msg.sender, members[msg.sender]);
    }
}
