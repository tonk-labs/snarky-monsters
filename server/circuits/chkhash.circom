pragma circom 2.1.4;

include "circomlib/mimc.circom";

// Here we will check the hash, and set k = 0 everytime. 
// We don't actually care about the security of the hash, 
// it's really more of an encoding of the game state
//game hash is hashed as follows H(mon1,mon2,m1,m2,swap1,r1,r2,...mn-1,mn,swapn,rn-1,rn)
template CheckHash(nMoves) {
    signal input state[nMoves + 1][10];
    signal input moves[nMoves][6];
    signal input randomness[nMoves];
    signal input atkeff[nMoves];
    signal input defeff[nMoves];

    signal output hash;

    component hasher = MultiMiMC7((nMoves*19 + 10), 5);
    var stateIndex = 0;
    var hi = 0;
    for (var m = 0; m < nMoves; m++) {
      for (var s = 0; s < 10; s++) {
        hasher.in[hi] <== state[m][s];
        hi += 1;
      }      
      hasher.in[hi] <== randomness[m];
      hi += 1;
      for (var mo = 0; mo < 6; mo++) {
        hasher.in[hi] <== moves[m][mo];
        hi += 1;
      }      
      hasher.in[hi] <== atkeff[m];
      hi += 1;
      hasher.in[hi] <== defeff[m];
      hi += 1;
      stateIndex += 1;
    }

    for (var s = 0; s < 10; s++) {
      hasher.in[hi] <== state[stateIndex][s];
      hi += 1;
    }      

    hasher.k <== 0;

    // log(hasher.out);
    hash <== hasher.out;
}