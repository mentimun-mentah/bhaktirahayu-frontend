import { jsonHeaderHandler, signature_exp } from 'lib/axios'

import _ from 'lodash'
import axios from 'lib/axios'
import * as actionType from './actionTypes'

/* GET INSTITUTION ACTIONS */
export const getInstitutionStart = () => {
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


export const getInstitution = ({ page = 1, per_page = 20, q, checking_type }) => {
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


export const getMultipleInstitutions = ({ list_id = [], state }) => {
  const data = { list_id: list_id }

  return dispatch => {
    dispatch(getInstitutionStart())

    axios.post('/institutions/get-multiple-institutions', data, jsonHeaderHandler())
      .then(res => {
        const data = { ...state, data: res.data }
        dispatch(getInstitutionSuccess(data))
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp) {
          axios.post('/institutions/get-multiple-institutions', data, jsonHeaderHandler())
            .then(res => {
              const data = { ...state, data: res.data }
              dispatch(getInstitutionSuccess(data))
            })
            .catch(err => {
              dispatch(getInstitutionFail(err.response))
            })
        }
        else {
          dispatch(getInstitutionFail(err.response))
        }
      })
  }
}
