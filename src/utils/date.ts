import { DateTime } from 'luxon'

export const formatDate = (dateString: string) => {
  const date = DateTime.fromISO(dateString)
  return date.toUTC().toLocaleString(DateTime.DATETIME_MED)
}
