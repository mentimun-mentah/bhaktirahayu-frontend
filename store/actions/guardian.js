import axios from 'lib/axios'
import * as actionType from './actionTypes'

/* GET GUARDIAN ACTIONS */
const getGuardianStart = () => {
  return {
    type: actionType.GET_GUARDIAN_START,
  }
}
export const getGuardianSuccess = (payload) => {
  return {
    type: actionType.GET_GUARDIAN_SUCCESS,
    payload: payload,
  }
}
const getGuardianFail = (error) => {
  return {
    type: actionType.GET_GUARDIAN_FAIL,
    error: error,
  }
}


export const getGuardian = ({ page = 1, per_page = 10, q }) => {
  let query = {}
  if(page) query["page"] = page
  if(per_page) query["per_page"] = per_page

  if(q !== "" && q !== undefined) query["q"] = q
  else delete query["q"]

  return dispatch => {
    dispatch(getGuardianStart())

    axios.get("/guardians/all-guardians", { params: query })
      .then(res => {
        dispatch(getGuardianSuccess(res.data))
      })
      .catch(err => {
        dispatch(getGuardianFail(err.response))
      })
  }
}
