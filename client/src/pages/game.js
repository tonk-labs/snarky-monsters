import Head from 'next/head'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
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
  margin: auto;
  max-width: 600px;
  max-height: 919px;
  background-color: #e3ceb9;
  position: relative;
  &::before {
    content: '';
    display: block;
    padding-top: 162%; /* height is 1.5 times the width */
  }
  #inner {
    position: absolute; /* position relative to .box */
    top: 50%; /* center vertically */
    left: 50%; /* center horizontally */
    height: 100%;
    width: 100%;
    transform: translate(-50%, -50%); /* center absolutely */
  }
`

const Child = styled.div`
  height: 100%;
  p {
    font-size: ${({ fontSize }) => fontSize}px;
  }
`

export default function GameComponent() {
  const parentRef = useRef(null)
  const childRef = useRef(null)
  const [opening, setOpening] = useState(true)
  const [gameState, dispatch, getState] = useEnhancedReducer(
    gameReducer,
    initialState,
  )
  const audioRef = useRef(null)
  function playMusic() {
    audioRef.current.play()
  }

  const {
    playerSelectMonster,
    selectMove,
    shiftAnimationQueue,
    fetchNPC,
  } = getActions(dispatch, getState)

  useEffect(() => {
    const parentWidth = parentRef.current.offsetWidth
    const fontSize = parentWidth * 0.03 // adjust as needed
    childRef.current.style.fontSize = fontSize + 'px'
  }, [])

  return (
    <Container>
      <div ref={parentRef} id="inner">
        <Child ref={childRef}>
          {opening && <Opening setOpening={setOpening} playMusic={playMusic} />}
          {!opening && !gameState.playerState.id && (
            <MonsterPicker
              monsters={Game.Monsters}
              playerSelectMonster={playerSelectMonster}
              fetchNPC={fetchNPC}
            />
          )}
          {gameState.playerState.id && (
            <Battle
              playerState={gameState.playerState}
              npcState={gameState.npcState}
              animationQueue={gameState.animationQueue}
              shiftAnimationQueue={shiftAnimationQueue}
              report={gameState.report}
              reportCounter={gameState.reportCounter}
              Game={Game}
              selectMove={selectMove}
            />
          )}
        </Child>
      </div>
      <audio
        loop
        ref={audioRef}
        credit="Epic Cyberpunk | Glory by Alex-Productions | https://onsound.eu/
Music promoted by https://www.chosic.com/free-music/all/
Creative Commons CC BY 3.0
https://creativecommons.org/licenses/by/3.0/
 "
      >
        <source src="/glory.mp3" ntype="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </Container>
  )
}
