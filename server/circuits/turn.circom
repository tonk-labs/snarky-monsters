pragma circom 2.1.4;

include "circomlib/poseidon.circom";
include "circomlib/bitify.circom";
include "circomlib/mux1.circom";
include "circomlib/comparators.circom";
include "circomlib/mux2.circom";

// include "https://github.com/0xPARC/circom-secp256k1/blob/master/circuits/bigint.circom";

// outputs 0 if a <= b else 1
template LEQ() {
    signal input a;
    signal input b;
    signal output out;
    var result = b - a;

    component bits = Num2Bits_strict();
    bits.in <== result;

    out <== bits.out[253];
}

template Turn (selfIndex, otherIndex) {
    //rounds, size(monster)*2
    signal input state[2][10];
    signal input move[6];
    signal input randomness;
    signal input atkeff;
    signal input defeff;

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

    component endGameFlag = IsEqual();
    endGameFlag.in <== [move[movtypeoff], 6];
   
    component pMiss = LEQ(); //used for miss
    pMiss.a <== randomness;
    pMiss.b <== move[movmissoff];

    component pCrit = LEQ(); //used for crit
    pCrit.a <== randomness;
    pCrit.b <== move[movcritoff];

    //isSwap will be 1 if true, 0 if not
    component isSwap = IsZero();
    isSwap.in <== move[movtypeoff];

    // log(isSwap.out);

    component pSwapMux = Mux1();
    pSwapMux.c <== [state[0][selfIndex + catoff], move[catoff]];
    pSwapMux.s <== isSwap.out * pMiss.out; //the player swap also has a miss chance, will be 0 if it's less than randomness

    // log(pSwapMux.out);

    component pCritMux = Mux2();
    pCritMux.c <== [0, state[0][selfIndex + atkoff]*2, 0, 0]; //this mux chooses whether to do a crit or not
    pCritMux.s <== [pCrit.out, endGameFlag.out];

    // log(pCritMux.out);

    component pCatSelector = IsZero();
    pCatSelector.in <== move[movcatoff];
    component pCatMux = Mux1(); //this mux chooses to match players category with itself if the category of the move is universal (ie. 0)
    pCatMux.c <== [state[0][selfIndex + catoff], move[movcatoff]];
    pCatMux.s <== pCatSelector.out;

    // log(pCatMux.out);

    // will be equal to 1 if it's a health move, otherwise 0
    component isHealth = IsEqual();
    isHealth.in <== [move[movtypeoff], 1];

    // log(isHealth.out);

    // assert the next category for the player matches the category of the current player state
    // unless there's a swap, in which case we want it to match the move cat, but only if swap is 1
    state[1][selfIndex + catoff] === pSwapMux.out;

    // assert the move cat matches the player category
    state[0][selfIndex + catoff] === pCatMux.out;

    // HEALING checks
    var boostedHP = state[0][selfIndex + hpoff] + (move[movatkoff]) * pMiss.out;
    component hpCheck = LEQ();
    hpCheck.a <== 100;
    hpCheck.b <== boostedHP;

    component healthCapMux = Mux1();
    healthCapMux.c <== [100, boostedHP];
    healthCapMux.s <== hpCheck.out;

    component selfMux = Mux1();
    
    var selfHP = state[0][selfIndex + hpoff];
    selfMux.c <== [selfHP, healthCapMux.out];
    selfMux.s <== isHealth.out;

    //assert the next iteration of player health fits the constraint
    state[1][selfIndex + hpoff] === selfMux.out;

    //ATTACK checks    

    component atkEffSelector = IsZero();
    atkEffSelector.in <== atkeff;
    component atkEffMux = Mux1();
    atkEffMux.c <== [move[movatkoff] * atkeff, 2];
    atkEffMux.s <== atkEffSelector.out;

    component defEffSelector = IsZero();
    defEffSelector.in <== defeff;
    component defEffMux = Mux1();
    defEffMux.c <== [state[0][otherIndex + defoff], 2];
    defEffMux.s <== defEffSelector.out;

    component targetMux = Mux1();
    var reducedHP = state[0][otherIndex + hpoff] - (pCritMux.out + atkEffMux.out - defEffMux.out) * pMiss.out;
    var sameHP = state[0][otherIndex + hpoff];
    targetMux.c <== [reducedHP, sameHP];
    targetMux.s <== isHealth.out;

    // log(targetMux.out);

    //in the instance that def is bigger than the attack, the attack becomes useless
    
    component noDiceMux = Mux1();
    component defBigger = LEQ();    
    defBigger.a <== pCritMux.out + atkEffMux.out;
    defBigger.b <== defEffMux.out;

    noDiceMux.c <== [state[1][otherIndex + hpoff], targetMux.out];
    noDiceMux.s <== defBigger.out;

    //flatline to 0 if we've reached end game state
    component bits = Num2Bits_strict();
    bits.in <== noDiceMux.out;

    component KOMux = Mux1();
    KOMux.c <== [noDiceMux.out, 0];
    KOMux.s <== bits.out[253];

    // log(KOMux.out);

    state[1][otherIndex + hpoff] === KOMux.out;

}

template ManyRounds() {
    signal input state[6][10];
    signal input randomness[4];
    signal input moves[4][6];
    signal input atkeff[4];
    signal input defeff[4];
    
    component t1 = Turn(0, 5);
    component t2 = Turn(5, 0);
    component t3 = Turn(0, 5);
    component t4 = Turn(5, 0);

    t1.state <== [state[0], state[1]];
    t1.randomness <== randomness[0];
    t1.move <== moves[0];
    t1.atkeff <== atkeff[0];
    t1.defeff <== defeff[0];

    t2.state <== [state[1], state[2]];
    t2.randomness <== randomness[1];
    t2.move <== moves[1];
    t2.atkeff <== atkeff[1];
    t2.defeff <== defeff[1];
    
    t3.state <== [state[2], state[3]];
    t3.randomness <== randomness[2];
    t3.move <== moves[2];
    t3.atkeff <== atkeff[2];
    t3.defeff <== defeff[2];

    t4.state <== [state[3], state[4]];
    t4.randomness <== randomness[3];
    t4.move <== moves[3];
    t4.atkeff <== atkeff[3];
    t4.defeff <== defeff[3];
}



// component main { public [ ] } = Example();
// component main = ManyRounds();

/* INPUT = {
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
        ]
    ],
    "randomness": [32, 8, 40, 50],
    "moves": [
        [3, 5, 98, 10, 6, 2],
        [5, 5, 98, 10, 2, 2],
        [3, 5, 98, 10, 6, 2],
        [3, 5, 98, 10, 6, 2]
    ],
    "atkeff": [3, 0, 3, 1],
    "defeff": [0, 1, 0, 1]
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
        //     [32, 8],
        // [40, 50]
    // "randomness": [32, 8],
    // "moves": [
    //     3, 10, 98, 10, 1, 2, 
    //     3, 10, 98, 10, 1, 2
    // ]