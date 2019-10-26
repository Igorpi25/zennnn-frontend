import Vue from 'vue'
import App from './App.vue'

import VueApollo from 'vue-apollo'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

Vue.config.productionTip = false

import {typeDefs} from './schema'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:3000/graphql',
})

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3000/graphql',
  options: {
    reconnect: true,
  },
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
  httpLink
)

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  link,
  cache,
  typeDefs,
  connectToDevTools: true,
})

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

new Vue({
  apolloProvider,
  render: h => h(App),
}).$mount('#app')
