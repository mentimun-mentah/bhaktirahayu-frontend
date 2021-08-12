import axios from 'lib/axios'
import * as actionType from './actionTypes'

/* GET INSTITUTION ACTIONS */
const getInstitutionStart = () => {
  return {
    type: actionType.GET_INSTITUTION_START,
  }
}
export const getInstitutionSuccess = (payload) => {
  return {
    type: actionType.GET_INSTITUTION_SUCCESS,
    payload: payload,
  }
}
const getInstitutionFail = (error) => {
  return {
    type: actionType.GET_INSTITUTION_FAIL,
    error: error,
  }
}


export const getInstitution = ({ page = 1, per_page = 10, q, checking_type }) => {
  let query = {}
  if(page) query["page"] = page
  if(per_page) query["per_page"] = per_page

  if(q !== "" && q !== undefined) query["q"] = q
  else delete query["q"]

  if(checking_type !== "" && checking_type !== undefined) query["checking_type"] = checking_type
  else delete query["checking_type"]

  return dispatch => {
    dispatch(getInstitutionStart())

    axios.get("/institutions/all-institutions", { params: query })
      .then(res => {
        dispatch(getInstitutionSuccess(res.data))
      })
      .catch(err => {
        dispatch(getInstitutionFail(err.response))
      })
  }
}
