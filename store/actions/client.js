import axios from 'lib/axios'
import * as actionType from './actionTypes'

import { signature_exp } from 'lib/axios'


/* GET CLIENT ACTIONS */
const getClientStart = () => {
  return {
    type: actionType.GET_CLIENT_START,
  }
}
export const getClientSuccess = (payload) => {
  return {
    type: actionType.GET_CLIENT_SUCCESS,
    payload: payload,
  }
}
const getClientFail = (error) => {
  return {
    type: actionType.GET_CLIENT_FAIL,
    error: error,
  }
}


export const getClient = ({ page = 1, per_page = 20, ...rest }) => {
  let query = {}
  if(page) query["page"] = page
  if(per_page) query["per_page"] = per_page

  query = { ...query, ...rest }

  return dispatch => {
    dispatch(getClientStart())

    axios.get("/clients/all-clients", { params: query })
      .then(res => {
        dispatch(getClientSuccess(res.data))
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp){
          axios.get("/clients/all-clients", { params: query })
            .then(res => {
              dispatch(getClientSuccess(res.data))
            })
            .catch(() => {})
        }
        else {
          dispatch(getClientFail(err.response))
        }
      })
  }
}
