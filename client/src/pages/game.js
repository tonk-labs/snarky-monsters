import Head from 'next/head'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import Opening from '@/components/Opening.js'
import MonsterPicker from '@/components/MonsterPicker.js'
import Image from 'next/image.js'
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

function BattleScreen({ playerState, npcState }) {
  return (
    <div>
      <h3>{playerState.categoryName}</h3>
      <p>
        <strong>HP: </strong>
        {playerState.hp}
      </p>
      <Image
        src={`/sprite_category_${playerState.category}.png`}
        width={50}
        height={50}
        alt="sprite"
      />
      {npcState.categoryName != null ? (
        <div>
          <h3>{npcState.categoryName}</h3>
          <p>
            <strong>HP: </strong>
            {npcState.hp}
          </p>
          <Image
            src={`/sprite_category_${npcState.category}.png`}
            width={50}
            height={50}
            alt="sprite"
          />
        </div>
      ) : (
        <p>Finding monster...</p>
      )}
    </div>
  )
}

function Dialogue({ dialogue, setDialogue }) {
  return (
    <div>
      <p>{dialogue}</p>
      <button onClick={() => setDialogue('')}>next</button>
    </div>
  )
}

function Actions({ playerState, Game, selectMove }) {
  const [moveIndex, updateMoveIndex] = useState(0)
  return (
    <div>
      <h3>Pick your move</h3>
      {playerState.moves.map((move) => {
        return (
          <button
            key={move.id}
            onClick={() => {
              selectMove(move.id)
            }}
          >
            {move.name}
          </button>
        )
      })}
    </div>
  )
}

function Battle({ playerState, Game, selectMove, npcState }) {
  const [dialogue, setDialogue] = useState(
    `A wild ${npcState.categoryName} appeared!`,
  )
  return (
    <>
      <BattleScreen playerState={playerState} npcState={npcState} />
      {dialogue === '' ? (
        <Actions
          Game={Game}
          selectMove={selectMove}
          playerState={playerState}
        />
      ) : (
        <Dialogue dialogue={dialogue} setDialogue={setDialogue} />
      )}
    </>
  )
}

export default function GameComponent() {
  const [opening, setOpening] = useState(true)
  const [gameState, dispatch, getState] = useEnhancedReducer(
    gameReducer,
    initialState,
  )

  const { playerSelectMonster, selectMove } = getActions(dispatch, getState)

  return (
    <Container>
      {opening ? (
        <Opening setOpening={setOpening} />
      ) : !gameState.playerState.id ? (
        <MonsterPicker
          monsters={Game.Monsters}
          categoryNames={Game.CategoryNames}
          playerSelectMonster={playerSelectMonster}
        />
      ) : gameState.playerState.id ? (
        <Battle
          playerState={gameState.playerState}
          npcState={gameState.npcState}
          Game={Game}
          selectMove={selectMove}
        />
      ) : (
        <p>endgame</p>
      )}
    </Container>
  )
}
