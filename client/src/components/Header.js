import styled from 'styled-components'
import Image from 'next/image'
import Link from 'next/link'
import discord from '../../public/discord.png'
import twitter from '../../public/twitter.png'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  h1 {
    &:hover {
      opacity: 0.8;
    }
  }
  .links {
    display: flex;
    align-items: center;
    a {
      margin-left: 16px;
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
  @media (max-width: 400px) {
    h1 {
      font-size: 20px;
    }
  }
`

export default function Header(props) {
  return (
    <Container>
      <Link href="/">
        <h1>Snarky Monsters!</h1>
      </Link>
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
