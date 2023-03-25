const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());
  
    const VerifierFactory = await hre.ethers.getContractFactory("Verifier");
    const verifierContract = await VerifierFactory.deploy();
    await verifierContract.deployed();

    const snarkyMonstersFactory = await hre.ethers.getContractFactory("SnarkyMonstersGame");
    const snarkyContract = await snarkyMonstersFactory.deploy(verifierContract.address);
    await snarkyContract.deployed();
  
    console.log("Snarky Address: ", snarkyContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();