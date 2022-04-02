// const { task } = require("hardhat/config");
// require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-web3");

// task("grantRole", "grantRole")
//     .setAction(async function (taskArgs, hre) {
//         const contract = await hre.ethers.getContractAt("Dao", process.env.DAO_ADDR);
//         try {
//             await contract.grantRole('0xdc1958ce1178d6eb32ccc146dcea8933f1978155832913ec88fa509962e1b413', '0xd2f5F24cf008d0c1280216ae98d3E35C1CFff270');
//             console.log('roled');
//         } catch (e) {
//             console.log('error', e);
//         }
//     });