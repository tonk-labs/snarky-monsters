import Head from 'next/head'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import Opening from '@/components/Opening.js'
import MonsterPicker from '@/components/MonsterPicker.js'
import Image from 'next/image.js'
import { gameReducer, getActions, initialState, useEnhancedReducer} from './gameReducer';
import Game from '../model/model';

const Container = styled.div`
  border: #5f3400 double thick;

  height: calc(100vh - 147px);
  padding: 8px;
`

function BattleScreen({ monster, moves }) {
  return (
    <div>
      <p>here can live the battle screen</p>
      <p>{Game.CategoryNames[monster.category]}</p>
      <Image
        src={`/sprite_category_${monster.category}.png`}
        width={200}
        height={200}
        alt="sprite"
      />
    </div>
  )
}

function Actions({ moves, gameModel }) {
  return (
    <div>
      <h3>Pick your move</h3>
      {moves.map((move) => {
        console.log
        return (
          <button
            onClick={() => {
              // here is the turn logic
            }}
          >
            {gameModel.MoveNames[move.id]}
          </button>
        )
      })}
    </div>
  )
}

function Battle({ monster, moves, gameModel }) {
  return (
    <>
      <BattleScreen monster={monster} />
      <Actions moves={moves} gameModel={gameModel} />
    </>
  )
}

export default function GameComponent() {
  const [opening, setOpening] = useState(true)
  const [gameState, dispatch, getState] = useEnhancedReducer(gameReducer, initialState);

  const {
    playerSelectMonster
  } = getActions(dispatch, getState);

  return (
    <Container>
      {opening ? (
        <Opening setOpening={setOpening} />
      ) : !gameState.playerState.id ? (
        <MonsterPicker
          monsters={Game.Monsters}
          categoryNames={Game.CategoryNames}
          setPickedMonsterId={playerSelectMonster}
        />
      ) : gameState.playerState.id ? (
        <Battle
          monster={gameState.playerState}
          gameModel={Game}
          moves={Game.Moves.filter((m) => {
            return m.category === gameState.playerState.category
          })}
        />
      ) : (
        <p>endgame</p>
      )}
    </Container>
  )
}
