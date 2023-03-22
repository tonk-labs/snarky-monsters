import styled from 'styled-components'
import { useEffect, useState } from 'react'
import next from 'next'

const Container = styled.div``

export default function Dialogue({
  nextAnimation,
  shiftAnimationQueue,
  setShowMoveBox,
}) {
  const [displayText, setDisplayText] = useState('')
  const text = nextAnimation ? nextAnimation.content : ''
  useEffect(() => {
    if (nextAnimation && nextAnimation.type === 'dialogue') {
      let currentIndex = 0
      let timer = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(timer)
        }
      }, 10)
      return () => clearInterval(timer)
    }
  }, [text, nextAnimation])
  if (nextAnimation && nextAnimation.type === 'dialogue') {
    return (
      <div>
        <p>{displayText}</p>
        <button onClick={() => shiftAnimationQueue()}>Next</button>
      </div>
    )
  }
}
