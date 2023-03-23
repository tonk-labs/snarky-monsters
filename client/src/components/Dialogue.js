import styled from 'styled-components'
import { useEffect, useState } from 'react'
import next from 'next'

const Container = styled.div`
  position: relative;
  height: 20%;
  background-color: #cda882;
  p {
    margin: 0;
    padding: 3% 5%;
  }
  .fadeIn {
    animation-duration: 0.1s;
    animation-name: fadeIn;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .nextButton {
    background-color: #cda882;
    display: inline-block;
    padding: 0.5%;
    border: 2px solid #5f3400;
    border-radius: 4px;
    filter: brightness(1);
    position: absolute;
    bottom: 10%;
    right: 3%;
    &:hover {
      cursor: pointer;
      filter: brightness(1.1);
    }
  }
`

export default function Dialogue({ nextAnimation, shiftAnimationQueue }) {
  const [displayText, setDisplayText] = useState('')
  const [showButton, setShowButton] = useState(false)
  const text = nextAnimation ? nextAnimation.content : ''
  useEffect(() => {
    if (nextAnimation && nextAnimation.type === 'dialogue') {
      console.log(nextAnimation.content)
      let currentIndex = 0
      let timer = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          setShowButton(true)
          clearInterval(timer)
        }
      }, 20)
      return () => clearInterval(timer)
    }
  }, [text, nextAnimation])
  return (
    <Container>
      {nextAnimation && nextAnimation.type === 'dialogue' && (
        <div id="inner">
          {displayText === 'What will you do?' && (
            <p className="fadeIn">{displayText}</p>
          )}
          {displayText != 'What will you do?' && <p>{displayText}</p>}

          {showButton && (
            <div
              className="nextButton"
              onClick={() => {
                setShowButton(false)
                shiftAnimationQueue()
              }}
            >
              NEXT
            </div>
          )}
        </div>
      )}
    </Container>
  )
}
