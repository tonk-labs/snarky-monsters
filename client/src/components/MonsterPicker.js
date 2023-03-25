import styled from 'styled-components'
import Image from 'next/image.js'
import { useEffect, useState } from 'react'

const Container = styled.div`
  text-align: center;
  position: relative;
  top: 20%;
  .monsterDiv {
    display: flex;
    flex-direction: column;
    align-items: center;
    #carousel {
      display: flex;
      justify-content: space-between;
      img {
        width: 50%;
      }
      .cycleButton {
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: center;

        div {
          background-color: #cda882;
          padding: 10%;
          border: 2px solid #5f3400;
          border-radius: 4px;
          filter: brightness(1);
          &:hover {
            cursor: pointer;
            filter: brightness(1.1);
          }
          p {
            margin: 0;
          }
        }
      }
    }
  }
  .button {
    margin-top: 10%;
    padding: 2%;
    background-color: #cda882;
    border: 2px solid #5f3400;
    border-radius: 4px;
    filter: brightness(1);
    font-weight: bolder;
    &:hover {
      cursor: pointer;
      filter: brightness(1.1);
    }
  }
`

export default function MonsterPicker({
  monsters,
  playerSelectMonster,
  fetchNPC,
}) {
  const [carouselIndex, setCarouselIndex] = useState(0)

  return (
    <Container>
      <h2 style={{ marginTop: '0' }}>CHOOSE FIGHTER</h2>
      <div className="monsterDiv">
        <div id="carousel">
          <div
            className="cycleButton"
            onClick={() => {
              carouselIndex === 0
                ? setCarouselIndex(monsters.length - 1)
                : setCarouselIndex(carouselIndex - 1)
            }}
          >
            <div>
              <p>
                <strong>PREV</strong>
              </p>
            </div>
          </div>
          <img
            src={`/sprite_category_${monsters[carouselIndex].category}.png`}
            alt="sprite"
          />

          <div
            className="cycleButton"
            onClick={() => {
              carouselIndex === monsters.length - 1
                ? setCarouselIndex(0)
                : setCarouselIndex(carouselIndex + 1)
            }}
          >
            <div>
              <p>
                <strong>NEXT</strong>
              </p>
            </div>
          </div>
        </div>
        <h2>{monsters[carouselIndex].categoryName}</h2>
        <p>
          Some explainer text about this character. They're really great but
          watch out for X
        </p>
        <div
          className="button"
          onClick={() => {
            playerSelectMonster(carouselIndex + 1)
          }}
        >
          BEGIN
        </div>
      </div>
    </Container>
  )
}
