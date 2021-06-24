import {
  ApolloClient,
  ApolloLink,
  split,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client/core'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { getMainDefinition } from '@apollo/client/utilities'
import Logger from 'shared/plugins/logger'
import { BACKEND_VERSION_HEADER_KEY } from 'shared/config'
import { PAPER_SID_STORE_KEY, SPEC_SIMPLE_UI_OFF_STORE_KEY } from '../config'
import { typeDefs, resolvers } from '../graphql'
import {
  GET_BACKEND_VERSION,
  GET_IS_SPEC_SYNC,
  SPEC_SIMPLE_UI_OFF,
} from '../graphql/queries'
import { getUsername } from '../graphql/resolvers'
import router from '../router'
import { auth, i18n, emitter, store } from '.'

import type { ReactiveVar } from '@apollo/client/core'

export const isLoggedIn: ReactiveVar<boolean> = makeVar<boolean>(false)

const logger = new Logger('Apollo')

// hardcoded TODO with https://www.apollographql.com/docs/react/data/fragments/#defining-possibletypes-manually
const possibleTypes = {
  SpecDeltaObject: [
    'Spec',
    'Invoice',
    'Product',
    'Client',
    'RequisiteItems',
    'PayloadFields',
  ],
  SpecPaperDeltaObject: [
    'PaperSpec',
    'PaperInvoice',
    'PaperProduct',
    'PayloadFields',
  ],
}

const typePolicies = {
  Query: {
    fields: {
      isLoggedIn: {
        read() {
          return isLoggedIn()
        },
      },
      getSpecs: {
        merge: false,
      },
      listClients: {
        merge: false,
      },
      listSuppliers: {
        merge: false,
      },
    },
  },
  Client: {
    fields: {
      contacts: {
        merge: false,
      },
    },
  },
  Supplier: {
    fields: {
      contacts: {
        merge: false,
      },
      branches: {
        merge: false,
      },
    },
  },
  SupplierBranch: {
    fields: {
      contacts: {
        merge: false,
      },
    },
  },
  Requisite: {
    fields: {
      contacts: {
        merge: false,
      },
      bankDetails: {
        merge: false,
      },
    },
  },
}

const cache = new InMemoryCache({
  possibleTypes,
  typePolicies,
})

const authLink = setContext(async (request, { headers }) => {
  const operationName = request.operationName
  let token = null
  let sid = null
  if (
    operationName === 'PriceContact' ||
    operationName === 'Signup' ||
    operationName === 'ListPrices'
  ) {
    sid = localStorage.getItem(PAPER_SID_STORE_KEY) || null
    try {
      const session = await auth.currentSession()
      token = session.getIdToken().getJwtToken()
    } catch (error) {} // eslint-disable-line
  } else {
    const session = await auth.currentSession()
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
  return forward(operation).map((response) => {
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
  uri: process.env.VUE_APP_GRAPHQL_WS_ENDPOINT as string,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: async () => {
      const session = await auth.currentSession()
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
          auth.signOut()
          router.push({
            name: 'signin',
            query:
              router.currentRoute.value.fullPath &&
              router.currentRoute.value.fullPath !== '/'
                ? { redirect: router.currentRoute.value.fullPath }
                : {},
          })
          break
        default:
          logger.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
          if (message === 'ForbiddenError: Insufficient access rights') {
            emitter.emit('show-system-message', message)
          } else if (message && message.includes('Forbidden')) {
            emitter.emit('show-notify', { color: 'warn', text: 'Forbidden' })
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
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(reponseHeaders.concat(httpLink))
)

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, link]),
  cache,
  typeDefs,
  resolvers,
  connectToDevTools: true,
})

const setData = async () => {
  isLoggedIn(false)
  cache.writeQuery({
    query: GET_IS_SPEC_SYNC,
    data: { isSpecSync: false },
  })

  const username = await getUsername()
  const key = `${username}.${SPEC_SIMPLE_UI_OFF_STORE_KEY}`
  const specSimpleUIOff = await store.getItem(key)
  cache.writeQuery({
    query: SPEC_SIMPLE_UI_OFF,
    data: { specSimpleUIOff },
  })
}

setData()
apolloClient.onResetStore(() => setData())

export default apolloClient
