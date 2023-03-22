import styled from 'styled-components'
import { useState, useEffect } from 'react'
import BattleScreen from '@/components/BattleScreen.js'
import MoveBox from '@/components/MoveBox'

const Container = styled.div``

export default function Battle({
  playerState,
  npcState,
  Game,
  selectMove,
  report,
  reportCounter,
  animationQueue,
  shiftAnimationQueue,
}) {
  const [showMoveBox, setShowMoveBox] = useState(false)
  const [savedReportCounter, setSavedReportCounter] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (animationQueue[0]) {
      setLoading(false)
      setShowMoveBox(animationQueue[0].type === 'showMoveBox')
    } else {
      setLoading(true)
      setShowMoveBox(false)
    }
  })
  return (
    <Container>
      <BattleScreen
        playerState={playerState}
        npcState={npcState}
        report={report}
        setShowMoveBox={setShowMoveBox}
        nextAnimation={animationQueue[0]}
        shiftAnimationQueue={shiftAnimationQueue}
      />
      {loading && <p>Loading...</p>}
      {showMoveBox && (
        <MoveBox
          Game={Game}
          selectMove={selectMove}
          playerState={playerState}
          setShowMoveBox={setShowMoveBox}
          shiftAnimationQueue={shiftAnimationQueue}
        />
      )}
    </Container>
  )
}
