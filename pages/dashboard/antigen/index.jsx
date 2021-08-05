import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { Form, Input, Row, Col, Space, DatePicker, AutoComplete, Grid, Tooltip, Divider, Popconfirm, message } from 'antd'

import { formPatient } from 'formdata/patient'
import { ExportToExcel } from 'lib/exportToExcel'
import { dataSourceReports, columnsReports, reformatData } from 'data/table'

import 'moment/locale/id'
import moment from 'moment'
import id_ID from "antd/lib/date-picker/locale/id_ID"

import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import pdfGenerator from 'lib/antigenGenerator'
import DrawerPatient from 'components/DrawerPatient'
import DrawerDetailPatient from 'components/DrawerDetailPatient'

moment.locale('id')
const useBreakpoint = Grid.useBreakpoint

const ProductCellEditable = ({ index, record, editable, type, children, onShowDrawer, onShowDetailPatient, ...restProps }) => {
  let childNode = children

  if(editable){
    childNode = (
      type === "action" && (
        <Space>
          <Tooltip placement="top" title="Ubah">
            <a onClick={() => onShowDrawer(record)}><i className="fal fa-edit text-center" /></a>
          </Tooltip>
          <Tooltip placement="top" title="Hasil">
            <a onClick={() => pdfGenerator(record, index)}><i className="fal fa-eye text-center" /></a>
          </Tooltip>
          <Tooltip placement="top" title="Riwayat">
            <a onClick={onShowDetailPatient}><i className="fal fa-clipboard-list text-center" /></a>
          </Tooltip>
        </Space>
      )
    )
  }
  
  return <td {...restProps}>{childNode}</td>
}

const AntigenContainer = () => {
  const screens = useBreakpoint()
  const [page, setPage] = useState(1)
  const [patient, setPatient] = useState(formPatient)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showDetailPatient, setShowDetailPatient] = useState(false)

  const columnsPatient = columnsReports.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record, index: index,
        type: col.type, 
        editable: col.editable,
        onShowDrawer: onEditPatientHandler,
        onShowDetailPatient: () => setShowDetailPatient(true)
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

  const instansi_list = [
    { value: "Bhakti Rahayu Denpasar" },
    { value: "Bhakti Rahayu Tabanan" },
    { value: "Bhaksena Bypass Ngurah Rai" },
    { value: "Bhaksena Pelabuhan Gilimanuk" },
  ]

  const pic_list = [
    { value: "James" },
    { value: "Robert" },
    { value: "Mary" },
    { value: "Patricia" },
    { value: "Michael" },
    { value: "Linda" },
    { value: "Susan" },
    { value: "Charles" },
    { value: "Nancy" },
    { value: "Ashley" },
  ]

  const location_list = [
    { value: "Hotel" },
    { value: "Lapangan" },
    { value: "Rumah Sakit" },
  ]

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          
          <Card.Title>Daftar Pasien Rapid Antigen</Card.Title>

          <Form layout="vertical" className="mb-3">
            <Row gutter={[10, 10]} justify="space-between">
              <Col xl={5} lg={5} md={8} sm={12} xs={24}>
                <Form.Item className="mb-0">
                  <Input placeholder="Cari NIK pasien" />
                </Form.Item>
              </Col>
              <Col xl={5} lg={5} md={8} sm={12} xs={24}>
                <Form.Item className="mb-0">
                  <AutoComplete 
                    className="w-100"
                    options={instansi_list}
                    placeholder="Cari instansi"
                    filterOption={(inputValue, option) =>
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
              </Col>
              <Col xl={5} lg={5} md={8} sm={12} xs={24}>
                <Form.Item className="mb-0">
                  <AutoComplete 
                    className="w-100"
                    options={pic_list}
                    placeholder="Cari penjamin"
                    filterOption={(inputValue, option) =>
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
              </Col>
              <Col xl={5} lg={5} md={12} sm={12} xs={24}>
                <Form.Item className="mb-0">
                  <AutoComplete 
                    className="w-100"
                    options={location_list}
                    placeholder="Lokasi pelayanan"
                    filterOption={(inputValue, option) =>
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={4} md={12} sm={24} xs={24}>
                <Form.Item className="mb-0">
                  <DatePicker
                    inputReadOnly
                    locale={id_ID}
                    className="w-100"
                    format="DD MMM YYYY HH:mm"
                    showTime={{ format: 'HH:mm' }}
                    placeholder="Pilih tanggal & waktu"
                  />
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
            <Row gutter={[10,10]} justify="space-between" align="middle">
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className={!screens.md && "text-center"}>
                <ExportToExcel jsonData={reformatData(dataSourceReports)} fileName={new Date()} />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className={!screens.md && "text-center"}>
                <div className={screens.md && "float-right"}>
                  <Pagination 
                    current={page} 
                    hideOnSinglePage 
                    pageSize={10}
                    total={304} 
                    goTo={val => setPage(val)} 
                  />
                </div>
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

      <DrawerDetailPatient
        visible={showDetailPatient} 
        onClose={() => setShowDetailPatient(false)}
      />

    </>
  )
}

export default withAuth(AntigenContainer)
