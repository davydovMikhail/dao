require("@nomiclabs/hardhat-web3");

async function main() {
  const minimumQuorum = '100'
  const duration = 7 // minutes 
  const Dao = await ethers.getContractFactory("Dao");
  const dao = await Dao.deploy(process.env.TOKEN_ADDR, web3.utils.toWei(minimumQuorum, 'ether'), duration);
  console.log("Dao address:", dao.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
