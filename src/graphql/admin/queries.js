
import gql from 'graphql-tag'

import { WORD_TRANSLATION_FRAGMENT } from './typeDefs'

export const LIST_WORDS = gql`
  query ListWords($filters: ListWordsFilters) {
    listWords(filters: $filters) {
      items {
        id
        status
        defaultLocale
        values {
          ...WordTranslationFragment
        }
        translations {
          ...WordTranslationFragment
        }
        products {
          id
          article
          description
          images {
            url
            filename
            contentType
          }
        }
      }
    }
  }
  ${WORD_TRANSLATION_FRAGMENT}
`

export const TRANSLATE_WORD = gql`
  query TranslateWord($text: String!, $sourceLang: String!) {
    translateWord(text: $text, sourceLang: $sourceLang) {
      ...WordTranslationFragment
    }
  }
  ${WORD_TRANSLATION_FRAGMENT}
`
