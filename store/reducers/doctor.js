import { updateObject } from 'lib/utility'
import * as actionType from 'store/actions/actionTypes'

const initialState = {
  doctor: [],
  loading: false,
  error: null
}

const getDoctorStart  = (state, _) => {
  return updateObject(state, {
    loading: true,
    error: null
  })
}

const getDoctorSuccess  = (state, action) => {
  return updateObject(state, {
    loading: false,
    doctor: action.payload
  })
}

const getDoctorFail  = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.GET_DOCTOR_START:
      return getDoctorStart(state, action)
    case actionType.GET_DOCTOR_SUCCESS:
      return getDoctorSuccess(state, action)
    case actionType.GET_DOCTOR_FAIL:
      return getDoctorFail(state, action)

    default:
      return state
  }
}

export default reducer
