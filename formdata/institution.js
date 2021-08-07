import isEmpty from 'validator/lib/isEmpty'

export const formInstitution = {
  id: { value: "", isValid: true, message: null },
  name: { value: "", isValid: true, message: null },
  checking_type: { value: [], isValid: true, message: null },
}

export const formInstitutionIsValid = (state, setState) => {
  const name = { ...state.name }
  const checking_type = { ...state.checking_type }
  let isGood = true

  if(isEmpty(name?.value)) {
    isGood = false
    name.isValid = false
    name.message = "Value can't be empty"
  }

  if(checking_type?.value?.length < 1) {
    isGood = false
    checking_type.isValid = false
    checking_type.message = "Value can't be empty"
  }

  if(!isGood) setState({ ...state, name, checking_type })

  return isGood
}

export const formImageAntigenGenoseIsValid = (state, setState, state2) => {
  const file = { ...state.file }
  const file2 = { ...state2.file }
  let isGood = true

  if(file?.value?.length < 1 && file2?.value?.length < 1) {
    isGood = false
    file.isValid = false
    file.message = "Upps, at least upload one of antigen or genose."
  }

  if(!isGood) setState({ ...state, file })

  return isGood
}
