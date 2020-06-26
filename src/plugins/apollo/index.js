import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
import { typeDefs, resolvers } from '../../graphql'
import { GET_BACKEND_VERSION } from '../../graphql/queries'
import { BACKEND_VERSION_HEADER_KEY, PAPER_SID_STORE_KEY, SPEC_SIMPLE_UI_OFF_STORE_KEY } from '../../config/globals'
import { Auth, Logger, i18n, store } from '../index'
import router from '../../router'
import { getUsername } from '../../graphql/resolvers'
import systemMessageBus from '../notify/systemMessageBus'

const logger = new Logger('Apollo')

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
              name: 'Spec',
            },
            {
              name: 'Invoice',
            },
            {
              name: 'Product',
            },
            {
              name: 'Client',
            },
            {
              name: 'RequisiteItems',
            },
            {
              name: 'PayloadFields',
            },
          ],
        },
        {
          kind: 'UNION',
          name: 'SpecPaperDeltaObject',
          possibleTypes: [
            {
              name: 'PaperSpec',
            },
            {
              name: 'PaperInvoice',
            },
            {
              name: 'PaperProduct',
            },
            {
              name: 'PayloadFields',
            },
          ],
        },
      ],
    },
  },
})

const cache = new InMemoryCache({ fragmentMatcher })

const authLink = setContext(async (request, { headers }) => {
  const operationName = request.operationName
  let token = null
  let sid = null
  if (
    operationName === 'Signup' ||
    operationName === 'ListPrices' ||
    operationName === 'GetPaperSpec' ||
    operationName === 'AddCommentToPaperSpec' ||
    operationName === 'ReplyToPaperSpecComment' ||
    operationName === 'AddCommentToPaperProduct' ||
    operationName === 'ReplyToPaperProductComment' ||
    operationName === 'MarkPaperSpecCommentsAsViewed' ||
    operationName === 'MarkPaperProductCommentsAsViewed'
  ) {
    sid = localStorage.getItem(PAPER_SID_STORE_KEY) || null
    try {
      const session = await Auth.currentSession()
      token = session.getIdToken().getJwtToken()
    } catch (error) {} // eslint-disable-line
  } else {
    const session = await Auth.currentSession()
    token = session.getIdToken().getJwtToken()
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
      sid,
      locale: i18n.locale,
    },
  }
})

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
export const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_GRAPHQL_WS_ENDPOINT,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: async () => {
      const session = await Auth.currentSession()
      const token = session.getIdToken().getJwtToken()
      const sid = localStorage.getItem(PAPER_SID_STORE_KEY) || null
      return {
        authToken: token ? `Bearer ${token}` : '',
        sid,
      }
    },
  },
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
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
              ? { redirect: router.currentRoute.fullPath } : {},
          })
          break
        default:
          logger.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          )
          if (message === 'ForbiddenError: Insufficient access rights') {
            systemMessageBus.$emit('system-message', message)
          } else if (message && message.includes('Forbidden')) {
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
  authLink.concat(reponseHeaders.concat(httpLink)),
)

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, link]),
  cache,
  typeDefs,
  resolvers,
  connectToDevTools: true,
})

const setData = async () => {
  const username = await getUsername()
  const key = `${username}.${SPEC_SIMPLE_UI_OFF_STORE_KEY}`
  const specSimpleUIOff = await store.getItem(key)
  const data = {
    isLoggedIn: false,
    isSpecSync: false,
    specSimpleUIOff,
    loggedInUser: null,
  }
  cache.writeData({ data })
}

setData()
apolloClient.onResetStore(() => setData())

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

export default apolloProvider
