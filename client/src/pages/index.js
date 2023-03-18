import Head from 'next/head'
import styled from 'styled-components'
import Leaderboard from '@/components/Leaderboard'
import Link from 'next/link'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  .bigBox {
    width: 33%;
    border: #5f3400 double thick;
    padding: 8px;
    margin: 8px;
  }
  @media (max-width: 800px) {
    flex-direction: column;
    .bigBox {
      width: auto;
    }
  }
  /* at 375px width, you should still be able to have space for 8px padding either side of game - 359 game width */
`

const Preview = styled.div``

const About = styled.div``

export default function Home() {
  return (
    <Container>
      <Leaderboard />
      <Preview className="bigBox">
        <h2>Here's a nice preview of the game</h2>
        <Link href="/game">
          <button>Play game</button>
        </Link>
      </Preview>
      <About className="bigBox">
        <h2>Welcome to snarky monsters</h2>
        <p>
          Get ready to dive into the world of Web3 and battle it out for
          ultimate dominance in this thrilling new video game! As a player,
          you'll face off against some of the toughest opponents the Web3 has to
          offer, using your wits, strategy, and a little bit of luck to emerge
          victorious.
        </p>
        <p>
          With each NPC opponent you face, you'll need to carefully study their
          play patterns and learn their strengths and weaknesses in order to
          defeat them. But don't get too comfortable - the Web3 is constantly
          evolving, and you'll need to stay on your toes if you want to come out
          on top. Whether you prefer to use brute force or cunning tactics, this
          game has something for everyone.{' '}
        </p>
        <hr />
        <h3>What is this?</h3>
        <p>
          Accessor Labs’ ZK-ML tooling empowers game creators to enrich their
          games with vibrant, trustless, intelligent agents. Furthermore, we are
          developing our own games to test this capability and inspire a
          community of game devs. Right now we are working on a cooking game
          that showcases proof of LSTM model execution and are excited to share
          it out in Q1 2023.{' '}
        </p>
      </About>
    </Container>
  )
}
