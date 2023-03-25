pragma solidity ^0.8.9;

// import "hardhat/console.sol";
import "./Verifier.sol"; // Import the Verifier contract with the verifyProof function

contract SnarkyMonstersGame {
    struct Game {
        address user;
        uint gameHash;
        bool verified;
    }

    struct BoardEntry {
        address user;
        uint256 wins;
        bool isEntry;
    }


    BoardEntry[] topScores;
    mapping(uint256 => Game) public games;
    mapping(address => BoardEntry) public leaderboard;

    Verifier public verifierContract;

    event GameSubmitted(uint256 indexed gameId);
    event GameCertification(uint256 indexed gameId, bool isValid);

    constructor(address verifierAddress) {
        verifierContract = Verifier(verifierAddress);
    }

    function addToLeaderBoard(BoardEntry memory entry) private {
        if(!leaderboard[entry.user].isEntry) {
            leaderboard[entry.user] = entry;
        }
    }

    function submitGame(uint256 gameId, uint gameHash) external {
        require(games[gameId].user == address(0), "Game already exists");

        // console.log("Submitting Game for Game %s and user %s", gameId, msg.sender);
        games[gameId] = Game({
            user: msg.sender,
            gameHash: gameHash,
            verified: false
        });

        emit GameSubmitted((gameId));
    }

    function updateTopScores(BoardEntry memory entry) private {
        if (topScores.length < 20 || entry.wins > topScores[0].wins) {
            int256 existingEntry = -1;
            for (uint i = 0; i < topScores.length; i++) {
                //update the existing entry
                if (topScores[i].user == entry.user) {
                    // Update the user's entry
                    existingEntry = int(i);
                    topScores[i].wins = entry.wins;
                    // console.log("Found existing entry for %s", entry.user);
                }
            } 
            
            // maybe will need to reorder with its neighbors
            if (existingEntry != -1) {
                uint index = uint(existingEntry);

                if (index == 0) {
                    return;
                }
                //swap with the neighbor if it's now bigger 
                while (topScores[index].wins > topScores[index - 1].wins && index > 0) {
                    // console.log("swapping to %s for user %s", index- 1, entry.user);
                    BoardEntry memory tmp = topScores[index - 1];
                    topScores[index - 1] = topScores[index];
                    topScores[index] = tmp;
                    index--;
                }
                return;
            }

            // otherwise we'll find a spot to insert it 
            uint insertIndex = 0;
            for (uint i = 0; i < topScores.length; i++) {
                if (entry.wins > topScores[i].wins) {
                    insertIndex = i;
                    break;
                }
            }

            // in this case, it's the smallest number of an array < 20
            if (insertIndex == 0 && topScores.length != 0) {
                insertIndex = topScores.length;
            }

            // shift all elements over to the right
            topScores.push();
            for (uint i = topScores.length-1; i > insertIndex; i--) {
                topScores[i] = topScores[i-1];
            }
            topScores[insertIndex] = entry;
            // console.log("insertIndex %s for user %s", insertIndex, entry.user);

            if (topScores.length > 20) {
                delete topScores[topScores.length - 1];
                topScores.pop();
            }

        } else {
            return;
        }
    }

    function certifyGame(
        uint256 gameId,
        bytes memory proof,
        uint[] memory pubSignals
    ) external {
        require(!games[gameId].verified, "Game already verified");

        //@TODO first 32 bytes of the pubSignals should be the gameHash
        //We need to perform a check here to make sure the gameId matches the gameHash
        //In theory we could also make sure the correct gameId is included
        //to prevent man-in-middle-attack on the certification
        require(pubSignals[1] == gameId, "Game id should match the public signal");

        bool isValid = verifierContract.verifyProof(proof, pubSignals);

        if (isValid) {
            address user = games[gameId].user;
            BoardEntry memory entry = leaderboard[user]; 
            games[gameId].verified = true;
            // console.log("Retrieved entry for user %s", entry.user);
            if (entry.isEntry) {
                leaderboard[user].wins += 1;
            } else {
                entry.isEntry = true;
                entry.wins = 1;
                entry.user = user;
                addToLeaderBoard(entry);
            }
            // console.log("updating entry for address: %s", leaderboard[user].user);
            updateTopScores(leaderboard[user]);
        }
        
        emit GameCertification(gameId, isValid);
    }

    function checkGameSubmitted(uint256 gameId) external view returns (bool) {
        return games[gameId].user != address(0);
    }

    function checkGameVerified(uint256 gameId) external view returns (bool) {
        return games[gameId].verified;
    }

    function getTopScores() external view returns (BoardEntry[] memory) {
        return topScores;
    }
}