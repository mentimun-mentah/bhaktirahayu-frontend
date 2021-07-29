import isEmpty from 'validator/lib/isEmpty'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

export const formDoctor = {
  username: { value: "", isValid: true, message: null },
  email: { value: "", isValid: true, message: null },
  password: { value: "", isValid: true, message: null },
  old_password: { value: "", isValid: true, message: null },
  confirm_password: { value: "", isValid: true, message: null },
}

export const formDoctorIsValid = (state, setState, isUpdate) => {
  const username = { ...state.username }
  const email = { ...state.email }
  const password = { ...state.password }
  const old_password = { ...state.old_password }
  const confirm_password = { ...state.confirm_password }

  let isGood = true

  if(isEmpty(username?.value)) {
    isGood = false
    username.isValid = false
    username.message = "Pastikan value tidak kosong"
  }

  if(!isEmail(email.value)){
    isGood = false
    email.isValid = false
    email.message = "Value harus berupa alamat email"
  }

  if(!isLength(password.value, { min: 6, max: 100 })){
    isGood = false;
    password.isValid = false;
    password.message = "Pastikan value memiliki 6 - 100 karakter";
  }

  if(isUpdate && !isLength(old_password.value, { min: 6, max: 100 })){
    isGood = false;
    old_password.isValid = false;
    old_password.message = "Pastikan value memiliki 6 - 100 karakter";
  }

  if(!isLength(confirm_password.value, { min: 6, max: 100 })){
    isGood = false;
    confirm_password.isValid = false;
    confirm_password.message = "Pastikan value memiliki 6 - 100 karakter";
  }

  if(!isGood) setState({ ...state, username, email, password, old_password, confirm_password })

  return isGood
}
