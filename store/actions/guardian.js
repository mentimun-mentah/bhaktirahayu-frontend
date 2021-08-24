import { jsonHeaderHandler, signature_exp } from 'lib/axios'

import axios from 'lib/axios'
import * as actionType from './actionTypes'

/* GET GUARDIAN ACTIONS */
export const getGuardianStart = () => {
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


export const getGuardian = ({ page = 1, per_page = 20, q }) => {
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


export const getMultipleGuardians = ({ list_id = [], state }) => {
  const data = { list_id: list_id }

  return dispatch => {
    dispatch(getGuardianStart())

    axios.post('/guardians/get-multiple-guardians', data, jsonHeaderHandler())
      .then(res => {
        const data = { ...state, data: res.data }
        dispatch(getGuardianSuccess(data))
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp) {
          axios.post('/guardians/get-multiple-guardians', data, jsonHeaderHandler())
            .then(res => {
              const data = { ...state, data: res.data }
              dispatch(getGuardianSuccess(data))
            })
            .catch(err => {
              dispatch(getGuardianFail(err.response))
            })
        }
        else {
          dispatch(getGuardianFail(err.response))
        }
      })
  }
}
