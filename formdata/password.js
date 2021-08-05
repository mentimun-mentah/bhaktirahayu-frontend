import isLength from 'validator/lib/isLength'

export const formConfigPassword = {
  old_password: { value: "", isValid: true, message: null },
  password: { value: "", isValid: true, message: null },
  confirm_password: { value: "", isValid: true, message: null },
}

export const formVerifyPassword = {
  password: { value: "", isValid: true, message: "" },
}

export const formConfigPasswordIsValid = (state, setState) => {
  const old_password = { ...state.old_password }
  const password = { ...state.password }
  const confirm_password = { ...state.confirm_password }
  let isGood = true

  if(!isLength(old_password.value, { min: 6, max: 100 })){
    isGood = false;
    old_password.isValid = false;
    old_password.message = "Ensure this value has 6 - 100 characters";
  }

  if(!isLength(password.value, { min: 6, max: 100 })){
    isGood = false;
    password.isValid = false;
    password.message = "Ensure this value has 6 - 100 characters";
  }

  if(!isLength(confirm_password.value, { min: 6, max: 100 })){
    isGood = false;
    confirm_password.isValid = false;
    confirm_password.message = "Ensure this value has 6 - 100 characters";
  }

  if(!isGood) setState({ ...state, old_password, password, confirm_password })

  return isGood
}

export const formVerifyPasswordIsValid = (state, setState) => {
  const password = { ...state.password }
  let isGood = true

  if(!isLength(password.value, { min: 6, max: 100 })){
    isGood = false;
    password.isValid = false;
    password.message = "Ensure this value has 6 - 100 characters";
  }

  if(!isGood) setState({ ...state, password })

  return isGood
}
