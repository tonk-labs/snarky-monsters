import styled from 'styled-components'
import { useState } from 'react'

const Container = styled.div``

export default function MoveBox({ playerState, Game, selectMove }) {
  const [moveIndex, updateMoveIndex] = useState(0)
  const [showSwapOptions, setShowSwapOptions] = useState(false)
  const swapOptions = Game.Monsters.filter((m) => m.id != playerState.id)
  return (
    <Container>
      <h3>Pick your move</h3>
      {showSwapOptions && (
        <div>
          {swapOptions.map((m) => {
            return (
              <button
                key={m.id}
                onClick={() => {
                  setShowSwapOptions(false)
                  selectMove(
                    playerState.moves.find((m) => m.type === 0),
                    m.id,
                  )
                }}
              >
                {Game.CategoryNames[m.category]}
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
