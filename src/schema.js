import gql from 'graphql-tag'

export const typeDefs = gql`
  input ProductInput {
    name: String,
    count: Int,
    price: Float
  }
  type User {
    id: String!
    username: String
    email: String
    email_verified: Boolean
    given_name: String
    family_name: String
    picture: String
    sub: String
  }
  extend type Mutation {
    setLoggedInUser(user: User!): Boolean
  }
  extend type Query {
    isLoggedIn: Boolean
    loggedInUser: User
  }
`

export const resolvers = {
  Mutation: {
    setLoggedInUser: (_, { user }, { cache }) => {
      user.__typename = 'User'
      const data = {
        isLoggedIn: !!user,
        loggedInUser: user
      }
      cache.writeData({ data })
      return user
    }
  }
}
