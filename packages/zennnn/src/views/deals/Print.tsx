import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ziCloseWindow } from '@zennnn/icons'
import { Btn, Icon, Modal } from '@zennnn/core'
import { GET_SPEC, LIST_ORG_REQUISITES } from '@/graphql/queries'
import { UPDATE_SPEC } from '@/graphql/mutations'
import ValidationStatus from '@/components/entity/ValidationStatus'
import ClientAndImporter from '@/components/print/ClientAndImporter'
import Company from '@/components/print/Company'
import CustomsAndPayment from '@/components/print/CustomsAndPayment'
import Shipment from '@/components/print/Shipment'
import printInvoice from '@/components/print/printInvoice'
import { validateInvoicePrint } from '@/utils/validation'
import { useNotify, useDisplay } from '@/plugins'

import type {
  GetSpec,
  GetSpecVariables,
  ListOrgRequisites,
  ListOrgRequisitesVariables,
  UpdateSpec,
  UpdateSpecVariables,
  SpecInput,
} from '@/graphql/types'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const notify = useNotify()
    const { mobile } = useDisplay()

    const dialog = ref(false)
    const loading = ref(false)

    onMounted(() => {
      dialog.value = true
    })

    const { result: getSpecResult } = useQuery<GetSpec, GetSpecVariables>(
      GET_SPEC,
      () => ({
        id: route.params.specId as string,
      }),
      {
        fetchPolicy: 'cache-first',
      }
    )
    const spec = computed(() => getSpecResult.value?.getSpec)

    const {
      result: listOrgRequisitesResult,
      loading: listOrgRequisitesLoading,
    } = useQuery<ListOrgRequisites, ListOrgRequisitesVariables>(
      LIST_ORG_REQUISITES,
      () => ({
        orgId: route.params.orgId as string,
      }),
      {
        fetchPolicy: 'cache-and-network',
      }
    )
    const listOrgRequisites = computed(
      () => listOrgRequisitesResult.value?.listOrgRequisites
    )

    const { mutate: updateSpecMutate } = useMutation<
      UpdateSpec,
      UpdateSpecVariables
    >(UPDATE_SPEC)

    const validationState = computed(() => {
      const def = {
        isOptionalFilled: false,
        isRequiredFilled: false,
      }

      if (!spec.value) return def
      if (!requisite.value) return def
      if (!spec.value.client) return def
      if (!spec.value.shipment) return def
      if (!spec.value.customs) return def

      return validateInvoicePrint(
        requisite.value,
        spec.value?.client,
        spec.value?.shipment,
        spec.value?.customs,
        spec.value?.amountInWords,
        spec.value?.amountInWordsClientLang
      )
    })

    const hasClient = computed(() => !!spec.value?.client?.id)

    const hasRequisite = computed(() => !!spec.value?.requisite)

    const requisites = computed(() => listOrgRequisites.value || [])

    const requisite = computed(() =>
      listOrgRequisites.value?.find((el) => el.id === spec.value?.requisite)
    )

    async function print() {
      try {
        if (!spec.value) return
        if (!requisite.value) return
        if (!spec.value.client) return
        if (!spec.value.shipment) return
        if (!spec.value.customs) return

        loading.value = true
        await printInvoice(
          spec.value,
          requisite.value,
          spec.value.client,
          spec.value.shipment,
          spec.value.customs,
          'print',
          false
        )
      } catch (error) {
        notify.error(`Error creating PDF: ${error.message}`)
        throw new Error(error)
      } finally {
        loading.value = false
      }
    }

    function goBack() {
      router.push({
        name: 'spec',
        params: {
          orgId: route.params.orgId,
          specId: route.params.specId,
        },
      })
    }

    return () => (
      <Modal
        v-model={dialog.value}
        fullscreen={mobile.value}
        maxWidth={1130}
        persistent
      >
        <Btn
          text
          icon
          mini
          class="absolute top-1 right-1 z-1 text-gray-100 dark:text-gray-200"
          {...{ onClick: goBack }}
        >
          <Icon>{ziCloseWindow}</Icon>
        </Btn>
        <div class="flex flex-col relative bg-white dark:bg-gray-900 pt-8 pb-12 px-4 sm:px-5">
          <div class="px-3">
            <div class="flex flex-col md:flex-row">
              <div class="mb-3 md:mb-0">
                <h4 class="text-2xl text-white">
                  {t('shipping.toPrintInvoiceTitle')}
                </h4>
                <p>{t('shipping.toPrintInvoiceSubtitle')}</p>
              </div>
              <ValidationStatus
                requiredFilled={validationState.value?.isRequiredFilled}
                optionalFilled={validationState.value?.isOptionalFilled}
                class="flex flex-wrap items-center justify-end flex-grow order-last md:order-none pr-2 md:pr-4 pt-2 md:pt-0"
              />
              <div class="flex items-center">
                <Btn
                  disabled={!validationState.value?.isRequiredFilled}
                  loading={loading.value}
                  minWidth={150}
                  {...{ onClick: print }}
                >
                  {t('shipping.doPrint')}
                </Btn>
              </div>
            </div>
          </div>

          <div class="py-6">
            <div class="bg-gray-600 rounded-md p-5 pt-10">
              <Company
                orgId={route.params.orgId as string}
                companyId={spec.value?.requisite}
                item={requisite.value}
                items={requisites.value}
                readonly={!hasRequisite.value}
                loading={listOrgRequisitesLoading.value}
                {...{
                  // update spec, set created requisite and default requisite
                  onUpdate: (input: SpecInput) => {
                    updateSpecMutate({
                      id: route.params.specId as string,
                      input: input,
                    })
                  },
                }}
              />

              <div class="my-10 border-t border-gray-400" />

              <ClientAndImporter
                orgId={route.params.orgId as string}
                specId={route.params.specId as string}
                item={spec.value?.client}
                readonly={!hasClient.value}
              />

              <div class="my-10 border-t border-gray-400" />

              <Shipment
                item={spec.value?.shipment}
                {...{
                  onUpdate: (input: SpecInput) => {
                    updateSpecMutate({
                      id: route.params.specId as string,
                      input: input,
                    })
                  },
                }}
              />

              <div class="my-10 border-t border-gray-400" />

              <CustomsAndPayment
                shipmentType={spec.value?.shipment?.activeType}
                item={spec.value?.customs}
                amount={spec.value?.total}
                {...{
                  onUpdate: (input: SpecInput) => {
                    updateSpecMutate({
                      id: route.params.specId as string,
                      input: input,
                    })
                  },
                }}
              />
            </div>
          </div>

          <div class="px-5">
            <div class="flex flex-col md:flex-row">
              <Btn
                outlined
                minWidth={150}
                class="order-last md:order-none mt-4 md:mt-0"
                {...{ onClick: goBack }}
              >
                {t('shipping.cancelPrint')}
              </Btn>
              <ValidationStatus
                requiredFilled={validationState.value?.isRequiredFilled}
                optionalFilled={validationState.value?.isOptionalFilled}
                class="flex flex-wrap items-center justify-end flex-grow order-first md:order-none md:pr-4 pb-2 md:pb-0"
              />
              <Btn
                disabled={!validationState.value?.isRequiredFilled}
                loading={loading.value}
                minWidth={150}
                {...{ onClick: print }}
              >
                {t('shipping.doPrint')}
              </Btn>
            </div>
          </div>
        </div>
      </Modal>
    )
  },
})
