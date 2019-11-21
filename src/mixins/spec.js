import { GET_SPEC } from '../graphql/queries'
import { CREATE_INVOICE, UPDATE_SPEC } from '../graphql/mutations'

export default {
  apollo: {
    getSpec: {
      query: GET_SPEC,
      variables () {
        return {
          id: this.specId,
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
    specId () {
      return this.$route.params.specId
    },
    spec () {
      return this.getSpec || {}
    },
  },
  watch: {
    'spec.specNo' (val) {
      this.$refs.name.innerText = val || ''
    },
  },
  mounted () {
    this.$refs.name.innerText = this.spec.specNo || ''
  },
  methods: {
    onBlur () {
      this.$refs.name.innerText = this.spec.specNo || ''
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
    async updateSpec (input) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: UPDATE_SPEC,
          variables: {
            id: this.specId,
            input,
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
