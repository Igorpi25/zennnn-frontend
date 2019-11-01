import gql from 'graphql-tag'

export const GET_IS_LOGGED_IN = gql`
  query GetIsLoggedIn {
    isLoggedIn @client
  }
`

export const SET_IS_LOGGED_IN = gql`
  mutation SetIsLoggedIn($isLoggedIn: Boolean) {
    setIsLoggedIn(isLoggedIn: $isLoggedIn) @client
  }
`

export const GET_PROFILE = gql`
  query GetProfile {
    getProfile {
      id
      email
      givenName
      familyName
      picture
    }
  }
`

export const GET_PROFILE_CLIENT = gql`
  query GetProfile {
    getProfile @client {
      id
      email
      givenName
      familyName
      picture
    }
  }
`

export const LOGIN = gql`
  mutation Login {
    login {
      id
      email
      givenName
      familyName
      picture
    }
  }
`

export const typeDefs = gql`
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

export const resolvers = {
  Mutation: {
    setIsLoggedIn: (_, { isLoggedIn }, { cache }) => {
      const data = {
        isLoggedIn
      }
      cache.writeData({ data })
      return isLoggedIn
    },
    setLoggedInUser: (_, { user }, { cache }) => {
      const isLoggedIn = !!user
      user.__typename = 'LoggedInUser'
      const data = {
        isLoggedIn,
        loggedInUser: user
      }
      cache.writeData({ data })
      return isLoggedIn
    }
  }
}
