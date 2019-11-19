import { GET_SPEC } from '../graphql/queries'
import { CREATE_INVOICE, UPDATE_SPEC } from '../graphql/mutations'

export default {
  apollo: {
    getSpec: {
      query: GET_SPEC,
      variables () {
        return {
          specId: this.$route.params.specId,
        }
      },
      fetchPolicy: 'cache-only',
    },
  },
  data () {
    return {
      createLoading: false,
      updateLoading: false,
    }
  },
  computed: {
    spec () {
      return this.getSpec || {}
    },
  },
  watch: {
    'spec.name' (val) {
      this.$refs.name.innerText = val || ''
    },
  },
  mounted () {
    this.$refs.name.innerText = this.spec.name || ''
  },
  methods: {
    onBlur () {
      this.$refs.name.innerText = this.spec.name || ''
    },
    async createInvoice () {
      try {
        this.createLoading = true
        await this.$apollo.mutate({
          mutation: CREATE_INVOICE,
          variables: {
            specId: this.specId,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.createLoading = false
      }
    },
    async updateSpec (specInput) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: UPDATE_SPEC,
          variables: {
            specId: this.specId,
            specInput,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
  },
}
