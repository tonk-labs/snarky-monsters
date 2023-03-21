import styled from 'styled-components'
import { useState } from 'react'

const Container = styled.div``

export default function Dialogue({ dialogue, setDialogue, setShowActions }) {
  return (
    <div>
      <p>{dialogue}</p>
      <button
        onClick={() => {
          setShowActions(true)
          setDialogue('')
        }}
      >
        next
      </button>
    </div>
  )
}
