import gql from 'graphql-tag'

export const WORD_TRANSLATION_FRAGMENT = gql`
  fragment WordTranslationFragment on WordTranslation {
    locale
    text
  }
`

const typeDefs = {}

export default typeDefs
