
import gql from 'graphql-tag'

export const CREATE_WORD = gql`
  mutation CreateWord($input: CreateWordInput!) {
    createWord(input: $input) {
      id
      status
      defaultLocale
      values {
        locale
        text
      }
      translations {
        locale
        text
      }
    }
  }
`

export const UPDATE_WORD = gql`
  mutation UpdateWord($input: UpdateWordInput!) {
    updateWord(input: $input) {
      id
      status
      defaultLocale
      values {
        locale
        text
      }
      translations {
        locale
        text
      }
    }
  }
`

export const APPROVE_WORDS = gql`
  mutation ApproveWords($ids: [ID!]) {
    approveWords(ids: $ids)
  }
`

export const MERGE_WORDS = gql`
  mutation MergeWords($ids: [ID!], $input: MergeWordInput!) {
    mergeWords(ids: $ids, input: $input) {
      id
      status
      defaultLocale
      values {
        locale
        text
      }
      translations {
        locale
        text
      }
    }
  }
`
