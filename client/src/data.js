import { request, gql } from 'graphql-request'

function getMonsters() {
  const query = gql`
    {
      monsters {
        id
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

export { getMonsters, getMoves }
