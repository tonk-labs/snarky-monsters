var express = require('express')
const cors = require('cors')
const storage = require('node-persist')
// var { graphqlHTTP } = require('express-graphql');
// var { buildSchema } = require('graphql');
const Model = require('./src/model.js')
const {
  generateRandomness,
  createEncryptedSecret,
  decryptSecret,
  calculateCombinedRandomness,
} = require('./src/hash')
const Engine = require('./src/engine.js')
const NpcBrain = require('./src/npcBrain.js')
const { generateUUID } = require('./src/helpers.js')

const Game = {
  engine: null,
  commit: null,
  rand: null,
  key: null,
  move: null,
  lastConfirmedMove: null,
  lastCommitByPlayer: false,
  numMoves: 0,
}

const DebugLogs = true;

const debugLogger = (statement) => {
  if (DebugLogs) {
    console.log(statement)
  }
}

function createServer() {
  var app = express()
  app.use(cors())

  storage.init({
    dir: 'storage/game',
  })

  app.use(express.json())
  const restRouter = express.Router()
  restRouter.get('/', (req, res) => {
    res.send({ text: 'ping' })
  })

  /**
   *
   */
  restRouter.post('/play', (req, res) => {
    const { playerState } = req.body;
    try {
      debugLogger(`req.body for /play ${JSON.stringify(req.body, null, 2)}`)
      const gameId = generateUUID();
      const npcId = NpcBrain.selectRandomNPC();
      const engine = new Engine(playerState.category, npcId, 25);
      storage.setItem(gameId, { ...Game, engine });
      debugLogger(`return for /play ${JSON.stringify({ gameId, npcState: engine.npc })}`)
      res.send({
        gameId,
        npcState: engine.npc,
      });
    } catch (e) {
      res.status(500);
      res.send({ error: "Failed with unknown error, check server logs"});
    }
  });

  // restRouter.get('/play/:gameId', (req, res) => {
  //   storage.getItem(req.params.gameId).then((data) => {
  //     const engine = Engine.fromJSON(data.engine)
  //     res.send({
  //       gameId: req.params.gameId,
  //       playerState: engine.player,
  //       npcState: engine.npc,
  //     });
  //   });
  // });

  const respondEndGame = (res, game) => {
    if (game.numMoves >= 25 || game.engine.npc.hp === 0 || game.engine.player.hp === 0) {
      res.send({
        goodGame: true,
      })
      return true
    }
    return false
  }

  /**
   * Player commits or asks for NPC commit
   */
  restRouter.post('/battle/commit', (req, res) => {
    const { playerMove, commitRandomness, gameId } = req.body
    debugLogger(`req.body for /battle/commit ${JSON.stringify(req.body)}`)
    // asking NPC for commit
    if (!playerMove) {
      storage.getItem(gameId).then((game) => {

        try {
          if (respondEndGame(res, game)) {
            return
          }
          if (!game.lastCommitByPlayer) {
            res.status(400);
            res.send({ error: "The player needs to first open their commit"})
            return;
          }
          // the player
          const engine = Engine.fromJSON(game.engine)
          const npcMove = NpcBrain.selectMove(engine)
          const commit = createEncryptedSecret()

          storage.setItem(gameId, {
            ...game,
            key: commit.key,
            commit: commit.ciphertext,
            move: npcMove,
            lastCommitByPlayer: false,
          })
          debugLogger(`return for /battle/commit ${JSON.stringify({
            commitRandomness: commit.ciphertext,
            move: npcMove,
            lastConfirmedMove: game.lastConfirmedMove,
            numMoves: game.numMoves,
          })}`)

          res.send({
            commitRandomness: commit.ciphertext,
            move: npcMove,
            lastConfirmedMove: game.lastConfirmedMove,
            numMoves: game.numMoves,
          })
        } catch (e) {
          res.status(500);
          res.send({ error: "Failed with unknown error, check server logs"});
        }

      })
      // player is making a commitment
    } else {
      const randomness = generateRandomness()
      storage.getItem(gameId).then((game) => {
        try {
          if (respondEndGame(res, game)) {
            return
          }
          if (game.lastCommitByPlayer) {
            res.status(400);
            res.send({ error: "The npc needs to first open their commit"})
            return;
          }
          storage.setItem(gameId, {
            ...game,
            commit: commitRandomness,
            move: playerMove,
            rand: randomness,
            lastCommitByPlayer: true,
          })
          debugLogger(`return for /battle/commit ${JSON.stringify({
            randomness,
            lastConfirmedMove: game.lastConfirmedMove,
            numMoves: game.numMoves,
          })}`);
          res.send({
            randomness,
            lastConfirmedMove: game.lastConfirmedMove,
            numMoves: game.numMoves,
          })
        } catch (e) {
          res.status(500);
          res.send({ error: "Failed with unknown error, check server logs "});
        }
      })
    }
  })

  restRouter.post('/battle/open', (req, res) => {
    const { key, randomness, gameId } = req.body
    debugLogger(`req.body for /battle/open ${JSON.stringify(req.body)}`)

    // we are opening the players move
    storage.getItem(gameId).then((game) => {
      if (respondEndGame(res, game)) {
        return
      }
      if (!key && game.lastCommitByPlayer) {
        res.status(400)
        res.send({
          error:
            'The player needs to first open its commitment by sending a key',
        })
        return
      }
      if (!randomness && !game.lastCommitByPlayer) {
        res.status(400)
        res.send({
          error:
            'The player needs to contribute randomness for npc to open commitment',
        })
        return
      }

      try {
        const k = key ? key : game.key
        const rand = randomness ? randomness : game.rand
        const d = decryptSecret(k, game.commit)
        const engine = Engine.fromJSON(game.engine)
        const r = calculateCombinedRandomness(d, rand)
        engine.turn(game.move, r)
        storage.setItem(gameId, {
          ...Game,
          engine,
          lastConfirmedMove: game.move,
          numMoves: game.numMoves + 1,
          lastCommitByPlayer: game.lastCommitByPlayer,
        })
        debugLogger(`return for /battle/open ${JSON.stringify({
          lastConfirmedMove: game.move,
          numMoves: game.numMoves + 1,
          key: k,
        })}`)
        res.send({
          lastConfirmedMove: game.move,
          numMoves: game.numMoves + 1,
          key: k,
        })
      } catch (e) {
        res.status(500);
        res.send({ error: "Failed with unknown error, check server logs"});
      }
    })
  })

  app.use('/api', restRouter)

  // REST route for authors

  // app.use(
  //   '/battle',
  //   // some logic for
  //   // 1. receiving character object
  //   // 2. generating session id, state, randomness
  //   // 3. storing them somewhere so server can be stateful
  //   // 4. sending information back to client

  //   // also some logic for
  //   // 1. receiving battle move
  //   // 2. generating return move
  //   // 3. sending back to client

  //   // also some logic for
  //   // 1. receiving representation of 'end-game'
  //   // 2. communicating that back to the client?
  // )

  return app
}

module.exports = createServer

// Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Stats {
//     attack: Int!
//     defense: Int!
//   }

//   type Monster {
//     id: ID!
//     hp: Int!
//     stats: Stats!
//     category: Int!
//   }

//   type Move {
//     id: ID!
//     attack: Int!
//     crit: Int!
//     miss: Int!
//     category: Int!
//     type: Int!
//   }

//   type Query {
//     monsters: [Monster]
//     moves: [Move]
//   }

//   type Randomness {
//     encrypted:
//   }
// `);

// The root provides a resolver function for each API endpoint
// var root = {
//   hello: () => {
//     return 'Hello world!'
//   },

//   monsters: () => {
//     return Game.Monsters
//   },

//   moves: () => {
//     return Game.Moves
//   },
// }

// const graphqlRouter = graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: true,
// });

// app.use('/graphql', graphqlRouter);
