import styled from 'styled-components'
import Image from 'next/image'
import discord from '../../public/discord.png'
import twitter from '../../public/twitter.png'

const Container = styled.div`
  .links {
    display: flex;
    justify-content: center;
    align-items: center;
    a {
      margin: 16px;
      &:hover {
        opacity: 0.8;
      }
      span {
        font-size: 22px;
        font-weight: boldest;
        position: relative;
        bottom: 2px;
      }
    }
  }
`

export default function Footer(props) {
  return (
    <Container>
      <div className="links">
        <a href="https://discord.gg/REF6tuZA7K" target="_blank">
          <Image src={discord} height={20} />
        </a>
        <a href="https://twitter.com/accessorlabs" target="_blank">
          <Image src={twitter} height={20} />
        </a>
        <a href="https://accessorlabs.org" target="_blank">
          <span>
            <strong>?</strong>
          </span>
        </a>
      </div>
    </Container>
  )
}
