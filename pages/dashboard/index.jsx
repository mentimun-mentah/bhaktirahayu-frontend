import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { Row, Col, Select } from 'antd'

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
      <Row gutter={[20,20]}>
        <Col span={24}>
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

        <Col span={24}>
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
    </>
  )
}

export default Dashboard
