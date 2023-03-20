pragma circom 2.1.4;

include "chkhash.circom";
include "turn.circom";
include "rounds.circom";

template Game() {
    //hash of all the moves, randomness, and monster choices (the ids are hashed)
    //game hash is hashed as follows H(mon1,mon2,m1,m2,swap1,r1,r2,...mn-1,mn,swapn,rn-1,rn)
    signal input gameHash;
    //this is the game state in order of player -> npc -> player -> and so forth
    signal input state[26][10];
    //the moves for each turn, makes a transition to the next state
    signal input moves[25][6];
    //the shared randomness (we assume the randomness has already been clipped)
    signal input randomness[25];
    //the attack and defense effectiveness of each move
    //this is kind of a stupid hack
    //but I'm sure there's a more clever way to incorporate
    //the model more succinctly into the game rules
    signal input atkeff[25];
    signal input defeff[25];
    
    //included to prevent man-in-middle-attacks?
    signal input sessionID;

    signal output out;

    assert(sessionID != 0);

    component checkHash = CheckHash(25);
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
