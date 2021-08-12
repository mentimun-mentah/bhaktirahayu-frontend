import isEmpty from 'validator/lib/isEmpty'
import isLength from 'validator/lib/isLength'

export const formRegister = {
  nik: { value: "", isValid: true, message: null },
  name: { value: "", isValid: true, message: null },
  birth_place: { value: "", isValid: true, message: null },
  birth_date: { value: "", isValid: true, message: null },
  gender: { value: [], isValid: true, message: null },
  address: { value: "", isValid: true, message: null },
  phone: { value: "", isValid: true, message: null },
  checking_type: { value: [], isValid: true, message: null },
  institution_id: { value: [], isValid: true, message: null },
}

export const formRegisterIsValid = (state, setState) => {
  const nik = { ...state.nik }
  const name = { ...state.name }
  const birth_place = { ...state.birth_place }
  const birth_date = { ...state.birth_date }
  const gender = { ...state.gender }
  const address = { ...state.address }
  const phone = { ...state.phone }
  const checking_type = { ...state.checking_type }
  const institution_id = { ...state.institution_id }

  let isGood = true

  if(!isLength(nik?.value || "", { min: 16, max: 16 })){
    isGood = false;
    nik.isValid = false;
    nik.message = "Value must only have 16 characters";
  }

  if(isEmpty(name?.value || "")){
    isGood = false;
    name.isValid = false;
    name.message = "Value can't be empty";
  }

  if(isEmpty(birth_place?.value || "")){
    isGood = false;
    birth_place.isValid = false;
    birth_place.message = "Value can't be empty";
  }

  if(isEmpty(birth_date?.value || "")){
    isGood = false;
    birth_date.isValid = false;
    birth_date.message = "Value can't be empty";
  }

  if(gender?.value?.length < 1) {
    isGood = false
    gender.isValid = false
    gender.message = "Value can't be empty"
  }

  if(isEmpty(address?.value || "")){
    isGood = false;
    address.isValid = false;
    address.message = "Value can't be empty";
  }

  if(checking_type?.value?.length < 1) {
    isGood = false;
    checking_type.isValid = false;
    checking_type.message = "Value can't be empty";
  }

  if(isEmpty(phone?.value || "")){
    isGood = false;
    phone.isValid = false;
    phone.message = "Value can't be empty";
  }

  if(institution_id?.value?.length < 1) {
    isGood = false;
    institution_id.isValid = false;
    institution_id.message = "Value can't be empty";
  }

  if(!isGood) setState({ ...state, nik, name, birth_place, birth_date, gender, address, phone, checking_type, institution_id })

  return isGood
}
