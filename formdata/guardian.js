import isEmpty from 'validator/lib/isEmpty'

export const formGuardian = {
  username: { value: "", isValid: true, message: null },
}

export const formGuardianIsValid = (state, setState) => {
  const username = { ...state.username }
  let isGood = true

  if(isEmpty(username?.value)) {
    isGood = false
    username.isValid = false
    username.message = "Value can't be empty"
  }

  if(!isGood) setState({ ...state, username })

  return isGood
}
