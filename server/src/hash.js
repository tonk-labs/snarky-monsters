const { buildMimc7 } = require('circomlibjs');
const Engine = require('../src/engine.js');
const Model = require('../src/model.js');

/**
 * For (i = 0; i < NMoves; i++) {
    Hash(State_i), Hash(Randomness_i), Hash(Move_i), Hash(AttackEff_i), Hash(DefEff_i)
}

Hash(State_N+1) //hash the final state object

 */

/**
 * Outputs the MiMC Multihash of the game state necessary for the circuit input
 * @param {*} engine The engine should hold a completed game state. 
 */
const hashGameState = (engine) => {
    return buildMimc7().then((hasher) => {
        let gameArray = [];
        for (var i = 0; i < engine.moveLimit; i++) {
            const ithState = engine.previousState[i]; 
            const ithMove = engine.previousMoves[i];
            gameArray.push(...[
                ithState.player.id, 
                ithState.player.hp, 
                ithState.player.stats.attack,
                ithState.player.stats.defense,
                ithState.player.category,
                ithState.npc.id, 
                ithState.npc.hp, 
                ithState.npc.stats.attack,
                ithState.npc.stats.defense,
                ithState.npc.category,
                engine.prevRandomness[i],
                ithMove.id,
                ithMove.attack,
                ithMove.crit,
                ithMove.miss,
                ithMove.category,
                ithMove.type,
                engine.prevAtkEff[i],
                engine.prevDefEff[i]
            ])
        }
        gameArray.push(...[
            engine.player.id, 
            engine.player.hp, 
            engine.player.stats.attack,
            engine.player.stats.defense,
            engine.player.category,
            engine.npc.id, 
            engine.npc.hp, 
            engine.npc.stats.attack,
            engine.npc.stats.defense,
            engine.npc.category,
        ])


        console.log(gameArray);
        return hasher.multiHash(gameArray, 0);
    });
}

const engine = new Engine(2, 3, 3);

while(engine.previousMoves.length !== engine.moveLimit) {
    engine.turn(Model.Moves[Model.Moves.length - 1], 30);
}


hashGameState(engine).then((hash) => console.log(hash));


/**
 * 
 * Uint8Array(32) [
  180, 21,   3,  24, 180, 166, 247, 105,
  181, 87, 192,  94,  85, 108, 184, 191,
  129, 96, 226, 107, 115, 149, 118, 180,
  201, 19, 111, 108, 251,  18, 249,  31
]
 */