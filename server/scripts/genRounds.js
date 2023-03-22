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

