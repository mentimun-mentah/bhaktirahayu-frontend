import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { useRouter } from 'next/router'
import { Row, Col, Select, Progress, Grid } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useCallback, useMemo } from 'react'

import _ from 'lodash'
import moment from 'moment'
import nookies from 'nookies'
import dynamic from 'next/dynamic'
import isIn from 'validator/lib/isIn'
import WebsocketHeartbeatJs from 'websocket-heartbeat-js'

import { uuidv4 } from 'lib/utility'
import { periodList } from 'data/all'
import { antigenGenoseOption } from 'lib/chartConfig'
import { jsonHeaderHandler, formErrorMessage, signature_exp } from 'lib/axios'

import axios from 'lib/axios'
import * as actions from 'store/actions'
import NotFoundSelect from 'components/NotFoundSelect'

const useBreakpoint = Grid.useBreakpoint;
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const stats_list = (data) => [
  {
    title: "Total Instansi",
    sub: data?.total_institutions,
    icon : "fas fa-hospitals",
    bg: "stats-1",
  },
  {
    title: "Total Dokter",
    sub: data?.total_doctors,
    icon : "fas fa-stethoscope",
    bg: "stats-1",
  },
  {
    title: "Total Penjamin",
    sub: data?.total_guardians,
    icon : "fas fa-users-crown",
    bg: "stats-1",
  },
  {
    title: "Total Lokasi Pelayanan",
    sub: data?.total_location_services,
    icon : "fas fa-location-circle",
    bg: "stats-1",
  },
]

const formAntigenGenose = [
  { name: 'Negatif', data: [0, 0, 0, 0, 0, 0, 0] }, 
  { name: 'Positif', data: [0, 0, 0, 0, 0, 0, 0] }
]

const formDoneWaiting = [
  { name: 'Terdaftar', data: [0, 0, 0, 0, 0, 0, 0] }, 
  { name: 'Selesai', data: [0, 0, 0, 0, 0, 0, 0] }
]

const selectProps = {
  allowClear: true,
  showSearch: true,
  className: "w-100",
  filterOption: (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
  getPopupContainer: triggerNode => triggerNode.parentElement
}

const per_page = 10
const user_hash = uuidv4()
const wsOptions = {
  url: `${process.env.NEXT_PUBLIC_WS_URL}/dashboards/ws-server-info?user_hash=${user_hash}`,
  pingTimeout: 2000, 
  pongTimeout: 2000, 
  reconnectTimeout: 2000,
  pingMsg: `send~${user_hash}`
}

let ws = {}

const Dashboard = ({ searchQuery }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const screens = useBreakpoint()

  const totalData = useSelector(state => state.dashboard.totalData)
  const chartData = useSelector(state => state.dashboard.chartData)

  const institutions = useSelector(state => state.institution.institution)
  const loadingInstitutions = useSelector(state => state.institution.loading)

  const locationServices = useSelector(state => state.locationService.locationService)
  const loadingLocationServices = useSelector(state => state.locationService.loading)

  const [period, setPeriod] = useState("week")
  const [institution, setInstitution] = useState([])
  const [serverUsage, setServerUsage] = useState({})
  const [locationService, setLocationService] = useState([])

  const [seriesPcr, setSeriesPcr] = useState(formAntigenGenose)
  const [seriesGenose, setSeriesGenose] = useState(formAntigenGenose)
  const [seriesAntigen, setSeriesAntigen] = useState(formAntigenGenose)
  const [seriesDoneWaiting, setSeriesDoneWaiting] = useState(formDoneWaiting)

  const [optionPcr, setOptionPcr] = useState(antigenGenoseOption)
  const [optionGenose, setOptionGenose] = useState(antigenGenoseOption)
  const [optionAntigen, setOptionAntigen] = useState(antigenGenoseOption)
  const [optionDoneWaiting, setOptionDoneWaiting] = useState({ ...antigenGenoseOption, colors: ['#fd9644', '#4b7bec']})

  useEffect(() => {
    dispatch(actions.getDashboardTotalData())
  }, [])

  useEffect(() => {
    if(!searchQuery) return

    for(let [key, value] of Object.entries(searchQuery)) {
      if(isIn(key, ['period'])) {
        setPeriod(value)
      }
      else if(isIn(key, ['institution_id'])) {
        getMultipleInstitutions(value.split(','))
        setInstitution(value)
      }
      else if(isIn(key, ['location_service_id'])) {
        setLocationService(value)
        getMultipleLocationService(value.split(','))
      }
    }
  }, [searchQuery])

  useEffect(() => {
    const query = { ...searchQuery }
    query['period'] = period
    if(institution?.length > 0) query['institution_id'] = institution
    else delete query['institution_id']

    if(locationService?.length > 0) query['location_service_id'] = locationService
    else delete query['location_service_id']

    const timer = setTimeout(() => {
      router.replace({
        pathname: "/dashboard",
        query: query
      })
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [period, institution, locationService])

  useEffect(() => {
    let copyOptionPcr = _.cloneDeep(optionPcr)
    let copyOptionGenose = _.cloneDeep(optionGenose)
    let copyOptionAntigen = _.cloneDeep(optionAntigen)
    let copyOptionDoneWaiting = _.cloneDeep(optionDoneWaiting)

    copyOptionPcr = {
      ...copyOptionPcr,
      xaxis: {
        ...copyOptionPcr['xaxis'],
        categories: chartData?.pcr_p_n?.date,
      }
    }

    copyOptionGenose = {
      ...copyOptionGenose,
      xaxis: {
        ...copyOptionGenose['xaxis'],
        categories: chartData?.genose_p_n?.date,
      }
    }

    copyOptionAntigen = {
      ...copyOptionAntigen,
      xaxis: {
        ...copyOptionAntigen['xaxis'],
        categories: chartData?.antigen_p_n?.date,
      }
    }

    copyOptionDoneWaiting = {
      ...copyOptionDoneWaiting,
      xaxis: {
        ...copyOptionDoneWaiting['xaxis'],
        categories: chartData?.done_waiting?.date,
      }
    }

    setOptionPcr(copyOptionPcr)
    setOptionGenose(copyOptionGenose)
    setOptionAntigen(copyOptionAntigen)
    setOptionDoneWaiting(copyOptionDoneWaiting)

    setSeriesPcr(chartData?.pcr_p_n?.series)
    setSeriesGenose(chartData?.genose_p_n?.series)
    setSeriesAntigen(chartData?.antigen_p_n?.series)
    setSeriesDoneWaiting(chartData?.done_waiting?.series)
  }, [chartData])

  const pieGender = {
    series: [+totalData?.total_male, +totalData?.total_female],
    options: {
      chart: { width: '100%', type: 'pie', },
      legend: { position: 'bottom' },
      labels: [
        `Laki-laki`, 
        `Perempuan`, 
        `Total ${+totalData?.total_male + +totalData?.total_female} pasien`
      ],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: '100%' },
          legend: { position: 'bottom' }
        }
      }]
    },
  };

  const onChangeInstitutionHandler = value => {
    setInstitution(value)
    nookies.set(null, 'institution_id_dashboard_delete', true, { maxAge: 30 * 24 * 60 * 60, path: '/' })
  }

  const onChangeLocationServiceHandler = value => {
    setLocationService(value)
    nookies.set(null, 'location_service_id_dashboard_delete', true, { maxAge: 30 * 24 * 60 * 60, path: '/' })
  }

  const onClearSelectHandler = (setState) => {
    setState([])
  }

  const fetchInstitution = useCallback(val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(val) queryString["q"] = val
    else delete queryString["q"]

    dispatch(actions.getInstitution({ ...queryString }))
  }, [])

  const onSearchInstitution = useMemo(() => {
    const loadOptions = val => {
      fetchInstitution(val)
    }
    return _.debounce(loadOptions, 500)
  }, [fetchInstitution])

  const onFocusInstitution = () => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page
    dispatch(actions.getInstitution({ ...queryString }))
  }


  const fetchLocationService = useCallback(val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(val) queryString["q"] = val
    else delete queryString["q"]
    dispatch(actions.getLocationService({ ...queryString }))
  }, [])

  const onSearchLocationService = useMemo(() => {
    const loadOptions = val => {
      fetchLocationService(val)
    }
    return _.debounce(loadOptions, 500)
  }, [fetchLocationService])

  const onFocusLocationService = () => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page
    dispatch(actions.getLocationService({ ...queryString }))
  }

  useEffect(() => {
    ws = new WebsocketHeartbeatJs(wsOptions)
    ws.onmessage = (e) => {
      setServerUsage(JSON.parse(e.data))
    }

    return () => {
      ws.close()
      ws.onclose = () => { console.log('ws closing connection') }
    }
  }, [])


  const getMultipleInstitutions = (list_id) => {
    const data = { list_id: list_id }
    axios.post('/institutions/get-multiple-institutions', data, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getInstitutionSuccess({ data: res.data }))
      })
      .catch(err => {
        const errDetail = err?.response?.data.detail
        if(errDetail === signature_exp){
          axios.post('/institutions/get-multiple-institutions', data, jsonHeaderHandler())
            .then(res => {
              dispatch(actions.getInstitutionSuccess({ data: res.data }))
            })
            .catch(() => {})
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })
  }

  const getMultipleLocationService = (list_id) => {
    const data = { list_id: list_id }
    axios.post('/location-services/get-multiple-location-services', data, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getLocationServiceSuccess({ data: res.data }))
      })
      .catch(err => {
        const errDetail = err?.response?.data.detail
        if(errDetail === signature_exp){
          axios.post('/location-services/get-multiple-location-services', data, jsonHeaderHandler())
            .then(res => {
              dispatch(actions.getLocationServiceSuccess({ data: res.data }))
            })
            .catch(() => {})
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })
  }


  const cpu_core_value = serverUsage?.cpu_info?.cpu_core?.value || 0
  const cpu_core_format = serverUsage?.cpu_info?.cpu_core?.format || "core"
  const cpu_usage_value = serverUsage?.cpu_info?.cpu_usage?.value || 0
  const cpu_usage_format = serverUsage?.cpu_info?.cpu_usage?.format
  const cpu_frequency_value = serverUsage?.cpu_info?.cpu_frequency?.value || 0
  const cpu_frequency_format = serverUsage?.cpu_info?.cpu_frequency?.format || "MHz"

  const ram_available_value = serverUsage?.ram_info?.ram_available?.value || 0
  const ram_usage_value = serverUsage?.ram_info?.ram_usage?.value || 0
  const ram_total_value = serverUsage?.ram_info?.ram_total?.value || 0
  const ram_total_format = serverUsage?.ram_info?.ram_total?.format || "MB"
  const ram_usage_value_percent = !isNaN(((ram_usage_value/ram_total_value)*100).toFixed(1)) ? ((ram_usage_value/ram_total_value)*100).toFixed(1) : 0
  const ram_available_value_percent = !isNaN(((ram_available_value/ram_total_value)*100).toFixed(1)) ? ((ram_available_value/ram_total_value)*100).toFixed(1) : 0

  const disk_usage_value = serverUsage?.disk_info?.disk_usage?.value || 0
  const disk_total_value = serverUsage?.disk_info?.disk_total?.value || 0
  const disk_total_format = serverUsage?.disk_info?.disk_total?.format || "GB"
  const disk_available_value = serverUsage?.disk_info?.disk_available?.value || 0
  const disk_usage_value_percent = !isNaN(((disk_usage_value/disk_total_value)*100).toFixed(1)) ? ((disk_usage_value/disk_total_value)*100).toFixed(1) : 0
  const disk_available_value_percent = !isNaN(((disk_available_value/disk_total_value)*100).toFixed(1)) ? ((disk_available_value/disk_total_value)*100).toFixed(1) : 0

  const vps_expired_date = serverUsage?.expired_info?.vps_expired?.date
  const vps_expired_remaining = serverUsage?.expired_info?.vps_expired?.remaining || 0

  const domain_expired_date = serverUsage?.expired_info?.domain_expired?.date
  const domain_expired_remaining = serverUsage?.expired_info?.domain_expired?.remaining || 0

  return (
    <>
      <div className="header-dashboard">
        <Row gutter={[20,20]} justify="space-between" align="middle">
          <Col xxl={6} xl={6} lg={24} md={24} sm={24} xs={24}>
            <h1 className="h1 fs-24-s bold mb-0">Dashboard</h1>
            <span className="header-date fs-14-s">
              {moment().format("dddd, DD MMMM YYYY")}
            </span>
          </Col>

          <Col xxl={18} xl={18} lg={24} md={24} sm={24} xs={24}>
            <Row gutter={[10,10]} align="middle">
              <Col span={3} sm={24} xs={24}>
                <b>Filter:</b>
              </Col>

              <Col span={7} sm={8} xs={24}>
                <Select
                  value={period}
                  className="w-100"
                  onChange={val => setPeriod(val)}
                  getPopupContainer={triggerNode => triggerNode.parentElement}
                >
                  {periodList.map(period => (
                    <Select.Option value={period.value} key={period.value}>
                      {period.label}
                    </Select.Option>
                  ))}
                </Select>
              </Col>

              <Col span={7} sm={8} xs={24}>
                <Select
                  {...selectProps}
                  value={institution}
                  placeholder="Pilih Instansi"
                  onFocus={onFocusInstitution}
                  onSearch={val => {
                    onSearchInstitution(val)
                    dispatch(actions.getInstitutionStart())
                  }}
                  onChange={onChangeInstitutionHandler}
                  onClear={() => onClearSelectHandler(setInstitution)}
                  clearIcon={<CloseCircleFilled onClick={() => onClearSelectHandler(setInstitution)} />}
                  notFoundContent={<NotFoundSelect loading={loadingInstitutions} />}
                >
                  {institutions?.data?.length > 0 && institutions?.data.map(institution => (
                    <Select.Option value={institution.institutions_id} key={institution.institutions_id}>
                      {institution.institutions_name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>

              <Col span={7} sm={8} xs={24}>
                <Select
                  {...selectProps}
                  value={locationService}
                  placeholder="Pilih Lokasi Pelayanan"
                  onFocus={onFocusLocationService}
                  onSearch={val => {
                    onSearchLocationService(val)
                    dispatch(actions.getLocationServiceStart())
                  }}
                  onChange={onChangeLocationServiceHandler}
                  onClear={() => onClearSelectHandler(setLocationService)}
                  clearIcon={<CloseCircleFilled onClick={() => onClearSelectHandler(setLocationService)} />}
                  notFoundContent={<NotFoundSelect loading={loadingLocationServices} />}
                >
                  {locationServices?.data?.length > 0 && locationServices?.data.map(loct => (
                    <Select.Option value={loct.location_services_id} key={loct.location_services_id}>
                      {loct.location_services_name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>

          </Col>
        </Row>
      </div>

      <Row gutter={[screens?.xs ? 0 : 20,screens?.xs ? 0 : 20]} className="m-b-20">
        {stats_list(totalData).map((data, i) => (
          <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24} key={i}>
            <Card className="border-0 shadow-1 dashboard-card">
              <Card.Body>
                <div className="media text-truncate">
                  <div className={`rounded-circle align-self-center icon-stats mr-3 ${data.bg}`}>
                    <i className={`${data.icon} fa-lg`} />
                  </div>
                  <div className="media-body align-self-center text-truncate" style={{ flex: 'none' }}>
                    <h6 className="mb-0 fs-18">{data.sub}</h6>
                    <p className="mb-0 fs-14 text-muted text-truncate">
                      {data.title}<small className="text-grey-0 text-truncate">{data.extra}</small>
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[screens?.xs ? 0 : 20,20]}>
        <Col span={24}>
          <Card className="border-0 shadow-1 dashboard-card">
            <Card.Body>
              <Row gutter={[10,10]} justify="space-between">
                <Col xl={12} lg={12}>
                  <Card.Title className="mb-3">Informasi Server</Card.Title>
                </Col>
              </Row>
              <Row gutter={[10,20]}>
                <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={24} className="text-center">
                  <Progress
                    width={150}
                    type="dashboard"
                    className="server-dashboard-text-success"
                    strokeColor={{ '0%': '#dc3545', '30%': '#f0932b', '50%': '#f0932b', '100%': '#00e395' }}
                    percent={cpu_usage_value}
                    format={percent => (
                      <>
                        <small className="mb-1"><i className="far fa-microchip"></i></small>
                        <p className="mb-0 mt-2">{percent}{cpu_usage_format}</p>
                      </>
                    )}
                  />
                  <div className="text-center text-muted mt-n2 fs-14">
                    <p className="mb-0 fw-500 text-dark">CPU</p>
                    {cpu_core_value} {cpu_core_format} {cpu_frequency_value} {cpu_frequency_format}
                  </div>
                </Col>

                <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={24} className="text-center">
                  <Progress
                    width={150}
                    type="dashboard"
                    className="server-dashboard-text-success"
                    strokeColor={{ '0%': '#dc3545', '30%': '#f0932b', '50%': '#f0932b', '100%': '#00e395' }}
                    percent={ram_usage_value_percent}
                    format={percent => (
                      <>
                        <small className="mb-1"><i className="far fa-memory"></i></small>
                        <p className="mb-0 mt-2">{percent}%</p>
                      </>
                    )}
                  />
                  <div className="text-center text-muted mt-n2 fs-14">
                    <p className="mb-0 fw-500 text-dark">RAM</p>
                    Free {ram_available_value_percent}% of {ram_total_value}{ram_total_format}
                  </div>
                </Col>

                <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={24} className="text-center">
                  <Progress
                    width={150}
                    type="dashboard"
                    className="server-dashboard-text-success"
                    strokeColor={{ '0%': '#dc3545', '30%': '#f0932b', '50%': '#f0932b', '100%': '#00e395' }}
                    percent={disk_usage_value_percent}
                    format={percent => (
                      <>
                        <small className="mb-1"><i className="far fa-hdd"></i></small>
                        <p className="mb-0 mt-2">{percent}%</p>
                      </>
                    )}
                  />
                  <div className="text-center text-muted mt-n2 fs-14">
                    <p className="mb-0 fw-500 text-dark">DISK</p>
                    Free {disk_available_value_percent}% of {disk_total_value}{disk_total_format}
                  </div>
                </Col>

                <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
                  <Row gutter={[10,20]} className="h-100">
                    <Col span={24}>
                      <Card className="shadow-sm border-0 p-2 h-100">
                        <p className="mb-2 fw-500 text-muted fs-14 border-bottom">VPS Expired</p>
                        <div className="text-center">
                          <p className="mb-0 fw-500 text-dark fs-18">{vps_expired_remaining} <small>day{vps_expired_remaining > 1 && 's'} left</small></p>
                          <p className="mb-0 text-dark fs-12">{vps_expired_date ? moment(vps_expired_date, 'DD-MM-YYYY').format('D MMMM YYYY') : ''}</p>
                        </div>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card className="shadow-sm border-0 p-2 h-100">
                        <p className="mb-2 fw-500 text-muted fs-14 border-bottom">Domain Expired</p>
                        <div className="text-center">
                          <p className="mb-0 fw-500 text-dark fs-18">{domain_expired_remaining} <small>day{domain_expired_remaining > 1 && 's'} left</small></p>
                          <p className="mb-0 text-dark fs-12">{domain_expired_date ? moment(domain_expired_date, 'DD-MM-YYYY').format('D MMMM YYYY') : ''}</p>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col xxl={10} xl={10} lg={24} md={24} sm={24} xs={24}>
          <Card className="border-0 shadow-1 dashboard-card">
            <Card.Body>
              <Row gutter={[10,10]} justify="space-between">
                <Col xl={12} lg={12}>
                  <Card.Title>Pasien</Card.Title>
                </Col>
              </Row>
              <Chart options={pieGender.options} series={pieGender.series} type="pie" width={475} />
            </Card.Body>
          </Card>
        </Col>

        <Col xxl={14} xl={14} lg={24} md={24} sm={24} xs={24}>
          <Card className="border-0 shadow-1 dashboard-card">
            <Card.Body>
              <Row gutter={[10,10]} justify="space-between">
                <Col xl={12} lg={12}>
                  <Card.Title>Terdaftar / Selesai</Card.Title>
                </Col>
              </Row>
              <Chart options={optionDoneWaiting} series={seriesDoneWaiting} type="bar" height={350} />
            </Card.Body>
          </Card>
        </Col>

        {seriesAntigen && (
          <Col xxl={12} xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card className="border-0 shadow-1 dashboard-card">
              <Card.Body>
                <Row gutter={[10,10]} justify="space-between">
                  <Col xl={12} lg={12}>
                    <Card.Title>Antigen</Card.Title>
                  </Col>
                </Row>
                <Chart options={optionAntigen} series={seriesAntigen} type="bar" height={350} />
              </Card.Body>
            </Card>
          </Col>
        )}

        {seriesGenose && (
          <Col xxl={12} xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card className="border-0 shadow-1 dashboard-card">
              <Card.Body>
                <Row gutter={[10,10]} justify="space-between">
                  <Col xl={12} lg={12}>
                    <Card.Title>GeNose</Card.Title>
                  </Col>
                </Row>
                <Chart options={optionGenose} series={seriesGenose} type="bar" height={350} />
              </Card.Body>
            </Card>
          </Col>
        )}

        {seriesPcr && (
          <Col span={24}>
            <Card className="border-0 shadow-1 dashboard-card">
              <Card.Body>
                <Row gutter={[10,10]} justify="space-between">
                  <Col xl={12} lg={12}>
                    <Card.Title>PCR</Card.Title>
                  </Col>
                </Row>
                <Chart options={optionPcr} series={seriesPcr} type="bar" height={350} />
              </Card.Body>
            </Card>
          </Col>
        )}


      </Row>

      <style jsx>{`
      :global(.icon-stats) {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      :global(.scrollable-row) {
        overflow-y: auto;
        flex-flow: unset;
      }
      :global(.scrollable-row::-webkit-scrollbar) {
        width: 0;  /* Remove scrollbar space */
        background: transparent;  /* Optional: just make scrollbar invisible */
      }

      :global(.stats-1) {
        color: #262626;
      }

      :global(.header-dashboard) {
        margin-bottom: 20px;
      }
      :global(.header-date) {
        color: #93999E!important;
      }

      :global(.ant-progress-circle .ant-progress-text) {
        font-size: .65em;
      }
      :global(.server-dashboard-text-success.ant-progress-circle.ant-progress-status-success .ant-progress-text) {
        color: #dc3545;
      }
      @media only screen and (max-width: 575px) {
        :global(.header-dashboard) {
          padding: 15px;
        }
        :global(.dashboard-card) {
          border-radius: 0px!important;
        }
      }
      `}</style>
    </>
  )
}

Dashboard.getInitialProps = async ctx => {
  if(ctx?.req) axios.defaults.headers.get.Cookie = ctx?.req.headers.cookie
  const searchQuery = { ...ctx.query }
  const cookies = nookies.get(ctx)

  if(isIn('institution_id', Object.keys(cookies)) &&
    !isIn('institution_id_dashboard_delete', Object.keys(cookies)) &&
    !isIn('institution_id', Object.keys(searchQuery))
  ) {
    if(cookies?.institution_id) {
      searchQuery['institution_id'] = cookies?.institution_id
    }
    else {
      delete searchQuery['institution_id']
    }
  }

  if(isIn('location_service_id', Object.keys(cookies)) &&
    !isIn('location_service_id_dashboard_delete', Object.keys(cookies)) &&
    !isIn('location_service_id', Object.keys(searchQuery))
  ) {
    if(cookies?.location_service_id) {
      searchQuery['location_service_id'] = cookies?.location_service_id
    }
    else {
      delete searchQuery['location_service_id']
    }
  }

  await ctx.store.dispatch(actions.getDashboardChart({ ...searchQuery }))
  return { searchQuery: searchQuery }
}

export default withAuth(Dashboard)
