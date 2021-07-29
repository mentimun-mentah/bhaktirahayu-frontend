import isEmpty from 'validator/lib/isEmpty'

export const formLocation = {
  location: { value: "", isValid: true, message: null },
}

export const formLocationIsValid = (state, setState) => {
  const location = { ...state.location }
  let isGood = true

  if(isEmpty(location?.value)) {
    isGood = false
    location.isValid = false
    location.message = "Value can't be empty"
  }

  if(!isGood) setState({ ...state, location })

  return isGood
}
