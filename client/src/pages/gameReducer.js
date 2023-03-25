import { useCallback, useReducer, useRef } from 'react'
import {
  ACTION_TYPES,
  shiftAnimationQueue, //this will only be needed if we decide to do something fancy on the reducer side
  playerSelectMonster,
  selectMove,
} from './gameActions'

export const initialState = {
  sessionID: '',
  playerState: {},
  npcState: {},
  report: {},
  reportCounter: 0,
  animationQueue: [],
  gameOver: false,
  previousMoves: [],
  previousStates: [],
  previousRandomness: [],
  previousMoveEffs: [],
  previousDefEffs: [],
}

export const getActions = (dispatch, getState) => {
  return {
    playerSelectMonster: playerSelectMonster(dispatch, getState),
    selectMove: selectMove(dispatch, getState),
    shiftAnimationQueue: shiftAnimationQueue(dispatch, getState),
  }
}

export const gameReducer = (state, action) => {
  return {
    ...state,
    ...action.payload,
  }
}

export const useEnhancedReducer = (reducer, initState, initializer) => {
  const lastState = useRef(initState)
  const getState = useCallback(() => lastState.current, [])
  const enhancedReducer = useRef(
    (state, action) => (lastState.current = reducer(state, action)),
  ).current
  const [state, dispatch] = useReducer(enhancedReducer, initState, initializer)
  return [state, dispatch, getState]
}
