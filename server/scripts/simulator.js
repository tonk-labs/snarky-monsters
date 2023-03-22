#!/usr/bin/env node

const path = require('node:path');

const Engine = require('../src/engine.js');
const Model = require('../src/model.js');
const { writeGameState } = require('./genCircuitInput.js');

const program = require('inquirer');

const questionsFighter = [
    {
        type: 'input',
        name: 'fighter',
        message: 'Choose your fighter! [1-7]'
    }
]
const questionsMove = [
    {
        type: 'input',
        name: 'move',
        message: 'Choose your move! [0-3]'
    }
]

const WRITE_PATH = path.join(__dirname, 'input.json');

console.log('Welcome to Snarky Monsters Simulator!!');

console.log(`
DEGEN - 1
REGULATOR - 2
VC - 3
NORMIE - 4
AGI - 5
BITCOIN_MAXI - 6
MOON_MATHER - 7
`);
program.prompt(questionsFighter).then((answer) => {
    console.log("LET THE GAMES BEGIN!!!");

    const npcId = Math.floor(Math.random() * 7) + 1;
    console.log(`The NPC has chosen ${Model.CategoryNames[npcId]}`);

    var engine = new Engine(parseInt(answer.fighter), npcId, 25);

    function round(isPlayerMove, moveCount) {
        if (engine.player.hp === 0 || engine.npc.hp === 0){
            console.log("GAME OVER!")
            writeGameState(engine, WRITE_PATH);
            return;
        }
        console.log(`It's your move: ${isPlayerMove ? 'Player' : 'NPC'}`);
        const index = isPlayerMove ? engine.player.category : engine.npc.category;
        console.log(`
        SWAP - 0
        HEAL - 1
        ATTACK - 2
        CHANCE ATTACK - 3
        `)
        program.prompt(questionsMove).then((answer) => {
            const number = parseInt(answer.move);
            const pRand = Math.round(Math.random() * 100);
            var report;
            if (number === 0) {
                program.prompt(questionsFighter).then((answer) => {
                    report = engine.turn({
                        ...Model.Moves[0],
                        category: parseInt(answer.fighter),
                    }, pRand);
                    console.log("REPORT!!!", report);
                    console.log("Player: ", engine.player);
                    console.log("NPC: ", engine.npc);

                    if(moveCount === 25){
                        console.log("GAME OVER!")
                        return;
                    }

                    round(!isPlayerMove, moveCount + 1);
                })
                return;
            } else if (number === 1) {
                report = engine.turn(Model.Moves[1], pRand)
            } else if (number === 2) {
                report = engine.turn(Model.Moves[index * 2], pRand)
            } else if (number === 3) {
                report = engine.turn(Model.Moves[index * 2 + 1], pRand)
            }

            console.log("REPORT!!!", report);
            console.log("Player: ", engine.player);
            console.log("NPC: ", engine.npc);
            console.log("MOVE COUNT: ", moveCount)

            if(moveCount === 25){
                console.log("GAME OVER!")
                writeGameState(engine, WRITE_PATH);
                return;
            }
            round(!isPlayerMove, moveCount + 1);
        })
    }

    round(true, 0);
})
