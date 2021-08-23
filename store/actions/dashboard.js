import _ from 'lodash'
import axios from 'lib/axios'
import * as actionType from './actionTypes'

import { signature_exp } from 'lib/axios'

/* GET TOTAL DATA ACTIONS */
const getDashboardTotalDataStart = () => {
  return {
    type: actionType.GET_DASHBOARD_TOTAL_DATA_START,
  }
}
export const getDashboardTotalDataSuccess = (payload) => {
  return {
    type: actionType.GET_DASHBOARD_TOTAL_DATA_SUCCESS,
    payload: payload,
  }
}
const getDashboardTotalDataFail = (error) => {
  return {
    type: actionType.GET_DASHBOARD_TOTAL_DATA_FAIL,
    error: error,
  }
}

/* GET CHART DATA ACTIONS */
const getDashboardChartDataStart = () => {
  return {
    type: actionType.GET_DASHBOARD_CHART_DATA_START,
  }
}
export const getDashboardChartDataSuccess = (payload) => {
  return {
    type: actionType.GET_DASHBOARD_CHART_DATA_SUCCESS,
    payload: payload,
  }
}
const getDashboardChartDataFail = (error) => {
  return {
    type: actionType.GET_DASHBOARD_CHART_DATA_FAIL,
    error: error,
  }
}

export const getDashboardTotalData = () => {
  return dispatch => {
    dispatch(getDashboardTotalDataStart())

    axios.get('/dashboards/total-data')
      .then(res => {
        dispatch(getDashboardTotalDataSuccess(res.data))
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp){
          axios.get('/dashboards/total-data')
            .then(res => {
              dispatch(getDashboardTotalDataSuccess(res.data))
            })
            .catch(() => {})
        }
        else {
          dispatch(getDashboardTotalDataFail(err.response))
        }
      })
  }
}

const reformatDashboard = (list, prop1, prop2, title1, title2) => {
  let copyList = _.cloneDeep(list)
  const data1 = copyList.map(x => x[prop1])
  const data2 = copyList.map(x => x[prop2])

  const date = copyList.map(x => x.date)

  const data = [
    { name: title1, data: data1 },
    { name: title2, data: data2 }
  ]

  return {
    date: date,
    series: data,
  }
}

export const getDashboardChart = ({ period = "week", ...rest }) => {
  let query = {}
  if(period) query["period"] = period

  query = { ...query, ...rest }

  return dispatch => {
    dispatch(getDashboardChartDataStart())

    axios.get('/dashboards/chart-data', { params: query })
      .then(res => {
        const data = {
          done_waiting: reformatDashboard(res.data.done_waiting, 'waiting', 'done', 'Terdaftar', 'Selesai'),
          antigen_p_n: reformatDashboard(res.data.antigen_p_n, 'positive', 'negative', 'Positive', 'Negative'),
          genose_p_n: reformatDashboard(res.data.genose_p_n, 'positive', 'negative', 'Positive', 'Negative'),
          pcr_p_n: reformatDashboard(res.data.pcr_p_n, 'positive', 'negative', 'Positive', 'Negative'),
        }
        dispatch(getDashboardChartDataSuccess(data))
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp){
          axios.get('/dashboards/chart-data', { params: query })
            .then(res => {
              const data = {
                done_waiting: reformatDashboard(res.data.done_waiting, 'waiting', 'done', 'Terdaftar', 'Selesai'),
                antigen_p_n: reformatDashboard(res.data.antigen_p_n, 'positive', 'negative', 'Positive', 'Negative'),
                genose_p_n: reformatDashboard(res.data.genose_p_n, 'positive', 'negative', 'Positive', 'Negative'),
                pcr_p_n: reformatDashboard(res.data.pcr_p_n, 'positive', 'negative', 'Positive', 'Negative'),
              }
              dispatch(getDashboardChartDataSuccess(data))
            })
            .catch(() => {})
        }
        else {
          dispatch(getDashboardChartDataFail(err.response))
        }
      })
  }
}
