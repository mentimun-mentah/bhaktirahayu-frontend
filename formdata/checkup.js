import isEmpty from 'validator/lib/isEmpty'

export const formCheckup = {
  id: { value: "", isValid: true, message: null },
  check_date: { value: "", isValid: true, message: null },
  check_result: { value: [], isValid: true, message: null },
  doctor_id: { value: [], isValid: true, message: null },
  guardian_id: { value: [], isValid: true, message: null },
  location_service_id: { value: [], isValid: true, message: null },
  institution_id: { value: [], isValid: true, message: null },
  checking_type: { value: "", isValid: true, message: null }
}

export const formCheckupIsValid = (state, setState) => {
  const check_date = { ...state.check_date }
  const check_result = { ...state.check_result }
  const doctor_id = { ...state.doctor_id }
  const institution_id = { ...state.institution_id }

  let isGood = true

  if(check_date && check_date?.value && isEmpty(check_date?.value || "")){
    isGood = false;
    check_date.isValid = false;
    check_date.message = "Value can't be empty";
  }

  if(check_result?.value?.length < 1) {
    isGood = false
    check_result.isValid = false
    check_result.message = "Value can't be empty"
  }

  if(doctor_id?.value?.length < 1) {
    isGood = false
    doctor_id.isValid = false
    doctor_id.message = "Value can't be empty"
  }

  if(institution_id?.value?.length < 1) {
    isGood = false
    institution_id.isValid = false
    institution_id.message = "Value can't be empty"
  }

  if(!isGood) setState({ ...state, check_date, check_result, doctor_id, institution_id })

  return isGood
}
