import Game from '../model/model'

export const ACTION_TYPES = {}

export const playerSelectMonster = (dispatch, getState) => (monsterId) => {
  // We want to attach the CategoryName and available moves to the monster, which doesn't get attached natively in the model
  function hydrateMonster(id) {
    const monsterState = { ...Game.Monsters[id] }
    monsterState.categoryName = Game.CategoryNames[id + 1]
    monsterState.moves = Game.Moves.filter((move) => {
      return move.category === monsterState.category
    }).map((move) => {
      move.name = Game.MoveNames[move.id]
      return move
    })
    return monsterState
  }

  //   this is just for the purposes of mocking up
  var npcState = {
    ...Game.Monsters.filter((monster) => monster.id != monsterId)[
      Math.floor(Math.random() * (Game.Monsters.length - 1))
    ],
  }

  npcState = hydrateMonster(npcState.id)

  dispatch({
    payload: {
      playerState: hydrateMonster(monsterId),
    },
  })

  setTimeout(() => {
    // pretend we are making a call to the server and it takes 1 second
    // we get back from the server some randomness
    const randomness =
      'dc33caadab561027e1cfa5280a2f65656ad8ffb6bc779fccfec74aa673b97184'
    //now we need to convert this into our "random number and save it for later somehow",
    dispatch({
      payload: {
        npcState: npcState,
        sessionID: '07554609-60f4-4edb-a6de-c7fab54f5b2b',
        randomness: Math.random() * 100, //pretend we already did the conversion
      },
    })
  }, 3000)
}

export const selectMove = (dispatch, getState) => (moves) => {
  // generate some new randomness
  // each state update is a separate dispatch
  // update to latest move - playerMovePending: {},
  // update currentMove: {}, (THIS INITIATES VISUAL TRANSITION)
  // currentMoveEffectiveness: null,
  // add to previousMoves
  // implement some callback to server
  // receive server randomness and npc move and new state
  // update npcMovePending: {},
  // update currentMove: {} (THIS INITIATES VISUAL TRANSITION)
  // currentMoveEffectiveness: null,
  // add to previousMoves
  // generate new state and add to previousStates and previousRandomness
  // previousStates: [],
  // previousRandomness: [],
  // previousEffectiveness: [],
}
