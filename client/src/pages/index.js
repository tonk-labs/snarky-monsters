import Head from 'next/head'
import styled from 'styled-components'

const Container = styled.div``

export default function Home() {
  return (
    <>
      <Head>
        <title>Snarky Monsters!</title>
        <meta
          name="description"
          content="Battle your way to web3 domination against ZK-powered NPCs"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Container>
        <p>contetn</p>
      </Container>
    </>
  )
}
