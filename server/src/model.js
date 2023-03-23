// this file holds the model in a convenient JS format and comes with a convenient serialization function

//This structure mostly for record keeping
const Category = {
  UNIVERSAL: 0,
  DEGEN: 1,
  REGULATOR: 2,
  VC: 3,
  NORMIE: 4,
  AGI: 5,
  BITCOIN_MAXI: 6,
  MOON_MATHER: 7,
}

const MoveTypes = {
  SWAP: 0,
  HEAL: 1,
  ATTACK: 2,
  BUFF: 3,
  NERF: 4,
  END_GAME: 6,
}

const Moves = [
  {
    id: 0,
    attack: 0,
    crit: 100, // crits occur if the crit number is less than the randomness
    miss: 50, // misses occur if the randomness is less than the miss number
    category: Category.UNIVERSAL,
    name: 'Re-train',
    type: MoveTypes.SWAP,
  },
  {
    id: 1,
    attack: 10,
    crit: 100,
    miss: 10,
    category: Category.UNIVERSAL,
    name: 'Heal',
    type: MoveTypes.HEAL,
  },
  // {
  //   id: 2,
  //   attack: 15,
  //   crit: 97,
  //   miss: 0,
  //   category: Category.UNIVERSAL,
  //   type: MoveTypes.ATTACK,
  // },
  {
    id: 2,
    attack: 10,
    crit: 97,
    miss: 10,
    category: Category.DEGEN,
    name: 'Diamond Hands',
    type: MoveTypes.ATTACK,
  },
  {
    id: 3,
    attack: 20,
    crit: 97,
    miss: 60,
    category: Category.DEGEN,
    name: 'Ape In',
    type: MoveTypes.ATTACK,
  },
  {
    id: 4,
    attack: 10,
    crit: 97,
    miss: 10,
    category: Category.REGULATOR,
    name: 'Use CBDC',
    type: MoveTypes.ATTACK,
  },
  {
    id: 5,
    attack: 20,
    crit: 97,
    miss: 60,
    category: Category.REGULATOR,
    name: 'Wanton Arrest',
    type: MoveTypes.ATTACK,
  },
  {
    id: 7,
    attack: 20,
    crit: 97,
    miss: 10,
    category: Category.VC,
    name: 'Take 10%',
    type: MoveTypes.ATTACK,
  },
  {
    id: 8,
    attack: 20,
    crit: 97,
    miss: 60,
    category: Category.VC,
    name: 'FOMO',
    type: MoveTypes.ATTACK,
  },
  {
    id: 9,
    attack: 20,
    crit: 97,
    miss: 10,
    category: Category.NORMIE,
    name: 'Soul Cycle',
    type: MoveTypes.ATTACK,
  },
  {
    id: 10,
    attack: 20,
    crit: 97,
    miss: 60,
    category: Category.NORMIE,
    name: 'Boozy Brunch',
    type: MoveTypes.ATTACK,
  },
  {
    id: 11,
    attack: 20,
    crit: 97,
    miss: 10,
    category: Category.AGI,
    name: 'Flash Crash',
    type: MoveTypes.ATTACK,
  },
  {
    id: 12,
    attack: 20,
    crit: 97,
    miss: 60,
    category: Category.AGI,
    name: 'Unleash Waluigi',
    type: MoveTypes.ATTACK,
  },
  {
    id: 13,
    attack: 20,
    crit: 97,
    miss: 10,
    category: Category.BITCOIN_MAXI,
    name: 'Angry Tweet',
    type: MoveTypes.ATTACK,
  },
  {
    id: 14,
    attack: 20,
    crit: 97,
    miss: 60,
    category: Category.BITCOIN_MAXI,
    name: 'Hard Fork',
    type: MoveTypes.ATTACK,
  },
  {
    id: 15,
    attack: 20,
    crit: 97,
    miss: 10,
    category: Category.MOON_MATHER,
    name: 'PlonK',
    type: MoveTypes.ATTACK,
  },
  {
    id: 16,
    attack: 20,
    crit: 97,
    miss: 60,
    category: Category.MOON_MATHER,
    name: 'Brute Force',
    type: MoveTypes.ATTACK,
  },
  {
    //end game component also has id 6 :\ but we don't really use ID so...
    //we're mostly just indexing into this array by category
    //which is whack, actually
    id: 6,
    attack: 0,
    crit: 0,
    miss: 0,
    category: Category.UNIVERSAL,
    type: MoveTypes.END_GAME,
  },
]

const Monsters = [
  {
    id: 1,
    hp: 100,
    stats: {
      attack: 10,
      defense: 5,
    },
    category: Category.DEGEN,
    categoryName: 'Degen',
  },
  {
    id: 2,
    hp: 100,
    stats: {
      attack: 10,
      defense: 5,
    },
    category: Category.REGULATOR,
    categoryName: 'Regulator',
  },
  {
    id: 3,
    hp: 100,
    stats: {
      attack: 10,
      defense: 5,
    },
    category: Category.VC,
    categoryName: 'Venture Capitalist',
  },
  {
    id: 4,
    hp: 100,
    stats: {
      attack: 10,
      defense: 5,
    },
    category: Category.NORMIE,
    categoryName: 'Normie',
  },
  {
    id: 5,
    hp: 100,
    stats: {
      attack: 10,
      defense: 5,
    },
    category: Category.AGI,
    categoryName: 'Artificial General Intelligence',
  },
  {
    id: 6,
    hp: 100,
    stats: {
      attack: 10,
      defense: 5,
    },
    category: Category.BITCOIN_MAXI,
    categoryName: 'Bitcoin Maxi',
  },
  {
    id: 7,
    hp: 100,
    stats: {
      attack: 10,
      defense: 5,
    },
    category: Category.MOON_MATHER,
    categoryName: 'Moon Mather',
  },
]

const CategoryNames = {
  1: 'Degen',
  2: 'Regulator',
  3: 'Venture Capitalist',
  4: 'Normie',
  5: 'Artificial General Intelligence',
  6: 'Bitcoin Maxi',
  7: 'Moon Mather',
}

const MoveNames = {
  0: 'Re-train',
  1: 'Heal',
  3: 'Diamond Hands',
  4: 'Ape In',
  5: 'Use CBDC',
  6: 'Wanton Arrest',
  7: 'Take 10%',
  8: 'FOMO',
  9: 'Soul Cycle',
  10: 'Boozy Brunch',
  11: 'Flash Crash',
  12: 'Unleash Waluigi',
  13: 'Angry Tweet',
  14: 'Hard Fork',
  15: 'PlonK',
  16: 'Brute Force',
}

const MoveTypeNames = {
  0: 'Re-train',
  1: 'Heal',
  2: 'Attack',
  3: 'Buff',
  4: 'Nerf',
}

const degen = [1, 0, 3, 2, 1, 1, 1]
const reg =   [3, 1, 1, 2, 1, 0, 1]
const vc =    [0, 1, 1, 1, 3, 2, 1]
const norm =  [1, 1, 2, 1, 1, 3, 0]
const agi =   [1, 2, 0, 1, 1, 1, 3]
const btcm =  [1, 3, 1, 0, 1, 1, 2]
const mm =    [1, 2, 1, 3, 0, 1, 1]

const EffectivenessMatrix = [degen, reg, vc, norm, agi, btcm, mm]

const Game = {
  Monsters: Monsters,
  Moves: Moves,
  EffectivenessMatrix: EffectivenessMatrix,
  MoveTypes: MoveTypes,
  Category: Category,
  MoveNames: MoveNames,
  CategoryNames: CategoryNames,
  MoveTypeNames: MoveTypeNames,
}

// // this is a utility script to serialize the state models for input into the circuits
// const { writeFile } = require('node:fs/promises')
// const path = require('node:path')

// // Get the command line arguments
// // input_path is to a json file of the game model, output_path writes the json input ready for the circom file
// // expected input is ./model [output_path]
// const args = process.argv.slice(2)

// // Check if any arguments were provided
// if (args.length === 0) {
//   console.log('Please provide some input!')
//   process.exit(1)
// }

// try {
//   const argOutput = args[0]
//   const outputPath = path.join(process.cwd(), argOutput)
//   console.log(outputPath)

//   console.log(JSON.stringify(Game))

//   writeFile(outputPath, JSON.stringify(Game), { encoding: 'utf8' })
// } catch (e) {
//   console.log(e)
// }

module.exports = Game
