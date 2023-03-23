const Model = require('./model.js');

/**
 * Just duplicate this for now 
 */
const calculateMoveEffectiveness = (target, source, move) => {
    if (move.category === 0 || move.type === Model.MoveTypes.SWAP) {
        return {
            atkEff: 1,
            defEff: 1,
        }
    } 
    if (move.type === Model.MoveTypes.END_GAME) {
        return {
            atkEff: 0,
            defEff: 0,
        }
    }

    const atkEff = Model.EffectivenessMatrix[source.category - 1][target.category - 1];
    const defEff = Model.EffectivenessMatrix[target.category - 1][source.category - 1];

    return {
        atkEff,
        defEff
    }
}

const selectEffectiveVariantFor = (category, effectiveness) => {
    var index = 0;
    var found = false;
    for (var cat = 0; cat < 7; cat++) {
        if (Model.EffectivenessMatrix[cat][category - 1] === effectiveness){
            found = true;
            break;
        }
        index += 1;
    }
    if (!found) {
        return selectEffectiveVariantFor(category, 3); //guaranteed
    }
    return index + 1;
}

const selectRandomNPC = () => {
    return Math.floor(Math.random() * 7) + 1;
}

/**
 * Core NPC logic
 * @param {} engine 
 */
const selectMove = (engine) => {
    const myHealth = engine.npc.hp;

    if (myHealth < 30 || (myHealth < 100 && Math.random() < 0.2)) {
        return Model.Moves[1]; //choose heal
    }

    const atkEff = Model.EffectivenessMatrix[engine.player.category - 1][engine.npc.category - 1];
    if (atkEff > 1 && Math.random() < 0.4) {
        let randomChoice = selectRandomNPC();
        if (Math.random() < 0.7 || randomChoice === engine.npc.category) {
            const e = Math.random() < 0.5 ? 2 : 3;
            randomChoice = selectEffectiveVariantFor(engine.player.category, e);
        }
        return {
            ...Model.Moves[0],
            category: randomChoice
        }
    }

    const attackOff = Math.random() < 0.3 ? 1 : 0;
    return Model.Moves[engine.npc.category * 2 + attackOff];
}

module.exports = {
    selectRandomNPC,
    selectMove
}