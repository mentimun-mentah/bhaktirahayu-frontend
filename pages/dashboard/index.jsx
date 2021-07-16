import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { Table, Form, Input, Row, Col, Select } from 'antd'

import dynamic from 'next/dynamic'

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const chart = {
  series: [
    {
      name: 'Negatif',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    }, 
    {
      name: 'Positif',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }
  ],
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
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands"
        }
      }
    },
  }
}


const Dashboard = () => {

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          <Row gutter={[10,10]} justify="space-between">
            <Col xl={12} lg={12}>
              <Card.Title>Hasil Tes Rapid Antigen</Card.Title>
            </Col>
            <Col xl={8} lg={8}>
              <Select 
                defaultValue="Bhakti Rahayu Denpasar"
                className="w-100"
                placeholder="Pilih Instansi"
              >
                <Select.Option value="Bhakti Rahayu Denpasar">Bhakti Rahayu Denpasar</Select.Option>
                <Select.Option value="Bhakti Rahayu Tabanan">Bhakti Rahayu Tabanan</Select.Option>
                <Select.Option value="Bhaksena Bypass Ngurah Rai">Bhaksena Bypass Ngurah Rai</Select.Option>
                <Select.Option value="Bhaksena Pelabuhan Gilimanuk">Bhaksena Pelabuhan Gilimanuk</Select.Option>
              </Select>
            </Col>
          </Row>

          <Chart options={chart.options} series={chart.series} type="bar" height={350} />

        </Card.Body>
      </Card>
    </>
  )
}

export default Dashboard
