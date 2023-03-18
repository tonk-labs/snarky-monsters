import Head from 'next/head'
import styled from 'styled-components'
import Leaderboard from '@/components/Leaderboard'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  .bigBox {
    width: 33%;
    border: #5f3400 double thick;
    padding: 8px;
    margin: 8px;
  }
`

const Preview = styled.div``

const About = styled.div``

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
        <Leaderboard />
        <Preview className="bigBox">
          <h2>Here's a nice preview of the game</h2>
        </Preview>
        <About className="bigBox">
          <h2>Welcome to snarky monsters</h2>
          <p>
            Get ready to dive into the world of Web3 and battle it out for
            ultimate dominance in this thrilling new video game! As a player,
            you'll face off against some of the toughest opponents the Web3 has
            to offer, using your wits, strategy, and a little bit of luck to
            emerge victorious.
          </p>
          <p>
            With each NPC opponent you face, you'll need to carefully study
            their play patterns and learn their strengths and weaknesses in
            order to defeat them. But don't get too comfortable - the Web3 is
            constantly evolving, and you'll need to stay on your toes if you
            want to come out on top. Whether you prefer to use brute force or
            cunning tactics, this game has something for everyone.{' '}
          </p>
          <hr />
          <h3>What is this?</h3>
          <p>explainer why the zk stuff is really cool</p>
        </About>
      </Container>
    </>
  )
}
