import styled from 'styled-components'
import { useState } from 'react'
import BattleScreen from '@/components/BattleScreen.js'
import MoveBox from '@/components/MoveBox'
import Dialogue from '@/components/Dialogue'

const Container = styled.div``

export default function Battle({
  playerState,
  Game,
  selectMove,
  npcState,
  latestConfirmedPlayerMove,
  latestConfirmedNPCMove,
}) {
  const [dialogue, setDialogue] = useState('')
  const [showActions, setShowActions] = useState(false)
  return (
    <Container>
      <BattleScreen
        playerState={playerState}
        npcState={npcState}
        latestConfirmedPlayerMove={latestConfirmedPlayerMove}
        latestConfirmedNPCMove={latestConfirmedNPCMove}
        setDialogue={setDialogue}
      />
      {dialogue != '' && (
        <Dialogue
          dialogue={dialogue}
          setDialogue={setDialogue}
          setShowActions={setShowActions}
        />
      )}
      {showActions && (
        <MoveBox
          Game={Game}
          selectMove={selectMove}
          playerState={playerState}
        />
      )}
    </Container>
  )
}
