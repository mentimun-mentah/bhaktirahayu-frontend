import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { withAuth } from 'lib/withAuth'
import { SearchOutlined } from '@ant-design/icons'
import { Form, Input, Row, Col, Button, Modal, Space, Select, Upload, Tooltip, Popconfirm, message } from 'antd'

import { formImage, formImageIsValid } from 'formdata/image'
import { imagePreview, uploadButton } from 'lib/imageUploader'
import { columns_instansi, data_instansi } from 'data/tableInstansi'
import { formInstitution, formInstitutionIsValid } from 'formdata/institution'

import isIn from 'validator/lib/isIn'

import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import ErrorMessage from 'components/ErrorMessage'

const ProductCellEditable = ({ index, record, editable, type, showModal, children, ...restProps }) => {
  let childNode = children

  if(editable){
    childNode = (
      type === "action" && (
        <Space>
          <Tooltip placement="top" title="Ubah">
            <a onClick={showModal}><i className="fal fa-edit text-center" /></a>
          </Tooltip>
          <Tooltip placement="top" title="Pratinjau">
            <a onClick={() => pdfGenerator(record, index)}><i className="fal fa-eye text-center" /></a>
          </Tooltip>
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

const addTitle = "Tambah Instansi"
const editTitle = "Edit Instansi"

const InstitutionContainer = () => {
  const [page, setPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [kindCheck, setKindCheck] = useState([])
  const [isUpdate, setIsUpdate] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [imageList, setImageList] = useState(formImage)
  const [guardian, setGuardian] = useState(formInstitution)
  const [modalTitle, setModalTitle] = useState(addTitle)

  const { name } = guardian

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = e => {
    const name = e.target.name
    const value = e.target.value

    const data = {
      ...guardian,
      [name]: { ...guardian[name], value: value, isValid: true, message: null }
    }

    setGuardian(data)
  }
  /* INPUT CHANGE FUNCTION */

  const columnsGuardians = columns_instansi.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record, index: index,
        type: col.type, 
        editable: col.editable,
        showModal: () => {
          setIsUpdate(true)
          setShowModal(true)
          setModalTitle(editTitle)
        }
      })
    }
  })

  const onSubmitHandler = e => {
    e.preventDefault()
    if(formGuardianIsValid(guardian, setGuardian, isUpdate)) {
      setLoading(true)
      const data = {
        username: username.value,
      }

      console.log(data)
    }
  }

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          <Row gutter={[10,0]} justify="space-between" align="middle">
            <Col span={12}>
              <Card.Title className="mb-0">Daftar Instansi</Card.Title>
            </Col>
            <Col span={12}>
              <Button 
                type="primary" 
                className="float-right"
                onClick={() => {
                  setShowModal(true)
                  setIsUpdate(false)
                  setModalTitle(addTitle)
                }}
              >
                <i className="far fa-plus mr-1" />Instansi
              </Button>
            </Col>
          </Row>
          <hr />

          <Form layout="vertical" className="mb-3">
            <Form.Item className="mb-0">
              <Input placeholder="Cari instansi" prefix={<SearchOutlined />} />
            </Form.Item>
          </Form>

          <TableMemo
            bordered
            size="middle"
            pagination={false} 
            columns={columnsGuardians}
            dataSource={data_instansi} 
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
        onOk={onSubmitHandler}
        onCancel={() => setShowModal(false)}
        okText="Simpan"
        cancelText="Batal"
        closeIcon={<i className="far fa-times" />}
      >
        <Form layout="vertical">

          <Form.Item 
            className="mb-3"
            label="Nama Instansi"
            validateStatus={!name.isValid && name.message && "error"}
          >
            <Input 
              name="name"
              value={name.value}
              onChange={onChangeHandler}
              placeholder="Nama instansi" 
            />
            <ErrorMessage item={name} />
          </Form.Item>

          <Form.Item 
            className="mb-3"
            label="Jenis Pemeriksaan"
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              onChange={val => setKindCheck(val)}
              placeholder="Pilih jenis pemeriksaan"
              removeIcon={<i className="fal fa-times" />}
              onDropdownVisibleChange={val => setIsOpen(val)}
            >
              <Select.Option value="antigen">Antigen</Select.Option>
              <Select.Option value="genose">GeNose</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={[10,10]}>
            {isIn('antigen', kindCheck) && !isOpen && (
              <Col>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <Form.Item 
                    label="Kop Antigen"
                    className="m-b-0"
                  >
                    <Upload
                      accept="image/*"
                      listType="picture-card"
                      onPreview={imagePreview}
                      fileList={imageList.file.value}
                    >
                      {imageList.file.value.length >= 1 ? null : uploadButton(loading)}
                    </Upload>
                  </Form.Item>
                </motion.div>
              </Col>
            )}
            {isIn('genose', kindCheck) && !isOpen && (
              <Col>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <Form.Item 
                    label="Kop GeNose"
                    className="m-b-0"
                  >
                    <Upload
                      accept="image/*"
                      listType="picture-card"
                      onPreview={imagePreview}
                      fileList={imageList.file.value}
                    >
                      {imageList.file.value.length >= 1 ? null : uploadButton(loading)}
                    </Upload>
                  </Form.Item>
                </motion.div>
              </Col>
            )}
          </Row>

          <Form.Item 
            label="Cap Instansi"
            className="m-b-0"
          >
            <Upload
              accept="image/*"
              listType="picture-card"
              onPreview={imagePreview}
              fileList={imageList.file.value}
            >
              {imageList.file.value.length >= 1 ? null : uploadButton(loading)}
            </Upload>
          </Form.Item>

        </Form>

        <h2 className="fs-14 bold m-b-0 mt-3">Note:</h2>
        <ul className="mb-0" style={{ paddingInlineStart: '25px' }}>
          <li>Ukuran file: maks. 5MB</li>
          <li>Ukuran cap: 500 × 500 px</li>
          <li>Ukuran kop: 1000 × 200 px</li>
        </ul>
      </Modal>
    </>
  )
}

export default withAuth(InstitutionContainer)
