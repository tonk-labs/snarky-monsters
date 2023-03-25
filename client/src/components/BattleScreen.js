import styled from 'styled-components'
import { useEffect, useState } from 'react'
import Image from 'next/image.js'
import Dialogue from '@/components/Dialogue'
import next from 'next'

const Container = styled.div`
  border-bottom: solid 2px #5f3400;
  height: 62%;
  position: relative;
  p {
    margin: 0;
  }
  #top {
    height: 80%;
    border-bottom: solid 2px #5f3400;
    display: flex;
    overflow: hidden;
    transition: opacity 3s ease-in-out;
    opacity: 1;
    &.ending {
      opacity: 0 !important;
    }
    #playerCache {
      width: 50%;
    }
    #npcCache {
      width: 50%;
    }

    .statusBar {
      opacity: 0;
      transition: 2s;
      &.animateHealthBarEntry {
        opacity: 1 !important;
      }
      background-color: #eadbcb;
      padding: 1%;
      border: solid 2px #dcc1a7;
      position: absolute;

      .health-bar {
        margin-top: 3%;
        width: 80%;
        height: 4px;
        border: 1px solid #9c6c3b;
        border-radius: 3px;
        background-color: #e3ceb9;
        overflow: hidden;
      }

      .health-bar-progress {
        height: 100%;
        background-color: #cda882;
        transition: width 0.3s ease-in-out;
      }
      &.npc {
        text-align: right;
        display: flex;
        flex-direction: column;
        align-items: end;
        width: 35%;
        border-right: none;
        top: 51%;
        right: 0%;
        font-size: 70%;
        padding-right: 5%;
        .health-bar {
          display: flex;
          justify-content: end;
        }
      }
      &.player {
        width: 42%;

        border-left: none;
        top: 30%;
        left: 0%;
        padding-left: 5%;
      }
    }
  }
  .playerImg {
    position: absolute;
    top: 47%;
    left: 12%;
    width: 0%;
  }
  .npcImg {
    position: absolute;
    top: 21%;
    right: 14%;
    width: 25%;
    transform: rotate(0) scaleX(-1);
  }
  .animatePlayerAttack {
    animation-duration: 2s;
    animation-name: playerAttack;
  }
  @keyframes playerAttack {
    50% {
      transform: translate(-20%, 20%);
    }
    55% {
      transform: translate(90%, -80%);
      transform: rotate(25deg);
    }
    65% {
      transform: translate(90%, -80%);
    }
  }

  .animateNPCAttack {
    animation-duration: 2s;
    animation-name: NPCAttack;
  }
  @keyframes NPCAttack {
    50% {
      transform: translate(20%, -20%);
    }
    55% {
      transform: translate(-120%, 80%);
      transform: rotate(-15deg);
    }
    65% {
      transform: translate(-120%, 80%);
    }
  }
  .animatePlayerHeal,
  .animateNPCHeal {
    animation-duration: 2s;
    animation-name: heal;
  }
  @keyframes heal {
    50% {
      filter: grayscale(100%) brightness(200%);
    }
  }
  .flash-image {
    animation: flash 0.2s 3;
  }

  @keyframes flash {
    25% {
      opacity: 1;
    }
    26% {
      opacity: 0;
    }
    75% {
      opacity: 0;
    }
    76% {
      opacity: 1;
    }
  }
  .animatePlayerEntry {
    animation: 2s playerEntry;
  }
  @keyframes playerEntry {
    50% {
      width: 0%;
    }
    100% {
      width: 29%;
    }
  }
  .playerEntered {
    width: 29%;
  }
  .animateNPCEntry {
    animation: 1s npcEntry;
  }
  @keyframes npcEntry {
    0% {
      width: 0%;
      transform: rotate(0) translateX(-1);
    }
    100% {
      width: 25%;
      transform: rotate(360deg) translateX(-1);
    }
  }
  .npcEntered {
    width: 25%;
    transform: rotate(1000deg) translateX(-1);
  }
  .animatePlayerExit {
    animation: 1s playerExit;
  }
  @keyframes playerExit {
    0% {
      width: 29%;
    }
    100% {
      width: 0%;
    }
  }
  .playerExited {
    display: none;
  }
  .animateNPCExit {
    animation: 1s npcExit;
  }
  @keyframes npcExit {
    0% {
      width: 25%;
    }
    100% {
      width: 0%;
    }
  }
  .npcExited {
    display: none;
  }
  .pulse {
    animation: 1.2s pulse;
  }
  @keyframes pulse {
    20% {
      transform: scale(110%, 110%);
    }
    25% {
      transform: scale(115%, 115%);
    }
    30% {
      transform: scale(110%, 110%);
    }
    50% {
      transform: scale(110%, 110%);
    }
    55% {
      transform: scale(115%, 115%);
    }
    60% {
      transform: scale(110%, 110%);
    }
    80% {
      transform: scale(110%, 110%);
    }
    85% {
      transform: scale(115%, 115%);
    }
    90% {
      transform: scale(110%, 110%);
    }
  }
  .endgame {
    display: none;
    z-index: 10;
    width: 100%;
    position: absolute;
    color: white;
    text-align: center;
    height: 80%;
    &.display {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    p {
      width: 80%;
      margin-bottom: 5%;
    }
    .endgameButton {
      padding: 2% 5%;
      border: 2px solid white;
      border-radius: 2px;
      filter: brightness(1);
      &:hover {
        cursor: pointer;
        filter: brightness(0.9);
      }
    }
  }
`

export default function BattleScreen({
  playerState,
  npcState,
  setShowMoveBox,
  nextAnimation,
  shiftAnimationQueue,
}) {
  const [animatePlayerEntry, setAnimatePlayerEntry] = useState(false)
  const [playerEntered, setPlayerEntered] = useState(false)
  const [animateNPCEntry, setAnimateNPCEntry] = useState(false)
  const [npcEntered, setNPCEntered] = useState(false)
  const [animatePlayerExit, setAnimatePlayerExit] = useState(false)
  const [playerExited, setPlayerExited] = useState(true)
  const [animateNPCExit, setAnimateNPCExit] = useState(false)
  const [npcExited, setNPCExited] = useState(true)
  const [animatePlayerHeal, setAnimatePlayerHeal] = useState(false)
  const [animateNPCHeal, setAnimateNPCHeal] = useState(false)
  const [animatePlayerPulse, setAnimatePlayerPulse] = useState(false)
  const [animateNPCPulse, setAnimateNPCPulse] = useState(false)
  const [animateHealthBarEntry, setAnimateHealthBarEntry] = useState(false)
  const [animatePlayerAttack, setAnimatePlayerAttack] = useState(false)
  const [animateNPCAttack, setAnimateNPCAttack] = useState(false)
  const [animatePlayerFlash, setAnimatePlayerFlash] = useState(false)
  const [animateNPCFlash, setAnimateNPCFlash] = useState(false)
  const [animateVictory, setAnimateVictory] = useState(false)
  const [animateDefeat, setAnimateDefeat] = useState(false)
  const [animateTimeout, setAnimateTimeout] = useState(false)
  const [cachedPlayerState, setCachedPlayerState] = useState({ ...playerState })
  const [cachedNPCState, setCachedNPCState] = useState({ ...npcState })
  const [rand, setRand] = useState(Math.floor(Math.random() * 4) + 1)

  // useEffect doesn't run if (1) a props changes where (2) the props is an array and (3) just the contents of the array change. We want
  useEffect(() => {
    if (nextAnimation && nextAnimation.type === 'gameOver') {
      if (nextAnimation.outcome === 'Victory') {
        console.log('hit')
        setAnimateVictory(true)
      } else if (nextAnimation.outcome === 'Defeat') {
        setAnimateDefeat(true)
      } else if (nextAnimation.outcome === 'Timeout') {
        setAnimateTimeout(true)
      }
    }
    if (nextAnimation && nextAnimation.type === 'visual') {
      console.log(nextAnimation.animation)
      switch (nextAnimation.animation) {
        case 'animatePlayerEntry':
          setCachedPlayerState({ ...playerState })
          setPlayerExited(false)
          setAnimatePlayerEntry(true)
          break
        case 'animateNPCEntry':
          setCachedNPCState({ ...npcState })
          setNPCExited(false)
          setAnimateNPCEntry(true)
          break
        case 'animatePlayerFlash':
          setAnimatePlayerFlash(true)
          break
        case 'animateNPCFlash':
          setAnimateNPCFlash(true)
          break
        case 'animatePlayerAttack':
          setAnimatePlayerAttack(true)
          break
        case 'animateNPCAttack':
          setAnimateNPCAttack(true)
          break
        case 'animatePlayerHeal':
          setAnimatePlayerHeal(true)
          break
        case 'animateNPCHeal':
          setAnimateNPCHeal(true)
          break
        case 'animatePlayerHP':
          setCachedPlayerState({ ...playerState })
          shiftAnimationQueue()
          break
        case 'animateNPCHP':
          setCachedNPCState({ ...npcState })
          shiftAnimationQueue()
          break
        case 'animatePlayerPulse':
          setAnimatePlayerPulse(true)
          break
        case 'animatePlayerExit':
          setAnimatePlayerExit(true)
          setPlayerEntered(false)
          break
        case 'animateNPCPulse':
          setAnimateNPCPulse(true)
          break
        case 'animateNPCExit':
          setAnimateNPCExit(true)
          setNPCEntered(false)
          break
      }
    }
  }, [
    setAnimatePlayerEntry,
    nextAnimation,
    npcState,
    shiftAnimationQueue,
    playerState,
  ])

  return (
    <Container>
      <div
        className={`endgame ${
          animateVictory || animateDefeat || animateTimeout ? 'display' : ''
        }`}
      >
        {animateVictory && (
          <>
            <h2>VICTORY!</h2>
            <p>
              The {npcState.categoryName} regrets ever picking a fight with you,
              and you've been invited onto the Bankless podcast as a special
              guest.
            </p>
            <p>Wen airdrop?</p>
            <div
              className={`endgameButton`}
              onClick={() => {
                // GAVIN TODO: add logic for signing tx to Scroll
              }}
            >
              PLAY AGAIN
            </div>
          </>
        )}
        {animateDefeat && (
          <>
            <h2>DEFEAT</h2>
            <p>
              The {npcState.categoryName} wiped the floor with you and has begun
              publicly shaming you on Twitter.
            </p>
            <p>Will you get your own back?</p>
            <div className={`endgameButton`} onClick={() => location.reload()}>
              PLAY AGAIN
            </div>
          </>
        )}
        {animateTimeout && (
          <>
            <h2>TIME UP</h2>
            <p>
              The battle took too long and {npcState.categoryName} moved on with
              their life. Maybe you should too.
            </p>
            <div className={`endgameButton`} onClick={() => location.reload()}>
              PLAY AGAIN
            </div>
          </>
        )}
      </div>
      <div style={{ backgroundColor: 'black', height: '100%' }}>
        <div
          id="top"
          style={{
            backgroundImage: `url(../../battleBackground_${rand}.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '80%',
          }}
          className={`${
            animateVictory || animateDefeat || animateTimeout ? 'ending' : ''
          }`}
        >
          <div
            className={`statusBar player ${
              animateHealthBarEntry ? 'animateHealthBarEntry' : ''
            }`}
          >
            <p>
              <strong>{cachedPlayerState.categoryName}</strong>
            </p>
            <p>
              HP:<span> </span>
              {cachedPlayerState.hp}
            </p>
            <div className="health-bar">
              <div
                className="health-bar-progress"
                style={{ width: `${cachedPlayerState.hp}%` }}
              />
            </div>
          </div>

          <img
            src={`/sprite_category_${cachedPlayerState.category}.png`}
            alt=""
            className={`
          playerImg
          ${animatePlayerEntry ? 'animatePlayerEntry' : ''}
          ${playerEntered ? 'playerEntered' : ''}
          ${animatePlayerExit ? 'animatePlayerExit' : ''}
          ${playerExited ? 'playerExited' : ''}
          ${animatePlayerAttack ? 'animatePlayerAttack' : ''}
          ${animatePlayerHeal ? 'animatePlayerHeal' : ''}
          ${animatePlayerFlash ? 'flash-image' : ''}
          ${animatePlayerPulse ? 'pulse' : ''}
          
          `}
            onAnimationEnd={() => {
              if (animatePlayerEntry) {
                setPlayerEntered(true)
                setAnimatePlayerEntry(false)
                shiftAnimationQueue()
              }
              if (animatePlayerExit) {
                setPlayerExited(true)
                setAnimatePlayerExit(false)
                shiftAnimationQueue()
              }
              if (animatePlayerAttack) {
                setAnimatePlayerAttack(false)
                shiftAnimationQueue()
              }
              if (animatePlayerHeal) {
                setAnimatePlayerHeal(false)
                shiftAnimationQueue()
              }
              if (animatePlayerFlash) {
                setAnimatePlayerFlash(false)
                shiftAnimationQueue()
              }
              if (animatePlayerPulse) {
                setAnimatePlayerPulse(false)
                shiftAnimationQueue()
              }
            }}
          />
          {npcState.categoryName != null && (
            <>
              <img
                src={`/sprite_category_${cachedNPCState.category}.png`}
                alt=""
                className={`
              npcImg
              ${animateNPCEntry ? 'animateNPCEntry' : ''}
              ${npcEntered ? 'npcEntered' : ''}
              ${animateNPCExit ? 'animateNPCExit' : ''}
              ${npcExited ? 'npcExited' : ''}
              ${animateNPCAttack ? 'animateNPCAttack' : ''}
              ${animateNPCHeal ? 'animateNPCHeal' : ''}
              ${animateNPCFlash ? 'flash-image' : ''}
              ${animateNPCPulse ? 'pulse' : ''}
              `}
                onAnimationEnd={() => {
                  if (animateNPCEntry) {
                    setNPCEntered(true)
                    setAnimateNPCEntry(false)
                    setAnimateHealthBarEntry(true)
                    shiftAnimationQueue()
                  }
                  if (animateNPCExit) {
                    setNPCExited(true)
                    setAnimateNPCExit(false)
                    shiftAnimationQueue()
                  }
                  if (animateNPCAttack) {
                    setAnimateNPCAttack(false)
                    shiftAnimationQueue()
                  }
                  if (animateNPCHeal) {
                    setAnimateNPCHeal(false)
                    shiftAnimationQueue()
                  }
                  if (animateNPCFlash) {
                    setAnimateNPCFlash(false)
                    shiftAnimationQueue()
                  }
                  if (animateNPCPulse) {
                    setAnimateNPCPulse(false)
                    shiftAnimationQueue()
                  }
                }}
              />
              <div
                className={`statusBar npc ${
                  animateHealthBarEntry ? 'animateHealthBarEntry' : ''
                }`}
              >
                <p>
                  <strong>{cachedNPCState.categoryName}</strong>
                </p>
                <p>
                  HP:<span> </span>
                  {cachedNPCState.hp}
                </p>
                <div className="health-bar">
                  <div
                    className="health-bar-progress"
                    style={{ width: `${cachedNPCState.hp}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <Dialogue
          nextAnimation={nextAnimation}
          shiftAnimationQueue={shiftAnimationQueue}
        />
      </div>
    </Container>
  )
}
