// this is a utility script to serialize the state models for use in the circuits
const { readFile, writeFile } = require('node:fs/promises');
const path = require('node:path');


// Get the command line arguments
// input_path is to a json file of the game model, output_path writes the json input ready for the circom file
// expected input is ./serialize_inputs [input_path] [output_path]
const args = process.argv.slice(2);

// Check if any arguments were provided
if (args.length === 0) {
  console.log('Please provide some input!');
  process.exit(1);
}

/**
 * Parses in the game JSON from the input path
 * 
 * @returns Object 
 */
async function parseIn() {
  // Use the first argument as input
  const argInput = args[0];
  // Do something with the input
  console.log(`Input path is: ${argInput}`);

  const inputPath = path.join(process.cwd(), argInput);

  const content = await readFile(inputPath, { encoding: 'utf8' });
  return JSON.parse(content);
}


/**
 * Old function I was using to test inputs on zkREPL
 * Can remove later if it's useless??
 * @param {*} game 
 * @returns 
 */
function serializeForSignalInput(game) {
  outputJson = {
    moves: [],
    monsters: [],
  }

  outputJson.monsters = game.Monsters.reduce((newArr, monster) => {
    newArr.push(
      monster.id,
    )
    newArr.push(
      monster.hp,
    )
    newArr.push(
      monster.stats.attack,
    )
    newArr.push(
      monster.stats.defense,
    )
    newArr.push(
      monster.category
    )
    return newArr;
  }, []);

  outputJson.moves = game.Moves.reduce((newArr, move) => {
    newArr.push(
      move.id,
    )
    newArr.push(
      move.attack,
    )
    newArr.push(
      move.crit,
    )
    newArr.push(
      move.miss,
    )
    newArr.push(
      move.category,
    )
    newArr.push(
      move.type,
    )
    return newArr;
  }, []);

  return outputJson;
}

const GenerateCircomTemplate = (monsterMat, moveMat) => `pragma circom 2.1.4;

// f(type -> type) testing if first type is effective against second
function effectivenessAgainst(t1, t2) {

  // values of effectiveness for each class of character
  // sort of a psuedo matrix

  var degen[7] = [1, 0, 3, 2, 1, 1, 1];
  var reg[7] =   [3, 1, 1, 2, 1, 0, 1];
  var vc[7] =    [0, 1, 1, 1, 3, 2, 1];
  var norm[7] =  [1, 1, 2, 1, 1, 3, 0];
  var agi[7] =   [1, 2, 0, 1, 1, 1, 3];
  var btcm[7] =  [1, 3, 1, 0, 1, 1, 2];
  var mm[7] =    [1, 2, 1, 3, 0, 1, 1];

  if (t1 == 1) {
    return degen[t2 - 1];

  } else if (t1 == 2) {
    return reg[t2 - 1];

  } else if (t1 == 3) {
    return vc[t2 - 1];

  } else if (t1 == 4) {
    return norm[t2 - 1];

  } else if (t1 == 5) {
    return agi[t2 - 1];

  } else if (t1 == 6) {
    return btcm[t2 - 1];

  } else if (t1 == 7) {
    return mm[t2 - 1];

  } else {
    return -1;
  }
}

function getMonsterForId(i) {
  ${monsterMat}
  var monster[5];
  var index = i*5;
  monster[0] = Monsters[index];
  monster[1] = Monsters[index+1];
  monster[2] = Monsters[index+2];
  monster[3] = Monsters[index+3];
  monster[4] = Monsters[index+4];

  return monster;
}

function getMoveForId(i) {
  ${moveMat}
  var move[6];
  var index = i*6;
  move[0] = Moves[index];
  move[1] = Moves[index+1];
  move[2] = Moves[index+2];
  move[3] = Moves[index+3];
  move[4] = Moves[index+4];
  move[5] = Moves[index+5];

  return move;
}
`

/**
 * Prepares to write out the circom file 
 * @param {Object} game 
 */
function stringifyToCircom(game) {
  let monsterMat = `//id, hp, attack, defense, category
var Monsters[${game.Monsters.length * 5}] = [` + '\n';
  game.Monsters.map((monster, i) => {
    monsterMat += `\t\t${monster.id}, ${monster.hp}, ${monster.stats.attack}, ${monster.stats.defense}, ${monster.category}${i === game.Monsters.length - 1 ? '' : ','}`;
    monsterMat += '\n';
  });
  monsterMat += '];\n\n'

  let moveMat = `//id, attack, crit, miss, category, type
var Moves[${game.Moves.length * 6}] = [` + '\n';
  game.Moves.map((move, i) => {
    moveMat += `\t\t${move.id}, ${move.attack}, ${move.crit}, ${move.miss}, ${move.category}, ${move.type}${i === game.Moves.length - 1 ? '' : ','}`;
    moveMat += '\n';
  });

  moveMat += '];';
  return GenerateCircomTemplate(monsterMat, moveMat);
}


function createRoundsFile(numberOfMoves) {
  let template = `pragma circom 2.1.4;

template Rounds() {
  signal input state[${numberOfMoves + 1}][10];
  signal input randomness[${numberOfMoves}];
  signal input moves[${numberOfMoves}][6];
  signal input atkeff[${numberOfMoves}];
  signal input defeff[${numberOfMoves}];

  signal output out;

`

  for (let i = 0; i < numberOfMoves; i++) {
    template += `  component t${i} = Turn(${i % 2 == 0 ? '0, 5' : '5, 0'});\n`
  }

  for (let i = 0; i < numberOfMoves; i++) {
    template += `
  t${i}.state <== [state[${i}], state[${i + 1}]];
  t${i}.randomness <== randomness[${i}];
  t${i}.move <== moves[${i}];
  t${i}.atkeff <== atkeff[${i}];
  t${i}.defeff <== defeff[${i}];

`;
  }

  template += `
  out <== t${numberOfMoves - 1}.out;
}`

  return template;
}


/**
 * Just writes out the content to the output path 
 * @param {String} content 
 */
async function writeOut(content) {
  const argOutput = args[1];
  const outputPath = path.join(process.cwd(), argOutput);


  console.log(`Output path is: ${argOutput}`);


  writeFile(outputPath, content);
}

async function run() {
  // const game = await parseIn();
  // const circomText = stringifyToCircom(game);
  const circomText = createRoundsFile(25);
  await writeOut(circomText)
}


run();

