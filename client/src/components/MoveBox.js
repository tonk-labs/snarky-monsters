import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { shiftAnimationQueue } from '@/pages/gameActions'

const Container = styled.div``

export default function MoveBox({
  playerState,
  Game,
  selectMove,
  shiftAnimationQueue,
}) {
  const [moveIndex, updateMoveIndex] = useState(0)
  const [showSwapOptions, setShowSwapOptions] = useState(false)
  const [swapOptions, setSwapOptions] = useState(
    Game.Monsters.filter((monster) => monster.id != playerState.id),
  )

  useEffect(() => {
    setSwapOptions(
      Game.Monsters.filter((monster) => monster.id != playerState.id),
    )
  }, [setSwapOptions, Game.Monsters, playerState.id])
  return (
    <Container>
      <h3>Pick your move</h3>
      {showSwapOptions && (
        <div>
          {swapOptions.map((monster) => {
            console.log(playerState)
            return (
              <button
                key={monster.id}
                onClick={() => {
                  setShowSwapOptions(false)
                  selectMove(
                    playerState.moves.find((move) => move.type === 0),
                    monster,
                  )
                  shiftAnimationQueue()
                }}
              >
                {monster.categoryName}
              </button>
            )
          })}
        </div>
      )}
      {!showSwapOptions &&
        playerState.moves.map((move) => {
          if (move.type === 0) {
            return (
              <button
                key={move.id}
                onClick={() => {
                  setShowSwapOptions(true)
                }}
              >
                {move.name}
              </button>
            )
          } else {
            return (
              <button
                key={move.id}
                onClick={() => {
                  selectMove(move)
                  shiftAnimationQueue()
                }}
              >
                {move.name}
              </button>
            )
          }
        })}
    </Container>
  )
}
