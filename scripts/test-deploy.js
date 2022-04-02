async function main() {
    const Test = await ethers.getContractFactory("Test");
    const test = await Test.deploy(process.env.DAO_ADDR);
    console.log("Test address:", test.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });