import { jsonHeaderHandler, signature_exp } from 'lib/axios'

import axios from 'lib/axios'
import * as actionType from './actionTypes'

/* GET LOCATION SERVICE ACTIONS */
export const getLocationServiceStart = () => {
  return {
    type: actionType.GET_LOCATION_SERVICE_START,
  }
}
export const getLocationServiceSuccess = (payload) => {
  return {
    type: actionType.GET_LOCATION_SERVICE_SUCCESS,
    payload: payload,
  }
}
const getLocationServiceFail = (error) => {
  return {
    type: actionType.GET_LOCATION_SERVICE_FAIL,
    error: error,
  }
}


export const getLocationService = ({ page = 1, per_page = 20, q }) => {
  let query = {}
  if(page) query["page"] = page
  if(per_page) query["per_page"] = per_page

  if(q !== "" && q !== undefined) query["q"] = q
  else delete query["q"]

  return dispatch => {
    dispatch(getLocationServiceStart())

    axios.get("/location-services/all-location-services", { params: query })
      .then(res => {
        dispatch(getLocationServiceSuccess(res.data))
      })
      .catch(err => {
        dispatch(getLocationServiceFail(err.response))
      })
  }
}


export const getMultipleLocationsServices = ({ list_id = [], state }) => {
  const data = { list_id: list_id }

  return dispatch => {
    dispatch(getLocationServiceStart())

    axios.post('/location-services/get-multiple-location-services', data, jsonHeaderHandler())
      .then(res => {
        const data = { ...state, data: res.data }
        dispatch(getLocationServiceSuccess(data))
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp) {
          axios.post('/location-services/get-multiple-location-services', data, jsonHeaderHandler())
            .then(res => {
              const data = { ...state, data: res.data }
              dispatch(getLocationServiceSuccess(data))
            })
            .catch(err => {
              dispatch(getLocationServiceFail(err.response))
            })
        }
        else {
          dispatch(getLocationServiceFail(err.response))
        }
      })
  }
}
