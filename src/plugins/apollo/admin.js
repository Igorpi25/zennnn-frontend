import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { typeDefs, resolvers } from '../../graphql/admin'
import { Auth, Logger } from '../admin'
import { notify } from '../notify'

const logger = new Logger('Apollo')

const cache = new InMemoryCache()

const authLink = setContext(async (_, { headers }) => {
  let token = null
  try {
    const session = await Auth.currentSession()
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
  uri: process.env.VUE_APP_ADMIN_GRAPHQL_ENDPOINT,
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
            notify.show({ color: 'warn', text: 'Forbidden' })
          }
      }
    }
  }
  if (networkError) {
    logger.warn(`[Network error]: ${networkError}`)
  }
})

const link = authLink.concat(httpLink)

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, link]),
  cache,
  typeDefs,
  resolvers,
  connectToDevTools: true,
})

const data = {
  isLoggedIn: false,
}

cache.writeData({ data })
apolloClient.onResetStore(() => cache.writeData({ data }))

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

export default apolloProvider
