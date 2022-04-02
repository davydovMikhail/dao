const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");

task("someString", "some string")
    .setAction(async function (taskArgs, hre) {
        const contract = await hre.ethers.getContractAt("Test", process.env.TEST_ADDR);
        try {
            const r = await contract.someString();
            console.log('r:', r);
        } catch (e) {
            console.log('error', e);
        }
    });