import { updateObject } from 'lib/utility'
import * as actionType from 'store/actions/actionTypes'

const initialState = {
  institution: [],
  loading: false,
  error: null
}

const getInstitutionStart = (state, _) => {
  return updateObject(state, {
    loading: true,
    error: null
  })
}

const getInstitutionSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    institution: action.payload
  })
}

const getInstitutionFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.GET_INSTITUTION_START:
      return getInstitutionStart(state, action)
    case actionType.GET_INSTITUTION_SUCCESS:
      return getInstitutionSuccess(state, action)
    case actionType.GET_INSTITUTION_FAIL:
      return getInstitutionFail(state, action)

    default:
      return state
  }
}

export default reducer
