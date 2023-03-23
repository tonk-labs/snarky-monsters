pragma circom 2.1.4;

include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/mux2.circom";

// outputs 0 if a <= b else 1

//5 -> 6
//category 2 vs 5
//randomness: 30
//4, 10, 98, 10, 2, 2
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

    signal output out;

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

    // will be equal to 1 if it's a health move, otherwise 0
    component isHealth = IsEqual();
    isHealth.in <== [move[movtypeoff], 1];

    component isUniversal = Mux2();
    isUniversal.c <== [0, 1, 1, 0]; //can't be both swap and health
    isUniversal.s <== [isHealth.out, isSwap.out];

    // log(isSwap.out);

    component pSwapMux = Mux1();
    pSwapMux.c <== [state[0][selfIndex + catoff], move[catoff]];
    pSwapMux.s <== isSwap.out * pMiss.out; //the player swap also has a miss chance, will be 0 if it's less than randomness

    // log(pSwapMux.out);

    component pCritMux = Mux2();
    pCritMux.c <== [0, state[0][selfIndex + atkoff]*2, 0, 0]; //this mux chooses whether to do a crit or not
    pCritMux.s <== [pCrit.out, endGameFlag.out];

    // log(pCritMux.out);
    
    //this mux chooses to match players category with itself if the category of the move is universal (ie. 0)
    //if pCatSelector is 1 (ie. move type is SWAP == 0) then the condition of 1,1 is undefined
    //00 10 01 11
    component pCatMux = Mux2(); 
    pCatMux.c <== [move[movcatoff], state[0][selfIndex + catoff], state[0][selfIndex + catoff], 10000];
    pCatMux.s <== [isUniversal.out, endGameFlag.out];

    // log(pCatMux.out);

    // log(isHealth.out);

    // assert the next category for the player matches the category of the current player state
    // unless there's a swap, in which case we want it to match the move cat, but only if swap is 1
    state[1][selfIndex + catoff] === pSwapMux.out;

    // assert the move cat matches the player category
    // log(state[0][selfIndex + catoff]);
    // log(pCatMux.out);
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

    // log(defeff);
    component defEffSelector = IsZero();
    defEffSelector.in <== defeff;
    component defEffMux = Mux1();
    defEffMux.c <== [state[0][otherIndex + defoff], 2];
    defEffMux.s <== defEffSelector.out;

    // log(pCritMux.out);
    // log(atkEffMux.out);
    // log(defEffMux.out);
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
    // log(state[1][otherIndex + hpoff]);

    state[1][otherIndex + hpoff] === KOMux.out;

    out <== KOMux.out;

}



// component main { public [ state, move, randomness, atkeff, defeff ] } = Turn(0, 5);
// component main = ManyRounds();

/* INPUT = {
        "state": [
            [
      2,
      100,
      10,
      5,
      2,
      1,
      100,
      10,
      5,
      1
    ],
    [
      2,
      100,
      10,
      5,
      2,
      1,
      72,
      10,
      5,
      1
    ]
        ],
        "move": [
            4,
      10,
      98,
      10,
      2,
      2
        ],
        "randomness": "30",
        "atkeff": "3",
        "defeff": "3"
    }*/