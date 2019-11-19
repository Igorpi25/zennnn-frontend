import gql from 'graphql-tag'

export const GET_ROLE_IN_PROJECT = gql`
  query GetRoleInProject($specId: ID!) {
    roleInProject(specId: $specId)
  }
`

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
