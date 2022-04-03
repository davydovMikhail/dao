require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();
require("./tasks");

const { API_URL, PRIVATE_KEY, ETH_API_KEY } = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: API_URL, 
      accounts: [`0x${PRIVATE_KEY}`],
      gas: 2100000,
      gasPrice: 8000000000
    }
  },
  etherscan: {
    apiKey: ETH_API_KEY
  }
};
