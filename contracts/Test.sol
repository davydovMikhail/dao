//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Test {
    uint256 public someNumber;
    string public someString;
    address daoContract;

    constructor(address _daoContract) {
        daoContract = _daoContract;
    }

    modifier onlyDAO() {
        require(
            msg.sender == daoContract,
            "this feature is only available to the dao address"
        );
        _;
    }

    function assignNumber(uint256 _someNumber) public onlyDAO {
        someNumber = _someNumber;
    }

    function summator(uint256 _a, uint256 _b) public onlyDAO {
        someNumber = _a + _b;
    }

    function assignString(string calldata _someString) public onlyDAO {
        someString = _someString;
    }
}
