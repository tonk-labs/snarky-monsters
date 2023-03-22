const { writeFile } = require('node:fs/promises');
const { mimcHashArray } = require("../src/hash.js");
const Model = require('../src/model.js');

const createEncodings = (states, moves, randomness, prevAtkEff, prevDefEff) => {
    let encodings = moves.map((move, i) => {
        const ithState = states[i];
        return [
            ithState[0],
            ithState[1],
            ithState[2],
            ithState[3],
            ithState[4],
            ithState[5],
            ithState[6],
            ithState[7],
            ithState[8],
            ithState[9],
            randomness[i],
            move[0],
            move[1],
            move[2],
            move[3],
            move[4],
            move[5],
            prevAtkEff[i],
            prevDefEff[i]
        ].reduce((prev, current) => {
            return prev + current.toString();
        });
    });

    const ithState = states[states.length - 1];
    encodings.push([
        ithState[0],
        ithState[1],
        ithState[2],
        ithState[3],
        ithState[4],
        ithState[5],
        ithState[6],
        ithState[7],
        ithState[8],
        ithState[9],
    ].reduce((prev, current) => {
        return prev + current.toString()
    }));

    return encodings;
}
/**
 * 
 * @param {*} engine 
 * @returns 
 */
const mockCircuitInput = async (engine) => {

    //pad the end appropriately
    while(engine.previousMoves.length < engine.moveLimit) {
        engine.turn(Model.Moves[Model.Moves.length - 1], 0);
    }

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

    stateArray.push([
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
        ]
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

    const encodings = createEncodings(stateArray, moveArray, engine.prevRandomness, engine.prevAtkEff, engine.prevDefEff)

    const encodingArray = encodings.reduce((prev, current) => {
        return prev.concat(BigInt(current));
    }, []);

    const gameHash = await mimcHashArray(encodingArray);
    

    const circuitInput = {
        gameHash,
        encodings,
        sessionID: sessionID,
        state: stateArray,
        randomness: engine.prevRandomness,
        moves: moveArray,
        atkeff: engine.prevAtkEff,
        defeff: engine.prevDefEff
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

module.exports = { writeGameState, createEncodings };

