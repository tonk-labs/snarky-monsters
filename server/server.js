var express = require('express')
var { graphqlHTTP } = require('express-graphql')
var { buildSchema } = require('graphql')
const Game = require('./scripts/model.js')

console.log(Game)

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Stats {
    attack: Int!
    defense: Int!
  }

  type Monster {
    id: ID!
    hp: Int!
    stats: Stats!
    category: Int!
  }

  type Move {
    id: ID!
  }

  type Query {
    hello: String
    monsters: [Monster]
    moves: [Move]
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!'
  },

  monsters: () => {
    return Game.Monsters
  },

  moves: () => {
    return Game.Moves
  },
}

var app = express()
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
)

app.use(
  '/battle',
  // some logic for
  // 1. receiving character object
  // 2. generating session id, state, randomness
  // 3. storing them somewhere so server can be stateful
  // 4. sending information back to client

  // also some logic for
  // 1. receiving battle move
  // 2. generating return move
  // 3. sending back to client

  // also some logic for
  // 1. receiving representation of 'end-game'
  // 2. communicating that back to the client?
)

app.listen(4000)
console.log('Running a GraphQL API server at http://localhost:4000/graphql')
