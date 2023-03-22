import styled from 'styled-components'
import { useEffect, useState } from 'react'
import next from 'next'

const Container = styled.div`
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
  }
`

export default function Dialogue({
  nextAnimation,
  shiftAnimationQueue,
  setShowMoveBox,
}) {
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
      }, 10)
      return () => clearInterval(timer)
    }
  }, [text, nextAnimation])
  if (nextAnimation && nextAnimation.type === 'dialogue') {
    return (
      <Container>
        {displayText === 'What will you do?' && (
          <p className="fadeIn">{displayText}</p>
        )}
        {displayText != 'What will you do?' && <p>{displayText}</p>}

        {showButton && (
          <button
            onClick={() => {
              setShowButton(false)
              shiftAnimationQueue()
            }}
          >
            Next
          </button>
        )}
      </Container>
    )
  }
}
