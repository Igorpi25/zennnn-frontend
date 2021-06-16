import parseISO from 'date-fns/parseISO'
import fromUnixTime from 'date-fns/fromUnixTime'
import formatISO from 'date-fns/formatISO'

export function parseDate(date: Date | string | number | undefined | null) {
  if (!date) return ''
  const isUnixTime = !Number.isNaN(Number(date))
  return isUnixTime
    ? fromUnixTime((date as number) / 1000)
    : parseISO(date as string)
}

export function toISOString(date: Date | number | undefined | null) {
  if (!date) return ''
  return formatISO(date)
}
