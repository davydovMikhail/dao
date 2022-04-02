const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");

describe("Dao", function () {
  beforeEach(async () => {
    [owner, chairman, user1, user2, user3, user4, user5, user6] = await ethers.getSigners();
    TokenF = await ethers.getContractFactory("Token");
    DaoF = await ethers.getContractFactory("Dao");
    TestF = await ethers.getContractFactory("Test");
    totalSupply = parseEther("100000");
    token = await TokenF.connect(owner).deploy(totalSupply, "DAO Token", "DT")
    balance = parseEther("10000")
    await token.connect(owner).transfer(user1.address, balance)
    await token.connect(owner).transfer(user2.address, balance)
    await token.connect(owner).transfer(user3.address, balance)
    await token.connect(owner).transfer(user4.address, balance)
    await token.connect(owner).transfer(user5.address, balance)
    await token.connect(owner).transfer(user6.address, balance)
    const minimumQuorum = parseEther("1000");
    dao = await DaoF.connect(owner).deploy(token.address, minimumQuorum, 15)
    await dao.connect(owner).grantRole(await dao.CHAIRMAN_ROLE(), chairman.address);
    test = await TestF.connect(owner).deploy(dao.address);
  })

  it("succeseful voiting", async function () {
    const id = 7;
    const description = "bla-bla-bla-bla-bla-bla"
    const jsonAbi = [{
        "inputs": [
          {
            "internalType": "string",
            "name": "_someString",
            "type": "string"
          }
        ],
        "name": "assignString",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
    ];
    const iface = new ethers.utils.Interface(jsonAbi);
    const calldata = iface.encodeFunctionData('assignString', ['Some Test String']);
    console.log(calldata)
    await dao.connect(chairman).addProposal(id, description, test.address, calldata)
    await expect(dao.connect(user1).vote(id, true)).to.be.revertedWith("You have not suffrage")
    const depositAmount = parseEther("450")
    await token.connect(user1).approve(dao.address, depositAmount)
    await dao.connect(user1).deposit(depositAmount)
    await dao.connect(user1).vote(id, true)
    await expect(dao.connect(user1).vote(id, true)).to.be.revertedWith("You already voted")
    await token.connect(user2).approve(dao.address, depositAmount)
    await dao.connect(user2).deposit(depositAmount)
    await dao.connect(user2).vote(id, true)
    await token.connect(user3).approve(dao.address, depositAmount)
    await dao.connect(user3).deposit(depositAmount)
    await dao.connect(user3).vote(id, false)
    await expect(dao.connect(user1).withdraw()).to.be.revertedWith("The last vote in which you participated has not yet ended")
    await expect(dao.connect(user6).finishProposal(id)).to.be.revertedWith("Voting is not over yet")
    await ethers.provider.send("evm_increaseTime", [900])
    await ethers.provider.send("evm_mine")
    await dao.connect(user6).finishProposal(id)
    await expect(dao.connect(user6).finishProposal(id)).to.be.revertedWith("Voting completed successfully before you")
    expect(await test.someString()).to.equal("Some Test String")
    await expect(dao.connect(user1).vote(id, true)).to.be.revertedWith("Voting time has expired")
    await expect(dao.connect(user6).withdraw()).to.be.revertedWith("You have not tokens on this contract")//
    const balanceBefore = await token.balanceOf(user1.address)
    await dao.connect(user1).withdraw()
    expect(+await token.balanceOf(user1.address)).to.equal(+balanceBefore + +depositAmount)
  });

  it("unsucceseful voiting(quorum)", async function () {
    const id = 7;
    const description = "bla-bla-bla-bla-bla-bla"
    const jsonAbi = [{
        "inputs": [
          {
            "internalType": "string",
            "name": "_someString",
            "type": "string"
          }
        ],
        "name": "assignString",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
    ];
    const iface = new ethers.utils.Interface(jsonAbi);
    const calldata = iface.encodeFunctionData('assignString', ['Some Test String']);
    await dao.connect(chairman).addProposal(id, description, test.address, calldata)
    const depositAmount = parseEther("450")
    await token.connect(user1).approve(dao.address, depositAmount)
    await dao.connect(user1).deposit(depositAmount)
    await dao.connect(user1).vote(id, true)
    await ethers.provider.send("evm_increaseTime", [900])
    await ethers.provider.send("evm_mine")
    await expect(dao.connect(user6).finishProposal(id)).to.be.revertedWith("The number of tokens is less than the minimum quorum")
  });

  it("unsucceseful voiting(less than 51%)", async function () {
    const id = 7;
    const description = "bla-bla-bla-bla-bla-bla"
    const jsonAbi = [{
        "inputs": [
          {
            "internalType": "string",
            "name": "_someString",
            "type": "string"
          }
        ],
        "name": "assignString",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
    ];
    const iface = new ethers.utils.Interface(jsonAbi);
    const calldata = iface.encodeFunctionData('assignString', ['Some Test String']);
    await dao.connect(chairman).addProposal(id, description, test.address, calldata)
    const depositAmount = parseEther("450")
    await token.connect(user1).approve(dao.address, depositAmount)
    await dao.connect(user1).deposit(depositAmount)
    await dao.connect(user1).vote(id, true)
    await token.connect(user2).approve(dao.address, depositAmount)
    await dao.connect(user2).deposit(depositAmount)
    await dao.connect(user2).vote(id, false)
    await token.connect(user3).approve(dao.address, depositAmount)
    await dao.connect(user3).deposit(depositAmount)
    await dao.connect(user3).vote(id, false)
    await ethers.provider.send("evm_increaseTime", [900])
    await ethers.provider.send("evm_mine")
    await expect(dao.connect(user6).finishProposal(id)).to.be.revertedWith("Vote scored less than 51%")
  });
});
