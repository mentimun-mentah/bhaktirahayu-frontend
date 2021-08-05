import { updateObject } from 'lib/utility'
import * as actionType from 'store/actions/actionTypes'

const initialState = {
  locationService: [],
  loading: false,
  error: null
}

const getLocationServiceStart  = (state, _) => {
  return updateObject(state, {
    loading: true,
    error: null
  })
}

const getLocationServiceSuccess  = (state, action) => {
  return updateObject(state, {
    loading: false,
    locationService: action.payload
  })
}

const getLocationServiceFail  = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.GET_LOCATION_SERVICE_START:
      return getLocationServiceStart(state, action)
    case actionType.GET_LOCATION_SERVICE_SUCCESS:
      return getLocationServiceSuccess(state, action)
    case actionType.GET_LOCATION_SERVICE_FAIL:
      return getLocationServiceFail(state, action)

    default:
      return state
  }
}

export default reducer
