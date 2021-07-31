import { Card } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { SearchOutlined, EditOutlined } from '@ant-design/icons'
import { Form, Input, Row, Col, Upload, Button, Modal, Space, message, Tabs, Typography } from 'antd'

import { urltoFile } from 'lib/utility'
import { formImage, formImageIsValid } from 'formdata/image'
import { formDoctor, formDoctorIsValid } from 'formdata/doctor'
import { imagePreview, uploadButton } from 'lib/imageUploader'
import { columns_doctor, data_doctor } from 'data/tableDoctor'

import _ from 'lodash'
import SignatureCanvas from 'react-signature-canvas'

import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import ErrorMessage from 'components/ErrorMessage'

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

const addTitle = "Tambah Dokter"
const editTitle = "Edit Dokter"

const NameEmailComponent = ({ username, email, onChangeHandler }) => (
  <>
    <Form.Item 
      label="Nama" 
      className="mb-3"
      validateStatus={!username.isValid && username.message && "error"}
    >
      <Input 
        name="username"
        addonBefore="dr."
        value={username.value}
        onChange={onChangeHandler}
        placeholder="Nama dokter" 
      />
      <ErrorMessage item={username} />
    </Form.Item>

    <Form.Item 
      label="Email"
      className="mb-3"
      validateStatus={!email.isValid && email.message && "error"}
    >
      <Input 
        name="email"
        type="email"
        value={email.value}
        onChange={onChangeHandler}
        placeholder="Email dokter" 
      />
      <ErrorMessage item={email} />
    </Form.Item>
  </>
)

const PasswordComponent = ({ isUpdate, old_password, password, confirm_password, onChangeHandler }) => (
  <>
    {isUpdate && (
      <Form.Item 
        label="Password Lama" 
        className="mb-3"
        validateStatus={!old_password.isValid && old_password.message && "error"}
      >
        <Input.Password 
          name="old_password"
          value={old_password.value}
          onChange={onChangeHandler}
          placeholder="Password lama" 
        />
        <ErrorMessage item={old_password} />
      </Form.Item>
    )}

    <Form.Item 
      label="Password" 
      className="mb-3"
      validateStatus={!password.isValid && password.message && "error"}
    >
      <Input.Password 
        name="password"
        value={password.value}
        onChange={onChangeHandler}
        placeholder="Password dokter" 
      />
      <ErrorMessage item={password} />
    </Form.Item>

    <Form.Item 
      label="Konfirmasi Password" 
      className="mb-3"
      validateStatus={!confirm_password.isValid && confirm_password.message && "error"}
    >
      <Input.Password 
        name="confirm_password"
        value={confirm_password.value}
        onChange={onChangeHandler}
        placeholder="Konfirmasi password" 
      />
      <ErrorMessage item={confirm_password} />
    </Form.Item>
  </>
)

const SignatureComponent = ({ file, loading, imagePreview, imageChangeHandler, onRemoveImageHandler, setShowModalSignature }) => (
  <>
    <Form.Item 
      label="Tanda tangan" 
      className="mb-0"
    >
      {file.value.length >= 1 ? (
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
            fileList={file.value}
            showUploadList={{
              showDownloadIcon: true,
              showRemoveIcon: true,
              downloadIcon: <EditOutlined 
                              title="Edit file"
                              className="text-white wh-inherit" 
                              onClick={() => setShowModalSignature(true)} 
                            />
            }}
            // beforeUpload={(f) => imageValidation(f, "image", "/plants/create", "post", setLoading, () => {}, "")}
          >
            {file.value.length >= 1 ? null : uploadButton(loading)}
          </Upload>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ".2" }}
        >
          <Button 
            type="dashed"
            className="h-auto"
            onClick={() => setShowModalSignature(true)}
            danger={!file.isValid && file.message && true}
          >
            <div>
              <i className="far fa-signature" />
              <p className="mb-0">Buat tanda tangan</p>
            </div>
          </Button>
          <ErrorMessage item={file} />
        </motion.div>
      )}
    </Form.Item>
  </>
)

const DoctorsContainer = () => {
  const sigCanvas = useRef()

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [doctor, setDoctor] = useState(formDoctor)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [imageList, setImageList] = useState(formImage)
  const [modalTitle, setModalTitle] = useState(addTitle)
  const [showModalSignature, setShowModalSignature] = useState(false)

  const { file } = imageList
  const { username, email, password, old_password, confirm_password } = doctor

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
    if(
      formDoctorIsValid(doctor, setDoctor, isUpdate) && 
      formImageIsValid(imageList, setImageList, "Pastikan value tidak kosong")
    ) {
      setLoading(true)
      const formData = new FormData()
      formData.append("username", "dr. " + username.value)
      formData.append("email", email.value)
      formData.append("password", password.value)
      formData.append("confirm_password", confirm_password.value)

      if(isUpdate) formData.append("old_password", old_password.value)

      _.forEach(file.value, f => {
        if(!f.hasOwnProperty('url')){
          formData.append('image', f.originFileObj)
        }
      })

      console.log(...formData)
    }
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
          setIsUpdate(true)
          setShowModal(true)
          setModalTitle(editTitle)
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
      status: 'done',
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
    sigCanvas.current?.clear()
  }

  const onCloseModalHandler = e => {
    e.preventDefault()
    setShowModal(false)
    setDoctor(formDoctor)
    setImageList(formImage)
    sigCanvas.current?.clear()
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
                  setIsUpdate(false)
                  setShowModal(true)
                  setModalTitle(addTitle)
                }}
              >
                <i className="far fa-plus mr-1" />Dokter
              </Button>
            </Col>
          </Row>
          <hr />

          <Form layout="vertical" className="mb-3">
            <Form.Item className="mb-0">
              <Input placeholder="Cari dokter" prefix={<SearchOutlined />} />
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
        onCancel={onCloseModalHandler}
        footer={activeTab === "password" ? null : (
          <Space>
            <Button onClick={onCloseModalHandler}>Batal</Button>
            <Button onClick={onSubmitHandler} type="primary">Simpan</Button>
          </Space>
        )}
        closeIcon={<i className="far fa-times" />}
      >
        {isUpdate ? (
          <Tabs activeKey={activeTab} type="card" onChange={e => setActiveTab(e)}>
            <Tabs.TabPane tab="Profile" key="profile">
              <Form layout="vertical">
                <NameEmailComponent
                  email={email}
                  username={username}
                  onChangeHandler={onChangeHandler}
                />

                <SignatureComponent 
                  file={file}
                  loading={loading}
                  imagePreview={imagePreview}
                  imageChangeHandler={imageChangeHandler}
                  onRemoveImageHandler={onRemoveImageHandler}
                  setShowModalSignature={setShowModalSignature}
                />
              </Form>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Password" key="password">
              <Form layout="vertical">
                <div className="text-center">
                  <Card className="card-token mb-3">
                    <Typography.Paragraph className="m-b-0 text-danger force-select overflow-wrap-anywhere user-select-all">
                      fd62fad84bbb75d2ba6a9d40ecc9568f571670371eab8efc9412ce40ce5c014awlemjlk5zgb27qel5v4jqc81bueel7ghxf6rb5gpy1hebs5iuvsq6l6kgskv6gy4ndtjjfu6d26dy0minbfnh6uvrssjdlt23uey1xgwii9z7iki05bf93igv26iz1ygz5fctns4l7yzgbpynq59ibcwxt7i026ii4yteceu47yq542
                    </Typography.Paragraph>
                  </Card>

                  <Button>Generate Password</Button>
                </div>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        ) : (
          <Form layout="vertical">
            <NameEmailComponent
              email={email}
              username={username}
              onChangeHandler={onChangeHandler}
            />
            <PasswordComponent 
              isUpdate={isUpdate}
              password={password}
              old_password={old_password}
              confirm_password={confirm_password}
            />
            <SignatureComponent 
              file={file}
              loading={loading}
              imagePreview={imagePreview}
              imageChangeHandler={imageChangeHandler}
              onRemoveImageHandler={onRemoveImageHandler}
              setShowModalSignature={setShowModalSignature}
            />
          </Form>
        )}

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

      :global(.wh-inherit) {
        width: inherit;
        height: inherit;
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

      :global(.card-token) {
        margin: 0 auto;
        width: fit-content;
        border-radius: .5rem;
        background-color: var(--light);
      }
      :global(.card-token .ant-card-body) {
        padding: 5px 10px;
      }
      :global(.overflow-wrap-anywhere) {
        overflow-wrap: anywhere;
      }

      `}</style>
    </>
  )
}

export default DoctorsContainer
