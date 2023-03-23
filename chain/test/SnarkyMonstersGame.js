// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { describe } = require("node:test");
const { waffle } = require('hardhat')
const { deployMockContract } = waffle;

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("SnarkyMonstersGame contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deploySnarkyFixture() {
    // Get the ContractFactory and Signers here.
    const SnarkyMonstersGame = await ethers.getContractFactory("SnarkyMonstersGame");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const myVerifier = require('../artifacts/contracts/Verifier.sol/Verifier.json');
    const mockedVerifier = await deployMockContract(owner, myVerifier.abi);
    await mockedVerifier.deployed();

    const hhSnarky = await SnarkyMonstersGame.deploy(mockedVerifier.address);
    await hhSnarky.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { mockedVerifier, hhSnarky, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Session Submission", function () {
    it("Should submit a session", async function () {
      const { hhSnarky, owner } = await loadFixture(deploySnarkyFixture);
      const gameHash = ethers.utils.formatBytes32String("gamehash");
      const sessionId = 1;

      await expect(hhSnarky.submitSession(sessionId, gameHash)).to.emit(
        hhSnarky, "SessionSubmitted").withArgs(1);
    });

    it("Cannot double submit session", async function () {
      const { hhSnarky } = await loadFixture(deploySnarkyFixture);
      const gameHash = ethers.utils.formatBytes32String("gamehash");
      const sessionId = 1;

      await hhSnarky.submitSession(sessionId, gameHash);

      await expect(hhSnarky.submitSession(sessionId, gameHash)).to.be.revertedWith("Session already exists");
    });
  });

  describe("Game certification", function() {
    it("Verifies a game correct", async function (){
      const { hhSnarky, mockedVerifier } = await loadFixture(deploySnarkyFixture);

      await mockedVerifier.mock.verifyProof.returns(true);

      await expect(hhSnarky.certifyGame(1, [0x0], [0, 0, 0])).to.emit(
        hhSnarky, "SessionCertification").withArgs(1, true);
    });
    it("Verifies a game incorrect", async function (){
      const { hhSnarky, mockedVerifier } = await loadFixture(deploySnarkyFixture);

      await mockedVerifier.mock.verifyProof.returns(false);

      await expect(hhSnarky.certifyGame(1, [0x0], [0, 0, 0])).to.emit(
        hhSnarky, "SessionCertification").withArgs(1, false);
    });
  });

  describe("Updating and retrieving leaderboard", function() {
    it("Correctly adds new entry to the leaderboard", async function() {
      const { hhSnarky, mockedVerifier } = await loadFixture(deploySnarkyFixture);
      await mockedVerifier.mock.verifyProof.returns(true);

      const tx = await hhSnarky.certifyGame(1, [0x0], [0, 0, 0]);
      await tx.wait();

      expect(await hhSnarky.checkSessionVerified(1)).to.equal(true);
      const topScores = await hhSnarky.getTopScores();

      const decodedScores = topScores.map((entry) => {
        return {
          user: entry[0],
          wins: BigInt(entry[1]._hex),
          isEntry: entry[2]
        }
      });

      expect(decodedScores[0].wins).equal(BigInt(1));

    });

    it("Correctly adds and sorts entries on the leaderboard", async function() {
      const { hhSnarky, mockedVerifier, owner, addr1 } = await loadFixture(deploySnarkyFixture);
      await mockedVerifier.mock.verifyProof.returns(true);

      const gameHash1 = ethers.utils.formatBytes32String("gamehash");
      const gameHash2 = ethers.utils.formatBytes32String("gamehash");
      const gameHash3 = ethers.utils.formatBytes32String("gamehash");
      
      const ownerC = await hhSnarky.connect(owner);
      const addrC = await hhSnarky.connect(addr1);
      await expect(ownerC.submitSession(1, gameHash1)).to.emit(
        hhSnarky, "SessionSubmitted").withArgs(1);
      await expect(ownerC.submitSession(2, gameHash2)).to.emit(
        hhSnarky, "SessionSubmitted").withArgs(2);
      await expect(addrC.submitSession(3, gameHash3)).to.emit(
        hhSnarky, "SessionSubmitted").withArgs(3);

      const tx = await hhSnarky.certifyGame(1, [0x0], [0, 0, 0]);
      await tx.wait();
      const tx2 = await hhSnarky.certifyGame(2, [0x0], [0, 0, 0]);
      await tx2.wait();
      const tx3 = await hhSnarky.certifyGame(3, [0x0], [0,0,0]);
      await tx3.wait();

      const topScores = await hhSnarky.getTopScores();

      const decodedScores = topScores.map((entry) => {
        return {
          user: entry[0],
          wins: BigInt(entry[1]._hex),
          isEntry: entry[2]
        }
      });

      console.log(decodedScores)

    });
  });


  //   it("Should assign the total supply of tokens to the owner", async function () {
  //     const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
  //     const ownerBalance = await hardhatToken.balanceOf(owner.address);
  //     expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  //   });
  // });

  // describe("Transactions", function () {
  //   it("Should transfer tokens between accounts", async function () {
  //     const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
  //       deployTokenFixture
  //     );
  //     // Transfer 50 tokens from owner to addr1
  //     await expect(
  //       hardhatToken.transfer(addr1.address, 50)
  //     ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

  //     // Transfer 50 tokens from addr1 to addr2
  //     // We use .connect(signer) to send a transaction from another account
  //     await expect(
  //       hardhatToken.connect(addr1).transfer(addr2.address, 50)
  //     ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
  //   });

  //   it("Should emit Transfer events", async function () {
  //     const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
  //       deployTokenFixture
  //     );

  //     // Transfer 50 tokens from owner to addr1
  //     await expect(hardhatToken.transfer(addr1.address, 50))
  //       .to.emit(hardhatToken, "Transfer")
  //       .withArgs(owner.address, addr1.address, 50);

  //     // Transfer 50 tokens from addr1 to addr2
  //     // We use .connect(signer) to send a transaction from another account
  //     await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
  //       .to.emit(hardhatToken, "Transfer")
  //       .withArgs(addr1.address, addr2.address, 50);
  //   });

  //   it("Should fail if sender doesn't have enough tokens", async function () {
  //     const { hardhatToken, owner, addr1 } = await loadFixture(
  //       deployTokenFixture
  //     );
  //     const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

  //     // Try to send 1 token from addr1 (0 tokens) to owner.
  //     // `require` will evaluate false and revert the transaction.
  //     await expect(
  //       hardhatToken.connect(addr1).transfer(owner.address, 1)
  //     ).to.be.revertedWith("Not enough tokens");

  //     // Owner balance shouldn't have changed.
  //     expect(await hardhatToken.balanceOf(owner.address)).to.equal(
  //       initialOwnerBalance
  //     );
  //   });
})