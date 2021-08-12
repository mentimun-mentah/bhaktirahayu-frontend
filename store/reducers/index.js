import { combineReducers } from 'redux'
import authReducer from './auth'
import clientReducer from './client'
import doctorReducer from './doctor'
import guardianReducer from './guardian'
import dashboardReducer from './dashboard'
import institutionReducer from './institution'
import locationServiceReducer from './locationService'

const reducers = {
  auth: authReducer,
  doctor: doctorReducer,
  client: clientReducer,
  guardian: guardianReducer,
  dashboard: dashboardReducer,
  institution: institutionReducer,
  locationService: locationServiceReducer
}

export default combineReducers(reducers)
