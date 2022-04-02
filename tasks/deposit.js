const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");

task("deposit", "Entering the amount to vote")
    .addParam("amount", "deposit amount") 
    .setAction(async function (taskArgs, hre) {
        const contract = await hre.ethers.getContractAt("Dao", process.env.DAO_ADDR);
        try {
            await contract.deposit(web3.utils.toWei(taskArgs.amount, 'ether'));
            console.log('deposited');
        } catch (e) {
            console.log('error', e);
        }
    });