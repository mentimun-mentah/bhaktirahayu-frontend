import { updateObject } from 'lib/utility'
import * as actionType from 'store/actions/actionTypes'

const initialState = {
  guardian: [],
  loading: false,
  error: null
}

const getGuardianStart = (state, _) => {
  return updateObject(state, {
    loading: true,
    error: null
  })
}

const getGuardianSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    guardian: action.payload
  })
}

const getGuardianFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.GET_GUARDIAN_START:
      return getGuardianStart(state, action)
    case actionType.GET_GUARDIAN_SUCCESS:
      return getGuardianSuccess(state, action)
    case actionType.GET_GUARDIAN_FAIL:
      return getGuardianFail(state, action)

    default:
      return state
  }
}

export default reducer
