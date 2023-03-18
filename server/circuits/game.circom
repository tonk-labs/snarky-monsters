pragma circom 2.1.4;

include "chkhash.circom";
include "turn.circom";
include "rounds.circom";

template Game() {
    //hash of all the moves, randomness, and monster choices (the ids are hashed)
    //game hash is hashed as follows H(mon1,mon2,m1,m2,swap1,r1,r2,...mn-1,mn,swapn,rn-1,rn)
    signal input gameHash;
    //this is the game state in order of player -> npc -> player -> and so forth
    signal input state[18][10];
    //the moves for each turn, makes a transition to the next state
    signal input moves[17][6];
    //the shared randomness (we assume the randomness has already been clipped)
    signal input randomness[17];
    //the attack and defense effectiveness of each move
    //this is kind of a stupid hack
    //but I'm sure there's a more clever way to incorporate
    //the model more succinctly into the game rules
    signal input atkeff[17];
    signal input defeff[17];
    
    //included to prevent man-in-middle-attacks?
    signal input sessionID;

    signal output out;

    assert(sessionID != 0);

    component checkHash = CheckHash(17);
    checkHash.state <== state;
    checkHash.randomness <== randomness;
    checkHash.moves <== moves;
    checkHash.atkeff <== atkeff;
    checkHash.defeff <== defeff;

    gameHash === checkHash.hash;

    component checkRounds = Rounds();
    checkRounds.state <== state;
    checkRounds.moves <== moves;
    checkRounds.randomness <== randomness;
    checkRounds.atkeff <== atkeff;
    checkRounds.defeff <== defeff;

    //we output the health of the NPC as proof of win or loss
    out <== checkRounds.out;
}

component main { public [ gameHash, sessionID ] } = Game();

/* INPUT = {
  "gameHash": "813300335888025801684684015622395836602544725253669613838535040135392070759",
  "sessionID": "23424145",
  "state": [
        [
            1, 100, 5, 5, 6,
            2, 100, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 87, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6, 
            2, 87, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 74, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 74, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 61, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 61, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 48, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 48, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 35, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 35, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 22, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 22, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 9, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 9, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 0, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 0, 5, 5, 2
        ],
        [
            1, 100, 5, 5, 6,
            2, 0, 5, 5, 2
        ]
    ],
    "randomness": [32, 8, 40, 50, 21, 32, 34, 40, 50, 20, 32, 90, 40, 50, 21, 0, 0],
    "moves": [
        [3, 5, 98, 10, 6, 2],
        [5, 5, 98, 10, 2, 2],
        [3, 5, 98, 10, 6, 2],
        [3, 5, 98, 10, 2, 2],
        [3, 5, 98, 10, 6, 2],
        [3, 5, 98, 10, 2, 2],
        [3, 5, 98, 10, 6, 2],
        [3, 5, 98, 10, 2, 2],
        [3, 5, 98, 10, 6, 2],
        [3, 5, 98, 10, 2, 2],
        [3, 5, 98, 10, 6, 2],
        [3, 5, 98, 10, 2, 2],
        [3, 5, 98, 10, 6, 2],
        [3, 5, 98, 10, 2, 2],
        [3, 5, 98, 10, 6, 2],
        [6, 0, 0, 0, 0, 6],
        [6, 0, 0, 0, 0, 6]
    ],
    "atkeff": [3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 0],
    "defeff": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0]
}
 */