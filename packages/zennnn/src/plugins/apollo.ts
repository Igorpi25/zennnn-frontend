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
import {
  PREVIEW_SID_STORE_KEY,
  DEAL_SIMPLE_UI_OFF_STORE_KEY,
  DEAL_EXPANDED_INVOICES_STORE_KEY,
  CURRENT_ORG_STORE_KEY,
  DEAL_ACTIVE_TAB_STORE_KEY,
} from '../config'
import router from '../router'
import { auth, i18n, emitter, store, getUsername } from '.'

import type { ReactiveVar } from '@apollo/client/core'

export const isLoggedInVar: ReactiveVar<boolean> = makeVar<boolean>(false)
export const backendVersionVar: ReactiveVar<string> = makeVar<string>('')
export const currentOrgIdVar: ReactiveVar<string | null> = makeVar<
  string | null
>(localStorage.getItem(CURRENT_ORG_STORE_KEY))
export const isDealSimpleOffVar: ReactiveVar<boolean> = makeVar<boolean>(false)
export const isDealSyncVar: ReactiveVar<boolean> = makeVar<boolean>(false)

const logger = new Logger('Apollo')

export async function getDealSimpleOff() {
  try {
    const username = await getUsername()
    const key = `${username}.${DEAL_SIMPLE_UI_OFF_STORE_KEY}`
    const result = await store.getItem(key)
    return !!result
  } catch (error) {
    logger.warn('[getDealSimpleOff]:', error)
  }
}

export async function setDealSimpleOff(val: boolean) {
  try {
    isDealSimpleOffVar(val)
    const username = await getUsername()
    const key = `${username}.${DEAL_SIMPLE_UI_OFF_STORE_KEY}`
    await store.setItem(key, val)
  } catch (error) {
    logger.warn('[setDealSimpleOff]:', error)
  }
}

export async function getDealActiveTab(id: string) {
  try {
    const username = await getUsername()
    const key = `${username}.${id}.${DEAL_ACTIVE_TAB_STORE_KEY}`
    const activeTab = await store.getItem(key)
    const parsed = parseInt(activeTab as string, 10)
    return !isNaN(parsed) ? parsed : 0
  } catch (error) {
    logger.warn('[getDealActiveTab]:', error)
  }
}

export async function setDealActiveTab(id: string, tab: number) {
  try {
    const username = await getUsername()
    const key = `${username}.${id}.${DEAL_ACTIVE_TAB_STORE_KEY}`
    await store.setItem(key, tab)
  } catch (error) {
    logger.warn('[setDealActiveTab]:', error)
  }
}

export async function getDealExpandedInvoices(id: string, prefix?: string) {
  try {
    const username = await getUsername()
    let key = prefix ? `${prefix}.` : ''
    key += `${username}.${id}.${DEAL_EXPANDED_INVOICES_STORE_KEY}`
    const ids = await store.getItem(key)
    return ids === null ? null : ((ids || []) as string[])
  } catch (error) {
    logger.warn('[getDealExpandedInvoices]:', error)
  }
}

export async function setDealExpandedInvoices(
  id: string,
  ids: string[],
  prefix?: string
) {
  try {
    const username = await getUsername()
    let key = prefix ? `${prefix}.` : ''
    key += `${username}.${id}.${DEAL_EXPANDED_INVOICES_STORE_KEY}`
    await store.setItem(key, ids)
  } catch (error) {
    logger.warn('[setDealExpandedInvoices]:', error)
  }
}

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
      getSpecs: {
        merge: false,
      },
      listClients: {
        merge: false,
      },
      listSuppliers: {
        merge: false,
      },
      listOrgRequisites: {
        merge: false,
      },
      listWords: {
        merge: false,
      },
    },
  },
  Client: {
    fields: {
      contacts: {
        merge: false,
      },
      files: {
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
      files: {
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
    sid = localStorage.getItem(PREVIEW_SID_STORE_KEY) || null
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
        backendVersionVar(backendVersion)
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
      const sid = localStorage.getItem(PREVIEW_SID_STORE_KEY) || null
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
            emitter.emit('showSystemMessage', message)
          } else if (message && message.includes('Forbidden')) {
            emitter.emit('showNotify', { color: 'warn', text: 'Forbidden' })
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
  connectToDevTools: process.env.NODE_ENV === 'development',
})

apolloClient.onResetStore(async () => {
  isLoggedInVar(false)
  isDealSyncVar(false)
  isDealSimpleOffVar(false)
})

export default apolloClient
