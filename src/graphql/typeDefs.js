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
  extend type Query {
    isLoggedIn: Boolean
  }
`

export default typeDefs
