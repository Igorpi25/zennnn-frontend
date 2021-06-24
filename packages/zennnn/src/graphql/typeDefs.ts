import { gql } from '@apollo/client/core'

const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean
    backendVersion: Boolean
    isSpecSync: Boolean
    specSimpleUIOff: Boolean
  }
  extend type Mutation {
    initSpecSimpleUI: Boolean
    setSpecSimpleUI(value: Boolean): Boolean
    setSpecActiveTab(specId: ID!, tab: Int!): Boolean
    setSpecExpandedInvoices(specId: ID!, ids: [ID!]!): Boolean
    addSpecExpandedInvoices(specId: ID!, ids: [ID!]!): Boolean
    removeSpecExpandedInvoices(specId: ID!, ids: [ID!]!): Boolean
  }
`

export default typeDefs
