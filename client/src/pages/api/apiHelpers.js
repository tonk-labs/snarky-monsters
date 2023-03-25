import {
  generateRandomness,
  createEncryptedSecret,
  decryptSecret,
  calculateCombinedRandomness,
  hashGameState,
} from '../../model/hash'

import {
  playGame,
  commitPlayerMove,
  openPlayerMove,
  commitNpcMove,
  openNpcMove,
} from './apiClient'

import Web3ConnectManager from './web3ConnectManager'

import Engine from '../../model/engine'

import Game from '../../model/model'

function hydrateMonster(monsterState) {
  const monster = { ...monsterState }
  monster.moves = Game.Moves.filter((move) => {
    // Add the monster's unique moves plus universal moves (re-train and heal)
    return (
      move.category === monster.category ||
      move.id === 0 ||
      (move.category === 0 && move.id != 6)
    )
  })
  return monster
}

const clearGame = () => localStorage.setItem('game', "")
const getGames = () => JSON.parse(localStorage.getItem('games') || "[]")
const setGames = (games) => localStorage.setItem('games', JSON.stringify(games))
const getGame = () => JSON.parse(localStorage.getItem('game') || "{}")
const setGame = (engineData, gameId) => localStorage.setItem('game', JSON.stringify({
  engineData,
  gameId
}))


export const startGame = async (playerState) => {
  const { gameId, npcState } = await playGame(playerState)
  const engine = new Engine(playerState.category, npcState.category, 25)
  setGame(engine, gameId)
  return { gameId, npcState }
}

export const makePlayerMove = async (move) => {
  const { engineData, gameId } = getGame()
  const engine = Engine.fromJSON(engineData)
  const { key, ciphertext } = createEncryptedSecret()
  const { randomness, goodGame } = await commitPlayerMove(
    move,
    ciphertext,
    gameId,
  )
  if (goodGame) {
    return {
      playerState: hydrateMonster(engine.player),
      npcState: hydrateMonster(engine.npc),
      goodGame,
    }
  }
  const d = decryptSecret(key, ciphertext)
  const r = calculateCombinedRandomness(d, randomness)

  // we can do some error checking here potentially with lastConfirmedMove and numMoves
  const { lastConfirmedMove } = await openPlayerMove(key, gameId)

  const report = engine.turn(move, r)

  console.log("Player HP: " + engine.player.hp)
  console.log("NPC HP: " + engine.npc.hp)

  report.lastMove = move
  setGame(engine, gameId)

  return {
    report,
    playerState: hydrateMonster(engine.player),
    npcState: hydrateMonster(engine.npc),
  }
}

export const getNpcMove = async () => {
  const { gameId, engineData } = getGame()
  const engine = Engine.fromJSON(engineData)
  const { move, commitRandomness, goodGame } = await commitNpcMove(gameId)
  if (goodGame) {
    return {
      playerState: hydrateMonster(engine.player),
      npcState: hydrateMonster(engine.npc),
      goodGame,
    }
  }
  const randomness = generateRandomness()
  const { key } = await openNpcMove(randomness, gameId)
  const d = decryptSecret(key, commitRandomness)
  const r = calculateCombinedRandomness(d, randomness)
  const report = engine.turn(move, r)

  console.log("Player HP: " + engine.player.hp)
  console.log("NPC HP: " + engine.npc.hp)

  report.lastMove = move

  setGame(engine, gameId)

  return {
    report,
    playerState: hydrateMonster(engine.player),
    npcState: hydrateMonster(engine.npc),
  }
}

const submitTxnToCertify = async (gameId, hash) => {
  const manager = Web3ConnectManager.getInstance()
  await manager.connectWallet()
  await manager.submitCertification(gameId, hash)
}

export const submitGame = async () => {
  const game = getGame()
  // localStorage.setItem("sneakySaveyGame", JSON.stringify(game))
  // const game = JSON.parse(localStorage.getItem("sneakySaveyGame"))
  if (!game) {
    return {
      error: "game doesn't exist"
    }
  }
  const { gameId, engineData } = game
  const engine = Engine.fromJSON(engineData)
  const hash = await hashGameState(engine)
  try {
    // victory condition!
    if (engine.npc.hp === 0) {
      let games = getGames()
      
      const existed = games.find((game) => {
        if (game.gameId === gameId) {
          //it already exists
          return true
        }
      })
      if (existed) {
        if (!existed.submitted) {
          //we'll try and submit again
        }
      } else {
        // make a call to the server and if success we push the game in and implement logic below
        await submitTxnToCertify(gameId, hash)
        // games.push({
        //   engine,
        //   gameId,
        //   submitted: true,
        //   verified: false,
        // })
        // setGames(games)
        // clearGame()
      }
      return {
        gameId,
        hash,
      }
    } else {
      // clearGame()
    }
  } catch (e) {
    console.error("something went wrong when submitting game", e)
  }

  return {
    error: "game exists, but it wasn't a victory"
  }

}

/**
 * Will check the verification of all games stored locally that haven't been verified
 * @returns 
 */
export const checkVerification = async () => {
  const games = getGames()
  // const game = JSON.parse(localStorage.getItem("sneakySaveyGame"))
  // games.push(gameSneaky)
  let updated = []
  let numberOfWins = 0;
  let pendingGames = 0;
  for (var game of games) {
    if (!game.verified) {
      pendingGames += 1;
      //make a call to check if the game has been certified
      //if it has, update it and 
      //if it hasn't just continue on
      const isVerified = await Web3ConnectManager.getInstance().checkGameVerified(game.gameId)
      if (isVerified) {
        numberOfWins += 1;
        game.verified = true
      }
    } else {
      numberOfWins += 1;
    }
    updated.push(game)
  }

  return {
    games: updated,
    numberOfWins,
    pendingGames
  }
}
