import * as dateFns from 'date-fns'

export function dateTimeFormat(date) {
  return dateFns.format(date, 'yyyy/MM/dd HH:mm:ss')
}

export function dateFormat(date) {
  return dateFns.format(date, 'yyyy/MM/dd')
}
