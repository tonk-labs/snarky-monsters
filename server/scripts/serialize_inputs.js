// this is a utility script to serialize the state models for input into the circuits
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

async function parseIn() {
  // Use the first argument as input
  const argInput = args[0];
  // Do something with the input
  console.log(`Input path is: ${argInput}`);

  const inputPath = path.join(process.cwd(), argInput);

  const content = await readFile(inputPath, { encoding: 'utf8' });
  return JSON.parse(content);
}

function reformatJson(game) {
  outputJson = {
    moves: [],
    monsters: [],
  }

  outputJson.monsters = game.Monsters.map((monster, i) => {
    return [
      monster.id,
      monster.hp,
      monster.stats.attack,
      monster.stats.defense,
      monster.category
    ];
  });

  outputJson.moves = game.Moves.map((move, i) => {
    return [
      move.id,
      move.attack,
      move.crit,
      move.miss,
      move.category,
    ]
  });

  return outputJson;
}

async function writeOut(formattedJson) {
  const argOutput = args[1];
  const outputPath = path.join(process.cwd(), argOutput);
  console.log(`Output path is: ${argOutput}`);


  writeFile(outputPath, JSON.stringify(formattedJson), { encoding: 'utf8' });
}

async function run() {
  const game = await parseIn();
  const formattedJson = reformatJson(game);
  await writeOut(formattedJson)
}


run();

