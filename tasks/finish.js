const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");

task("finishProposal", "grantRole")
    .addParam("id", "proposal's number")
    .setAction(async function (taskArgs, hre) {
        const contract = await hre.ethers.getContractAt("Dao", process.env.DAO_ADDR);
        try {
            await contract.finishProposal(taskArgs.id);
            console.log('proposal finished');
        } catch (e) {
            console.log('error', e);
        }
    });