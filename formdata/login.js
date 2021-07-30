import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

export const formLogin = {
  email: { value: "", isValid: true, message: "" },
  password: { value: "", isValid: true, message: "" },
}

export const formLoginIsValid = (state, setState) => {
  const email = { ...state.email }
  const password = { ...state.password }
  let isGood = true

  if(!isEmail(email.value)){
    isGood = false;
    email.isValid = false;
    email.message = "Value is not a valid email address";
  }

  if(!isLength(password.value, { min: 6, max: 100 })){
    isGood = false;
    password.isValid = false;
    password.message = "Ensure this value has 6 - 100 characters";
  }

  if(!isGood) setState({ ...state, email, password })

  return isGood
}
