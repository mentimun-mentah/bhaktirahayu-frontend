import { jsonHeaderHandler, signature_exp } from 'lib/axios'

import axios from 'lib/axios'
import * as actionType from './actionTypes'

/* GET DOCTOR ACTIONS */
export const getDoctorStart = () => {
  return {
    type: actionType.GET_DOCTOR_START,
  }
}
export const getDoctorSuccess = (payload) => {
  return {
    type: actionType.GET_DOCTOR_SUCCESS,
    payload: payload,
  }
}
const getDoctorFail = (error) => {
  return {
    type: actionType.GET_DOCTOR_FAIL,
    error: error,
  }
}


export const getDoctor = ({ page = 1, per_page = 10, q }) => {
  let query = {}
  if(page) query["page"] = page
  if(per_page) query["per_page"] = per_page

  if(q !== "" && q !== undefined) query["q"] = q
  else delete query["q"]

  return dispatch => {
    dispatch(getDoctorStart())

    axios.get("/users/all-doctors", { params: query })
      .then(res => {
        dispatch(getDoctorSuccess(res.data))
      })
      .catch(err => {
        dispatch(getDoctorFail(err.response))
      })
  }
}

export const getMultipleDoctors = ({ list_id = [], state }) => {
  const data = { list_id: list_id }

  return dispatch => {
    dispatch(getDoctorStart())

    axios.post('/users/get-multiple-doctors', data, jsonHeaderHandler())
      .then(res => {
        const data = { ...state, data: res.data }
        dispatch(getDoctorSuccess(data))
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp) {
          axios.post('/users/get-multiple-doctors', data, jsonHeaderHandler())
            .then(res => {
              const data = { ...state, data: res.data }
              dispatch(getDoctorSuccess(data))
            })
            .catch(err => {
              dispatch(getDoctorFail(err.response))
            })
        }
        else {
          dispatch(getDoctorFail(err.response))
        }
      })
  }
}
