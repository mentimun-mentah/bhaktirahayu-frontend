import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { Row, Col, Space, Grid, Tooltip, Popconfirm, Button, Form, Input, message } from 'antd'

import { formPatient } from 'formdata/patient'
import { ExportToExcel } from 'lib/exportToExcel'
import { dataSourceReports, columnsReports, reformatData } from 'data/table'

import 'moment/locale/id'
import moment from 'moment'

import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import pdfGenerator from 'lib/antigenGenerator'
import DrawerFilter from 'components/DrawerFilter'
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
          <Tooltip placement="top" title="Riwayat">
            <a onClick={onShowDetailPatient}><i className="fal fa-clipboard-list text-center" /></a>
          </Tooltip>
          <Tooltip placement="top" title="Ubah">
            <a onClick={() => onShowDrawer(record)}><i className="fal fa-edit text-center" /></a>
          </Tooltip>
          {/* <Tooltip placement="top" title="Hasil"> */}
          {/*   <a onClick={() => pdfGenerator(record, index)}><i className="fal fa-eye text-center" /></a> */}
          {/* </Tooltip> */}
          <Tooltip placement="top" title="Hapus">
            <Popconfirm
              placement="bottomRight"
              title="Hapus data ini?"
              onConfirm={() => message.info('Data berhasil dihapus!')}
              okText="Ya"
              cancelText="Batal"
            >
              <a><i className="fal fa-trash-alt text-danger text-center" /></a>
            </Popconfirm>
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
  const [showFilter, setShowFilter] = useState(false)
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

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          
          <Row gutter={[10, 10]} justify="space-between" className="mb-3">
            <Col xl={5} lg={8} md={10} sm={12} xs={12}>
              <Form.Item className="mb-0">
                <Input 
                  prefix={<i className="far fa-search pr-2" />}
                  placeholder="Cari nik / nama pasien" 
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={12} md={12} sm={12} xs={12}>
              <Space className="float-right">
                <ExportToExcel jsonData={reformatData(dataSourceReports)} fileName={new Date()} />
                <Button 
                  type="text" 
                  className="border" 
                  onClick={() => setShowFilter(true)}
                  icon={<i className="far fa-filter mr-2" />}
                >
                  Filter
                </Button>
              </Space>
            </Col>
          </Row>

          <TableMemo
            bordered
            size="middle"
            pagination={false} 
            columns={columnsPatient}
            dataSource={dataSourceReports} 
            scroll={{ y: `${screens.xs ? 'calc(100vh - 226px)' : (screens.sm && !screens.md) ? 'calc(100vh - 242px)' : 'calc(100vh - 242px)'}`, x: 1180 }} 
            components={{ body: { cell: ProductCellEditable } }}
          />

          <Card.Body className="pb-2 px-0">
            <div className="text-center">
              <Pagination 
                current={page} 
                hideOnSinglePage 
                pageSize={10}
                total={304} 
                goTo={val => setPage(val)} 
              />
            </div>
          </Card.Body>
        </Card.Body>
      </Card>

      <DrawerFilter
        visible={showFilter}
        onClose={() => setShowFilter(false)}
      />

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
