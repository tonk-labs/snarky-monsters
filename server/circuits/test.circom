Move {
    id: int,
    attack: int,
    crit: char, //1-100
    miss: char,
    category: short, 
    type: int //heal, attack, buff, nerf
    effect_id: int,
}

[2 bytes, 4 bytes, 1 btyte, 1 byte, 2 bytes, 1 byte, 2 bytes]

Monster {
    id: int,
    hp: int // 4 bytes
    stats: { // make it 16 bytes
        attack: int, //1 bytes
        defense: int //1 bytes
    },
    category: short,
    moves: [int], // this is just for tracking possible moves for a character, it's an array of size 8
}


[2 bytes, 4 bytes, 16 bytes, 2 bytes, 32 bytes] //we represent the moves as valid with a binary-bit flag 

//effects that are applied from moves are tracked in the internal state of the system

Effect {
    id: int,
    type: int //heal, attack, boost, reduce, vulnerability, resistance 
    category: int //category of the effect
    modifier: int //modifier based off the type
}

[2 bytes, 1 byte, 1 byte, 4 bytes]

circuit will load in, moves, monsters, and effects as lists



pragma circom 2.1.4;

include "circomlib/mimc.circom";

// include "https://github.com/0xPARC/circom-secp256k1/blob/master/circuits/bigint.circom";

template CheckGameHash(nInput) {
    signal input dmg[nInput]; 
    signal input randomness[nInput];
    signal input moves[nInput];
    signal input gameHash;

    component hasher = MultiMiMC7(nInput*2, 5);
    for (var i = 0; i < nInput; i++) {        
        var movingI = i * 3;
        hasher.in[movingI] <== moves[i];
        hasher.in[movingI+1] <== dmg[i];
        hasher.in[movingI+2] <== randomness[i];
    }
    hasher.k <== 0;
    gameHash === hasher.out;
}

template CheckStateHash(nInput) {
    signal input state[nInput];
    signal input stateHash;

    component hasher = MultiMiMC7(nInput, 5);
    for (var i = 0; i < nInput; i++) {        
        hasher.in[i] <== state[i];        
    }
    hasher.k <== 0;
    stateHash === hasher.out;
}


template Game () {
    // we always start with player
    signal input dmg[6];
    signal input moves[6];
    signal input randomness[6];
    // the initial state of the NPC
    // hp, mv1, mv2, mv3, mv4, mv5, mv6
    signal input npcState[7];
    signal input npcHash;
    // the initial state of player
    signal input playerState[7];
    signal input gameHash;
    signal input sessionId;
    signal output gameOutcome;    

    log(sessionId);

    //sessionID is mostly unused, but we keep it to prevent man-in-middle attacks
    assert(sessionId != 0);

    // check all hashes
    component checkGameHash = CheckGameHash(6);
    checkGameHash.moves <== moves;
    checkGameHash.dmg <== dmg;
    checkGameHash.randomness <== randomness;
    checkGameHash.gameHash <== gameHash;
    component checkStateHash = CheckStateHash(7);
    checkStateHash.state <== npcState;
    checkStateHash.stateHash <== npcHash;

    // iterate over the moves
    for (var m = 0; m < 6; m++) {
        // it's players turn
        if (m % 2 == 0) {
        // it's npcs turn
        } else {

        }
    }
    
}

component main { public [ npcHash, playerState, gameHash, sessionId ] } = Game();

/* INPUT = {    
    "moves": [2, 4, 0, 4, 1, 3],
    "dmg": [0, 4, 4, 5, 7, 8],
    "randomness": [78, 94, 87, 58, 5, 87],
    "gameHash": "7016613552093010809231070053930868205021491457382451990998567080286794001946",
    "playerState": [10, 50, 75, 50, 20, 50, 70],
    "npcState": [10, 50, 75, 50, 20, 50, 70],
    "npcHash": "17375164578945722275697965865664848066942599146086686015275202889054656484846",
    "sessionId": "18446744073709551324"
} */


////21342568883940020494048222204330033436953017952874691220446021514037830810970
//[2, 4, 0, 4, 1, 3]
//[2, 4, 7, 9, 10, 8];
//[78, 94, 87, 58, 5, 87];
//ps [10, 50, 75, 50, 20, 50, 70]
//npcs [10, 50, 75, 50, 20, 50, 70]


/**
 "moves": [
    0,
    0,
    0,
    20,
    0,
    0,
    1,
    10,
    2,
    10,
    0,
    1,
    2,
    10,
    2,
    0,
    0,
    2,
    3,
    10,
    2,
    10,
    1,
    2,
    4,
    10,
    2,
    10,
    1,
    2,
    5,
    10,
    2,
    10,
    2,
    2,
    6,
    10,
    2,
    10,
    2,
    2,
    7,
    10,
    2,
    10,
    3,
    2,
    8,
    10,
    2,
    10,
    3,
    2,
    9,
    10,
    2,
    10,
    4,
    2,
    10,
    10,
    2,
    10,
    4,
    2,
    11,
    10,
    2,
    10,
    5,
    2,
    12,
    10,
    2,
    10,
    5,
    2,
    13,
    10,
    2,
    10,
    6,
    2,
    14,
    10,
    2,
    10,
    6,
    2,
    15,
    10,
    2,
    10,
    7,
    2,
    16,
    10,
    2,
    10,
    7,
    2
  ],
  "monsters": [
    1,
    100,
    10,
    10,
    1,
    2,
    100,
    10,
    10,
    2,
    3,
    100,
    10,
    10,
    3,
    4,
    100,
    10,
    10,
    4,
    5,
    100,
    10,
    10,
    5,
    6,
    100,
    10,
    10,
    6,
    7,
    100,
    10,
    10,
    7
  ]
*/