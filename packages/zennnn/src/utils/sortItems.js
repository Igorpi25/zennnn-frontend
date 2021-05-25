import { getObjectValueByPath } from 'vue-supp'

export const sortItems = (items, sortBy, sortDesc, locale, customSorters) => {
  if (sortBy === null || !sortBy.length) return items
  const stringCollator = new Intl.Collator(locale, {
    sensitivity: 'accent',
    usage: 'sort',
  })

  return items.sort((a, b) => {
    for (let i = 0; i < sortBy.length; i++) {
      const sortKey = sortBy[i]

      let sortA = getObjectValueByPath(a, sortKey)
      let sortB = getObjectValueByPath(b, sortKey)

      if (sortDesc[i]) {
        ;[sortA, sortB] = [sortB, sortA]
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

      ;[sortA, sortB] = [sortA, sortB].map((s) =>
        (s || '').toString().toLocaleLowerCase()
      )

      if (sortA !== sortB) {
        if (!isNaN(sortA) && !isNaN(sortB)) return Number(sortA) - Number(sortB)
        return stringCollator.compare(sortA, sortB)
      }
    }

    return 0
  })
}

export default sortItems
