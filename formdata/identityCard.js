import isIn from 'validator/lib/isIn'

export const formIdentityCard = {
  kind: { value: "ktp", isValid: true, message: null }
}

export const formIdentityCardIsValid = (state, setState) => {
  const kind = { ...state.kind }
  let isGood = true

  if(!isIn(kind.value || "", ['ktp', 'kis'])) {
    isGood = false
    kind.isValid = false
    kind.message = "Invalid card type"
  }

  if(!isGood) setState({ ...state, kind })

  return isGood
}
