import styled from 'styled-components'
import Image from 'next/image.js'
import { useState } from 'react'

const Container = styled.div`
  text-align: center;
  .monsterDiv {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

export default function MonsterPicker({
  monsters,
  categoryNames,
  setPickedMonsterId,
}) {
  const [carouselIndex, setCarouselIndex] = useState(0)

  console.log(carouselIndex);

  return (
    <Container>
      <h2>Pick your monster!</h2>
      <button
        onClick={() => {
          carouselIndex === 0
            ? setCarouselIndex(monsters.length - 1)
            : setCarouselIndex(carouselIndex - 1)
        }}
      >
        previous
      </button>
      <button
        onClick={() => {
          carouselIndex === monsters.length - 1
            ? setCarouselIndex(0)
            : setCarouselIndex(carouselIndex + 1)
        }}
      >
        next
      </button>
      <div className="monsterDiv">
        <Image
          src={`/sprite_category_${monsters[carouselIndex].category}.png`}
          width={200}
          height={200}
        />
        <h2>{categoryNames[monsters[carouselIndex].category]}</h2>
        <p>
          Some explainer text about this character. They're really great but
          watch out for X
        </p>
        <button
          onClick={() => {
            // This is where you need to send a message to the backend
            // Send fetch request to /backend
            // receive back state of game, sessionID & hash(randomness_1_server)
            // modify state to show that player has been picked (and stop showing the 'pick char' component)
            setPickedMonsterId(carouselIndex)
            // modify state to show that battle has begun (and start showing the 'battle' component)
          }}
        >
          Select fighter
        </button>
      </div>
    </Container>
  )
}
