import styled from 'styled-components'
import { useState, useEffect } from 'react'

const Container = styled.div``

export default function LoadingMoves() {
  const [dots, setDots] = useState('')
  const [numDots, setNumDots] = useState(1)

  useEffect(() => {
    let timer = setInterval(() => {
      if (numDots < 3 && dots.endsWith('.')) {
        setNumDots(numDots + 1)
      } else if (numDots > 1 && dots.endsWith('...')) {
        setNumDots(0)
      }
      setDots('.'.repeat(numDots))
    }, 300)
    return () => clearInterval(timer)
  }, [numDots, dots])

  return (
    <Container>
      <p>Loading{dots}</p>
    </Container>
  )
}
