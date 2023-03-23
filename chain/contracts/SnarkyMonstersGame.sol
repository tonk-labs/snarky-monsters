pragma solidity ^0.8.9;

import "./Verifier.sol"; // Import the Verifier contract with the verifyProof function

contract SnarkyMonstersGame {
    struct Session {
        address user;
        bytes32 gameHash;
        bool verified;
    }

    struct BoardEntry {
        address user;
        uint256 wins;
        bool isEntry;
    }


    BoardEntry[] topScores;
    address[] private addresses;
    mapping(uint256 => Session) public sessions;
    mapping(address => BoardEntry) public leaderboard;

    Verifier public verifierContract;

    event SessionSubmitted(uint256 indexed sessionId);
    event SessionCertification(uint256 indexed sessionId, bool isValid);

    constructor(address verifierAddress) {
        verifierContract = Verifier(verifierAddress);
    }

    function addAddress(address _addr) private {
        if(!leaderboard[_addr].isEntry) {
            addresses.push(_addr);
        }
    }

    function addToLeaderBoard(BoardEntry memory entry) private {
        if(!leaderboard[entry.user].isEntry) {
            leaderboard[entry.user] = entry;
        }
    }

    function submitSession(uint256 sessionId, bytes32 gameHash) external {
        require(sessions[sessionId].user == address(0), "Session already exists");

        sessions[sessionId] = Session({
            user: msg.sender,
            gameHash: gameHash,
            verified: false
        });

        emit SessionSubmitted((sessionId));
    }

    function updateTopScores(BoardEntry memory entry) private {
        // Check if the new score is greater than the lowest score in topScores
        if (topScores.length == 0 || entry.wins > topScores[topScores.length-1].wins) {
            // Check if the user already has an entry in topScores
            for (uint i = 0; i < topScores.length; i++) {
                if (topScores[i].user == entry.user) {
                    // Update the user's entry
                    topScores[i].wins = entry.wins;
                    return;
                }
            }
            
            // Insert the new entry in the correct position in topScores
            uint insertIndex = 0;
            for (uint i = 0; i < topScores.length; i++) {
                if (entry.wins > topScores[i].wins) {
                    insertIndex = i;
                    break;
                }
            }
            topScores.push(); // Append a new element to the end of the array to make space
            for (uint i = topScores.length-1; i > insertIndex; i--) {
                topScores[i] = topScores[i-1]; // Shift the elements to the right
            }
            topScores[insertIndex] = entry; // Insert the new element
        }
        else {
            // The new score is not high enough to be a top score, so do nothing.
            return;
        }
        
        // If topScores now has more than 20 entries, remove the lowest entry.
        if (topScores.length > 20) {
            delete topScores[topScores.length-1];
            topScores.pop();
        }
    }

    function certifyGame(
        uint256 sessionId,
        bytes memory proof,
        uint[] memory pubSignals
    ) external {
        require(!sessions[sessionId].verified, "Session already verified");

        bool isValid = verifierContract.verifyProof(proof, pubSignals);

        if (isValid) {
            address user = sessions[sessionId].user;
            addAddress(user);
            BoardEntry memory entry = leaderboard[user]; 
            if (entry.isEntry) {
                leaderboard[user].wins += 1;
            } else {
                entry.isEntry = true;
                entry.wins = 1;
                entry.user = user;
                addToLeaderBoard(entry);
            }
            updateTopScores(entry);
        }
        
        sessions[sessionId].verified = true;
        emit SessionCertification(sessionId, isValid);
    }

    function checkSessionSubmitted(uint256 sessionId) external view returns (bool) {
        return sessions[sessionId].user != address(0);
    }

    function checkSessionVerified(uint256 sessionId) external view returns (bool) {
        return sessions[sessionId].verified;
    }

    function getTopScores() external view returns (BoardEntry[] memory) {
        return topScores;
    }
}