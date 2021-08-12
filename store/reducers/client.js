import { updateObject } from 'lib/utility'
import * as actionType from 'store/actions/actionTypes'

const initialState = {
  client: [],
  loading: false,
  error: null
}

const getClientStart = (state, _) => {
  return updateObject(state, {
    loading: true,
    error: null
  })
}

const getClientSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    client: action.payload
  })
}

const getClientFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.GET_CLIENT_START:
      return getClientStart(state, action)
    case actionType.GET_CLIENT_SUCCESS:
      return getClientSuccess(state, action)
    case actionType.GET_CLIENT_FAIL:
      return getClientFail(state, action)

    default:
      return state
  }
}

export default reducer
