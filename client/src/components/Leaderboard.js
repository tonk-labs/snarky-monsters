import styled from 'styled-components'

const Container = styled.div`
  border: #5f3400 double thick;
  padding: 8px;
  margin: 8px;
  width: 33%;
  @media (max-width: 1000px) {
    width: auto;
  }
  li {
    font-size: 16px;
  }
`

export default function Leaderboard(props) {
  return (
    <Container>
      <h2>Leaderboard</h2>
      <ol>
        <li>BAZ</li>
        <li>GAV</li>
        <li>WOZ</li>
        <li>DOM</li>
        <li>CEC</li>
        <li>BAZ</li>
        <li>GAV</li>
        <li>WOZ</li>
        <li>DOM</li>
        <li>CEC</li>
      </ol>
    </Container>
  )
}
