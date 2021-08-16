import moment from 'moment'
import { DATE_FORMAT } from 'lib/disabledDate'

export const formFilter = {
  gender: [],
  checking_type: [],
  check_result: [],
  doctor_id: [],
  guardian_id: [],
  location_service_id: [],
  institution_id: [],
  register_start_date: moment().format(DATE_FORMAT),
  register_end_date: moment().format(DATE_FORMAT),
  check_start_date: "",
  check_end_date: ""
}
