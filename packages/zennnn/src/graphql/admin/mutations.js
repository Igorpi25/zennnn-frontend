import { gql } from '@apollo/client/core'

export const CREATE_WORD = gql`
  mutation CreateWord($input: CreateWordInput!) {
    createWord(input: $input) {
      id
      status
      defaultLocale
      values {
        k
        v
        tr
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
        k
        v
        tr
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
        k
        v
        tr
      }
    }
  }
`

export const HIDE_WORDS = gql`
  mutation HideWords($ids: [ID!]) {
    hideWords(ids: $ids)
  }
`

export const CREATE_WORD_WITH_PRODUCTS = gql`
  mutation CreateWordWithProducts(
    $productsIds: [ID!]
    $input: CreateWordInput!
  ) {
    createWordWithProducts(productsIds: $productsIds, input: $input)
  }
`

export const ADD_PRODUCTS_TO_WORD = gql`
  mutation addProductsToWord($productsIds: [ID!], $wordId: ID!) {
    addProductsToWord(productsIds: $productsIds, wordId: $wordId)
  }
`
