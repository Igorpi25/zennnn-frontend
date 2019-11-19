<template>
  <div>
    <div style="font-size: 12px; color: grey; text-align: left;">
      Спецификации
    </div>
    <h1>Спецификации:</h1>
    <div v-if="$apollo.queries.getSpecs.loading">
      Загрузка...
    </div>
    <div v-else>
      <table style="margin-left: auto; margin-right: auto;">
        <thead>
          <th>
            id
          </th>
          <th>
            name
          </th>
        </thead>
        <tbody>
          <tr
            v-for="spec in specs"
            :key="spec.id"
          >
            <td>
              <router-link
                :to="{
                  name: 'spec',
                  params: {
                    specId: spec.id
                  }
                }"
              >
                {{ spec.id }}
              </router-link>
            </td>
            <td>
              {{ spec.name }}
            </td>
            <td width="48px">
              <button
                :disabled="deleteLoading === spec.id"
                @click="deleteSpec(spec.id)"
              >x</button>
            </td>
          </tr>
        </tbody>
      </table>
      <br>
      <button
        :disabled="createLoading"
        @click="createSpec"
      >
        Создать
      </button>
    </div>
    <br>
  </div>
</template>

<script>
import { TYPENAME, OPERATION } from '../graphql/constants'
import { SPEC_FRAGMENT } from '../graphql/typeDefs'
import { GET_SPECS } from '../graphql/queries'
import { CREATE_SPEC, DELETE_SPEC } from '../graphql/mutations'
import { SPECS_DELTA } from '../graphql/subscriptions'

export default {
  name: 'Specs',
  data () {
    return {
      createLoading: false,
      deleteLoading: null,
    }
  },
  computed: {
    specs () {
      return this.getSpecs || []
    },
  },
  apollo: {
    getSpecs: GET_SPECS,
  },
  mounted () {
    const observer = this.$apollo.subscribe({
      query: SPECS_DELTA,
      fetchPolicy: 'no-cache',
    })

    const apolloClient = this.$apollo.provider.defaultClient

    observer.subscribe({
      next: ({ data }) => {
        const operation = data.delta.operation
        const typename = data.delta.payload.__typename

        this.$logger.info(`[${typename}]: ${JSON.stringify(data)}`)

        if (operation === OPERATION.INSERT_SPEC) {
          const { getSpecs } = apolloClient.readQuery({
            query: GET_SPECS,
          })

          if (!getSpecs.some(el => el.id === data.delta.payload.id)) {
            getSpecs.push(data.delta.payload)

            apolloClient.writeQuery({
              query: GET_SPECS,
              data: {
                getSpecs,
              },
            })
          }
        }

        if (operation === OPERATION.UPDATE_SPEC) {
          apolloClient.writeFragment({
            id: `${TYPENAME.SPEC}:${data.delta.payload.id}`,
            fragment: SPEC_FRAGMENT,
            data: data.delta.payload,
          })
        }

        if (operation === OPERATION.DELETE_SPEC) {
          const { getSpecs } = apolloClient.readQuery({
            query: GET_SPECS,
          })

          const index = getSpecs.findIndex(el => el.id === data.delta.payload.id)

          if (index !== -1) {
            getSpecs.splice(index, 1)
            apolloClient.writeQuery({
              query: GET_SPECS,
              data: {
                getSpecs,
              },
            })
          }
        }
      },
      error: (error) => {
        this.$logger.warn('Error: ', error)
      },
    })
  },
  methods: {
    async createSpec () {
      try {
        this.createLoading = true
        const response = await this.$apollo.mutate({
          mutation: CREATE_SPEC,
        })
        if (response && response.data && response.data.createSpec) {
          const spec = response.data.createSpec

          const { getSpecs } = this.$apollo.provider.defaultClient.readQuery({
            query: GET_SPECS,
          })

          if (!getSpecs.some(el => el.id === spec.id)) {
            getSpecs.push(spec)

            this.$apollo.provider.defaultClient.writeQuery({
              query: GET_SPECS,
              data: {
                getSpecs,
              },
            })
          }
        }
      } catch (error) {
        throw new Error(error)
      } finally {
        this.createLoading = false
      }
    },
    async deleteSpec (specId) {
      try {
        this.deleteLoading = specId
        await this.$apollo.mutate({
          mutation: DELETE_SPEC,
          variables: {
            specId,
          },
        })
        const { getSpecs } = this.$apollo.provider.defaultClient.readQuery({
          query: GET_SPECS,
        })

        const index = getSpecs.findIndex(el => el.id === specId)

        if (index !== -1) {
          getSpecs.splice(index, 1)
          this.$apollo.provider.defaultClient.writeQuery({
            query: GET_SPECS,
            data: {
              getSpecs,
            },
          })
        }
      } catch (error) {
        throw new Error(error)
      } finally {
        this.deleteLoading = null
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
