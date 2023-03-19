import Head from 'next/head'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { loadMonsters, getMoves, hardcodedData } from '../data.js'
import { useState, useEffect } from 'react'
import Opening from '@/components/Opening.js'
import MonsterPicker from '@/components/MonsterPicker.js'
import Image from 'next/image.js'

const Container = styled.div`
  background-color: red;
  height: calc(100vh - 147px);
`

export default function Game() {
  const [opening, setOpening] = useState(true)
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
      {opening ? (
        <Opening setOpening={setOpening} />
      ) : monsters ? (
        <MonsterPicker monsters={monsters} hardcodedData={hardcodedData} />
      ) : startBattle ? (
        <Battle />
      ) : (
        <p>endgame</p>
      )}
      {/* first they have to pick their character */}
    </Container>
  )
}

// const PhaserWithNav = dynamic(() => import('@/components/PhaserWithNav'), {
//   ssr: false,
// })

// export default function Game() {
//   return <PhaserWithNav />
// }
