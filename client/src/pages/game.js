import Head from 'next/head'
import styled from 'styled-components'
import dynamic from 'next/dynamic'

const Container = styled.div``

const PhaserWithNav = dynamic(() => import('@/components/PhaserWithNav'), {
  ssr: false,
})

export default function Game() {
  return <PhaserWithNav />
}
