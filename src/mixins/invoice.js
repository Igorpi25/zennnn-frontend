import format from 'date-fns/format'

import { UPDATE_INVOICE } from '../graphql/mutations'

export default {
  // props: {
  //   content: {
  //     type: Object,
  //     required: true,
  //   },
  // },
  data () {
    return {
      createLoading: false,
      updateLoading: false,
    }
  },
  // watch: {
  //   'content.invoiceNo' (val) {
  //     this.$refs.name.innerText = val || ''
  //   },
  // },
  // mounted () {
  //   this.$refs.name.innerText = this.content.invoiceNo || ''
  // },
  methods: {
    // onBlur () {
    //   this.$refs.name.innerText = this.content.invoiceNo || ''
    // },
    formatDate (date) {
      return format(this.$parseISO(date), this.$i18n.locale === 'zh'
        ? 'yyyy-M-d' : this.$i18n.locale === 'ru'
          ? 'dd.MM.yyyy' : 'dd/MM/yyyy',
      )
    },
    async updateInvoice (id, input) {
      try {
        this.updateLoading = id
        await this.$apollo.mutate({
          mutation: UPDATE_INVOICE,
          variables: { id, input },
        })
      } catch (error) {
        if (error && error.errors && error.errors.length > 0) {
          this.errors = error.errors
        }
        this.$logger.warn('Error: ', error)
        // this.$Amplify.Analytics.record({
        //   name: 'UpdateInvoiceError',
        //   attributes: {
        //     error: error.message
        //   }
        // })
      } finally {
        this.updateLoading = null
      }
    },
  },
}
