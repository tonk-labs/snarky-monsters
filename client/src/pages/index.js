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
      <About className="bigBox">
        <h2 style={{ textAlign: 'center' }}>WELCOME!</h2>
        <p>
          Get ready to duke it out and achieve web3 stardom as you climb the
          ranks of crypto and battle enemies along the way.
        </p>
        <p>
          Will you embrace life as the Bitcoin Maxi, launching tirades of angry
          tweets, or wield the Degen's diamond hands?
        </p>
        <p>
          Some moves are super effective against particular enemies but you'll
          need to figure out what works against who.
        </p>
        <p>
          The clock is ticking and with the right blend of strategy, luck and
          timing you too can emerge victorious among the Snarky Monsters!
        </p>
        <hr />
        <h3 style={{ textAlign: 'center' }}>UNDER THE HOOD</h3>
        <p>
          Accessor Labs' mission is to restore the magic of open networks by
          porting artificially intelligent agents into on-chain games.
        </p>
        <p>
          Fully on-chain games - or "Autonomous Worlds" - can solve (1) the
          platform risk endemic to gaming and (2) the challenge of making web3
          mainstream. However, in 2023, blockchain infrastructure is too slow
          and public to run most video games.
        </p>
        <p>
          A combination of cryptographic hacks and game design allows us to
          recreate Pokémon-style battles in a trustless, low latency environment
          incorporating hidden information. In other words, a simple, fun game!
        </p>
      </About>
      <Preview className="bigBox">
        <Link href="/game">
          <div>
            <h1>PLAY NOW</h1>

            <img src="preview.png" alt="game preview" />
          </div>
        </Link>
      </Preview>
      <Leaderboard />
    </Container>
  )
}
