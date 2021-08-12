import moment from 'moment'

export const DATE_FORMAT = 'DD-MM-YYYY'

export const disabledTomorrow = (current) => {
  return current && current > moment().endOf('day')
}
