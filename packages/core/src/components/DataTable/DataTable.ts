import {
  h,
  ref,
  watch,
  computed,
  defineComponent,
  Prop,
} from 'vue'

import { useI18n } from 'vue-i18n'

import { convertToUnit, getObjectValueByPath, wrapInArray, deepEqual } from 'vue-supp'

import { ziArrowSortTop } from '@zennnn/icons'

import defaultFilter from '../../utils/defaultFilter'

import Icon from '../Icon'
import Progress from '../Progress'

type DataTableCompareFunction<T = any> = (a: T, b: T) => number
type DataTableFilterFunction = (value: any, search: string | null, item: any) => boolean
interface DataTableHeader<T extends any = any> {
  text: string
  value: string
  align?: 'start' | 'left' | 'center' | 'end' | 'right'
  sortable?: boolean
  class?: string | string[]
  cellClass?: string | string[]
  width?: string | number
  minWidth?: string | number
  filter?: (value: any, search: string | null, item: any) => boolean
  sort?: DataTableCompareFunction<T>
}
interface ItemGroup<T> {
  name: string
  items: T[]
}

function sortItems<T extends any = any> (
  items: T[],
  sortBy: string[],
  sortDesc: boolean[],
  locale: string,
  customSorters?: Record<string, DataTableCompareFunction<T>>,
): T[] {
  if (sortBy === null || !sortBy.length) return items
  const stringCollator = new Intl.Collator(locale, { sensitivity: 'accent', usage: 'sort' })

  return items.sort((a, b) => {
    for (let i = 0; i < sortBy.length; i++) {
      const sortKey = sortBy[i]

      let sortA = getObjectValueByPath(a, sortKey)
      let sortB = getObjectValueByPath(b, sortKey)

      if (sortDesc[i]) {
        [sortA, sortB] = [sortB, sortA]
      }

      if (customSorters && customSorters[sortKey]) {
        const customResult = customSorters[sortKey](sortA, sortB)

        if (!customResult) continue

        return customResult
      }

      // Check if both cannot be evaluated
      if (sortA === null && sortB === null) {
        continue
      }

      [sortA, sortB] = [sortA, sortB].map(s => (s || '').toString().toLocaleLowerCase())

      if (sortA !== sortB) {
        if (!isNaN(sortA) && !isNaN(sortB)) return Number(sortA) - Number(sortB)
        return stringCollator.compare(sortA, sortB)
      }
    }

    return 0
  })
}

function filterFn (item: any, search: string | null, filter: DataTableFilterFunction) {
  return (header: DataTableHeader) => {
    const value = getObjectValueByPath(item, header.value)
    return header.filter ? header.filter(value, search, item) : filter(value, search, item)
  }
}

function searchTableItems (
  items: any[],
  search: string | null,
  headersWithCustomFilters: DataTableHeader[],
  headersWithoutCustomFilters: DataTableHeader[],
  customFilter: DataTableFilterFunction,
) {
  let filtered = items
  search = typeof search === 'string' ? search.trim() : null
  if (search && headersWithoutCustomFilters.length) {
    filtered = items.filter(item => headersWithoutCustomFilters.some(filterFn(item, search, customFilter)))
  }
  if (headersWithCustomFilters.length) {
    filtered = filtered.filter(item => headersWithCustomFilters.every(filterFn(item, search, defaultFilter)))
  }
  return filtered
}

function groupItems<T extends any = any> (
  items: T[],
  groupBy: string[],
  groupDesc: boolean[], // eslint-disable-line @typescript-eslint/no-unused-vars
): ItemGroup<T>[] {
  const key = groupBy[0]
  const groups: ItemGroup<T>[] = []
  let current = null
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const val = getObjectValueByPath(item, key)
    if (current !== val) {
      current = val
      groups.push({
        name: val,
        items: [],
      })
    }
    groups[groups.length - 1].items.push(item)
  }
  return groups
}

export default defineComponent({
  name: 'DataTable',

  props: {
    hoverable: Boolean,
    hideHeaders: Boolean,
    headers: {
      type: Array,
      default: () => ([]),
    } as Prop<DataTableHeader[]>,
    items: {
      type: Array,
      default: () => ([]),
    },
    expanded: {
      type: Array,
      default: () => ([]),
    },
    tableClass: {
      type: String,
      default: '',
    },
    search: String,
    customFilter: {
      type: Function,
      default: defaultFilter,
    },
    page: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    options: Object,
    sortBy: {
      type: [String, Array],
      default: () => ([]),
    } as Prop<string | string[]>,
    sortDesc: {
      type: [Boolean, Array],
      default: () => ([]),
    } as Prop<boolean | boolean[]>,
    customSort: {
      type: Function,
      default: sortItems,
    },
    groupBy: {
      type: [String, Array],
      default: () => ([]),
    } as Prop<string | string[]>,
    groupDesc: {
      type: [Boolean, Array],
      default: () => ([]),
    } as Prop<boolean | boolean[]>,
    customGroup: {
      type: Function,
      default: groupItems,
    },
    serverItemsLength: {
      type: Number,
      default: -1,
    },
    disableFiltering: Boolean,
    disableSort: Boolean,
    mustSort: Boolean,
    multiSort: Boolean,
    fixed: {
      type: Boolean,
      default: true,
    },
    width: {
      type: [Number, String],
      default: '100%',
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    borderSpacing: {
      type: String,
      default: '0 1px',
    },
    singleLine: {
      type: Boolean,
      default: true,
    },
    loading: Boolean,
    scrollable: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['update:page', 'update:items-per-page', 'update:sort-by', 'update:sort-desc', 'update:group-by', 'update:group-desc'],

  setup (props, { slots, emit }) {
    const { locale, t } = useI18n()

    const internalOptions = ref({
      page: props.page,
      itemsPerPage: props.itemsPerPage,
      sortBy: wrapInArray(props.sortBy),
      sortDesc: wrapInArray(props.sortDesc),
      groupBy: wrapInArray(props.groupBy),
      groupDesc: wrapInArray(props.groupDesc),
      multiSort: props.multiSort,
      mustSort: props.mustSort,
    })

    if (props.options) {
      Object.assign(internalOptions.value, props.options)
    }

    const { sortBy: _sortBy, sortDesc: _sortDesc, groupBy: _groupBy, groupDesc: _groupDesc } = internalOptions.value
    const sortDiff = _sortBy.length - _sortDesc.length
    const groupDiff = _groupBy.length - _groupDesc.length

    if (sortDiff > 0) {
      internalOptions.value.sortDesc.push(...Array(sortDiff).fill(false))
    }

    if (groupDiff > 0) {
      internalOptions.value.groupDesc.push(...Array(groupDiff).fill(false))
    }

    const borderSpacing = computed(() => {
      return props.rounded
        ? '0 4px'
        : props.borderSpacing
    })

    const itemsLength = computed(() => {
      return props.serverItemsLength >= 0 ? props.serverItemsLength : filteredItems.value.length
    })

    const pageCount = computed(() => {
      return internalOptions.value.itemsPerPage === -1
        ? 1
        : Math.ceil(itemsLength.value / internalOptions.value.itemsPerPage)
    })

    const isGrouped = computed(() => !!internalOptions.value.groupBy.length)

    const computedHeaders = computed(() => {
      if (!props.headers) return []
      const headers = props.headers
      return headers
    })

    const columnSorters = computed((): Record<string, DataTableCompareFunction> => {
      return computedHeaders.value.reduce<Record<string, DataTableCompareFunction>>((acc, header) => {
        if (header.sort) acc[header.value] = header.sort
        return acc
      }, {})
    })

    const headersWithCustomFilters = computed(() => computedHeaders.value.filter(header => header.filter))

    const headersWithoutCustomFilters = computed(() => computedHeaders.value.filter(header => !header.filter))

    const filteredItems = computed((): any[] => {
      let items = props.items.slice()
      if (!props.disableFiltering && props.serverItemsLength <= 0) {
        items = customFilterWithColumns(items, props.search as string)
      }
      return items
    })

    const computedItems = computed((): any[] => {
      let items = filteredItems.value.slice()
      if (!props.disableSort && props.serverItemsLength <= 0) {
        items = _sortItems(items)
      }
      if (isGrouped.value) {
        const group = _groupItems(items)
        if (group) {
          const groupItems: any[] = []
          group.forEach(el => {
            const group = { group: true, groupName: el.name, groupItemsCount: el.items.length }
            groupItems.push(group, ...el.items)
          })
          return groupItems
        }
      }
      return items
    })

    watch(() => props.page, (page) => {
      updateOptions({ page })
    })

    watch(() => internalOptions.value.page, (page) => {
      emit('update:page', page)
    })

    watch(() => props.itemsPerPage, (itemsPerPage) => {
      updateOptions({ itemsPerPage })
    })

    watch(() => internalOptions.value.itemsPerPage, (itemsPerPage) => {
      emit('update:items-per-page', itemsPerPage)
    })

    watch(() => props.sortBy, (sortBy) => {
      updateOptions({ sortBy: wrapInArray(sortBy) })
    })

    watch(() => internalOptions.value.sortBy, (sortBy, old) => {
      !deepEqual(sortBy, old) && emit('update:sort-by', Array.isArray(props.sortBy) ? sortBy : sortBy[0])
    })

    watch(() => props.sortDesc, (sortDesc) => {
      updateOptions({ sortDesc: wrapInArray(sortDesc) })
    })

    watch(() => internalOptions.value.sortDesc, (sortDesc, old) => {
      !deepEqual(sortDesc, old) && emit('update:sort-desc', Array.isArray(props.sortDesc) ? sortDesc : sortDesc[0])
    })

    watch(() => props.groupBy, (groupBy) => {
      updateOptions({ groupBy: wrapInArray(groupBy) })
    })

    watch(() => internalOptions.value.groupBy, (groupBy, old) => {
      !deepEqual(groupBy, old) && emit('update:group-by', Array.isArray(props.groupBy) ? groupBy : groupBy[0])
    })

    watch(() => props.groupDesc, (groupDesc) => {
      updateOptions({ groupDesc: wrapInArray(groupDesc) })
    })

    watch(() => internalOptions.value.groupDesc, (groupDesc, old) => {
      !deepEqual(groupDesc, old) && emit('update:group-desc', Array.isArray(props.groupDesc) ? groupDesc : groupDesc[0])
    })

    function toggle (key: string, oldBy: string[], oldDesc: boolean[], page: number, mustSort: boolean, multiSort: boolean) {
      let by = oldBy.slice()
      let desc = oldDesc.slice()
      const byIndex = by.findIndex((k) => k === key)

      if (byIndex < 0) {
        if (!multiSort) {
          by = []
          desc = []
        }

        by.push(key)
        desc.push(false)
      } else if (byIndex >= 0 && !desc[byIndex]) {
        desc[byIndex] = true
      } else if (!mustSort) {
        by.splice(byIndex, 1)
        desc.splice(byIndex, 1)
      } else {
        desc[byIndex] = false
      }

      // Reset page to 1 if sortBy or sortDesc have changed
      if (!deepEqual(by, oldBy) || !deepEqual(desc, oldDesc)) {
        page = 1
      }

      return { by, desc, page }
    }

    // (key: string | string[]): void
    function sort (key: string | string[]): void {
      if (Array.isArray(key)) return sortArray(key)

      const { by: sortBy, desc: sortDesc, page } = toggle(
        key,
        internalOptions.value.sortBy,
        internalOptions.value.sortDesc,
        internalOptions.value.page,
        props.mustSort,
        props.multiSort,
      )
      updateOptions({ sortBy, sortDesc, page })
    }

    function sortArray (sortBy: string[]) {
      const sortDesc = sortBy.map(s => {
        const i = internalOptions.value.sortBy.findIndex((k) => k === s)
        return i > -1 ? internalOptions.value.sortDesc[i] : false
      })

      updateOptions({ sortBy, sortDesc })
    }

    function updateOptions (options: any) {
      internalOptions.value = {
        ...internalOptions.value,
        ...options,
        page: props.serverItemsLength < 0
          ? Math.max(1, Math.min(options.page || internalOptions.value.page, pageCount.value))
          : options.page || internalOptions.value.page,
      }
    }

    function _sortItems (items: any[]): any[] {
      let sortBy = internalOptions.value.sortBy
      let sortDesc = internalOptions.value.sortDesc

      if (internalOptions.value.groupBy.length) {
        sortBy = [...internalOptions.value.groupBy, ...sortBy]
        sortDesc = [...internalOptions.value.groupDesc, ...sortDesc]
      }

      return customSortWithHeaders(items, sortBy, sortDesc, locale.value)
    }

    function _groupItems (items: any[]): ItemGroup<any>[] {
      return props.customGroup(items, internalOptions.value.groupBy, internalOptions.value.groupDesc)
    }

    function customSortWithHeaders (items: any[], sortBy: string[], sortDesc: boolean[], locale: string) {
      return props.customSort(items, sortBy, sortDesc, locale, columnSorters.value)
    }

    function customFilterWithColumns (items: any[], search: string) {
      return searchTableItems(items, search, headersWithCustomFilters.value, headersWithoutCustomFilters.value, props.customFilter as DataTableFilterFunction)
    }

    function genSlot (name: string) {
      return slots[name]?.()
    }

    function genTHead () {
      if (props.hideHeaders) return undefined
      const children = computedHeaders.value.map((header, i) => {
        if (slots[`header-${header.value}`]) return slots[`header-${header.value}`]!({ value: header.value, header: header })
        return h('th', {
          key: i,
          width: convertToUnit(header.width) || null,
          style: {
            width: convertToUnit(header.width) || null,
            minWidth: convertToUnit(header.minWidth) || null,
          },
          class: [
            header.align === 'left' ? 'text-left' : header.align === 'right' ? 'text-right' : 'text-center',
            { sortable: header.sortable },
            header.sortable && internalOptions.value.sortBy.includes(header.value)
              ? `active ${internalOptions.value.sortDesc[internalOptions.value.sortBy.findIndex(k => k === header.value)] ? 'desc' : 'asc'}`
              : '',
            header.class,
          ],
          onClick: () => {
            return header.sortable ? sort(header.value) : undefined
          },
        }, [
          slots[`header-content-${header.value}`]
            ? slots[`header-content-${header.value}`]!({ value: header.value, header: header })
            : h('span', undefined, header.text),
          h(Icon, { size: 24, class: 'data-table-header__icon' }, { default: () => ziArrowSortTop }),
        ])
      })
      return h('thead', undefined, h('tr', undefined, children))
    }

    function genTBody () {
      return h('tbody', undefined, [
        slots.items ? genSlotItems() : genDefaultItems(),
        slots.expanded?.(),
        slots.footer?.(),
      ])
    }

    function genNoData () {
      return slots['no-data']
        ? slots['no-data']()
        : h('div', {
          class: 'text-center text-gray-200 leading-tight py-4',
        }, t('dataTable.noData'))
    }

    function genNoResult () {
      return slots['no-result']
        ? slots['no-result']()
        : h('div', {
          class: 'text-center text-gray-200 leading-tight py-4',
        }, t('dataTable.noResult'))
    }

    function genLoading () {
      return slots.loading
        ? slots.loading()
        : h('div', {
          class: 'text-center text-gray-200 py-4',
        }, h(Progress, {
          indeterminate: true,
          size: 24,
          width: 2,
        }))
    }

    function genNoDataSlot () {
      return props.items.length === 0 && props.loading
        ? genLoading()
        : props.items.length === 0
          ? genNoData()
          : filteredItems.value.length === 0
            ? genNoResult()
            : undefined
    }

    function genSlotItems () {
      return slots.items?.({ items: computedItems.value })
    }

    function genDefaultItems () {
      return computedItems.value.map((item, i) => {
        if (item.group) {
          return h('tr', {
            key: item.groupName,
            style: { background: 'transparent' },
          }, h('td', {
            colspan: computedHeaders.value.length,
            style: { height: i === 0 ? '16px' : '32px', paddingLeft: '51px' },
            class: 'text-gray-200 text-base leading-tight align-bottom p-0',
          }, [
            h('span', {
              class: 'text-white',
            }, item.groupName),
            h('span', {
              class: 'text-gray-200',
            }, item.groupItemsCount),
          ]))
        } else {
          const children = computedHeaders.value.map(header => {
            if (slots[`item-${header.value}`]) return slots[`item-${header.value}`]!({ value: item[header.value], item: item })
            return h('td', {
              key: `${i}-${header.value}`,
              class: [
                header.align === 'left' ? 'text-left' : header.align === 'right' ? 'text-right' : 'text-center',
              ],
            }, item[header.value])
          })
          return h('tr', {
            key: i,
          }, children)
        }
      })
    }

    function genTable () {
      const table = h('table', {
        width: convertToUnit(props.width),
        class: {
          'data-table': true,
          'data-table--rounded': props.rounded,
          'data-table--hoverable': props.hoverable,
          'data-table--single-line': props.singleLine,
          'data-table--empty': computedItems.value.length === 0,
          'table-fixed': props.fixed,
          'border-separate': borderSpacing.value,
          [props.tableClass.trim()]: true,
        },
        style: {
          borderSpacing: borderSpacing.value,
        },
      }, [
        genTHead(),
        genTBody(),
      ])

      return props.scrollable
        ? h('div', {
          class: {
            'data-table__scroll-wrapper': props.scrollable,
          },
        }, table)
        : table
    }

    return {
      genSlot,
      genTable,
      genNoDataSlot,
    }
  },

  render () {
    return h('div', {
      class: 'data-table__wrapper',
    }, [
      this.genSlot('top'),
      this.genTable(),
      this.genNoDataSlot(),
    ])
  },
})
