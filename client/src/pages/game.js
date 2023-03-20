import Head from 'next/head'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import Opening from '@/components/Opening.js'
import MonsterPicker from '@/components/MonsterPicker.js'
import BattleScreen from '@/components/BattleScreen.js'
import Actions from '@/components/MoveBox'
import Image from 'next/image.js'
import Battle from '@/components/Battle'
import Dialogue from '@/components/Dialogue'
import {
  gameReducer,
  getActions,
  initialState,
  useEnhancedReducer,
} from './gameReducer'
import Game from '../model/model'

const Container = styled.div`
  border: #5f3400 double thick;

  height: calc(100vh - 147px);
  padding: 8px;
`

export default function GameComponent() {
  const [opening, setOpening] = useState(true)
  const [gameState, dispatch, getState] = useEnhancedReducer(
    gameReducer,
    initialState,
  )

  const { playerSelectMonster, selectMove } = getActions(dispatch, getState)

  return (
    <Container>
      {opening && <Opening setOpening={setOpening} />}
      {!opening && !gameState.playerState.id && (
        <MonsterPicker
          monsters={Game.Monsters}
          categoryNames={Game.CategoryNames}
          playerSelectMonster={playerSelectMonster}
        />
      )}
      {gameState.playerState.id &&
        gameState.playerState.hp > 0 &&
        gameState.npcState.hp > 0 && (
          <Battle
            playerState={gameState.playerState}
            npcState={gameState.npcState}
            Game={Game}
            selectMove={selectMove}
          />
        )}
      {(gameState.playerState.hp === 0 || gameState.npcState.hp === 0) && (
        <p>endgame</p>
      )}
    </Container>
  )
}
