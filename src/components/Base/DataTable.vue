<template>
  <div
    :class="[
      'data-table',
      { 'data-table--flat': flat },
      { 'data-table--hoverable': hoverable },
    ]"
  >
    <slot name="top"/>
    <table
      :width="tableWidth || null"
      :class="[
        'border-separate bg-gray-800 rounded-md',
        { 'px-sm': !flat },
        { 'pb-2': !flat && computedItems.length !== 0 },
        flat ? 'border-spacing-y-px' : 'border-spacing-y-1',
        tableClass,
      ]"
    >
      <thead
        v-if="!hideHeaders"
        :class="[
          'bg-gray-800 text-center select-none',
          flat ? 'text-gray-300' : 'text-gray-400',
          theadClass,
        ]"
      >
        <tr>
          <template
            v-for="(header, index) in headers"
          >
            <slot
              :name="`header.${header.value}`"
              :value="header.value"
              :header="header"
            >
              <td
                :key="index"
                :width="convertToUnit(header.width) || null"
                :style="{
                  width: convertToUnit(header.width) || null,
                  minWidth: convertToUnit(header.minWidth) || null
                }"
                :class="[
                    header.align === 'left' ? 'text-left' : header.align === 'right' ? 'text-right' : 'text-center',
                  { 'sortable cursor-pointer': header.sortable },
                  header.sortable && internalOptions.sortBy.includes(header.value)
                    ? `active ${internalOptions.sortDesc[internalOptions.sortBy.findIndex(k => k === header.value)] ? 'desc' : 'asc'}`
                    : '',
                  header.class,
                ]"
                @click="header.sortable ? sort(header.value) : {}"
              >
                <slot
                  :name="`header.${header.value}-content`"
                  :value="header.value"
                  :header="header"
                >
                  <span>{{ header.text }}</span>
                </slot>
                <span v-if="header.sortable" class="absolute inset-y-0 inline-flex items-center">
                  <i
                    class="data-table-header__icon zi-arrow-top-sort"
                  />
                </span>
              </td>
            </slot>
          </template>
        </tr>
      </thead>
      <thead v-if="computedItems.length === 0 && !hideNoData">
        <tr>
          <td
            :colspan="headers.length"
            class="text-gray-200 text-center"
          >
            <slot name="no-data">
              <span v-if="items.length === 0">
                {{ $t('dataTable.noData') }}
              </span>
              <span v-else>
                {{ $t('dataTable.noResult') }}
              </span>
            </slot>
          </td>
        </tr>
      </thead>
      <thead v-if="computedItems.length === 0 && items.length > 0">
        <tr>
          <td
            :colspan="headers.length"
            class="text-gray-200 text-center"
          >
            <slot name="no-result">
              <span>
                {{ $t('dataTable.noResult') }}
              </span>
            </slot>
          </td>
        </tr>
      </thead>
      <tbody v-else>
        <slot name="items" :items="computedItems">
          <template v-for="(item, index) in computedItems">
            <tr
              v-if="item.group"
              :key="item.groupName"
              :style="{ background: 'transparent' }"
            >
              <td
                :colspan="headers.length"
                :style="{ height: '32px', paddingLeft: '51px' }"
                class="text-gray-200 text-base leading-tight align-bottom p-0"
              >
                <span class="text-white">{{ item.groupName }}</span> <span class="text-gray-200">({{ item.groupItemsCount }})</span>
              </td>
            </tr>
            <tr
              v-else
              :key="index"
            >
              <template v-for="header in headers">
                <slot
                  :name="`item.${header.value}`"
                  :value="item[header.value]"
                  :item="item"
                >
                  <td
                    :key="`${index}-${header.value}`"
                    :class="[
                      'p-1',
                      header.align === 'left' ? 'text-left' : header.align === 'right' ? 'text-right' : 'text-center',
                    ]"
                  >
                    {{ item[header.value] }}
                  </td>
                </slot>
              </template>
            </tr>
          </template>
        </slot>
        <slot name="expanded" />
        <slot name="footer" />
      </tbody>
    </table>
  </div>
</template>

<script>

import { convertToUnit, getObjectValueByPath, defaultFilter, sortItems, deepEqual, wrapInArray } from '@/util/helpers'

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
    flat: Boolean,
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
      type: [String, Array, Object],
      default: '',
    },
    theadClass: {
      type: [String, Array, Object],
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
    hideNoData: Boolean,
  },
  data () {
    const internalOptions = {
      page: this.page,
      itemsPerPage: this.itemsPerPage,
      sortBy: wrapInArray(this.sortBy),
      sortDesc: wrapInArray(this.sortDesc),
      groupBy: wrapInArray(this.groupBy),
      groupDesc: wrapInArray(this.groupDesc),
      multiSort: false,
      mustSort: false,
    }
    if (this.options) {
      Object.assign(internalOptions, this.options)
    }

    const { sortBy, sortDesc, groupBy, groupDesc } = internalOptions
    const sortDiff = sortBy.length - sortDesc.length
    const groupDiff = groupBy.length - groupDesc.length

    if (sortDiff > 0) {
      internalOptions.sortDesc.push(...Array(sortDiff).fill(false))
    }

    if (groupDiff > 0) {
      internalOptions.groupDesc.push(...Array(groupDiff).fill(false))
    }

    return {
      serverItemsLength: -1,
      internalOptions,
    }
  },
  computed: {
    locale () {
      return this.$i18n.locale
    },
    itemsLength () {
      return this.serverItemsLength >= 0 ? this.serverItemsLength : this.filteredItems.length
    },
    pageCount () {
      return this.internalOptions.itemsPerPage === -1
        ? 1
        : Math.ceil(this.itemsLength / this.internalOptions.itemsPerPage) // TODO: can't use items.length here
    },
    isGrouped () {
      return !!this.internalOptions.groupBy.length
    },
    computedHeaders () {
      if (!this.headers) return []
      const headers = this.headers
      return headers
    },
    columnSorters () {
      return this.computedHeaders.reduce((acc, header) => {
        if (header.sort) acc[header.value] = header.sort
        return acc
      }, {})
    },
    headersWithCustomFilters () {
      return this.computedHeaders.filter(header => header.filter)
    },
    headersWithoutCustomFilters () {
      return this.computedHeaders.filter(header => !header.filter)
    },
    filteredItems () {
      let items = this.items.slice()
      if (!this.disableFiltering && this.serverItemsLength <= 0) {
        items = this.customFilterWithColumns(items, this.search)
      }
      return items
    },
    computedItems () {
      let items = this.filteredItems.slice()
      if (!this.disableSort && this.serverItemsLength <= 0) {
        items = this.sortItems(items)
      }
      if (this.isGrouped) {
        const group = this.groupItems(items)
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
    },
  },
  watch: {
    page (page) {
      this.updateOptions({ page })
    },
    'internalOptions.page' (page) {
      this.$emit('update:page', page)
    },
    itemsPerPage (itemsPerPage) {
      this.updateOptions({ itemsPerPage })
    },
    'internalOptions.itemsPerPage' (itemsPerPage) {
      this.$emit('update:items-per-page', itemsPerPage)
    },
    sortBy (sortBy) {
      this.updateOptions({ sortBy: wrapInArray(sortBy) })
    },
    'internalOptions.sortBy' (sortBy, old) {
      !deepEqual(sortBy, old) && this.$emit('update:sort-by', Array.isArray(this.sortBy) ? sortBy : sortBy[0])
    },
    sortDesc (sortDesc) {
      this.updateOptions({ sortDesc: wrapInArray(sortDesc) })
    },
    'internalOptions.sortDesc' (sortDesc, old) {
      !deepEqual(sortDesc, old) && this.$emit('update:sort-desc', Array.isArray(this.sortDesc) ? sortDesc : sortDesc[0])
    },
    groupBy (groupBy) {
      this.updateOptions({ groupBy: wrapInArray(groupBy) })
    },
    'internalOptions.groupBy' (groupBy, old) {
      !deepEqual(groupBy, old) && this.$emit('update:group-by', Array.isArray(this.groupBy) ? groupBy : groupBy[0])
    },
    groupDesc (groupDesc) {
      this.updateOptions({ groupDesc: wrapInArray(groupDesc) })
    },
    'internalOptions.groupDesc' (groupDesc, old) {
      !deepEqual(groupDesc, old) && this.$emit('update:group-desc', Array.isArray(this.groupDesc) ? groupDesc : groupDesc[0])
    },
  },
  methods: {
    convertToUnit (val) {
      return convertToUnit(val)
    },
    toggle (key, oldBy, oldDesc, page, mustSort, multiSort) {
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
    },
    group (key) {
      const { by: groupBy, desc: groupDesc, page } = this.toggle(
        key,
        this.internalOptions.groupBy,
        this.internalOptions.groupDesc,
        this.internalOptions.page,
        true,
        false,
      )
      this.updateOptions({ groupBy, groupDesc, page })
    },
    sort (key) {
      if (Array.isArray(key)) return this.sortArray(key)

      const { by: sortBy, desc: sortDesc, page } = this.toggle(
        key,
        this.internalOptions.sortBy,
        this.internalOptions.sortDesc,
        this.internalOptions.page,
        this.mustSort,
        this.multiSort,
      )
      this.updateOptions({ sortBy, sortDesc, page })
    },
    sortArray (sortBy) {
      const sortDesc = sortBy.map(s => {
        const i = this.internalOptions.sortBy.findIndex((k) => k === s)
        return i > -1 ? this.internalOptions.sortDesc[i] : false
      })

      this.updateOptions({ sortBy, sortDesc })
    },
    updateOptions (options) {
      this.internalOptions = {
        ...this.internalOptions,
        ...options,
        page: this.serverItemsLength < 0
          ? Math.max(1, Math.min(options.page || this.internalOptions.page, this.pageCount))
          : options.page || this.internalOptions.page,
      }
    },
    sortItems (items) {
      let sortBy = this.internalOptions.sortBy
      let sortDesc = this.internalOptions.sortDesc

      if (this.internalOptions.groupBy.length) {
        sortBy = [...this.internalOptions.groupBy, ...sortBy]
        sortDesc = [...this.internalOptions.groupDesc, ...sortDesc]
      }

      return this.customSortWithHeaders(items, sortBy, sortDesc, this.locale)
    },
    groupItems (items) {
      return this.customGroup(items, this.internalOptions.groupBy, this.internalOptions.groupDesc)
    },
    customSortWithHeaders (items, sortBy, sortDesc, locale) {
      return this.customSort(items, sortBy, sortDesc, locale, this.columnSorters)
    },
    customFilterWithColumns (items, search) {
      return searchTableItems(items, search, this.headersWithCustomFilters, this.headersWithoutCustomFilters, this.customFilter)
    },
  },
}
</script>
