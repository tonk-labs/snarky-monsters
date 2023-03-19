import Head from 'next/head'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { loadMonsters, getMoves, hardcodedData } from '../data.js'
import { useState, useEffect } from 'react'
import Opening from '@/components/Opening.js'
import MonsterPicker from '@/components/MonsterPicker.js'
import Image from 'next/image.js'

const Container = styled.div`
  border: #5f3400 double thick;

  height: calc(100vh - 147px);
  padding: 8px;
`

function BattleScreen({ monster, moves }) {
  console.log(moves)
  return (
    <div>
      <p>here can live the battle screen</p>
      <p>{hardcodedData.categories[monster.category]}</p>
      <Image
        src={`/sprite_category_${monster.category}.png`}
        width={200}
        height={200}
        alt="sprite"
      />
    </div>
  )
}

function Actions({ moves, hardcodedData }) {
  return (
    <div>
      <h3>Pick your move</h3>
      {moves.map((move) => {
        console.log
        return (
          <button
            onClick={() => {
              // here is the turn logic
            }}
          >
            {hardcodedData.moveNames[move.id]}
          </button>
        )
      })}
    </div>
  )
}

function Battle({ monster, moves, hardcodedData }) {
  return (
    <>
      <BattleScreen monster={monster} />
      <Actions moves={moves} hardcodedData={hardcodedData} />
    </>
  )
}

export default function Game() {
  const [opening, setOpening] = useState(true)
  const [monsters, setMonsters] = useState(null)
  const [moves, setMoves] = useState(null)
  const [pickedMonsterId, setPickedMonsterId] = useState(null)

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
      ) : monsters && !pickedMonsterId ? (
        <MonsterPicker
          monsters={monsters}
          hardcodedData={hardcodedData}
          setPickedMonsterId={setPickedMonsterId}
        />
      ) : pickedMonsterId ? (
        <Battle
          monster={monsters[pickedMonsterId]}
          hardcodedData={hardcodedData}
          moves={moves.filter((m) => {
            return m.category === pickedMonsterId + 1
          })}
        />
      ) : (
        <p>endgame</p>
      )}
    </Container>
  )
}

// const PhaserWithNav = dynamic(() => import('@/components/PhaserWithNav'), {
//   ssr: false,
// })

// export default function Game() {
//   return <PhaserWithNav />
// }
