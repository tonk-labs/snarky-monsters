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
    padding: 16px;
    margin: 8px;
  }
  @media (max-width: 1000px) {
    flex-direction: column;
    .bigBox {
      width: auto;
    }
  }
`

const Preview = styled.div`
  filter: brightness(1);
  &:hover {
    background-color: #e3ceb9;
    filter: brightness(1.1);
  }
  div {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: center;
    img {
      max-width: 100%;
      @media (max-width: 1000px) {
        width: 400px;
        max-width: 90%;
        margin: auto;
      }
      border: 1px solid #e3ceb9;
    }
  }
`

const About = styled.div``

export default function Home() {
  return (
    <Container>
      <Leaderboard />
      <Preview className="bigBox">
        <Link href="/game">
          <div>
            <h1>PLAY NOW</h1>

            <img src="preview.png" alt="game preview" />
          </div>
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
