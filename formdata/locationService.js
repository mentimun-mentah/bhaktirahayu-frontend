import isEmpty from 'validator/lib/isEmpty'

export const formLocation = {
  id: { value: "", isValid: true, message: null },
  name: { value: "", isValid: true, message: null },
}

export const formLocationIsValid = (state, setState) => {
  const name = { ...state.name }
  let isGood = true

  if(isEmpty(name?.value || "")) {
    isGood = false
    name.isValid = false
    name.message = "Value can't be empty"
  }

  if(!isGood) setState({ ...state, name })

  return isGood
}
