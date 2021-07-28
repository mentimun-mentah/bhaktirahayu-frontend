import isEmpty from 'validator/lib/isEmpty'
import isLength from 'validator/lib/isLength'

export const formRegister = {
  no_card: { value: "", isValid: true, message: null },
  nik: { value: "", isValid: true, message: null },
  name: { value: "", isValid: true, message: null },
  birth_place: { value: "", isValid: true, message: null },
  birth_date: { value: "", isValid: true, message: null },
  gender: { value: "", isValid: true, message: null },
  address: { value: "", isValid: true, message: null },
  checking_type: { value: "", isValid: true, message: null },
  instantion: { value: "", isValid: true, message: null },
}

export const formRegisterIsValid = (state, setState) => {
  const nik = { ...state.nik }
  const name = { ...state.name }
  const birth_place = { ...state.birth_place }
  const birth_date = { ...state.birth_date }
  const gender = { ...state.gender }
  const address = { ...state.address }

  let isGood = true

  if(isEmpty(nik.value ? nik.value : "")){
    isGood = false;
    nik.isValid = false;
    nik.message = "Data tidak boleh kosong";
  }

  if(isEmpty(name.value ? name.value : "")){
    isGood = false;
    name.isValid = false;
    name.message = "Data tidak boleh kosong";
  }

  if(isEmpty(address.value ? address.value : "")){
    isGood = false;
    address.isValid = false;
    address.message = "Data tidak boleh kosong";
  }

  if(!isGood) setState({ ...state, nik, name, address })

  return isGood
}
