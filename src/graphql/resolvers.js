import { Auth, store } from '../plugins'
import {
  SPEC_ACTIVE_TAB_STORE_KEY,
  SPEC_EXPANDED_INVOICES_STORE_KEY,
  PAPER_STORE_KEY_PREFIX,
} from '../config/globals'
import { emptyInvoice, emptyProduct } from '../graphql/enums'

const getUsername = async (defaultUsername = '') => {
  defaultUsername = defaultUsername || 'Username'
  let username = defaultUsername
  try {
    const session = await Auth.currentSession()
    if (session) {
      const payload = session.accessToken && session.accessToken.payload
      username = (payload && payload.username) || defaultUsername
    }
  } catch (error) { // eslint-disable-line
    username = defaultUsername
  }
  return username
}

export const getSpecExpandedInvoices = async (specId, prefix) => {
  const username = await getUsername()
  let key = prefix ? `${prefix}.` : ''
  key += `${username}.${specId}.${SPEC_EXPANDED_INVOICES_STORE_KEY}`
  const ids = await store.getItem(key)
  return ids === null ? null : (ids || [])
}

export const getSpecActiveTab = async (specId, prefix) => {
  const username = await getUsername()
  let key = prefix ? `${prefix}.` : ''
  key += `${username}.${specId}.${SPEC_ACTIVE_TAB_STORE_KEY}`
  const activeTab = await store.getItem(key)
  return activeTab || 0
}

const resolvers = {
  Query: {
    getSpec: async (data) => {
      const spec = data.getSpec
      if (!spec) return spec
      const specId = spec.id
      const activeTab = await getSpecActiveTab(specId)
      const expandedInvoices = await getSpecExpandedInvoices(specId)
      const invoices = spec.invoices
      const emptyId = `empty-${specId}`
      const emptyIndex = invoices.findIndex(el => el.id === emptyId)
      if (emptyIndex === -1) {
        invoices.push(Object.assign({}, emptyInvoice, { id: emptyId, products: [] }))
        spec.invoices = invoices
      }
      return { ...spec, activeTab, expandedInvoices }
    },
    getPaperSpec: async (data) => {
      const spec = data.getPaperSpec
      if (!spec) return spec
      const specId = spec.id
      const expandedInvoices = await getSpecExpandedInvoices(specId, PAPER_STORE_KEY_PREFIX)
      return { ...spec, expandedInvoices }
    },
  },
  Mutation: {
    setSpecActiveTab: async (_, { specId, tab }) => {
      const username = await getUsername()
      const key = `${username}.${specId}.${SPEC_ACTIVE_TAB_STORE_KEY}`
      await store.setItem(key, tab)
      return true
    },
    setSpecExpandedInvoices: async (_, { specId, ids, prefix }) => {
      const username = await getUsername()
      let key = prefix ? `${prefix}.` : ''
      key += `${username}.${specId}.${SPEC_EXPANDED_INVOICES_STORE_KEY}`
      await store.setItem(key, ids || [])
      return true
    },
    addSpecExpandedInvoices: async (_, { specId, ids, prefix }) => {
      const username = await getUsername()
      let key = prefix ? `${prefix}.` : ''
      key += `${username}.${specId}.${SPEC_EXPANDED_INVOICES_STORE_KEY}`
      const invoicesIds = await store.getItem(key) || []
      ids = ids || []
      ids.forEach(id => {
        if (!invoicesIds.includes(id)) {
          invoicesIds.push(id)
        }
      })
      await store.setItem(key, invoicesIds)
      return true
    },
    removeSpecExpandedInvoices: async (_, { specId, ids, prefix }) => {
      const username = await getUsername()
      let key = prefix ? `${prefix}.` : ''
      key += `${username}.${specId}.${SPEC_EXPANDED_INVOICES_STORE_KEY}`
      const invoicesIds = await store.getItem(key) || []
      const result = invoicesIds.filter(id => !ids.includes(id))
      await store.setItem(key, result)
      return true
    },
  },
  Invoice: {
    products: (invoice) => {
      const products = invoice.products
      const emptyId = `empty-${invoice.id}`
      const emptyIndex = products.findIndex(el => el.id === emptyId)
      if (emptyIndex === -1) {
        products.push(Object.assign({}, emptyProduct, { id: emptyId }))
        invoice.products = products
      }
      return invoice
    },
  },
}

export default resolvers
