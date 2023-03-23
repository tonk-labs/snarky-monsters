pragma circom 2.1.4;

include "../node_modules/circomlib/circuits/mimc.circom";

// Here we will check the hash, and set k = 0 everytime. 
// We don't actually care about the security of the hash, 
// it's really more of an encoding of the game state
//game hash is hashed as follows H(mon1,mon2,m1,m2,swap1,r1,r2,...mn-1,mn,swapn,rn-1,rn)
template CheckHash(nMoves) {
    signal input encodings[nMoves];

    signal output hash;

    component hasher = MultiMiMC7(nMoves, 91);
    for (var i = 0; i < nMoves; i++) {
        hasher.in[i] <== encodings[i];
    }

    hasher.k <== 0;

    // log(hasher.out);
    hash <== hasher.out;
}