import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { Row, Col, Select } from 'antd'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import _ from 'lodash'
import moment from 'moment'
import dynamic from 'next/dynamic'

import { periodList } from 'data/all'
import { antigenGenoseOption } from 'lib/chartConfig'

import * as actions from 'store/actions'

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

const per_page = 30

const Dashboard = () => {
  const dispatch = useDispatch()

  const totalData = useSelector(state => state.dashboard.totalData)
  const chartData = useSelector(state => state.dashboard.chartData)
  const institutions = useSelector(state => state.institution.institution)
  const locationServices = useSelector(state => state.locationService.locationService)

  const [period, setPeriod] = useState("week")
  const [institution, setInstitution] = useState([])
  const [locationService, setLocationService] = useState([])
  const [seriesGenose, setSeriesGenose] = useState(formAntigenGenose)
  const [seriesAntigen, setSeriesAntigen] = useState(formAntigenGenose)
  const [seriesDoneWaiting, setSeriesDoneWaiting] = useState(formDoneWaiting)

  const [optionGenose, setOptionGenose] = useState(antigenGenoseOption)
  const [optionAntigen, setOptionAntigen] = useState(antigenGenoseOption)
  const [optionDoneWaiting, setOptionDoneWaiting] = useState({ ...antigenGenoseOption, colors: ['#fd9644', '#4b7bec']})

  useEffect(() => {
    dispatch(actions.getDashboardTotalData())
  }, [])

  useEffect(() => {
    const query = {}
    query['period'] = period
    if(institution?.length > 0) query['institution_id'] = institution
    else delete query['institution_id']

    if(locationService?.length > 0) query['location_service_id'] = locationService
    else delete query['location_service_id']

    dispatch(actions.getDashboardChart({ ...query }))
  }, [period, institution, locationService])

  useEffect(() => {
    let copyOptionGenose = _.cloneDeep(optionGenose)
    let copyOptionAntigen = _.cloneDeep(optionAntigen)
    let copyOptionDoneWaiting = _.cloneDeep(optionDoneWaiting)

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

    setOptionGenose(copyOptionGenose)
    setOptionAntigen(copyOptionAntigen)
    setOptionDoneWaiting(copyOptionDoneWaiting)

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

  const onSearchInstitutionServices = val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(val) queryString["q"] = val
    else delete queryString["q"]
    dispatch(actions.getInstitution({ ...queryString }))
  }

  const onFocusInstitutionServices = () => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page
    dispatch(actions.getInstitution({ ...queryString }))
  }

  const onSearchLocationServices = val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(val) queryString["q"] = val
    else delete queryString["q"]
    dispatch(actions.getLocationService({ ...queryString }))
  }

  const onFocusLocationServices = () => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page
    dispatch(actions.getLocationService({ ...queryString }))
  }

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

              <Col span={7} sm={8} xs={8}>
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

              <Col span={7} sm={8} xs={8}>
                <Select
                  allowClear
                  showSearch
                  className="w-100"
                  value={institution}
                  placeholder="Pilih Instansi"
                  onFocus={onFocusInstitutionServices}
                  onSearch={onSearchInstitutionServices}
                  onChange={val => setInstitution(val)}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  getPopupContainer={triggerNode => triggerNode.parentElement}
                >
                  {institutions?.data?.length > 0 && institutions?.data.map(institution => (
                    <Select.Option value={institution.institutions_id} key={institution.institutions_id}>
                      {institution.institutions_name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>

              <Col span={7} sm={8} xs={8}>
                <Select
                  allowClear
                  showSearch
                  className="w-100"
                  value={locationService}
                  placeholder="Pilih Lokasi Pelayanan"
                  onFocus={onFocusLocationServices}
                  onSearch={onSearchLocationServices}
                  onChange={val => setLocationService(val)}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  getPopupContainer={triggerNode => triggerNode.parentElement}
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

      <Row gutter={[20,20]}>
        {stats_list(totalData).map((data, i) => (
          <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24} key={i}>
            <Card className="border-0 shadow-1">
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

        <Col xxl={10} xl={10} lg={24} md={24} sm={24} xs={24}>
          <Card className="border-0 shadow-1">
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
          <Card className="border-0 shadow-1">
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

        <Col xxl={12} xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card className="border-0 shadow-1">
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

        <Col xxl={12} xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card className="border-0 shadow-1">
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
      `}</style>
    </>
  )
}

export default withAuth(Dashboard)
