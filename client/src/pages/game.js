import Head from 'next/head'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { getMonsters, getMoves } from '../data.js'

const Container = styled.div``

export default function Game() {
  getMonsters().then((data) => {
    console.log(data)
  })
  getMoves().then((data) => {
    console.log(data)
  })
  return (
    <Container>
      <h4>This is a really fun game</h4>
      <p>Character 1</p>
      <p>Character 2</p>
      <h4>Dialogue</h4>
      <p>Some snarky dialogue!</p>
      <h4>Controls</h4>
      <button>button 1</button>
      <button>button 2</button>

      <button>button 3</button>

      <button>button 4</button>
    </Container>
  )
}

// const PhaserWithNav = dynamic(() => import('@/components/PhaserWithNav'), {
//   ssr: false,
// })

// export default function Game() {
//   return <PhaserWithNav />
// }
