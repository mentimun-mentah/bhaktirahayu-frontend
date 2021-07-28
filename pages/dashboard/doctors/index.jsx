import { Card } from 'react-bootstrap'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchOutlined, EditOutlined } from '@ant-design/icons'
import { Form, Input, Row, Col, Upload, Button, Modal, Space, Drawer, message } from 'antd'

import { formImage } from 'formdata/image'
import { formDoctor } from 'formdata/doctor'
import { imagePreview, uploadButton } from 'lib/imageUploader'
import { columns_doctor, data_doctor } from 'data/tableDoctor'

import _ from 'lodash'
import SignatureCanvas from 'react-signature-canvas'

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

const urltoFile = (url, filename, mimeType) => {
  return (fetch(url)
    .then(function(res){return res.arrayBuffer();})
    .then(function(buf){return new File([buf], filename,{type:mimeType});})
  );
}


const addDoctor = "Tambah Dokter"
const editDoctor = "Edit Dokter"

const DoctorsContainer = () => {
  const sigCanvas = useRef()

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [doctor, setDoctor] = useState(formDoctor)
  const [showModal, setShowModal] = useState(false)
  const [imageList, setImageList] = useState(formImage)
  const [modalTitle, setModalTitle] = useState(addDoctor)
  const [showModalSignature, setShowModalSignature] = useState(false)

  const { name, email, password } = doctor

  /* IMAGE CHANGE FUNCTION */
  const imageChangeHandler = ({ fileList: newFileList }) => {
    const data = {
      ...imageList,
      file: { value: newFileList, isValid: true, message: null }
    }
    setImageList(data)
  };
  /* IMAGE CHANGE FUNCTION */

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = e => {
    const name = e.target.name
    const value = e.target.value

    const data = {
      ...doctor,
      [name]: { ...doctor[name], value: value, isValid: true, message: null }
    }

    setDoctor(data)
  }
  /* INPUT CHANGE FUNCTION */

  const onSubmitHandler = e => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.append("name", name.value)
    formData.append("email", email.value)
    formData.append("password", password.value)

    _.forEach(imageList.file.value, file => {
      if(!file.hasOwnProperty('url')){
        formData.append('image', file.originFileObj)
      }
    })

    console.log(...formData)
  }

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

  const onSaveSignatureHandler = async () => {
    const dataUrl = sigCanvas.current.getSignaturePad().toDataURL('image/png')
    const file = await urltoFile(dataUrl, 'signature.png','image/png')
    const signatureFile = {
      size: file.size,
      type: file.type,
      name: file.name,
      uid: -Math.abs(Math.random()),
      lastModified: new Date().getTime(),
      lastModifiedDate: new Date(),
      originFileObj: file,
      thumbUrl: dataUrl
    }
    const data = {
      ...imageList,
      file: { value: [signatureFile], isValid: true, message: null }
    }

    if(sigCanvas.current.isEmpty()) {
      message.error('Tanda tangan tidak boleh kosong')
      return
    } else {
      setImageList(data)
      setShowModalSignature(false)
    }
  }

  const onRemoveImageHandler = () => {
    setImageList(formImage)
    sigCanvas.current.clear()
  }

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
        onOk={onSubmitHandler}
        onCancel={() => setShowModal(false)}
        okText="Simpan"
        cancelText="Batal"
        closeIcon={<i className="far fa-times" />}
      >
        <Form 
          layout="vertical"
          id="w-modal-body"
        >
          <Form.Item 
            label="Nama" 
            className="mb-3"
          >
            <Input 
              name="name"
              value={name.value}
              onChange={onChangeHandler}
              placeholder="Nama dokter" 
            />
          </Form.Item>

          <Form.Item 
            label="Email"
            className="mb-3"
          >
            <Input 
              name="email"
              type="email"
              value={email.value}
              onChange={onChangeHandler}
              placeholder="Email dokter" 
            />
          </Form.Item>

          <Form.Item 
            label="Password" 
            className="mb-3"
          >
            <Input.Password 
              name="password"
              value={password.value}
              onChange={onChangeHandler}
              placeholder="Password dokter" 
            />
          </Form.Item>

          <Form.Item 
            label="Tanda tangan" 
            className="mb-0"
          >
            {imageList.file.value.length >= 1 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: ".2" }}
              >
                <Upload
                  accept="image/jpeg,image/png"
                  listType="picture-card"
                  className="avatar-uploader"
                  disabled={loading}
                  onPreview={imagePreview}
                  onChange={imageChangeHandler}
                  onRemove={onRemoveImageHandler}
                  fileList={imageList.file.value}
                  showUploadList={{
                    showDownloadIcon: true,
                  }}
                  // beforeUpload={(f) => imageValidation(f, "image", "/plants/create", "post", setLoading, () => {}, "")}
                >
                  {imageList.file.value.length >= 1 ? null : uploadButton(loading)}
                </Upload>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: ".2" }}
              >
                <Button onClick={() => setShowModalSignature(true)}>Buat Tanda Tangan</Button>
              </motion.div>
            )}

          </Form.Item>

        </Form>
      </Modal>

      <Modal 
        centered
        className="modal-close-disabled"
        title={<span className="user-select-none">Tanda Tangan</span>}
        visible={showModalSignature}
        onOk={onSubmitHandler}
        onCancel={() => {}}
        footer={false}
        closeIcon={<i className="far fa-times text-white hover-normal" />}
      >
        <div className="square border">
          <SignatureCanvas 
            penColor='black' 
            ref={ref => { sigCanvas.current = ref }}
            canvasProps={{className: 'sigCanvas content'}} 
          />
        </div>
        <div className="text-center mt-4">
          <Space>
            <Button 
              onClick={() => sigCanvas.current.clear()}
            >
              Hapus
            </Button>
            <Button 
              type="primary"
              onClick={onSaveSignatureHandler}
            >
              Simpan
            </Button>
          </Space>
        </div>
      </Modal>

      <style jsx>{`

      .square {
        position: relative;
        width: 100%;
      }

      .square:after {
        content: "";
        display: block;
        padding-bottom: 100%;
      }

      :global(.content) {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      :global(.signature-uploader .ant-upload.ant-upload-select-picture-card, .ant-upload-list-picture-card-container, .signature-uploader) {
        width: 200px;
        height: 200px;
      }
      :global(.signature-uploader .ant-upload-list-picture-card .ant-upload-list-item-thumbnail, .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img) {
        object-fit: cover;
      }

      @media only screen and (max-width: 320px) { 
        :global(.signature-uploader .ant-upload.ant-upload-select-picture-card, .ant-upload-list-picture-card-container, .signature-uploader) {
          width: 150px;
          height: 150px;
        }
      }

      `}</style>
    </>
  )
}

export default DoctorsContainer
