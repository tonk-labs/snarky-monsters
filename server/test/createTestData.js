
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