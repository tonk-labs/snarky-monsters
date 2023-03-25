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

export const startGame = async (playerState) => {
  const { gameId, npcState } = await playGame(playerState)
  const engine = new Engine(playerState.category, npcState.category, 25)
  localStorage.setItem(
    'game',
    JSON.stringify({
      engineData: engine,
      gameId,
    }),
  )
  return { gameId, npcState }
}

export const makePlayerMove = async (move) => {
  const { engineData, gameId } = JSON.parse(localStorage.getItem('game'))
  const { key, ciphertext } = createEncryptedSecret()
  const { randomness, goodGame } = await commitPlayerMove(
    move,
    ciphertext,
    gameId,
  )
  if (goodGame) {
    return {
      goodGame,
    }
  }
  const d = decryptSecret(key, ciphertext)
  const r = calculateCombinedRandomness(d, randomness)

  // we can do some error checking here potentially with lastConfirmedMove and numMoves
  const { lastConfirmedMove } = await openPlayerMove(key, gameId)

  const engine = Engine.fromJSON(engineData)
  const report = engine.turn(move, r)

  console.log("Player HP: " + engine.player.hp)

  report.lastMove = move
  localStorage.setItem(
    'game',
    JSON.stringify({
      gameId,
      engineData: engine,
    }),
  )

  return {
    report,
    playerState: hydrateMonster(engine.player),
    npcState: hydrateMonster(engine.npc),
  }
}

export const getNpcMove = async () => {
  const { gameId, engineData } = JSON.parse(localStorage.getItem('game'))
  const engine = Engine.fromJSON(engineData)
  const { move, commitRandomness, goodGame } = await commitNpcMove(gameId)
  if (goodGame) {
    return {
      goodGame,
    }
  }
  const randomness = generateRandomness()
  const { key } = await openNpcMove(randomness, gameId)
  const d = decryptSecret(key, commitRandomness)
  const r = calculateCombinedRandomness(d, randomness)
  const report = engine.turn(move, r)

  console.log("NPC HP: " + engine.player.hp)

  report.lastMove = move

  localStorage.setItem(
    'game',
    JSON.stringify({
      gameId,
      engineData: engine,
    }),
  )

  return {
    report,
    playerState: hydrateMonster(engine.player),
    npcState: hydrateMonster(engine.npc),
  }
}

export const getGameHashAndId = async () => {
  const { gameId, engineData } = JSON.parse(localStorage.getItem('game'))
  const engine = Engine.fromJSON(engineData)
  const hash = await hashGameState(engine)
  return {
    gameId,
    hash,
  }
}
