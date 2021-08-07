import { combineReducers } from 'redux'
import authReducer from './auth'
import doctorReducer from './doctor'
import guardianReducer from './guardian'
import institutionReducer from './institution'
import locationServiceReducer from './locationService'

const reducers = {
  auth: authReducer,
  doctor: doctorReducer,
  guardian: guardianReducer,
  institution: institutionReducer,
  locationService: locationServiceReducer
}

export default combineReducers(reducers)
