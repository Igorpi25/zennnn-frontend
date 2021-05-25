export const defaultFilter = (value, search) => {
  return (
    value != null &&
    search != null &&
    typeof value !== 'boolean' &&
    value.toString().toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !==
      -1
  )
}

export default defaultFilter
