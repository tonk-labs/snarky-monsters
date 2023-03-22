pragma solidity ^0.8.9;

import "./Verifier.sol"; // Import the Verifier contract with the verifyProof function

contract SnarkyMonstersGame {
    struct Session {
        address user;
        bytes32 gameHash;
        bool verified;
    }

    mapping(uint256 => Session) public sessions;
    mapping(address => uint256) public leaderboard;
    Verifier public verifierContract;

    event SessionVerified(uint256 indexed sessionId);

    constructor(address verifierAddress) {
        verifierContract = Verifier(verifierAddress);
    }

    function submitSession(uint256 sessionId, bytes32 gameHash) external {
        require(sessions[sessionId].user == address(0), "Session already exists");

        sessions[sessionId] = Session({
            user: msg.sender,
            gameHash: gameHash,
            verified: false
        });
    }

    function certifyGame(
        uint256 sessionId,
        bytes memory proof,
        uint[] memory pubSignals
    ) external {
        require(sessions[sessionId].user == msg.sender, "Unauthorized");
        require(!sessions[sessionId].verified, "Session already verified");

        bool isValid = verifierContract.verifyProof(proof, pubSignals);

        if (isValid) {
            sessions[sessionId].verified = true;
            address user = sessions[sessoinId].user;
            leaderboard[user] += 1;
            emit SessionVerified(sessionId);
        }
    }

    function checkSessionVerified(uint256 sessionId) external view returns (bool) {
        return sessions[sessionId].verified;
    }

}