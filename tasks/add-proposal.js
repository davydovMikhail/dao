const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

task("addProposal", "adding a new vote")
    .addParam("id", "proposal's number")
    .addParam("desc", "essence of voting")
    .addParam("address", "call contract")
    .addParam("data", "calldata")
    .setAction(async function (taskArgs, hre) {
        const contract = await hre.ethers.getContractAt("Dao", process.env.DAO_ADDR);
        try {
            await contract.addProposal(taskArgs.id, taskArgs.desc, taskArgs.address, taskArgs.data)
            console.log('added');
        } catch (e) {
            console.log('error',e)
        }
    });