pragma circom 2.1.4;

include "circomlib/poseidon.circom";
include "circomlib/bitify.circom";
include "circomlib/mux1.circom";
include "circomlib/comparators.circom";

// include "https://github.com/0xPARC/circom-secp256k1/blob/master/circuits/bigint.circom";

// outputs 1 if a < b, 0 if a >= b
template LEQ() {
    signal input a;
    signal input b;
    signal output out;
    var result = b - a;

    component bits = Num2Bits_strict();
    bits.in <== result;

    out <== bits.out[253];
}

template Round () {
    //rounds, size(monster)*2
    signal input state[3][10];
    signal input moves[12];
    signal input randomness[2];

    signal output npcHP;

    var coff = 5;
    var moff = 6;

    var hpoff = 1;
    var atkoff = 2;
    var defoff = 3;
    var catoff = 4;
    var movatkoff = 1;
    var movcritoff = 2;
    var movmissoff = 3;
    var movcatoff = 4;
    var movtypeoff = 5;


    /**
     * We are in state 0
     * PLAYER TURN
     */

   
    component leq1 = LEQ(); //used for miss
    leq1.a <== randomness[0];
    leq1.b <== moves[movmissoff];

    component leq2 = LEQ(); //used for crit
    leq2.a <== randomness[0];
    leq2.b <== moves[movcritoff];

    component isSwap = IsZero();
    isSwap.in <== moves[movtypeoff];

    component mux1 = Mux1();
    mux1.c <== [state[0][catoff], moves[catoff]];
    mux1.s <== isSwap.out * leq1.out; //the player swap also has a miss chance, will be 0 if it's less than randomness

    component mux2 = Mux1();
    mux2.c <== [state[0][atkoff], state[0][atkoff]*2]; //this mux chooses whether to do a crit or not
    mux2.s <== leq2.out;

    component mux3 = Mux1(); //this mux chooses the to match players category with itself if the category of the move is universal (ie. 0)
    mux3.c <== [state[0][catoff], moves[movcatoff]];
    mux3.s <== moves[movcatoff];

    // assert the next category for the player matches the category of the current player state
    // unless there's a swap, in which case we want it to match the move cat, but only if swap is 1
    state[1][catoff] === mux1.out;

    // assert the move cat matches the player category
    state[0][catoff] === mux3.out;

    // assert the next iteration of npc health fits the constraint
    state[1][coff + hpoff] === state[0][coff + hpoff] - (mux2.out + moves[movatkoff] - state[0][coff + defoff]) * leq1.out;


    /**
     * We are now in state 1
     * NPC TURN, we use offset NPC state and offset NPC moves and prior player state
     */

    component leq1n = LEQ(); //used for miss
    leq1n.a <== randomness[1];
    leq1n.b <== moves[moff + movmissoff];

    component leq2n = LEQ(); //used for crit
    leq2n.a <== randomness[1];
    leq2n.b <== moves[moff + movcritoff];

    component isSwapn = IsZero();
    isSwapn.in <== moves[moff + movtypeoff];

    //Psyche, NPCs should be able to swap, we'll compare the output of this mux to the next states category for the npc
    component mux1n = Mux1();
    mux1n.c <== [state[1][coff + catoff], moves[moff + catoff]];
    mux1n.s <== isSwapn.out * leq1n.out; //the player swap also has a miss chance, will be 0 if it's less than randomness

    //this mux chooses whether to do a crit or not
    component mux2n = Mux1();
    mux2n.c <== [state[1][coff + atkoff], state[1][coff + atkoff]*2];
    mux2n.s <== leq2n.out;

    //this mux chooses to match the npc category with itself if the category of the move is universal (ie. 0)
    component mux3n = Mux1(); 
    mux3n.c <== [state[1][catoff], moves[moff + movcatoff]];
    mux3n.s <== moves[moff + movcatoff];

    // assert the next category for the npc matches the category of the current npc state
    // unless there's a swap, in which case we want it to match the move cat, but only if swap is 1
    state[2][coff + catoff] === mux1n.out;

    // assert the move/swap cat matches the player category
    state[1][catoff] === mux3n.out;

    // assert the next iteration of player health fits the constraint
    state[2][hpoff] === state[1][hpoff] - (mux2n.out + moves[moff + movatkoff] - state[1][defoff]) * leq1n.out;

}

template ManyRounds() {
    signal input state[5][10];
    signal input randomness[2][2];
    signal input moves[2][12];

    component round1 = Round();
    component round2 = Round();

    round1.state <== [state[0], state[1], state[2]];
    round1.randomness <== randomness[0];
    round1.moves <== moves[0];

    round2.state <== [state[2], state[3], state[4]];
    round2.randomness <== randomness[1];
    round2.moves <== moves[1];
}



// component main { public [ ] } = Example();
component main = ManyRounds();

/* INPUT = {
    "state": [
        [
            1, 100, 10, 10, 1,
            2, 100, 10, 10, 2
        ],
        [
            1, 100, 10, 10, 1,
            2, 90, 10, 10, 2
        ],
        [
            1, 100, 10, 10, 1, 
            2, 90, 10, 10, 2
        ],
        [
            1, 100, 10, 10, 1,
            2, 80, 10, 10, 2
        ],
        [
            1, 90, 10, 10, 1,
            2, 80, 10, 10, 2
        ]
    ],
    "randomness": [
        [32, 8],
        [40, 50]
    ],
    "moves": [
      [
        3, 10, 98, 10, 1, 2, 
        3, 10, 98, 10, 1, 2
      ],  
      [
        3, 10, 98, 10, 1, 2,
        3, 10, 98, 10, 1, 2
      ]
    ]
} */

    // "player": [
    //     1, 100, 10, 10, 1, 
    //     1, 90, 10, 10, 1,
    //     1, 80, 10, 10, 1, 
    //     1, 70, 10, 10, 1
    // ],
    // "npc": [
    //     2, 100, 10, 10, 2,
    //     2, 90, 10, 10, 2,
    //     2, 80, 10, 10, 2, 
    //     2, 70, 10, 10, 2
    // ],


    //     "state": [
    //     //start state
    //     [
    //         1, 100, 10, 10, 1, //player
    //         2, 100, 10, 10, 2 //npc 
    //     ],
    //     //player 1 moves
    //     [
    //         1, 100, 10, 10, 1, //player
    //         2, 90, 10, 10, 2  //npc
    //     ],
    //     //npc moves, reach end state
    //     [
    //         1, 90, 10, 10, 1, //player
    //         2, 90, 10, 10, 2  //npc
    //     ]
    // ],
    // "randomness": [32, 8],
    // "moves": [
    //     3, 10, 98, 10, 1, 2, 
    //     3, 10, 98, 10, 1, 2
    // ]