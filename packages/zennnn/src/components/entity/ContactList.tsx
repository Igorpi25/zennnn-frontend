import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Btn } from '@zennnn/core'
import { ContactType } from '@/graphql/types'
import ContactItem from './ContactItem'
import Expand from './Expand'

import type { PropType } from 'vue'
import type { ContactInput } from '@/graphql/types'

export default defineComponent({
  props: {
    supplierId: String as PropType<string | null>,
    items: {
      type: Array as PropType<ContactInput[]>,
      default: () => [],
    },
    loading: Boolean,
    expanded: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t } = useI18n()

    // filter items fron __typename for fully array update
    const clearedItems = computed(() =>
      props.items.map((item) => ({
        contactType: item.contactType,
        contact: item.contact,
      }))
    )

    function addData() {
      emit('update', {
        contacts: [...clearedItems.value, { contactType: ContactType.QQ }],
      })
    }

    function updateData(i: number, item: ContactInput, value: ContactInput) {
      const updatedItem = Object.assign({}, item, value)
      const items = clearedItems.value.slice()
      items.splice(i, 1, updatedItem as any)
      emit('update', { contacts: items })
    }

    function deleteData(i: number) {
      const items = clearedItems.value.slice()
      items.splice(i, 1)
      emit('update', { contacts: items })
    }

    return () => (
      <Expand title={t('companyDetail.contactList')} expanded={props.expanded}>
        <div>
          <div
            class={[
              clearedItems.value.length > 0 ? 'pt-10' : 'pt-4',
              'grid md:grid-cols-2 gap-y-10 gap-x-4 lg:gap-x-10',
            ]}
          >
            {clearedItems.value.map((item, i) => (
              <ContactItem
                loading={props.loading}
                item={item}
                {...{
                  onUpdate: (val: ContactInput) => updateData(i, item, val),
                  onDelete: () => deleteData(i),
                }}
              />
            ))}
          </div>
          <div class="grid md:grid-cols-2 gap-y-10 gap-x-4 lg:gap-x-10 pt-10">
            <Btn block outlined small onClick={addData}>
              {t('companyDetail.addContact')}
            </Btn>
          </div>
        </div>
      </Expand>
    )
  },
})
