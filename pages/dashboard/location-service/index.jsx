import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { SearchOutlined } from '@ant-design/icons'
import { Form, Input, Row, Col, Button, Modal, Space } from 'antd'

import { columns_location, data_location } from 'data/tableLocation'

import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'

const ProductCellEditable = ({ index, record, editable, type, children, ...restProps }) => {
  let childNode = children

  if(editable){
    childNode = (
      type === "action" && (
        <Space>
          <a onClick={() => {}}><i className="fal fa-edit text-center" /></a>
          <a onClick={() => {}}><i className="fal fa-trash-alt text-center" /></a>
        </Space>
      )
    )
  }
  
  return <td {...restProps}>{childNode}</td>
}

const LocationServiceContainer = () => {
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)

  const columnsLocations = columns_location.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record, index: index,
        type: col.type, 
        editable: col.editable,
      })
    }
  })

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          <Row gutter={[10,0]} justify="space-between" align="middle">
            <Col span={12}>
              <Card.Title className="mb-0">Lokasi Pelayanan</Card.Title>
            </Col>
            <Col span={12}>
              <Button 
                type="primary" 
                className="float-right"
                onClick={() => setShowModal(true)}
              >
                <i className="far fa-plus mr-1" />Lokasi
              </Button>
            </Col>
          </Row>
          <hr />

          <Form layout="vertical" className="mb-3">
            <Form.Item className="mb-0">
              <Input placeholder="Cari lokasi pelayanan" prefix={<SearchOutlined />} />
            </Form.Item>
          </Form>

          <TableMemo
            bordered
            size="middle"
            pagination={false} 
            columns={columnsLocations}
            dataSource={data_location} 
            scroll={{ y: 485, x: 800 }} 
            components={{ body: { cell: ProductCellEditable } }}
          />

          <Card.Body className="pb-2 px-0">
            <Row gutter={[10,10]} justify="space-between">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div className="text-center">
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


      <Modal 
        centered
        title="Tambah Lokasi"
        visible={showModal}
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        okText="Simpan"
        cancelText="Batal"
        closeIcon={<i className="far fa-times" />}
      >
        <Form layout="vertical">

          <Form.Item label="Lokasi" className="mb-0">
            <Input placeholder="Lokasi pelayanan" />
          </Form.Item>

        </Form>
      </Modal>
    </>
  )
}

export default LocationServiceContainer
