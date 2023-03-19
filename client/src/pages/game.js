import Head from 'next/head'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { loadMonsters, getMoves, hardcodedData } from '../data.js'
import { useState, useEffect } from 'react'

const Container = styled.div``

export default function Game() {
  const [monsters, setMonsters] = useState(null)
  const [moves, setMoves] = useState(null)

  useEffect(() => {
    loadMonsters().then((data) => {
      setMonsters(data.monsters)
    })
    getMoves().then((data) => {
      setMoves(data.moves)
    })
  }, [])

  return (
    <Container>
      {/* first they have to pick their character */}
      <h4>Pick your character</h4>
      {monsters ? (
        <div>
          {monsters.map((m) => {
            return (
              <button
                onClick={() => {
                  // This is where you need to send a message to the backend
                  console.log(m.category)
                }}
              >
                {hardcodedData.categories[m.category]}
              </button>
            )
          })}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {/* once character is picked then they can select moves */}
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
