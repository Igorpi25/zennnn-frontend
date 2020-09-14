
import gql from 'graphql-tag'

export const LIST_WORDS = gql`
  query ListWords($filters: ListWordsFilters) {
    listWords(filters: $filters) {
      items {
        id
        status
        defaultLocale
        values {
          k
          v
          tr
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
        isHidden
      }
    }
  }
`

export const TRANSLATE_WORD = gql`
  query TranslateWord($text: String!, $sourceLang: String!) {
    translateWord(text: $text, sourceLang: $sourceLang) {
      k
      v
      tr
    }
  }
`

export const SEARCH_WORDS = gql`
  query SearchWords($search: String!) {
    searchWords(search: $search) {
      items {
        id
        status
        defaultLocale
        values {
          k
          v
          tr
        }
        isHidden
      }
    }
  }
`
