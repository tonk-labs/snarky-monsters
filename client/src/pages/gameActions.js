import Game from '../model/model'
import { sha256 } from '@aws-crypto/sha256-js'
import seedrandom from 'seedrandom'

export const ACTION_TYPES = {}

// We want to attach the CategoryName and available moves to the monster, which doesn't get attached natively in the model
function hydrateMonster(id) {
  const monsterState = { ...Game.Monsters[id - 1] }
  monsterState.categoryName = Game.CategoryNames[id]
  monsterState.moves = Game.Moves.filter((move) => {
    // Add the monster's unique moves plus universal moves (re-train and heal)
    return (
      move.category === monsterState.category ||
      move.id === 0 ||
      move.category === 0
    )
  }).map((move) => {
    move.name = Game.MoveNames[move.id]
    return move
  })
  return monsterState
}
export const playerSelectMonster = (dispatch, getState) => (monsterId) => {
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
  }, 1500)
}

export const selectMove = (dispatch, getState) => (move, swappedMonsterId) => {
  function hydrateMove(move) {
    move.name = Game.MoveNames[move.id]
  }
  // generate some new randomness

  // implement some callback to server

  setTimeout(() => {
    // send move (or move id?)
    // const move = move
    // send 2x randomness
    const clientGeneratedRandomnessForPlayer = seedrandom('beep boop')()
    const clientGeneratedRandomnessForNPC = seedrandom('shneep shnoop')()
    // send effectiveness, calculated from player state, npc state and the effectiveness table

    var effectiveness =
      Game.EffectivenessMatrix[getState().playerState.id - 1][
        getState().npcState.id - 1
      ]
    // receive npc move and final step in randomness
    const npcMove = {
      ...getState().npcState.moves[
        Math.floor(Math.random() * getState().npcState.moves.length - 1)
      ],
    }
    hydrateMove(npcMove)

    // calculate randomness for player move
    // server will send this across
    // OK COULDNT GET RANDOMNESS TO WORK AFTER HACKING AT IT FOR LIKE 30 MINUTES. GONNA TRY PAIR W GAVIN
    // const serverGeneratedRandomnessForPlayer = '23456'
    // const hash = sha256.create()
    // hash.update(clientGeneratedRandomnessForPlayer)
    // hash.update(serverGeneratedRandomnessForPlayer)
    // const result = hash.digest()
    const playerRandomness = Math.random() * 100
    // calculate randomness for client move
    // server will send this across
    // const serverGeneratedRandomnessForNPC = 'hkjlasfd'
    const npcRandomness = Math.random() * 100

    function calculateDamage(move, rand, attackerState, defenderState) {
      if (move.miss >= rand) return 0
      var effectiveness =
        Game.EffectivenessMatrix[attackerState.id - 1][defenderState.id - 1]

      var baseDamage = move.attack * effectiveness

      if (move.crit <= rand) {
        baseDamage = baseDamage + attackerState.stats.attack * 2
      }
      var totalDamage = baseDamage - defenderState.stats.defense
      //   Base damage is 2 HP
      if (totalDamage < 2) {
        totalDamage = 2
      }
      //   can't reduce health to below 0
      if (totalDamage > defenderState.hp) {
        totalDamage = defenderState.hp
      }
      return totalDamage
    }

    function calculateHeal(move, rand, attackerState) {
      if (move.miss >= rand) return null
      var baseHeal = move.attack
      if (move.crit <= rand) {
        baseHeal = baseHeal * 2
      }
      if (attackerState.hp + baseHeal > 100) {
        baseHeal = 100 - attackerState.hp
      }
      return baseHeal
    }

    function calculateSwap(move, rand) {
      if (move.miss >= rand) return null
      return true
    }

    switch (move.type) {
      case 0:
        if (calculateSwap(move, playerRandomness)) {
          dispatch({
            payload: {
              playerState: hydrateMonster(swappedMonsterId),
            },
          })
        }
        break

      case 1:
        const heal = calculateHeal(
          move,
          playerRandomness,
          getState().playerState,
        )
        const playerState = getState().playerState
        playerState.hp = getState().playerState.hp + heal
        dispatch({
          payload: {
            playerState: playerState,
          },
        })
        break
      case 2:
        const playerMoveDamage = calculateDamage(
          move,
          playerRandomness,
          getState().playerState,
          getState().npcState,
        )
        const npcState = getState().npcState
        npcState.hp = npcState.hp - playerMoveDamage
        dispatch({
          payload: {
            npcState: npcState,
          },
        })
        break
      // haven't implemented death logic yet
    }

    // when NPC move is executed, update state latestConfirmedPlayerMove and latestConfirmedNPCMove
    // frontend can listen to when such a state update occurs and when it does, execute some animations

    switch (npcMove.type) {
      //   case 0:
      //     if (calculateSwap(npcMove, npcRandomness)) {
      //       dispatch({
      //         payload: {
      //           npcState: hydrateMonster(??? HOW THIS GONNA WORK?),
      //         },
      //       })
      //     }
      //     break

      case 1:
        const heal = calculateHeal(npcMove, npcRandomness, getState().npcState)
        var npcState = getState().npcState
        npcState.hp = getState().npcState.hp + heal
        dispatch({
          payload: {
            npcState: npcState,
            latestConfirmedPlayerMove: move,
            latestConfirmedNPCMove: npcMove,
          },
        })
        break
      case 2:
        const npcMoveDamage = calculateDamage(
          npcMove,
          npcRandomness,
          getState().npcState,
          getState().playerState,
        )
        var playerState = getState().playerState
        playerState.hp = playerState.hp - npcMoveDamage
        dispatch({
          payload: {
            playerState: playerState,
            latestConfirmedPlayerMove: move,
            latestConfirmedNPCMove: npcMove,
          },
        })
        break
      // haven't implemented death logic yet
    }

    // receive old state
    const previousState = {
      playerState: {
        id: 10,
        hp: 10,
        attack: 10,
        defense: 10,
        category: 10,
      },
      npcState: {
        id: 10,
        hp: 10,
        attack: 10,
        defense: 10,
        category: 10,
      },
    }

    // generate new state and add to previousStates and previousRandomness
    // dispatch everything to the store to transition to new local state and let it propagate through components

    // receive new state
    const nextState = {
      playerState: {
        id: 10,
        hp: 10,
        stats: {
          attack: 10,
          defense: 10,
        },
        category: 10,
      },
      npcState: {
        id: 10,
        hp: 10,
        stats: {
          attack: 10,
          defense: 10,
        },
        category: 10,
      },
    }
  }, 3000)
}

// haven't stored old moves, old randomness etc. yet
