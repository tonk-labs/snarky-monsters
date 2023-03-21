const { writeFile } = require('node:fs/promises');
const { hashGameState } = require("../src/hash.js");
const Model = require('../src/model.js');

/**
 * 
 * @param {*} engine 
 * @returns 
 */
const mockCircuitInput = async (engine) => {

    //pad the end appropriately
    while(engine.previousMoves.length !== engine.moveLimit) {
        engine.turn(Model.Moves[Model.Moves.length - 1], 0);
    }

    const { gameHash, gameEncoding } = await hashGameState(engine);
    const sessionID = "0241008287272164729465721528295504357972";

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
        // gameEncoding,
        // gameHash,
        sessionID: sessionID,
        state: stateArray,
        randomness: engine.prevRandomness,
        moves: moveArray,
        atkeff: engine.prevAtkEff,
        defeff: engine.prevAtkEff
    }

    return JSON.stringify(circuitInput, null, 2);
}

/**
 * 
 * @param {*} engine 
 * @param {*} writePath 
 */
async function writeGameState (engine, writePath) {
    const json = await mockCircuitInput(engine)
    try {
        await writeFile(writePath, json);
    } catch (e) {
        console.error(e);
    }
}

module.exports = { writeGameState };

