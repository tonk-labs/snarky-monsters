import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { shiftAnimationQueue } from '@/pages/gameActions'

const Container = styled.div`
  text-align: center;
  position: relative;
  top: 3%;
  h3 {
    margin-bottom: 0;
    margin-top: 0;
  }
  #moveButtons {
    width: 100%;
    display: flex;
    flex-wrap: wrap-reverse;
    justify-content: space-around;
    margin-top: 2%;

    .moveButton {
      background-color: #cda882;
      width: 40%;
      padding: 2%;
      border: 2px solid #5f3400;
      border-radius: 4px;
      filter: brightness(1);
      margin-top: 2%;
      &:hover {
        cursor: pointer;
        filter: brightness(1.1);
      }
    }
  }
  #monsterButtons {
    position: relative;
    top: 2%;
    display: flex;
    flex-direction: column;
    align-items: center;
    div {
      background-color: #cda882;
      padding: 1%;
      width: 75%;
      border: 2px solid #5f3400;
      border-radius: 4px;
      filter: brightness(1);
      margin-top: 1%;
      &:hover {
        cursor: pointer;
        filter: brightness(1.1);
      }
    }
    scale: 0.9;
  }
`

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
      <h3>SELECT MOVE</h3>
      {showSwapOptions && (
        <div id="monsterButtons">
          {swapOptions.map((monster) => {
            return (
              <div
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
              </div>
            )
          })}
        </div>
      )}
      {!showSwapOptions && (
        <div id="moveButtons">
          {playerState.moves.map((move) => {
            if (move.type === 0) {
              return (
                <div
                  className="moveButton"
                  key={move.id}
                  onClick={() => {
                    setShowSwapOptions(true)
                  }}
                >
                  {move.name.toUpperCase()}
                </div>
              )
            } else {
              return (
                <div
                  className="moveButton"
                  key={move.id}
                  onClick={() => {
                    selectMove(move)
                    shiftAnimationQueue()
                  }}
                >
                  {move.name.toUpperCase()}
                </div>
              )
            }
          })}
        </div>
      )}
    </Container>
  )
}
