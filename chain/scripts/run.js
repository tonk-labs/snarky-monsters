const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const testContractFactory = await hre.ethers.getContractFactory("Test");
    const testContract = await testContractFactory.deploy();
    await testContract.deployed();
    console.log("Contract deployed to:", testContract.address);

    await testContract.getTotalBumps();

    const bumpTxn = await testContract.bump();
    await bumpTxn.wait();

    await testContract.getTotalBumps();

    const bumpTxn2 = await testContract.connect(randomPerson).bump();
    await bumpTxn2.wait();

    await testContract.getTotalBumps();
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0); // exit Node process without error
    } catch (error) {
      console.log(error);
      process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
  };
  
  runMain();