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
        Snarky Monsters is a turn-based combat game quite unlike anything you've
        seen before. Start your journey in the world of web3 and fight off the
        many enemies you'll meet.
      </p>
      <p>
        Pick your moves wisely and rise to the top - with enough luck, skill and
        cunning, you too can take your place at the top of the crypto world.
      </p>
      <p>
        Under the hood, this game is completely trustless - all in-game activity
        is verified on the blockchain using zero-knowledge proofs. something
        more about why this is cool.
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
