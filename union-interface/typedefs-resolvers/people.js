const { gql } = require('apollo-server')
const dbWorks = require('../dbWorks.js')

// union과 interface를 사용하는 people 선언
const typeDefs = gql`
    type People {
        id: ID!
        first_name: String!
        last_name: String!
        sex: Sex!
        blood_type: BloodType!
        serve_years: Int!
        role: Role!
        team: ID!
        from: String!
        tools: [Tool]
        givens: [Given]
    }
`

const resolvers = {
    Query: {
        people: (parent, args) => dbWorks.getPeople(args),
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}