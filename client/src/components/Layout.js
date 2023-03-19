import Header from './Header'
import Footer from './Footer'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 1000px;
  margin: auto;
`

export default function Layout({ children }) {
  return (
    <Container>
      <Header />
      <main>{children}</main>
      <Footer />
    </Container>
  )
}
