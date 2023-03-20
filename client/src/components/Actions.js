import styled from 'styled-components'
import { useState } from 'react'

const Container = styled.div``

export default function Actions({ playerState, Game, selectMove }) {
  const [moveIndex, updateMoveIndex] = useState(0)
  return (
    <Container>
      <h3>Pick your move</h3>
      {playerState.moves.map((move) => {
        return (
          <button
            key={move.id}
            onClick={() => {
              selectMove(move.id)
            }}
          >
            {move.name}
          </button>
        )
      })}
    </Container>
  )
}
