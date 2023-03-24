import { 
    generateRandomness, 
    createEncryptedSecret, 
    decryptSecret, 
    calculateCombinedRandomness,
    hashGameState
} from '../../model/hash'

import {
    playGame,
    commitPlayerMove,
    openPlayerMove,
    commitNpcMove,
    openNpcMove
} from './apiClient'

import Engine from '../../model/engine'

export const startGame = async (playerState) => {
    const { gameId, npcState } = await playGame(playerState)
    const engine = new Engine(playerState.category, npcState.category, 25)
    localStorage.setItem("game", {
        engineData: engine,
        gameId
    })
}

export const makePlayerMove = async (move) => {
    const { engineData, gameId } = localStorage.getItem("game")
    const { key, ciphertext } = createEncryptedSecret()
    const { randomness, goodGame } = await commitPlayerMove(move, ciphertext, gameId)
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
    localStorage.setItem("game", {
        gameId,
        engineData: engine
    })

    return {
        report,
        playerState: engine.player,
        npcState: engine.npc,
    }
}

export const getNpcMove = async () => {
    const { gameId, engineData } = localStorage.getItem("game")
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
    localStorage.setItem("game", {
        gameId,
        engineData: engine
    })

    return {
        report,
        playerState: engine.player,
        npcState: engine.npc
    }
}

export const getGameHashAndId = async () => {
    const { gameId, engineData } = localStorage.getItem("game")
    const engine = Engine.fromJSON(engineData)
    const hash = await hashGameState(engine)
    return {
        gameId,
        hash,
    }
}