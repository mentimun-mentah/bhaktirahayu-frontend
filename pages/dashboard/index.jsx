import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { Table, Form, Input, Row, Col, Select } from 'antd'

import { ExportToExcel } from 'lib/exportToExcel'
import { dataSourceReports, columnsDaftarPasien, reformatData } from 'data/table'

import _ from "lodash"
import moment from 'moment'
import 'moment/locale/id'

import Pagination from 'components/Pagination'

moment.locale('id')

const Dashboard = () => {
  const [page, setPage] = useState(1)

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          <Card.Title>Daftar Pasien Menunggu</Card.Title>

          <Form layout="vertical">
            <Row gutter={[10, 10]}>
              <Col xl={14}>
                <Form.Item>
                  <Input placeholder="Cari nama pasien" />
                </Form.Item>
              </Col>
              <Col xl={10}>
                <Form.Item>
                  <Select defaultValue="terlama" className="w-100" placeholder="Urutkan" allowClear>
                    <Select.Option value="terlama">Terlama</Select.Option>
                    <Select.Option value="terbaru">Terbaru</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Table 
            bordered
            size="middle"
            pagination={false} 
            columns={columnsDaftarPasien}
            dataSource={dataSourceReports} 
            scroll={{ y: 500, x: 1180 }} 
          />

          <Card.Body className="text-right pb-2 pr-0">
            <Pagination 
              current={page} 
              hideOnSinglePage 
              pageSize={10}
              total={304} 
              goTo={val => setPage(val)} 
            />
          </Card.Body>

        </Card.Body>
      </Card>
    </>
  )
}

export default Dashboard
