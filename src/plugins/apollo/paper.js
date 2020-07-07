import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
import { typeDefs, resolvers } from '../../graphql'
import { GET_BACKEND_VERSION } from '../../graphql/queries'
import { BACKEND_VERSION_HEADER_KEY } from '../../config/globals'
import { Logger } from '../paper'
import router from '../../router/paper'

const logger = new Logger('Apollo')

const cache = new InMemoryCache()

const reponseHeaders = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const context = operation.getContext()
    const {
      response: { headers },
    } = context
    if (headers) {
      const backendVersion = headers.get(BACKEND_VERSION_HEADER_KEY)
      if (backendVersion) {
        apolloClient.writeQuery({
          query: GET_BACKEND_VERSION,
          data: {
            backendVersion,
          },
        })
      }
    }
    return response
  })
})

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_GRAPHQL_ENDPOINT,
})

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_GRAPHQL_WS_ENDPOINT,
  options: {
    reconnect: true,
    lazy: true,
  },
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const { message, locations, path, extensions } = err
      const code = extensions && extensions.code
      switch (code) {
        default:
          logger.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          )
          if (message && message.includes('Forbidden')) {
            router.app.$notify({ color: 'warn', text: 'Forbidden' })
          }
      }
    }
  }
  if (networkError) {
    logger.warn(`[Network error]: ${networkError}`)
  }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  },
  wsLink,
  reponseHeaders.concat(httpLink),
)

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, link]),
  cache,
  typeDefs,
  resolvers,
  connectToDevTools: true,
})

const data = {
  isLoggedIn: false,
  isSpecSync: false,
  loggedInUser: null,
}

cache.writeData({ data })
apolloClient.onResetStore(() => cache.writeData({ data }))

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

export default apolloProvider
