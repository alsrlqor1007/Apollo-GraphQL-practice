const { gql } = require('apollo-server')
const dbWorks = require('../dbWorks.js')

// Equipment 또는 Supply를 받을 수 있는 Union 선언
const typeDefs = gql`
    union Given = Equipment | Supply
`

const resolvers = {
    Query: {
        // equipements와 supplies를 둘 다 넣어서 반환하는 givens query 추가
        givens: (parent, args) => {
            return [
                ...dbWorks.getEquipments(args),
                ...dbWorks.getSupplies(args)
            ]
        }
    },
    Given: {
        // 각 항목 구분 역할: used_by면 __typename으로 Equipment, team이면 Supply
        __resolveType(given, context, info) {
            if (given.used_by) {
                return 'Equipment'
            }
            if (given.team) {
                return 'Supply'
            }
            return null
        }
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}