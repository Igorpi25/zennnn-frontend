import {
  h,
  ref,
  watch,
  computed,
} from 'vue'

import { useI18n } from 'vue-i18n'

import './DataTable.css'

import { convertToUnit } from '../../../utils/convertToUnit'
import { getObjectValueByPath } from '../../../utils/object'
import { wrapInArray } from '../../../utils/wrapInArray'
import { deepEqual } from '../../../utils/deepEqual'
import { defaultFilter } from '../../../utils/defaultFilter'

import Icon from '../Icon'

import { ziArrowSortTop } from '../../../assets/icons'

function sortItems (
  items,
  sortBy,
  sortDesc,
  locale,
  customSorters,
) {
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

function filterFn (item, search, filter) {
  return (header) => {
    const value = getObjectValueByPath(item, header.value)
    return header.filter ? header.filter(value, search, item) : filter(value, search, item)
  }
}

function searchTableItems (
  items,
  search,
  headersWithCustomFilters,
  headersWithoutCustomFilters,
  customFilter,
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

function groupItems (items, groupBy, groupDesc) {
  const key = groupBy[0]
  const groups = []
  let current = null
  for (var i = 0; i < items.length; i++) {
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

export default {
  name: 'DataTable',

  props: {
    hoverable: Boolean,
    hideHeaders: Boolean,
    tableWidth: {
      type: [String, Number],
      default: '',
    },
    headers: {
      type: Array,
      default: () => ([]),
    },
    items: {
      type: Array,
      default: () => ([]),
    },
    light: Boolean,
    expanded: {
      type: Array,
      default: () => ([]),
    },
    expand: Boolean,
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
      default: () => [],
    },
    sortDesc: {
      type: [Boolean, Array],
      default: () => [],
    },
    customSort: {
      type: Function,
      default: sortItems,
    },
    groupBy: {
      type: [String, Array],
      default: () => [],
    },
    groupDesc: {
      type: [Boolean, Array],
      default: () => [],
    },
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
    hideNoData: Boolean,
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
  },

  emits: ['update:page', 'update:items-per-page', 'update:sort-by', 'update:sort-desc', 'update:group-by', 'update:group-desc'],

  setup (props, { slots, emit }) {
    const { locale } = useI18n()

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

    // computed
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
        : Math.ceil(itemsLength.value / internalOptions.value.itemsPerPage) // TODO: can't use items.length here
    })

    const isGrouped = computed(() => !!internalOptions.value.groupBy.length)

    const computedHeaders = computed(() => {
      if (!props.headers) return []
      const headers = props.headers
      return headers
    })

    const columnSorters = computed(() => {
      return computedHeaders.value.reduce((acc, header) => {
        if (header.sort) acc[header.value] = header.sort
        return acc
      }, {})
    })

    const headersWithCustomFilters = computed(() => computedHeaders.value.filter(header => header.filter))

    const headersWithoutCustomFilters = computed(() => computedHeaders.value.filter(header => !header.filter))

    const filteredItems = computed(() => {
      let items = props.items.slice()
      if (!props.disableFiltering && props.serverItemsLength <= 0) {
        items = customFilterWithColumns(items, props.search)
      }
      return items
    })

    const computedItems = computed(() => {
      let items = filteredItems.value.slice()
      if (!props.disableSort && props.serverItemsLength <= 0) {
        items = _sortItems(items)
      }
      if (isGrouped.value) {
        const group = _groupItems(items)
        if (group) {
          const groupItems = []
          group.map(el => {
            const group = { group: true, groupName: el.name, groupItemsCount: el.items.length }
            groupItems.push(group, ...el.items)
          })
          return groupItems
        }
      }
      return items
    })

    // watch
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

    // methods
    const toggle = (key, oldBy, oldDesc, page, mustSort, multiSort) => {
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

    const sort = (key) => {
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

    const sortArray = (sortBy) => {
      const sortDesc = sortBy.map(s => {
        const i = internalOptions.value.sortBy.findIndex((k) => k === s)
        return i > -1 ? internalOptions.value.sortDesc[i] : false
      })

      updateOptions({ sortBy, sortDesc })
    }

    const updateOptions = (options) => {
      internalOptions.value = {
        ...internalOptions.value,
        ...options,
        page: props.serverItemsLength < 0
          ? Math.max(1, Math.min(options.page || internalOptions.value.page, pageCount.value))
          : options.page || internalOptions.value.page,
      }
    }

    const _sortItems = (items) => {
      let sortBy = internalOptions.value.sortBy
      let sortDesc = internalOptions.value.sortDesc

      if (internalOptions.value.groupBy.length) {
        sortBy = [...internalOptions.value.groupBy, ...sortBy]
        sortDesc = [...internalOptions.value.groupDesc, ...sortDesc]
      }

      return customSortWithHeaders(items, sortBy, sortDesc, locale)
    }

    const _groupItems = (items) => {
      return props.customGroup(items, internalOptions.value.groupBy, internalOptions.value.groupDesc)
    }

    const customSortWithHeaders = (items, sortBy, sortDesc, locale) => {
      return props.customSort(items, sortBy, sortDesc, locale, columnSorters.value)
    }

    const customFilterWithColumns = (items, search) => {
      return searchTableItems(items, search, headersWithCustomFilters.value, headersWithoutCustomFilters.value, props.customFilter)
    }

    const genSlot = (name) => {
      return slots[name] ? slots[name]() : undefined
    }

    const genTHead = () => {
      const children = computedHeaders.value.map((header, i) => {
        if (slots[`header.${header.value}`]) return slots[`header.${header.value}`]({ value: header.value, header: header })
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
          slots[`header.${header.value}-content`]
            ? slots[`header.${header.value}-content`]({ value: header.value, header: header })
            : h('span', undefined, header.text),
          h(Icon, { size: 24, class: 'data-table-header__icon' }, { default: () => ziArrowSortTop }),
        ])
      })
      return h('thead', undefined, h('tr', undefined, children))
    }

    const genTBody = () => {
      return h('tbody', undefined, [
        slots.items ? genSlotItems() : genDefaultItems(),
        slots.expanded ? slots.expanded() : undefined,
        slots.footer ? slots.footer() : undefined,
      ])
    }

    const genSlotItems = () => {
      return slots.items({ items: computedItems.value })
    }

    const genDefaultItems = () => {
      return computedItems.value.map((item, i) => {
        if (item.group) {
          return h('tr', {
            key: item.groupName,
            style: { background: 'transparent' },
          }, h('td', {
            colspan: computedHeaders.value.length,
            style: { height: '32px', paddingLeft: '51px' },
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
            if (slots[`item.${header.value}`]) return slots[`item.${header.value}`]({ value: item[header.value], item: item })
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

    const genTable = () => {
      return h('table', {
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
    }

    return {
      genSlot,
      genTable,
    }
  },

  render () {
    return h('div', {
      class: 'data-table__wrapper',
    }, [
      this.genSlot('top'),
      this.genTable(),
      this.genSlot('bottom'),
    ])
  },
}
