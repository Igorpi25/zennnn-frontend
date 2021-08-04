import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import Logger from 'shared/plugins/logger'
import { auth, emitter } from '.'

import type { ReactiveVar } from '@apollo/client/core'

export const isLoggedInVar: ReactiveVar<boolean> = makeVar<boolean>(false)

const logger = new Logger('Apollo')

const typePolicies = {
  Query: {
    fields: {
      listWords: {
        merge: false,
      },
    },
  },
  Word: {
    fields: {
      products: {
        merge: false,
      },
    },
  },
}

const cache = new InMemoryCache({
  typePolicies,
})

const authLink = setContext(async (_, { headers }) => {
  let token = null
  try {
    const session = await auth.currentSession()
    token = session.getIdToken().getJwtToken()
  } catch (error) {} // eslint-disable-line
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_GRAPHQL_ENDPOINT,
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const { message, locations, path, extensions } = err
      const code = extensions && extensions.code
      switch (code) {
        default:
          logger.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
          if (message && message.includes('Forbidden')) {
            emitter.emit('showNotify', { color: 'warn', text: 'Forbidden' })
          } else {
            emitter.emit('showNotify', { color: 'error', text: message })
          }
      }
    }
  }
  if (networkError) {
    emitter.emit('showNotify', { color: 'error', text: networkError.message })
    logger.warn(`[Network error]: ${networkError}`)
  }
})

const link = authLink.concat(httpLink)

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, link]),
  cache,
  connectToDevTools: process.env.NODE_ENV === 'development',
})

apolloClient.onResetStore(async () => {
  isLoggedInVar(false)
})

export default apolloClient
