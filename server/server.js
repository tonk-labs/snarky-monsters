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
app.listen(4000)
console.log('Running a GraphQL API server at http://localhost:4000/graphql')
