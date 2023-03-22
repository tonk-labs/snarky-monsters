import styled from 'styled-components'
import { useEffect, useState } from 'react'
import Image from 'next/image.js'
import Dialogue from '@/components/Dialogue'

const Container = styled.div`
  .playerImg {
    background-color: red;
  }
  .npcImg {
    background-color: blue;
    position: relative;
    left: 100px;
  }
  .animatePlayerEntry {
    background-color: red;
    animation-duration: 5s;
    animation-name: playerAppears;
  }
  @keyframes playerAppears {
    from {
      margin-left: 100%;
      width: 300%;
    }
    to {
      margin-left: 0%;
      width: 100%;
    }
  }
  .animateNPCEntry {
    animation-duration: 2s;
    animation-name: enemyAppears;
  }
  @keyframes enemyAppears {
    from {
      left: 100px;
    }
    to {
      left: 0px;
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
  report,
  setShowMoveBox,
  nextAnimation,
  shiftAnimationQueue,
}) {
  const [animatePlayerEntry, setAnimatePlayerEntry] = useState(false)
  const [animateNPCEntry, setAnimateNPCEntry] = useState(false)
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
  // useEffect doesn't run if (1) a props changes where (2) the props is an array and (3) just the contents of the array change. We want
  useEffect(() => {
    if (nextAnimation && nextAnimation.type === 'visual') {
      switch (nextAnimation.animation) {
        case 'animatePlayerEntry':
          setAnimatePlayerEntry(true)
          break
        case 'animateNPCEntry':
          setAnimateNPCEntry(true)
          break
        case 'animatePlayerFlash':
          setAnimatePlayerFlash(true)
          break
        case 'animateNPCFlash':
          setAnimateNPCFlash(true)
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
        id="playerCache"
        onAnimationEnd={() => {
          // this will be used to update hp, category name and sprite
          setCachedPlayerState(playerState)
        }}
      >
        <div
          className={`playerImg ${
            animatePlayerEntry ? 'animatePlayerEntry' : ''
          } ${animatePlayerFlash ? 'flash-image' : ''}
          `}
          onAnimationEnd={() => {
            setAnimatePlayerEntry(false)
            setAnimatePlayerFlash(false)
            shiftAnimationQueue()
          }}
        >
          {/* what is rendered on the UI needs to take its cue from the animation queue */}
          {/* playerstate and npcstate will update separately to how you want the animation to run */}
          {/* one option is to remove them as soon as you make the swap request */}
          {/* another option is to change these references so that instead of reading from state they read from animation queue */}
          {/* in which case animation queue would need to contain information about which monsters are currently in play */}
          {/* and then locally you would cache this in the component as {cachedPlayerState} */}
          {/* {cachedPlayerState} updates when a particular item comes up in the animation queue */}

          <h3>{cachedPlayerState.categoryName}</h3>
          <p>
            <strong>HP: </strong>
            {playerState.hp}
          </p>
          <Image
            src={`/sprite_category_${cachedPlayerState.category}.png`}
            width={50}
            height={50}
            alt="sprite"
          />
        </div>
      </div>
      {npcState.categoryName != null && (
        <div
          className={`npcImg ${animateNPCEntry ? 'animateNPCEntry' : ''} ${
            animateNPCFlash ? 'flash-image' : ''
          }`}
          onAnimationEnd={() => {
            setAnimateNPCEntry(false)
            setAnimateNPCFlash(false)
            shiftAnimationQueue()
          }}
        >
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
      )}
      <Dialogue
        nextAnimation={nextAnimation}
        shiftAnimationQueue={shiftAnimationQueue}
        setShowMoveBox={setShowMoveBox}
      />
    </Container>
  )
}
