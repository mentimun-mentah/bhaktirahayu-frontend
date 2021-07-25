import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { SearchOutlined } from '@ant-design/icons'
import { Form, Input, Row, Col, Upload, Button, Modal, Space } from 'antd'

import { formImage } from 'formdata/image'
import { imagePreview, uploadButton } from 'lib/imageUploader'
import { columns_doctor, data_doctor } from 'data/tableDoctor'

import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'

const ProductCellEditable = ({ index, record, editable, type, children, showModal, ...restProps }) => {
  let childNode = children

  if(editable){
    childNode = (
      type === "action" && (
        <Space>
          <a onClick={showModal}><i className="fal fa-edit text-center" /></a>
          <a onClick={() => {}}><i className="fal fa-trash-alt text-center" /></a>
        </Space>
      )
    )
  }
  
  return <td {...restProps}>{childNode}</td>
}

const addDoctor = "Tambah Dokter"
const editDoctor = "Edit Dokter"

const DoctorsContainer = () => {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [imageList, setImageList] = useState(formImage)
  const [modalTitle, setModalTitle] = useState(addDoctor)

  /* IMAGE CHANGE FUNCTION */
  const imageChangeHandler = ({ fileList: newFileList }) => {
    const data = {
      ...imageList,
      file: { value: newFileList, isValid: true, message: null }
    }
    setImageList(data)
  };
  /* IMAGE CHANGE FUNCTION */

  const columnsDoctors = columns_doctor.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record, index: index,
        type: col.type, 
        editable: col.editable,
        showModal: () => {
          setShowModal(true)
          setModalTitle(editDoctor)
        }
      })
    }
  })

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          <Row gutter={[10,0]} justify="space-between" align="middle">
            <Col span={12}>
              <Card.Title className="mb-0">Daftar Dokter</Card.Title>
            </Col>
            <Col span={12}>
              <Button 
                type="primary" 
                className="float-right"
                onClick={() => {
                  setShowModal(true)
                  setModalTitle(addDoctor)
                }}
              >
                <i className="far fa-plus mr-1" />Dokter
              </Button>
            </Col>
          </Row>
          <hr />

          <Form layout="vertical" className="mb-3">
            <Form.Item className="mb-0">
              <Input placeholder="Cari nama dokter" prefix={<SearchOutlined />} />
            </Form.Item>
          </Form>

          <TableMemo
            bordered
            size="middle"
            pagination={false} 
            columns={columnsDoctors}
            dataSource={data_doctor} 
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
        title={modalTitle}
        visible={showModal}
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        okText="Simpan"
        cancelText="Batal"
        closeIcon={<i className="far fa-times" />}
      >
        <Form layout="vertical">

          <Form.Item label="Tanda tangan (500 × 500 px)" className="mb-2">
            <Upload
              accept="image/*"
              listType="picture-card"
              className="avatar-uploader"
              disabled={loading}
              onPreview={imagePreview}
              onChange={imageChangeHandler}
              fileList={imageList.file.value}
              // beforeUpload={(f) => imageValidation(f, "image", "/plants/create", "post", setLoading, () => {}, "")}
            >
              {imageList.file.value.length >= 1 ? null : uploadButton(loading)}
            </Upload>
          </Form.Item>

          <Form.Item label="Nama" className="mb-3">
            <Input placeholder="Nama dokter" />
          </Form.Item>

          <Form.Item label="Email" className="mb-3">
            <Input placeholder="Email dokter" />
          </Form.Item>

          <Form.Item label="Password" className="mb-3">
            <Input.Password placeholder="Password dokter" />
          </Form.Item>

        </Form>
      </Modal>
    </>
  )
}

export default DoctorsContainer
