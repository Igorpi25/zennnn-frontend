
import gql from 'graphql-tag'

import { WORD_TRANSLATION_FRAGMENT } from './typeDefs'

export const CREATE_WORD = gql`
  mutation CreateWord($input: CreateWordInput!) {
    createWord(input: $input) {
      id
      status
      defaultLocale
      values {
        ...WordTranslationFragment
      }
      translations {
        ...WordTranslationFragment
      }
    }
  }
  ${WORD_TRANSLATION_FRAGMENT}
`

export const UPDATE_WORD = gql`
  mutation UpdateWord($input: UpdateWordInput!) {
    updateWord(input: $input) {
      id
      status
      defaultLocale
      values {
        ...WordTranslationFragment
      }
      translations {
        ...WordTranslationFragment
      }
    }
  }
  ${WORD_TRANSLATION_FRAGMENT}
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
        ...WordTranslationFragment
      }
      translations {
        ...WordTranslationFragment
      }
    }
  }
  ${WORD_TRANSLATION_FRAGMENT}
`
