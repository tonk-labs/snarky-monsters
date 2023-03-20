import styled from 'styled-components'
import { useState } from 'react'
import Image from 'next/image.js'

const Container = styled.div`
  #enemyDiv {
    animation-duration: 2s;
    animation-name: enemyAppears;
  }

  @keyframes enemyAppears {
    from {
      margin-left: 100%;
      width: 300%;
    }
    to {
      margin-left: 0%;
      width: 100%;
    }
  }
`

export default function BattleScreen({
  playerState,
  npcState,
  setDialogue,
  setShowActions,
}) {
  return (
    <Container>
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
        <div
          id="enemyDiv"
          onAnimationEnd={() => {
            setDialogue(`A wild ${npcState.name} appeared!`)
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
      ) : (
        <p>Finding monster...</p>
      )}
    </Container>
  )
}
