import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Web3ConnectManager from '@/pages/api/web3ConnectManager'
import { checkVerification } from '@/pages/api/apiHelpers'

const Container = styled.div`
  border: #5f3400 double thick;
  padding: 16px;
  margin: 8px;
  width: 33%;
  overflow: hidden;
  @media (max-width: 1000px) {
    width: auto;
  }
  li {
    margin-left: -40px;
    font-size: 16px;
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
    text-overflow: ellipsis;
    max-width: calc(100% + 40px);
    margin-top: 10px;
    overflow: scroll;
  }
  li::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
  p {
    margin-top: -5px;
  }
`
const LeaderboardList = styled.div`
  height: 80%;
`

const VerificationBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 20%;
  text-align: center;
`

const VerificationDisplayBox = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
`

const CenterDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
`
const StyledButton = styled.button`
  background-color: #cda882;
  width: 60%;
  margin: auto;
  padding: 2%;
  border: 2px solid #5f3400;
  border-radius: 4px;
  filter: brightness(1);
  margin-top: 2%;
  font-weight: 600;
  &:hover {
    cursor: pointer;
    filter: brightness(1.1);
  }
`

const CenterButton = styled.div``

export default function Leaderboard(props) {
  const [isConnected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [numberOfWins, setNumberOfWins] = useState(0)
  const [numberPending, setNumberPending] = useState(0)
  const [didCheckVerification, setDidCheckVerification] = useState(false)

  const connect = () => {
    return Web3ConnectManager.getInstance()
      .connectWallet()
      .then(() => {
        setConnected(true)
      })
  }

  const checkVerified = () => {
    checkVerification().then(({ numberOfWins, pendingGames }) => {
      setNumberOfWins(numberOfWins)
      setNumberPending(pendingGames)
      setDidCheckVerification(true)
    })
  }

  useEffect(() => {
    if (!isConnected && Web3ConnectManager.getInstance().hasConnected()) {
      connect().then(() => setLoading(false))
    } else {
      setLoading(false)
    }
  })

  return (
    <Container>
      {!loading && isConnected ? (
        <div className="leaderList">
          <h2 style={{ textAlign: 'center' }}>Leaderboard</h2>
          <LeaderboardList>
            <ol>
              <li>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</li>
              <li>0x70997970C51812dc3A010C7d01b50e0d17dc79C8</li>
              <li>0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC</li>
              <li>0x90F79bf6EB2c4f870365E785982E1f101E93b906</li>
              <li>0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65</li>
              <li>0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc</li>
              <li>0x976EA74026E726554dB657fA54763abd0C3a0aa9</li>
              <li>0x14dC79964da2C08b23698B3D3cc7Ca32193d9955</li>
              <li>0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f</li>
              <li>0xa0Ee7A142d267C1f36714E4a8F75612F20a79720</li>
              <li>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</li>
              <li>0x70997970C51812dc3A010C7d01b50e0d17dc79C8</li>
              <li>0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC</li>
              <li>0x90F79bf6EB2c4f870365E785982E1f101E93b906</li>
            </ol>
            <hr />
          </LeaderboardList>
          <VerificationBox>
            <h3>CHECK VERIFICATION</h3>
            <p>Check your pending and verified wins</p>
            <VerificationDisplayBox>
              {didCheckVerification ? (
                <div>
                  <p>{`Number of wins: ${numberOfWins}`}</p>
                  <p>{`Pending proofs: ${numberPending}`}</p>
                </div>
              ) : (
                <StyledButton onClick={checkVerified}>
                  CHECK VERIFICATION
                </StyledButton>
              )}
            </VerificationDisplayBox>
          </VerificationBox>
        </div>
      ) : !loading ? (
        <CenterDiv>
          <StyledButton onClick={connect}>CONNECT WALLET</StyledButton>
        </CenterDiv>
      ) : (
        <CenterDiv></CenterDiv>
      )}
    </Container>
  )
}
