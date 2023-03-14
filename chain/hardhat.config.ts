import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_, hre: HardhatRuntimeEnvironment) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
      console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

export default config;
