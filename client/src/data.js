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
  moveNames: {
    3: 'Diamond Hands',
    4: 'Ape In',
    5: 'Use CBDC',
    6: 'Wanton Arrest',
    7: 'Take 10%',
    8: 'FOMO',
    9: 'Soul Cycle',
    10: 'Boozy Brunch',
    11: 'Flash Crash',
    12: 'Unleash Waluigi',
    13: 'Angry Tweet',
    14: 'Hard Fork',
    15: 'PlonK',
    16: 'Brute Force',
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
        attack
        crit
        miss
        category
        type
      }
    }
  `
  return request('http://localhost:4000/graphql/', query)
}

export { loadMonsters, getMoves, hardcodedData }
