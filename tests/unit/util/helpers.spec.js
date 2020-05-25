import { classToArray, clearClasses, mergeClasses } from '@/util/helpers'

describe('classToArray', () => {
  it('normalized classes array from string', () => {
    const classes = classToArray('flex items-center')
    expect(classes).toEqual(
      expect.arrayContaining(['flex', 'items-center'])
    )
  })
  it('normalized classes array from array', () => {
    const classes = classToArray(['flex items-center', 'justify-center'])
    expect(classes).toEqual(
      expect.arrayContaining(['flex', 'items-center', 'justify-center'])
    )
  })
})

describe('clearClasses', () => {
  it('empty classes', () => {
    expect(clearClasses('h-12', null)).toBe('h-12')
    expect(clearClasses('h-12', undefined)).toBe('h-12')
    expect(clearClasses('h-12', '')).toBe('h-12')
    expect(clearClasses(null, 'flex items-center h-12')).toBeFalsy()
  })
  it('clear string classes', () => {
    const source = 'h-12 mx-12 flex items-center'
    const dest = 'h-10 mx-1'
    const classes = clearClasses(source, dest)
    expect(classes).toBe('flex items-center')
  })
  it('clear array classes', () => {
    const source = ['h-12', 'mx-12', 'flex', 'items-center']
    const dest = 'h-10 mx-1'
    const classes = clearClasses(source, dest)
    expect(classes).toEqual(
      expect.arrayContaining(['flex', 'items-center'])
    )
  })
  it('pseudo-class clear', () => {
    const source = 'flex relative text-gray-100 bg-blue-100 hover:text-gray-500 focus:bg-blue-500'
    const dest = 'hover:text-gray-900 focus:bg-blue-900'
    const classes = clearClasses(source, dest)
    expect(classes).toEqual(
      'flex relative text-gray-100 bg-blue-100'
    )
  })
})

describe('mergeClasses', () => {
  it('empty classes', () => {
    expect(mergeClasses('h-12', null)).toBe('h-12')
    expect(mergeClasses('h-12', undefined)).toBe('h-12')
    expect(mergeClasses('h-12', '')).toBe('h-12')
    expect(mergeClasses(null, 'flex items-center h-12')).toBe('flex items-center h-12')
  })
  it('merge string classes', () => {
    const source = 'h-12 mx-12 flex items-center text-2xl text-white text-gray-100'
    const dest = 'h-10 mx-1 text-sm text-gray-200'
    const classes = mergeClasses(source, dest)
    expect(classes).toBe('flex items-center h-10 mx-1 text-sm text-gray-200')
  })
  it('merge array classes', () => {
    const source = ['h-12', 'mx-12', 'flex', 'items-center', 'border-gray-100']
    const dest = 'h-10 mx-1 border-blue-500'
    const classes = mergeClasses(source, dest)
    expect(classes).toEqual(
      expect.arrayContaining(['flex', 'items-center', 'h-10', 'mx-1', 'border-blue-500'])
    )
  })
  it('pseudo-class merge', () => {
    const source = 'flex relative text-gray-100 bg-blue-100 text-2xl text-black hover:text-white focus:bg-blue-500'
    const dest = 'hover:text-gray-900 focus:bg-blue-900'
    const classes = mergeClasses(source, dest)
    expect(classes).toEqual(
      'flex relative text-gray-100 bg-blue-100 text-2xl text-black hover:text-gray-900 focus:bg-blue-900'
    )
  })
})
