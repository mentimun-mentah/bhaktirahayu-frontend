import { updateObject } from 'lib/utility'
import * as actionType from 'store/actions/actionTypes'

const initialState = {
  totalData: {},
  chartData: {
    done_waiting: { date: [], series: [] },
    antigen_p_n: { date: [], series: [] },
    genose_p_n: { date: [], series: [] }
  },
  loading: false,
  error: null
}

/* TOTAL DASHBOARD */
const getDashboardTotalDataStart = (state, _) => {
  return updateObject(state, {
    loading: true,
    error: null
  })
}

const getDashboardTotalDataSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    totalData: action.payload
  })
}

const getDashboardTotalDataFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error
  })
}
/* TOTAL DASHBOARD */

/* CHART DASHBOARD */
const getDashboardChartDataStart = (state, _) => {
  return updateObject(state, {
    loading: true,
    error: null
  })
}

const getDashboardChartDataSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    chartData: action.payload
  })
}

const getDashboardChartDataFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error
  })
}
/* CHART DASHBOARD */

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.GET_DASHBOARD_TOTAL_DATA_START:
      return getDashboardTotalDataStart(state, action)
    case actionType.GET_DASHBOARD_TOTAL_DATA_SUCCESS:
      return getDashboardTotalDataSuccess(state, action)
    case actionType.GET_DASHBOARD_TOTAL_DATA_FAIL:
      return getDashboardTotalDataFail(state, action)

    case actionType.GET_DASHBOARD_CHART_DATA_START:
      return getDashboardChartDataStart(state, action)
    case actionType.GET_DASHBOARD_CHART_DATA_SUCCESS:
      return getDashboardChartDataSuccess(state, action)
    case actionType.GET_DASHBOARD_CHART_DATA_FAIL:
      return getDashboardChartDataFail(state, action)

    default:
      return state
  }
}

export default reducer
