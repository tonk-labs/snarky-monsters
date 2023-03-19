const {CircomJS} = require("@zefi/circomjs")
const process = require('process')
const path = require('path')

const serverDir = path.join(__dirname, '..');
process.chdir(serverDir)

const circomjs = new CircomJS();

const main = async() => {
    const circomjs = new CircomJS()    
    const game =  circomjs.getCircuit("game")    

    // important to await compilation, before running circuit.genProof()
    await game.compile()

    // const input = {
    //     x: 3,
    //     y: 5
    // }

    // const proof = await circuit.genProof(input);
    // console.log("proof verification result ----->",await circuit.verifyProof(proof))
}

main()
