import { combineReducers } from 'redux'
import authReducer from './auth'
import doctorReducer from './doctor'
import guardianReducer from './guardian'
import locationServiceReducer from './locationService'

const reducers = {
  auth: authReducer,
  doctor: doctorReducer,
  guardian: guardianReducer,
  locationService: locationServiceReducer
}

export default combineReducers(reducers)
