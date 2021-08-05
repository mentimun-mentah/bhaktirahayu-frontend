import { Card } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { withAuth } from 'lib/withAuth'
import { useState, useRef } from 'react'
import { SearchOutlined, EditOutlined } from '@ant-design/icons'
import { Form, Input, Row, Col, Upload, Button, Modal, Space, message, Tabs } from 'antd'

import { urltoFile } from 'lib/utility'
import { formImage, formImageIsValid } from 'formdata/image'
import { formDoctor, formDoctorIsValid } from 'formdata/doctor'
import { imagePreview, uploadButton } from 'lib/imageUploader'

import _ from 'lodash'
import SignatureCanvas from 'react-signature-canvas'

import ErrorMessage from 'components/ErrorMessage'

const ProfileContainer = () => {
  const sigCanvas = useRef()

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [doctor, setDoctor] = useState(formDoctor)
  const [showModal, setShowModal] = useState(false)
  const [imageList, setImageList] = useState(formImage)
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

  const onSubmitHandler = e => {
    e.preventDefault()
  }

  return (
    <>
      <Row gutter={[20,20]}>
        <Col xxl={12} xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card className="border-0 shadow-1 h-100">
            <Card.Header className="bg-transparent border-bottom">
              <Card.Title className="mb-0">Akun Saya</Card.Title>
              <small className="text-muted">
                Kelola informasi profil Anda untuk mengontrol dan melindungi akun anda
              </small>
            </Card.Header>

            <Card.Body>

              <Form layout="vertical">

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

                <Form.Item 
                  label="Tanda tangan" 
                  className="mb-3"
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

                <Form.Item className="m-b-0">
                  <Button 
                    // size="large"
                    type="primary" 
                    className="p-l-30 p-r-30" 
                    // disabled={loading}
                    // onClick={onSubmitHandler}
                  >
                    Simpan
                  </Button>
                </Form.Item>

              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col xxl={12} xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card className="border-0 shadow-1 h-100">
            <Card.Header className="bg-transparent border-bottom">
              <Card.Title className="mb-0">Atur Kata Sandi</Card.Title>
              <small className="text-muted">
                Untuk keamanan akun, mohon untuk tidak menyebarkan password Anda ke orang lain.
              </small>
            </Card.Header>

            <Card.Body>
              <Form layout="vertical">

                <Form.Item label="Password Lama" className="mb-3">
                  <Input.Password placeholder="Password Lama" />
                </Form.Item>

                <Form.Item label="Password Baru" className="mb-3">
                  <Input.Password placeholder="Password Baru" />
                </Form.Item>

                <Form.Item label="Konfirmasi Password" className="mb-3">
                  <Input.Password placeholder="Konfirmasi Password" />
                </Form.Item>

                <Form.Item className="m-b-0">
                  <Button 
                    // size="large"
                    type="primary" 
                    className="p-l-30 p-r-30" 
                    // disabled={loading}
                    // onClick={onSubmitHandler}
                  >
                    Simpan
                  </Button>
                </Form.Item>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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

      `}</style>
    </>
  )
}

export default withAuth(ProfileContainer)
