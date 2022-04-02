const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

task("vote", "doing vote")
    .addParam("id", "proposal's number")
    .addParam("vote", "vote's value")
    .setAction(async function (taskArgs, hre) {
        const contract = await hre.ethers.getContractAt("Dao", process.env.DAO_ADDR);
        try {
            await contract.vote(taskArgs.id, taskArgs.vote)
            console.log('voted');
        } catch (e) {
            console.log('error',e)
        }
    });