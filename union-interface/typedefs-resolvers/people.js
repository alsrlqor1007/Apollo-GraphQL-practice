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
    input PostPersonInput {
        first_name: String!
        last_name: String!
        sex: Sex!
        blood_type: BloodType!
        serve_years: Int!
        role: Role!
        team: ID!
        from: String!
    }
`

const resolvers = {
    Query: {
        people: (parent, args) => dbWorks.getPeople(args),
        // 받아올 정보 필터링
        peopleFiltered: (parent, args) => dbWorks.getPeople(args),
        // 리스트 페이지네이션 구현 (필터링도 동시에 가능)
        peoplePaginated: (parent, args) => dbWorks.getPeople(args),
    },
    Mutation: {
        postPerson: (parent, args) => dbWorks.postPerson(args),
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}