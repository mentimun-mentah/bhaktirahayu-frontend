import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { Row, Col, Select } from 'antd'

import moment from 'moment'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chart = {
  options: {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
        tools: {
          download: false
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        endingShape: 'rounded',
        borderRadius: 5,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#304758"]
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    colors: ['#47e395', '#E91E63'],
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          }
        }
      },
      tooltip: {
        enabled: true,
      }
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      enabled: false,
    },
  }
}

const denpasar = [
  {
    name: 'Negatif',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
  }, 
  {
    name: 'Positif',
    data: [12, 32, 19, 8, 0, 2, 41, 14, 52]
  }
]

const tabanan = [
  {
    name: 'Negatif',
    data: [61, 55, 57, 56, 66, 58, 63, 44, 60]
  }, 
  {
    name: 'Positif',
    data: [8, 12, 0, 32, 2, 41, 14, 19, 52]
  }
]

const bypass = [
  {
    name: 'Negatif',
    data: [58, 63, 61, 60, 57, 56, 66, 44, 55]
  }, 
  {
    name: 'Positif',
    data: [8, 12, 0, 14, 32, 41, 52, 19, 2]
  }
]

const gilimanuk = [
  {
    name: 'Negatif',
    data: [58, 60, 63, 55, 57, 56, 66, 61, 44]
  }, 
  {
    name: 'Positif',
    data: [8, 12, 0, 14, 32, 41, 52, 19, 2]
  }
]

const stats_list = [
  {
    title: "Total antigen",
    sub: "192",
    icon : "fas fa-sword-laser",
    bg: "stats-1",
    extra: " / hari ini"
  },
  {
    title: "Total genose",
    sub: "192",
    icon : "fas fa-wind",
    bg: "stats-1",
    extra: " / hari ini"
  },
  {
    title: "Total Pasien",
    sub: "3.423",
    icon : "fas fa-users",
    bg: "stats-1",
    extra: " / hari ini"
  },
  {
    title: "Total Dokter",
    sub: "192",
    icon : "fas fa-stethoscope",
    bg: "stats-1",
    extra: ""
  },
]

const Dashboard = () => {
  const [series, setSeries] = useState(denpasar)
  const [instansi, setInstansi] = useState("denpasar")

  const onChangeInstansiHandler = value => {
    setInstansi(value)
    if(value == "denpasar") setSeries(denpasar)
    else if(value == "tabanan") setSeries(tabanan)
    else if(value == "bypass") setSeries(bypass)
    else if(value == "gilimanuk") setSeries(gilimanuk)
    else setSeries(denpasar)
  }

  return (
    <>
      <div className="header-dashboard">
        <h1 className="h1 bold mb-0">Dashboard</h1>
        <span className="header-date">
          {moment().format("dddd, DD MMMM YYYY")}
        </span>
      </div>

      <Row gutter={[20,20]}>
        {stats_list.map((data, i) => (
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

        <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
          <Card className="border-0 shadow-1">
            <Card.Body>
              <p className="mb-0">pie chart antigen</p>
              <ul>
                <li>positif</li>
                <li>negatif</li>
                <li>belum ditangani</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
          <Card className="border-0 shadow-1">
            <Card.Body>
              <Row gutter={[10,10]} justify="space-between">
                <Col xl={12} lg={12}>
                  <Card.Title>Hasil Tes Rapid Antigen</Card.Title>
                </Col>
                <Col xl={8} lg={8}>
                  <Select 
                    value={instansi}
                    className="w-100"
                    placeholder="Pilih Instansi"
                    onChange={onChangeInstansiHandler}
                  >
                    <Select.Option value="denpasar">Bhakti Rahayu Denpasar</Select.Option>
                    <Select.Option value="tabanan">Bhakti Rahayu Tabanan</Select.Option>
                    <Select.Option value="bypass">Bhaksena Bypass Ngurah Rai</Select.Option>
                    <Select.Option value="gilimanuk">Bhaksena Pelabuhan Gilimanuk</Select.Option>
                  </Select>
                </Col>
              </Row>

              <Chart options={chart.options} series={series} type="bar" height={350} />

            </Card.Body>
          </Card>
        </Col>

        <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
          <Card className="border-0 shadow-1">
            <Card.Body>
              <Row gutter={[10,10]} justify="space-between">
                <Col xl={12} lg={12}>
                  <Card.Title>Hasil Tes GeNose</Card.Title>
                </Col>
                <Col xl={8} lg={8}>
                  <Select 
                    // value={instansi}
                    className="w-100"
                    placeholder="Pilih Instansi"
                    // onChange={onChangeInstansiHandler}
                  >
                    <Select.Option value="denpasar">Bhakti Rahayu Denpasar</Select.Option>
                    <Select.Option value="tabanan">Bhakti Rahayu Tabanan</Select.Option>
                    <Select.Option value="bypass">Bhaksena Bypass Ngurah Rai</Select.Option>
                    <Select.Option value="gilimanuk">Bhaksena Pelabuhan Gilimanuk</Select.Option>
                  </Select>
                </Col>
              </Row>

              <Chart options={chart.options} series={series} type="bar" height={350} />

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
