import styled from 'styled-components'
import { useEffect, useState } from 'react'
import Image from 'next/image.js'
import Dialogue from '@/components/Dialogue'

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
    #playerCache {
      width: 50%;
    }
    #npcCache {
      width: 50%;
    }
    .statusBar {
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
    img {
      position: absolute;
      top: 25%;
      right: 17%;
      width: 0%;
      transform: scaleX(-1);
    }
  }
  .animatePlayerEntry {
    animation: 2s playerAppears forwards;
  }
  @keyframes playerAppears {
    0% {
      width: 0;
      height: 0;
    }
    100% {
      width: 29%;
      transform: rotate(720deg) scale(1);
    }
  }
  .animateNPCEntry {
    animation: 2s enemyAppears forwards;
  }
  @keyframes enemyAppears {
    0% {
      width: 0;
      height: 0;
      transform: translate(-50%, -50%) rotate(0) scale(0);
    }
    100% {
      width: 20%;
      transform: translate(0%, 0%) rotate(-720deg) scaleX(-1);
    }
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
  const [animatePlayerHeal, setAnimatePlayerHeal] = useState(false)
  const [animateNPCHeal, setAnimateNPCHeal] = useState(false)
  const [animateHealthBarEntry, setAnimateHealthBarEntry] = useState(false)
  const [animatePlayerAttack, setAnimatePlayerAttack] = useState(false)
  const [animateNPCAttack, setAnimateNPCAttack] = useState(false)
  const [animatePlayerFlash, setAnimatePlayerFlash] = useState(false)
  const [animateNPCFlash, setAnimateNPCFlash] = useState(false)
  const [animateNPCDepleteHP, setAnimateNPCDepleteHP] = useState(false)
  const [animatePlayerDepleteHP, setAnimatePlayerDepleteHP] = useState(false)
  const [animateVictory, setAnimateVictory] = useState(false)
  const [animateDefeat, setAnimateDefeat] = useState(false)
  const [cachedPlayerState, setCachedPlayerState] = useState(playerState)
  const [cachedNPCState, setCachedNPCState] = useState(npcState)
  const [rand, setRand] = useState(Math.floor(Math.random() * 4) + 1)

  // useEffect doesn't run if (1) a props changes where (2) the props is an array and (3) just the contents of the array change. We want
  useEffect(() => {
    if (nextAnimation && nextAnimation.type === 'visual') {
      switch (nextAnimation.animation) {
        case 'animatePlayerEntry':
          setAnimatePlayerEntry(true)
          break
        case 'animateNPCEntry':
          setCachedNPCState(npcState)
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
        case 'animatePlayerSwap':
        // animate as usual, but playerState is changing too.
        // after animation ends, you will need to update locally cached playerstate
      }
    }
  }, [setAnimatePlayerEntry, nextAnimation])

  return (
    <Container>
      <div
        id="top"
        style={{
          backgroundImage: `url(../../battleBackground_${rand}.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '80%',
        }}
      >
        <div
          id="playerCache"
          onAnimationEnd={() => {
            // this will be used to update hp, category name and sprite
            setCachedPlayerState(playerState)
          }}
        >
          <div className="statusBar player">
            <p>
              <strong>{cachedPlayerState.categoryName}</strong>
            </p>
            <p>
              HP:<span> </span>
              {playerState.hp}
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
            alt="sprite"
            className={`
                playerImg
                ${animatePlayerAttack ? 'animatePlayerAttack' : ''}
                ${animatePlayerHeal ? 'animatePlayerHeal' : ''}
                ${animatePlayerEntry ? 'animatePlayerEntry' : ''}
                ${animatePlayerFlash ? 'flash-image' : ''}
              `}
            onAnimationEnd={() => {
              if (animatePlayerAttack) {
                setAnimatePlayerAttack(false)
              }
              if (animatePlayerHeal) {
                setAnimatePlayerHeal(false)
              }
              if (animatePlayerEntry && !playerEntered) {
                setPlayerEntered(true)
                // setAnimatePlayerEntry(false)
              }
              if (animatePlayerFlash) {
                setAnimatePlayerFlash(false)
              }
              shiftAnimationQueue()
            }}
          />
        </div>
        {npcState.categoryName != null && (
          <div
            id="npcCache"
            onAnimationEnd={() => {
              // this will be used to update hp, category name and sprite
              setCachedNPCState(npcState)
            }}
          >
            <div
              className={`npcImg  ${animateNPCFlash ? 'flash-image' : ''}`}
              onAnimationEnd={() => {
                setAnimateNPCFlash(false)
                shiftAnimationQueue()
              }}
            >
              <img
                src={`/sprite_category_${cachedNPCState.category}.png`}
                alt="sprite"
                className={`${animateNPCAttack ? 'animateNPCAttack' : ''}
                 ${animateNPCHeal ? 'animateNPCHeal' : ''}
                ${animateNPCEntry ? 'animateNPCEntry' : ''}

`}
                onAnimationEnd={() => {
                  setAnimateNPCAttack(false)
                  shiftAnimationQueue()
                }}
              />
            </div>
            <div className="statusBar npc">
              <p>
                <strong>{cachedNPCState.categoryName}</strong>
              </p>
              <p>
                HP:<span> </span>
                {npcState.hp}
              </p>
              <div className="health-bar">
                <div
                  className="health-bar-progress"
                  style={{ width: `${cachedPlayerState.hp}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Dialogue
        nextAnimation={nextAnimation}
        shiftAnimationQueue={shiftAnimationQueue}
      />
    </Container>
  )
}
