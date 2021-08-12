import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

export const formLogin = {
  email: { value: "", isValid: true, message: null },
  password: { value: "", isValid: true, message: null },
  institution_id: { value: [], isValid: true, message: null },
  location_service_id: { value: [], isValid: true, message: null },
}

export const formLoginIsValid = (state, setState) => {
  const email = { ...state.email }
  const password = { ...state.password }
  // const institution_id = { ...state.institution_id }
  let isGood = true

  if(!isEmail(email.value || "")){
    isGood = false;
    email.isValid = false;
    email.message = "Value is not a valid email address";
  }

  if(!isLength(password.value || "", { min: 6, max: 100 })){
    isGood = false;
    password.isValid = false;
    password.message = "Ensure this value has 6 - 100 characters";
  }

  // if(institution_id.value === undefined || institution_id && institution_id?.value?.length < 1) {
  //   isGood = false
  //   institution_id.value = institution_id.value || []
  //   institution_id.isValid = false
  //   institution_id.message = "Value can't be empty"
  // }

  if(!isGood) setState({ ...state, email, password })

  return isGood
}
