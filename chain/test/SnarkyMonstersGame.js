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
const { test1 } = require('./test_calldata')

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

  async function deploySnarkyFixtureLegit() {
    const SnarkyMonstersGame = await ethers.getContractFactory("SnarkyMonstersGame");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Verifier = await ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy();
    await verifier.deployed();

    const hhSnarky = await SnarkyMonstersGame.deploy(verifier.address);
    await hhSnarky.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { verifier, hhSnarky, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Game Submission", function () {
    it("Should submit a game", async function () {
      const { hhSnarky, owner } = await loadFixture(deploySnarkyFixture);
      const gameHash = ethers.utils.formatBytes32String("gamehash");
      const gameId = 1;

      await expect(hhSnarky.submitGame(gameId, gameHash)).to.emit(
        hhSnarky, "GameSubmitted").withArgs(1);
    });

    it("Cannot double submit game", async function () {
      const { hhSnarky } = await loadFixture(deploySnarkyFixture);
      const gameHash = ethers.utils.formatBytes32String("gamehash");
      const gameId = 1;

      await hhSnarky.submitGame(gameId, gameHash);

      await expect(hhSnarky.submitGame(gameId, gameHash)).to.be.revertedWith("Game already exists");
    });
  });

  describe("Game certification", function() {
    it("Verifies a game correct", async function (){
      const { hhSnarky, mockedVerifier } = await loadFixture(deploySnarkyFixture);

      await mockedVerifier.mock.verifyProof.returns(true);

      await expect(hhSnarky.certifyGame(1, [0x0], [1, 1])).to.emit(
        hhSnarky, "GameCertification").withArgs(1, true);
    });
    it("Verifies a game incorrect", async function (){
      const { hhSnarky, mockedVerifier } = await loadFixture(deploySnarkyFixture);

      await mockedVerifier.mock.verifyProof.returns(false);

      await expect(hhSnarky.certifyGame(1, [0x0], [0, 1])).to.emit(
        hhSnarky, "GameCertification").withArgs(1, false);
    });
  });

  describe("Updating and retrieving leaderboard", function() {
    it("Correctly adds new entry to the leaderboard", async function() {
      const { hhSnarky, mockedVerifier } = await loadFixture(deploySnarkyFixture);
      await mockedVerifier.mock.verifyProof.returns(true);

      const tx = await hhSnarky.certifyGame(1, [0x0], [0, 1]);
      await tx.wait();

      expect(await hhSnarky.checkGameVerified(1)).to.equal(true);
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
      
      await expect(hhSnarky.connect(owner).submitGame(2, gameHash1)).to.emit(
        hhSnarky, "GameSubmitted").withArgs(2);
      await expect(hhSnarky.connect(owner).submitGame(3, gameHash2)).to.emit(
        hhSnarky, "GameSubmitted").withArgs(3);
      await expect(hhSnarky.connect(addr1).submitGame(4, gameHash3)).to.emit(
        hhSnarky, "GameSubmitted").withArgs(4);

      await hhSnarky.certifyGame(2, [0x0], [2, 2]);   
      await hhSnarky.certifyGame(3, [0x0], [3, 3]);      
      await hhSnarky.certifyGame(4, [0x0], [4, 4]);

      const topScores = await hhSnarky.getTopScores();
      const decodedScores = topScores.map((entry) => {
        return {
          user: entry[0],
          wins: BigInt(entry[1]._hex),
          isEntry: entry[2]
        }
      });

      console.log(decodedScores);

      expect(decodedScores.length).equal(2);
      expect(decodedScores[0].wins).equal(BigInt(2));
    });
  });

  describe("Real verifier with real example data", async function() {
    it("Makes a call to the verifier contract with a legit game", async function() {
      const { hhSnarky, addr1 } = await loadFixture(deploySnarkyFixtureLegit);
      await hhSnarky.connect(addr1).submitGame(BigInt(test1.gameId), test1.gameHash);
      await expect(hhSnarky.certifyGame(test1.gameId, test1.proof_bytes, test1.public_bytes)).to.emit(
        hhSnarky, "GameCertification").withArgs(test1.gameId, true);
    });
  });
})