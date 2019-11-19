import gql from 'graphql-tag'

const typeDefs = gql`
  input ProductInput {
    name: String,
    count: Int,
    price: Float
  }
  input InvoiceInput {
    name: String
  }
  input SpecInput {
    name: String
  }
  type LoggedInUser {
    id: String!
    email: String
    givenName: String
    familyName: String
    picture: String
  }
  extend type Mutation {
    setIsLoggedIn(isLoggedIn: Boolean!): Boolean
    setLoggedInUser(user: LoggedInUser!): Boolean
  }
  extend type Query {
    isLoggedIn: Boolean
    loggedInUser: LoggedInUser
  }
`

export default typeDefs
