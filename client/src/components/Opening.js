import styled from 'styled-components'

const Container = styled.div`
  text-align: center;
  padding: 8px;
`

export default function Opening({ setOpening }) {
  return (
    <Container>
      <h2>Welcome to snarky monsters</h2>
      <p>
        Get ready to dive into the world of Web3 and battle it out for ultimate
        dominance in this thrilling new video game! As a player, you'll face off
        against some of the toughest opponents the Web3 has to offer, using your
        wits, strategy, and a little bit of luck to emerge victorious.
      </p>
      <p>
        With each NPC opponent you face, you'll need to carefully study their
        play patterns and learn their strengths and weaknesses in order to
        defeat them. But don't get too comfortable - the Web3 is constantly
        evolving, and you'll need to stay on your toes if you want to come out
        on top. Whether you prefer to use brute force or cunning tactics, this
        game has something for everyone.{' '}
      </p>
      <button
        onClick={() => {
          setOpening(false)
        }}
      >
        begin
      </button>
    </Container>
  )
}
