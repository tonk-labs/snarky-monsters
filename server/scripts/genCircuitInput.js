const { writeFile } = require('node:fs/promises');
const { hashGameState } = require("../src/hash.js");
const Model = require('../src/model.js');

/**
 * 
 * @param {*} engine 
 * @returns 
 */
const mockCircuitInput = (engine) => {

    //pad the end appropriately
    while(engine.previousMoves.length !== engine.moveLimit) {
        engine.turn(Model.Moves[Model.Moves.length - 1]);
    }

    const gameHash = hashGameState(engine);
    const sessionId = "9068058a-e432-4a2a-beaa-6b278e2bd481";

    let stateArray = engine.previousState.map((state) => {
        return [
            state.player.id, 
            state.player.hp, 
            state.player.stats.attack,
            state.player.stats.defense,
            state.player.category,
            state.npc.id, 
            state.npc.hp, 
            state.npc.stats.attack,
            state.npc.stats.defense,
            state.npc.category,
        ]
    });

    stateArray.push(
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
    );

    let moveArray = engine.previousMoves.map((move) => {
        return [
            move.id,
            move.attack,
            move.crit,
            move.miss,
            move.category,
            move.type,
        ]
    });

    const circuitInput = {
        state: stateArray,
        randomness: engine.previousRandomness,
        moves: moveArray,
        atkEff: engine.prevAtkEff,
        defEff: engine.prevAtkEff
    }

    return JSON.stringify(circuitInput, null, 2);
}

/**
 * 
 * @param {*} engine 
 * @param {*} writePath 
 */
async function writeGameState (engine, writePath) {
    const json = mockCircuitInput(engine);
    await writeFile(outputPath, content);
}

module.exports = { writeGameState };

