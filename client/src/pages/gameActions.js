import Game from '../model/model'
import { getNpcMove, makePlayerMove, startGame } from './api/apiHelpers'

export const ACTION_TYPES = {}

// We want to attach the available moves to the monster, which doesn't get attached natively in the model
function hydrateMonster(id) {
  const monsterState = { ...Game.Monsters[id - 1] }
  monsterState.moves = Game.Moves.filter((move) => {
    // Add the monster's unique moves plus universal moves (re-train and heal)
    return (
      move.category === monsterState.category ||
      move.id === 0 ||
      (move.category === 0 && move.id != 6)
    )
  })
  return monsterState
}
export const playerSelectMonster = (dispatch, getState) => async (
  monsterId,
) => {
  const playerState = hydrateMonster(monsterId)
  const animationQueue = getState().animationQueue
  animationQueue.push({
    type: 'visual',
    animation: 'animatePlayerEntry',
  })
  animationQueue.push({
    type: 'dialogue',
    content:
      "You were minding your own business and catching up on Vitalik's blog, when suddenly...",
  })
  startGame(playerState).then(({ gameId, npcState }) => {
    animationQueue.push({
      type: 'dialogue',
      content: `A wild ${npcState.categoryName} appeared!`,
    })
    animationQueue.push({
      type: 'visual',
      animation: 'animateNPCEntry',
    })
    animationQueue.push({
      type: 'dialogue',
      content: 'What will you do?',
    })
    animationQueue.push({
      type: 'showMoveBox',
    })
    dispatch({
      payload: {
        playerState: playerState,
        npcState: npcState,
        sessionID: gameId,
        animationQueue: animationQueue,
      },
    })
  })
}

export const selectMove = (dispatch, getState) => (
  move,
  attemptedSwapTarget,
) => {
  var animationQueue = getState().animationQueue
  makePlayerMove(move)
    .then(({ playerState, npcState, report }) => {
      playerState.hp = 0
      if (report.lastMove.name === 'Heal') {
        animationQueue.push({
          type: 'dialogue',
          content: `You used ${report.lastMove.name}!`,
        })
        if (report.didMiss) {
          animationQueue.push({
            type: 'dialogue',
            content: "But it didn't work this time. Bad luck.",
          })
        } else {
          animationQueue.push({
            type: 'visual',
            animation: 'animatePlayerHeal',
          })
          animationQueue.push({
            type: 'visual',
            animation: 'animatePlayerHP',
          })
          if (report.didCrit) {
            animationQueue.push({
              type: 'dialogue',
              content: `Critical heal! You received extra HP.`,
            })
          }
        }
      } else if (report.lastMove.name === 'Re-train') {
        animationQueue.push({
          type: 'dialogue',
          content: `You took the plunge and decided to re-train and achieve your dream of becoming a...`,
        })
        animationQueue.push({
          type: 'dialogue',
          content: `...${attemptedSwapTarget.categoryName}!`,
        })
        animationQueue.push({
          type: 'visual',
          animation: 'animatePlayerPulse',
        })
        if (report.didMiss) {
          animationQueue.push({
            type: 'dialogue',
            content:
              'But it was too hard and you got distracted. Better luck next time! #PersistencePays.',
          })
        } else {
          animationQueue.push({
            type: 'visual',
            animation: 'animatePlayerExit',
          })
          dispatch({
            payload: {
              playerState: playerState,
            },
          })
          animationQueue.push({
            type: 'visual',
            animation: 'animatePlayerEntry',
          })
          animationQueue.push({
            type: 'dialogue',
            content: `You successfully re-trained and re-branded as a ${playerState.categoryName}. Have you updated your Twitter yet?`,
          })
        }
      } else {
        animationQueue.push({
          type: 'dialogue',
          content: `You used ${report.lastMove.name}!`,
        })
        animationQueue.push({
          type: 'visual',
          animation: 'animatePlayerAttack',
        })
        if (report.didMiss) {
          animationQueue.push({
            type: 'dialogue',
            content: 'But it missed. Bad luck.',
          })
        } else {
          animationQueue.push({
            type: 'visual',
            animation: 'animateNPCFlash',
          })
          animationQueue.push({
            type: 'visual',
            animation: 'animateNPCHP',
          })
          if (report.didCrit) {
            animationQueue.push({
              type: 'dialogue',
              content: `It's a critical hit!`,
            })
          }
          switch (report.attkEff) {
            case 0:
              animationQueue.push({
                type: 'dialogue',
                content: `But ${playerState.categoryName}'s moves are not very effective against ${npcState.categoryName}.`,
              })
              animationQueue.push({
                type: 'dialogue',
                content: `Maybe you should retrain to another profession...`,
              })
              break
            case 2:
              animationQueue.push({
                type: 'dialogue',
                content: `${playerState.categoryName}'s moves are quite effective against ${npcState.categoryName}.`,
              })
              break
            case 3:
              animationQueue.push({
                type: 'dialogue',
                content: `${playerState.categoryName}'s moves are super effective against ${npcState.categoryName}!`,
              })
              break
          }
        }
      }
      dispatch({
        payload: {
          playerState: playerState,
          npcState: npcState,
          report: report,
          animationQueue: animationQueue,
          reportCounter: getState().reportCounter + 1,
        },
      })
      if (
        playerState.hp === 0 ||
        npcState.hp === 0 ||
        getState().reportCounter === 24
      ) {
        animationQueue.push({
          type: 'gameOver',
          outcome:
            playerState.hp === 0
              ? 'Defeat'
              : npcState.hp === 0
              ? 'Victory'
              : 'Timeout',
        })
        dispatch({
          payload: {
            animationQueue: animationQueue,
            gameOver: true,
          },
        })
      }
    })
    .then(() => {
      getNpcMove().then(({ playerState, npcState, report }) => {
        if (report.lastMove.name === 'Heal') {
          animationQueue.push({
            type: 'dialogue',
            content: `${npcState.categoryName} used ${report.lastMove.name}!`,
          })
          if (report.didMiss) {
            animationQueue.push({
              type: 'dialogue',
              content: "But it didn't work!",
            })
          } else {
            animationQueue.push({
              type: 'visual',
              animation: 'animateNPCHeal',
            })
            animationQueue.push({
              type: 'visual',
              animation: 'animateNPCHP',
            })
            if (report.didCrit) {
              animationQueue.push({
                type: 'dialogue',
                content: `Critical heal! ${npcState.categoryName} received extra HP.`,
              })
            }
          }
        } else if (report.lastMove.name === 'Re-train') {
          animationQueue.push({
            type: 'dialogue',
            content: `${npcState.categoryName} took the plunge and decided to re-train.`,
          })
          animationQueue.push({
            type: 'visual',
            animation: 'animateNPCPulse',
          })
          if (report.didMiss) {
            animationQueue.push({
              type: 'dialogue',
              content: `But it was too hard and they got distracted. It's a tough world out there...`,
            })
          } else {
            animationQueue.push({
              type: 'visual',
              animation: 'animateNPCExit',
            })
            dispatch({
              payload: {
                npcState: npcState,
              },
            })
            animationQueue.push({
              type: 'visual',
              animation: 'animateNPCEntry',
            })
            animationQueue.push({
              type: 'dialogue',
              content: `They successfully re-trained and re-branded as a ${npcState.categoryName}. Maybe they'll blog about it.`,
            })
          }
        } else {
          animationQueue.push({
            type: 'dialogue',
            content: `${npcState.categoryName} used ${report.lastMove.name}!`,
          })
          animationQueue.push({
            type: 'visual',
            animation: 'animateNPCAttack',
          })
          if (report.didMiss) {
            animationQueue.push({
              type: 'dialogue',
              content: 'But they missed. You lucky thing.',
            })
          } else {
            animationQueue.push({
              type: 'visual',
              animation: 'animatePlayerFlash',
            })
            animationQueue.push({
              type: 'visual',
              animation: 'animatePlayerHP',
            })
            if (report.didCrit) {
              animationQueue.push({
                type: 'dialogue',
                content: `Ouch! It's a critical hit!`,
              })
            }
            switch (report.attkEff) {
              case 0:
                animationQueue.push({
                  type: 'dialogue',
                  content: `But ${npcState.categoryName}'s moves are not very effective against ${playerState.categoryName}.`,
                })
                break
              case 2:
                animationQueue.push({
                  type: 'dialogue',
                  content: `${npcState.categoryName}'s moves are quite effective against ${playerState.categoryName}.`,
                })
                break
              case 3:
                animationQueue.push({
                  type: 'dialogue',
                  content: `${npcState.categoryName}'s moves are super effective against ${playerState.categoryName}. Maybe you should retrain to another profession...`,
                })
                break
            }
          }
        }
        animationQueue.push({
          type: 'dialogue',
          content: 'What will you do?',
        })
        animationQueue.push({
          type: 'showMoveBox',
        })
        // TODO: Decrypt randomness
        // TODO: Update internal Game Hash with new state, including hashing state, randomness, move, attackEff, defEff.
        dispatch({
          payload: {
            playerState: playerState,
            npcState: npcState,
            report: report,
            reportCounter: getState().reportCounter + 1,
          },
        })
        if (
          playerState.hp === 0 ||
          npcState.hp === 0 ||
          getState().reportCounter === 24
        ) {
          animationQueue.push({
            type: 'gameOver',
            outcome:
              playerState.hp === 0
                ? 'Defeat'
                : npcState.hp === 0
                ? 'Victory'
                : 'Timeout',
          })
          dispatch({
            payload: {
              animationQueue: animationQueue,
              gameOver: true,
            },
          })
        }
      })
    })
}

export const shiftAnimationQueue = (dispatch, getState) => () => {
  const animationQueue = getState().animationQueue
  animationQueue.shift()
  dispatch({
    payload: {
      animationQueue: animationQueue,
    },
  })
}
