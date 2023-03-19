import { request, gql } from 'graphql-request'

const hardcodedData = {
  categories: {
    1: 'Degen',
    2: 'Regulator',
    3: 'Venture Capitalist',
    4: 'Normie',
    5: 'Artificial General Intelligence',
    6: 'Bitcoin Maxi',
    7: 'Moon Mather',
  },
  moveTypes: {
    0: 'Re-train',
    1: 'Heal',
    2: 'Attack',
    3: 'Buff',
    4: 'Nerf',
  },
}

function loadMonsters() {
  const query = gql`
    {
      monsters {
        id
        hp
        stats {
          attack
          defense
        }
        category
      }
    }
  `
  return request('http://localhost:4000/graphql/', query)
}

function getMoves() {
  const query = gql`
    {
      moves {
        id
      }
    }
  `
  return request('http://localhost:4000/graphql/', query)
}

export { loadMonsters, getMoves, hardcodedData }
