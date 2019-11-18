import Vue from 'vue'
import App from './App.vue'

import VueApollo from 'vue-apollo'

import { ApolloClient } from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
import { typeDefs, resolvers } from './schema'
import router from './router'
import Auth from './plugins/auth'
import './plugins/logger'

Vue.config.productionTip = false

// hardcoded TODO with https://www.apollographql.com/docs/react/data/fragments/#fragments-on-unions-and-interfaces
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'UNION',
          name: 'SpecDeltaObject',
          possibleTypes: [
            {
              name: 'Spec'
            },
            {
              name: 'Invoice'
            },
            {
              name: 'Product'
            }
          ]
        }
      ]
    }
  }
})

const cache = new InMemoryCache({ fragmentMatcher })

const authLink = setContext(async ({ operationName }, { headers }) => {
  // on Login get token from sessionStorage
  // get the authentication token from local storage if it exists
  const session = await Auth.currentSession()
  const token = operationName === 'Login'
    // on Login operation, session setted to Memory storage
    ? session.getIdToken().getJwtToken()
    : session.getIdToken().getJwtToken()
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : ''
    }
  }
})

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:3000/graphql'
})

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    connectionParams: async () => {
      const session = await Auth.currentSession()
      const token = session.getIdToken().getJwtToken()
      return {
        authToken: token || ''
      }
    }
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      const { message, locations, path, extensions } = err
      const code = extensions && extensions.code
      switch (code) {
        case 'UNAUTHENTICATED':
          // error code is set to UNAUTHENTICATED
          // when AuthenticationError thrown in resolver
          cache.reset()
          Auth.signOut()
          router.push({
            name: 'signin',
            query: router.currentRoute.fullPath && router.currentRoute.fullPath !== '/'
              ? { redirect: router.currentRoute.fullPath } : {}
          })
          break
        default:
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
      }
    }
  }
  if (networkError) console.log(`[Network error]: ${networkError}`)
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
  authLink.concat(httpLink)
)

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, link]),
  cache,
  typeDefs,
  resolvers,
  connectToDevTools: true
})

const data = {
  isLoggedIn: false,
  loggedInUser: null
}

cache.writeData({ data })
apolloClient.onResetStore(() => cache.writeData({ data }))

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

new Vue({
  apolloProvider,
  router,
  render: h => h(App)
}).$mount('#app')
