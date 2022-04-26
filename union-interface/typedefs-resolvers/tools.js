const { gql } = require('apollo-server')

// 공통 요소들을 뽑아 인터페이스로 지정
const typeDefs = gql`
    interface Tool {
        id: ID!
        used_by: Role!
    }
`

const resolvers = {
    Tool: {
        __resolveType(tool, context, info) {
            if (tool.developed_by) {
                return 'Software'
            }
            if (tool.new_or_used) {
                return 'Equipment'
            }
            return null
        }
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}