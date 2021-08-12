import isEmpty from 'validator/lib/isEmpty'
import isEmail from 'validator/lib/isEmail'

export const formDoctor = {
  id: { value: "", isValid: true, message: null },
  username: { value: "", isValid: true, message: null },
  email: { value: "", isValid: true, message: null },
}

export const formDoctorIsValid = (state, setState) => {
  const username = { ...state.username }
  const email = { ...state.email }

  let isGood = true

  if(isEmpty(username?.value || "")) {
    isGood = false
    username.isValid = false
    username.message = "Value can't be empty"
  }

  if(!isEmail(email.value || "")){
    isGood = false
    email.isValid = false
    email.message = "Value is not a valid email address"
  }

  if(!isGood) setState({ ...state, username, email })

  return isGood
}
