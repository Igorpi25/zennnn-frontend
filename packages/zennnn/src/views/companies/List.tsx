import { defineComponent, ref, computed, Transition } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { getObjectValueByPath } from 'vue-supp'
import {
  ziStarLg,
  ziStarOutlineLg,
  ziUser,
  ziSearch,
  ziDelete,
  ziInfoBig,
  ziPlusOutline,
} from '@zennnn/icons'
import { Icon, Progress, TextField, Btn } from '@zennnn/core'
import Dialog from 'shared/components/Dialog'
import { LIST_ORG_REQUISITES } from '@/graphql/queries'
import { DELETE_REQUISITE, SET_DEFAULT_REQUISITE } from '@/graphql/mutations'
import { defaultFilter } from '@/utils/defaultFilter'
import { useOrgs } from '@/composables/orgs'
import { logger } from '@/plugins'

import type {
  ListOrgRequisites,
  ListOrgRequisitesVariables,
  DeleteRequisite,
  DeleteRequisiteVariables,
  SetDefaultReqisite,
  SetDefaultReqisiteVariables,
} from '@/graphql/types'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const { currentOrg, refetch: getOrgsRefetch } = useOrgs()

    const orgId = route.params.orgId
    const search = ref()
    // TODO: add id on deleteRequisite mutation
    const deleteRequisiteId = ref<string>()
    // TODO: add id on setDefaultRequisite mutation
    const setDefaultRequisiteId = ref<string>()

    const {
      result: listOrgRequisitesResult,
      loading: listOrgRequisitesLoading,
    } = useQuery<ListOrgRequisites, ListOrgRequisitesVariables>(
      LIST_ORG_REQUISITES,
      () => ({
        orgId: orgId as string,
      }),
      {
        fetchPolicy: 'cache-and-network',
      }
    )

    const { mutate: deleteRequisiteMutate, loading: deleteRequisiteLoading } =
      useMutation<DeleteRequisite, DeleteRequisiteVariables>(DELETE_REQUISITE, {
        update: (cache, { data: result }) => {
          const id = deleteRequisiteId.value
          // TODO: return in result id
          logger.info('Requisite delete', result?.deleteRequisite)

          const data = cache.readQuery<
            ListOrgRequisites,
            ListOrgRequisitesVariables
          >({
            query: LIST_ORG_REQUISITES,
            variables: {
              orgId: orgId as string,
            },
          })
          if (data?.listOrgRequisites?.some((item) => item.id === id)) {
            cache.writeQuery<ListOrgRequisites, ListOrgRequisitesVariables>({
              query: LIST_ORG_REQUISITES,
              variables: {
                orgId: orgId as string,
              },
              data: {
                listOrgRequisites: data.listOrgRequisites.filter(
                  (item) => item.id !== id
                ),
              },
            })
          }
        },
      })
    const {
      mutate: setDefaultRequisiteMutate,
      loading: setDefaultRequisiteLoading,
    } = useMutation<SetDefaultReqisite, SetDefaultReqisiteVariables>(
      SET_DEFAULT_REQUISITE
    )

    const items = computed(() =>
      (listOrgRequisitesResult.value?.listOrgRequisites || []).map((item) => {
        return {
          ...item,
          ownerFullName: item.companyOwner && item.companyOwner.fullName,
        }
      })
    )

    const filteredItems = computed(() => {
      let filtered = items.value.slice()
      const _search =
        typeof search.value === 'string' ? search.value.trim() : undefined
      if (_search) {
        const filters = ['companyName', 'companyNameLocal', 'ownerFullName']
        filtered = filtered.filter((item) =>
          filters.some((v) => {
            const value = getObjectValueByPath(item, v)
            return defaultFilter(value, _search)
          })
        )
      }
      return filtered
    })

    function goToCompany(companyId: string) {
      router.push({
        name: 'company',
        params: {
          orgId: orgId,
          companyId,
        },
      })
    }

    async function setDefaultRequisite(variables: SetDefaultReqisiteVariables) {
      try {
        setDefaultRequisiteId.value = variables.id
        await setDefaultRequisiteMutate(variables)
        // update orgs query
        // TODO: should be on subscription
        getOrgsRefetch()
      } catch (error) {
        logger.info('[SetDefaultRequisite]: ', error)
      } finally {
        setDefaultRequisiteId.value = undefined
      }
    }

    async function deleteRequisite(variables: DeleteRequisiteVariables) {
      try {
        deleteRequisiteId.value = variables.id
        await deleteRequisiteMutate(variables)
      } catch (error) {
        logger.info('[DeleteRequisite]: ', error)
      } finally {
        deleteRequisiteId.value = undefined
      }
    }

    return () => (
      <div class="container pt-4 pb-10">
        <TextField
          v-model={search.value}
          placeholder={t('placeholder.pageSearch')}
          controlClass={
            search.value ? 'ring-1 ring-blue-500 ring-inset' : undefined
          }
          prependIcon={ziSearch}
          class="w-full pb-6"
          inputClass="placeholder-blue-500 dark:placeholder-blue-500"
          clearable
        />

        <div class="font-semibold text-white text-2xl leading-tight whitespace-nowrap overflow-x-auto scrolling-touch pb-4 px-1">
          <span class="relative">
            <span class="text-gray-900 dark:text-white">
              {t('requisites.title')}
            </span>
            <Transition
              name="fade-transition"
              v-slots={{
                default: () =>
                  listOrgRequisitesLoading.value && (
                    <div class="absolute right-0 -mr-6 inline-block text-gray-200">
                      <Progress indeterminate size="20" width="2" />
                    </div>
                  ),
              }}
            />
          </span>
          <RouterLink
            to={{ name: 'dictionary', params: { orgId } }}
            class="text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring focus:ring-blue-400 with-focus-visible transition-colors duration-75 ease-out ml-10"
          >
            {t('header.dictionary')}
          </RouterLink>
        </div>

        <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 pt-6 pb-10">
          {filteredItems.value.map((item) => (
            <div class="cursor-pointer">
              <button
                class="w-full bg-light-gray-100 dark:bg-gray-800 bg-opacity-90 rounded-md focus:outline-none focus:ring focus:ring-blue-400 with-focus-visible border border-transparent hover:border-blue-400 p-2.5 pt-4"
                onClick={() => {
                  goToCompany(item.id)
                }}
              >
                <div class="h-10 w-full flex justify-between px-2">
                  <div class="p-1">
                    <Btn
                      icon
                      mini
                      text
                      loading={
                        setDefaultRequisiteLoading.value &&
                        setDefaultRequisiteId.value === item.id
                      }
                      class={[
                        'hover:text-green-400 dark:hover:text-green-400 active:text-green-500 dark:active:text-green-500',
                        item.id === currentOrg.value.defaultRequisite
                          ? 'text-green-500'
                          : 'text-gray-200',
                      ]}
                      onClick={(e: MouseEvent) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (item.id === currentOrg.value.defaultRequisite)
                          return
                        setDefaultRequisite({
                          orgId: orgId as string,
                          id: item.id,
                        })
                      }}
                    >
                      <Icon>
                        {item.id === currentOrg.value.defaultRequisite
                          ? ziStarLg
                          : ziStarOutlineLg}
                      </Icon>
                    </Btn>
                  </div>
                  <Dialog
                    v-slots={{
                      activator: () => (
                        <Btn icon text mini class="text-gray-200">
                          <Icon>{ziDelete}</Icon>
                        </Btn>
                      ),
                      actionStart: () => (
                        <Btn
                          loading={deleteRequisiteLoading.value}
                          primary={false}
                          class="text-white bg-red-700 hover:bg-red-600 active:bg-red-700 active:brightness-90 focus:ring-red-600"
                          onClick={() => deleteRequisite({ id: item.id })}
                        >
                          {t('action.delete')}
                        </Btn>
                      ),
                    }}
                    bodyClass="dark:text-white p-6"
                    hideOverlay
                    icon={ziDelete}
                    title={t('action.delete')}
                    showActions
                    cancelText={t('action.cancel')}
                    loading={deleteRequisiteLoading.value}
                  >
                    <div class="text-yellow-400 font-semibold pb-4">
                      {[item.companyName, item.companyNameLocal]
                        .filter((el) => !!el)
                        .join(' - ')}
                    </div>
                    <div>{t('alert.removeRequisites')}</div>
                  </Dialog>
                </div>
                <div class="pt-16 leading-tight">
                  <div
                    class="flex flex-col relative bg-white dark:bg-gray-600 rounded-md text-center pt-16 px-6"
                    style="height: 282px"
                  >
                    {/* <!-- TODO: add image upload --> */}
                    <div class="absolute w-[6.5rem] h-[6.5rem] rounded-full bg-light-gray-550 dark:bg-gray-400 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border border-light-gray-200 dark:border-gray-200">
                      <Icon large class="text-gray-100 dark:text-gray-200">
                        {ziUser}
                      </Icon>
                    </div>
                    <div class="font-bold text-gray-900 dark:text-white min-h-[1.25rem] mb-2 mt-1">
                      {item.companyName}
                    </div>
                    <div class="flex-grow text-sm pb-2">
                      {item.companyNameLocal}
                    </div>
                    {item.companyOwner && item.companyOwner.fullName && (
                      <div>
                        <div class="text-gray-900 dark:text-white bg-light-gray-100 dark:bg-gray-800 bg-opacity-90 text-sm h-8 inline-flex items-center justify-center rounded-[20px] px-4">
                          {t('role.OWNER')}
                        </div>
                      </div>
                    )}
                    <div class="pt-2 pb-8">
                      {item.companyOwner && item.companyOwner.fullName}
                    </div>
                  </div>
                </div>
                <div class="h-16 pt-2.5">
                  {(!item.isRequiredFilled || !item.isOptionalFilled) && (
                    <div class="h-full flex items-center rounded-md relative text-yellow-500 bg-yellow-500 bg-opacity-10 py-2 px-3">
                      <Icon large class="text-yellow-500 flex-shrink-0 mr-4">
                        {ziInfoBig}
                      </Icon>
                      <div class="flex-grow flex items-center text-sm leading-tight">
                        {t('requisites.unfilled')}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          ))}
          <div style="min-height: 476px" class="h-full">
            <button
              class="w-full border border-light-gray-400 dark:border-gray-400 focus:outline-none focus:ring focus:ring-blue-400 with-focus-visible hover:border-blue-400 rounded-md h-full flex items-center justify-center cursor-pointer"
              onClick={() => {
                router.push({ name: 'company-create', params: { orgId } })
              }}
            >
              <div class="flex flex-col items-center pb-8">
                <Icon size={106} class="text-gray-100 dark:text-gray-200">
                  {ziPlusOutline}
                </Icon>
                <div class="text-blue-500 pt-6">
                  {t('requisites.addCompany')}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  },
})
