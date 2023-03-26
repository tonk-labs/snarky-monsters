import styled from 'styled-components'

const Container = styled.div`
  height: 100%;
  width: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  .button {
    padding: 5%;
    width: 50%;
    background-color: #cda882;
    margin-top: 10%;
    border: 2px solid #5f3400;
    border-radius: 4px;
    filter: brightness(1);
    font-weight: bolder;
    &:hover {
      cursor: pointer;
      filter: brightness(1.1);
    }
  }
`

export default function Opening({ setOpening, playMusic }) {
  return (
    <Container>
      <h1>WELCOME!</h1>
      <p>
        Get ready to duke it out and achieve web3 stardom as you climb the ranks
        of crypto and battle enemies along the way.
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
      <p>
        A combination of cryptographic hacks and game design allows us to
        recreate Pokémon-style battles in a trustless, low latency environment
        incorporating hidden information. In other words: a simple, fun game.
      </p>
      <div
        className="button"
        onClick={() => {
          setOpening(false)
          playMusic()
        }}
      >
        LET'S PLAY!
      </div>
    </Container>
  )
}
