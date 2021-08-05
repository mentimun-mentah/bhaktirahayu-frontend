import axios from 'lib/axios'
import * as actionType from './actionTypes'

/* GET LOCATION SERVICE ACTIONS */
const getLocationServiceStart = () => {
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


export const getLocationService = ({ page = 1, per_page = 10, q }) => {
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
