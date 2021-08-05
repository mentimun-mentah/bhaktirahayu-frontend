import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { Form, Input, Row, Col, Select, Space } from 'antd'

import { formPatient } from 'formdata/patient'
import { ExportToExcel } from 'lib/exportToExcel'
import { dataSourceReports, columnsReports, reformatData } from 'data/table'

import _ from "lodash"
import moment from 'moment'
import 'moment/locale/id'

import pdfGenerator from 'lib/genoseGenerator'
import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import DrawerPatient from 'components/DrawerPatient'

moment.locale('id')

const ProductCellEditable = ({ index, record, editable, type, children, onShowDrawer, ...restProps }) => {
  let childNode = children

  if(editable){
    childNode = (
      type === "action" && (
        <Space>
          <a onClick={() => onShowDrawer(record)}><i className="fal fa-edit text-center" /></a>
          <a onClick={() => pdfGenerator(record, index)}><i className="fal fa-eye text-center" /></a>
        </Space>
      )
    )
  }
  
  return <td {...restProps}>{childNode}</td>
}

const GenoseContainer = () => {
  const [page, setPage] = useState(1)
  const [showDrawer, setShowDrawer] = useState(false)
  const [patient, setPatient] = useState(formPatient)

  const columnsPatient = columnsReports.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record, index: index,
        type: col.type, 
        editable: col.editable,
        onShowDrawer: onEditPatientHandler
      })
    }
  })

  const onEditPatientHandler = (value) => {
    setShowDrawer(true)
    const data = {
      ...patient, 
      name: { ...patient.name, value: value.name },
      gender: { ...patient.gender, value: value.gender },
      birth_place: { ...patient.birth_place, value: value.birth_place },
      birth_date: { ...patient.birth_date, value: value.birth_date },
      address: { ...patient.address, value: value.address },
      result: { ...patient.result, value: value.result },
    }
    setPatient(data)
  }

  const onClosePatientDrawerHandler = () => {
    setShowDrawer(false)
    setPatient(formPatient)
  }

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          
          <Card.Title>Daftar Pasien Tes Genose</Card.Title>

          <Form layout="vertical" className="mb-3">
            <Row gutter={[10, 10]}>
              <Col xl={14} lg={14} md={14} sm={13} xs={24}>
                <Form.Item className="mb-0">
                  <Input placeholder="Cari nama pasien" />
                </Form.Item>
              </Col>
              <Col xl={10} lg={10} md={10} sm={11} xs={24}>
                <Form.Item className="mb-0">
                  <Select defaultValue="semua" className="w-100" placeholder="Filter hasil" allowClear>
                    <Select.Option value="semua">Semua</Select.Option>
                    <Select.Option value="negatif">Negatif</Select.Option>
                    <Select.Option value="positif">Positif</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <TableMemo
            bordered
            size="middle"
            pagination={false} 
            columns={columnsPatient}
            dataSource={dataSourceReports} 
            scroll={{ y: 485, x: 1180 }} 
            components={{ body: { cell: ProductCellEditable } }}
          />

          <Card.Body className="pb-2 px-0">
            <Row gutter={[10,10]} justify="space-between">
              <Col>
                <ExportToExcel jsonData={reformatData(dataSourceReports)} fileName={new Date()} />
              </Col>
              <Col>
                <Pagination 
                  current={page} 
                  hideOnSinglePage 
                  pageSize={10}
                  total={304} 
                  goTo={val => setPage(val)} 
                />
              </Col>
            </Row>
          </Card.Body>
        </Card.Body>
      </Card>

      <DrawerPatient 
        data={patient} 
        onSave={setPatient} 
        visible={showDrawer} 
        onClose={onClosePatientDrawerHandler}
      />

    </>
  )
}

export default withAuth(GenoseContainer)
