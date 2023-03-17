pragma circom 2.1.4;

include "model.circom";

//for now player move goes first, then npc move, every round
template Move () {
    signal input pm;
    signal input nm;
    signal input pr;
    signal input nr;
    signal input player[5];
    signal input npc[5];
    signal input playerChoice;
    signal input npcChoice;

    var fpm = getMoveForId(pm);
    var fnm = getMoveForId(nm);

    
}

/**
 * Just gonna simply check if its a win or not
 */
template Rounds (nRounds) {
    
    var nMoves = nRounds * 2;
    signal input moveSeq[nMoves];
    signal input randomness[nMoves];
    signal input playerChoice;
    signal input npcChoice;

    var player[5] = getMonsterForId(playerChoice);
    var npc[5] = getMonsterForId(npcChoice);
    
    for (var i = 0; i < nRounds; i++) {
        var slide = i * 2;
        var playerMove = moveSeq[slide];
        var npcMove = moveSeq[slide + 1];
        var playerRandomness = randomness[slide];
        var npcRandomness = randomness[slide + 1];


    }
}

