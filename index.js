const database = require('./database')
const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
    type Query {
        teams: [Team]
        team(id: Int): Team
        equipments: [Equipment]
        supplies: [Supply]
    }
    type Mutation {
        deleteEquipment(id: String): Equipment
        insertEquipment(
            id: String,
            used_by: String,
            count: Int,
            new_or_used: String
        ): Equipment
        editEquipment(
            id: String,
            used_by: String,
            count: Int,
            new_or_used: String
        ): Equipment
    }
    type Team {
        id: Int
        manager: String 
        office: String
        extension_number: String
        mascot: String
        cleaning_duty: String
        project: String
        supplies: [Supply]
    }
    type Equipment {
        id: String
        used_by: String
        count: Int
        new_or_used: String
    }
    type Supply {
        id: String
        team: Int
    }
`

const resolvers = {
    Query: {
        // team에 supplies 연결해서 받아오기
        teams: () => database.teams.map((team) => {
            // team에 연결한 supplies는 supplies DB에서 서로 id 값이 일치하는 supplies 데이터로 넣는다.
            team.supplies = database.supplies.filter((supply) => {
                return supply.team === team.id
            })
            // 그 다음 team 반환
            return team;
        }),
        // 특정 team만 받아오기
        // args로 주어진 id에 해당하는 team만 필터링
        team: (parent, args, context, info) => database.teams
            .filter((team) => {
                return team.id === args.id
            })[0],
        equipments: () => database.equipments,
        supplies: () => database.supplies
    },
    Mutation: {
        // 데이터 추가
        insertEquipment: (parent, args, context, info) => {
            database.equipments.push(args);
            return args;
        },
        // 데이터 삭제
        deleteEquipment: (parent, args, context, info) => {
            const deleted = database.equipments.filter((equipment) => {
                    return equipment.id === args.id
                })[0]
            database.equipments = database.equipments.filter((equipment) => {
                    return equipment.id !== args.id
                })
            return deleted;
        },
        // 데이터 수정
        editEquipment: (parent, args, context, info) => {
            return database.equipments.filter((equipment) => {
                return equipment.id === args.id
            }).map((equipment) => {
                Object.assign(equipment, args)
                return equipment
            })[0]
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
});
