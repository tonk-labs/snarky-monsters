var express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); 

const Queue = require('bull');

const PORT = process.env.PORT || 8080;
const HOST = '127.0.0.1';

const proofQueue = new Queue('proofs');

const spawnPromise = (cmd, args, cb) => {
    return new Promise((resolve, reject) => {
        let output;
        const child = spawn(cmd, args, {
            cwd: path.resolve(__dirname),
        });

        child.stdout.on('data', (data) => {
            output += data;
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
            code !== 0 ? reject(code) : resolve(data);
        });
    });
}

const generateWitness = async (gameId) => {
    const cmd = path.resolve('circuits','compiled','game_cpp','game')
    const witnessFile = path.resolve('games', `${gameId}.wtns`);
    const gameFile = path.resolve('games', `${gameId}.json`);
    await spawnPromise(game, [input, witness]);
    return witnessFile;
}

const generateProof = async (gameId) => {
    const witnessFile = path.resolve('games', `${gameId}.wtns`);
    const zkey = path.resolve('circuits', 'compiled', 'circuit_final');
    const proofPath = path.resolve('games', `${gameId}_proof.json`);
    const publicPath = path.resolve('games', `${gameId}_public.json`);
    await spawnPromise('snarkjs', ['pkp', zkey, witnessFile, proofPath, publicPath]);
    return { proofPath, publicPath };
}

const generateCallData = async (gameId) => {
    const proofPath = path.resolve('games', `${gameId}_proof.json`);
    const publicPath = path.resolve('games', `${gameId}_public.json`);
    return await spawnPromise('snarkjs', ['generatecall', publicPath, proofPath]);
}

var app = express();
app.use(cors());
app.use(express.json());

/**
 * Accepts the input.json as json, writes the file and then adds the job to a queue
 */
app.post('/prove', (req, res) => {
    const { input, gameId } = req.body;
    proofQueue.add(req.body);
})

proofQueue.process(async (job) => {
    const { input, gameId } = job.data;
    const gameFile = path.resolve('games', `${gameId}.json`);
    fs.writeFileSync(gameFile, input);
    let proofPath, publicPath, witnessFile;
    try {
        witnessFile = await generateWitness(gameId)
        const proofs = await generateProof(gameId);
        proofPath = proofs.proofPath;
        publicPath = proofs.publicPath;

        const calldata = generateCallData(gameId);


    } catch (e) {
        fs.unlink(gameFile);
        !!witnessFile && fs.unlink(witnessFile);
        !!proofPath && fs.unlink(proofPath);
        !!publicPath && fs.unlink(publicPath);

    }
})

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});


// ./circuits/compiled/game_cpp/game input.json witness.wtns
// snarkjs pkp circuits/compiled/circuit_final.zkey witness.wtns proof.json public.json
// snarkjs generatecall