import isEmpty from 'validator/lib/isEmpty'

export const formGuardian = {
  id: { value: "", isValid: true, message: null },
  name: { value: "", isValid: true, message: null },
}

export const formGuardianIsValid = (state, setState) => {
  const name = { ...state.name }
  let isGood = true

  if(isEmpty(name?.value)) {
    isGood = false
    name.isValid = false
    name.message = "Value can't be empty"
  }

  if(!isGood) setState({ ...state, name })

  return isGood
}
