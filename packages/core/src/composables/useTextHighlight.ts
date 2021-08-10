import { h, Ref } from 'vue'

export function useTextHighlight(search: Ref<string | null | undefined>) {
  function genFilteredText(text: string | null | undefined) {
    text = text || ''

    if (!search.value) return text

    const { start, middle, end } = getMaskedCharacters(text)

    return h('span', [start, genHighlight(middle), end])
  }

  function genHighlight(text: string) {
    return h(
      'span',
      {
        class: 'listbox__option__mask',
      },
      text
    )
  }

  function getMaskedCharacters(text: string) {
    const searchInput = (search.value || '').toString().toLocaleLowerCase()
    const index = text.toLocaleLowerCase().indexOf(searchInput)

    if (index < 0) return { start: '', middle: text, end: '' }

    const start = text.slice(0, index)
    const middle = text.slice(index, index + searchInput.length)
    const end = text.slice(index + searchInput.length)
    return { start, middle, end }
  }

  return {
    genFilteredText,
  }
}
