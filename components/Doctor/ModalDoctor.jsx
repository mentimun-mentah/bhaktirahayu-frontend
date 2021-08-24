import { motion } from 'framer-motion'
import { EditOutlined } from '@ant-design/icons'
import { useState, useRef, useEffect, memo } from 'react'
import { Form, Input, Row, Col, Upload, Button, Modal, Space, message, Tabs } from 'antd'

import { urltoFile } from 'lib/utility'
import { formImage, formImageIsValid } from 'formdata/image'
import { formDoctor, formDoctorIsValid } from 'formdata/doctor'
import { imagePreview, uploadButton, imageValidation, fixRotationOfFile } from 'lib/imageUploader'
import { jsonHeaderHandler, formHeaderHandler, formErrorMessage, errEmail, signature_exp } from 'lib/axios'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'
import SignatureCanvas from 'react-signature-canvas'

import axios from 'lib/axios'
import ErrorMessage from 'components/ErrorMessage'

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

const SignatureComponent = ({ file, loading, setLoading, imagePreview, imageChangeHandler, onRemoveImageHandler, setShowModalSignature, config }) => (
  <>
    <Form.Item 
      label="Tanda tangan" 
      className="mb-0"
    >
      {(file.value[0]?.status === "done" && file.value.length >= 1) || file.value[0]?.url ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ".2" }}
        >
          <Upload
            accept="image/jpeg,image/png"
            listType="picture-card"
            className={`${!file.isValid && file.message ? 'ant-image-error' : ''} signature-uploader`}
            disabled={loading}
            onPreview={imagePreview}
            onChange={imageChangeHandler}
            onRemove={onRemoveImageHandler}
            fileList={file.value}
            showUploadList={{
              showDownloadIcon: file.value[0]?.sigCanvas ? true : false,
              showRemoveIcon: true,
              downloadIcon: <EditOutlined 
                              title="Edit file"
                              className="text-white wh-inherit" 
                              onClick={() => setShowModalSignature(true)} 
                            />
            }}
            beforeUpload={(f) => imageValidation(f, "image", config.url, config.method, setLoading, () => {}, "")}
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
          <Row gutter={[20,20]} className="row-signature-upload" align="middle">
            <Col span="auto">
              <Button 
                type="dashed"
                className="wh-170"
                disabled={loading}
                onClick={() => setShowModalSignature(true)}
                danger={!file.isValid && file.message && true}
                style={{ color: 'rgba(0, 0, 0, 0.65)', backgroundColor: '#fafafa' }}
              >
                <div>
                  <i className="far fa-signature" />
                  <p className="mb-0">Buat tanda tangan</p>
                </div>
              </Button>
            </Col>
            <Col span="auto" className="text-muted user-select-none text-center">
              <div className="w-170">
                atau
              </div>
            </Col>
            <Col span="auto">
              <Upload
                accept="image/jpeg,image/png"
                listType="picture-card"
                className={`${!file.isValid && file.message ? 'ant-image-error' : ''} signature-uploader`}
                disabled={loading}
                onPreview={imagePreview}
                onChange={imageChangeHandler}
                onRemove={onRemoveImageHandler}
                fileList={file.value}
                beforeUpload={(f) => imageValidation(f, "image", config.url, config.method, setLoading, () => {}, "")}
              >
                {file.value.length >= 1 ? null : uploadButton(loading)}
              </Upload>
            </Col>
          </Row>
          <ErrorMessage item={file} />
        </motion.div>
      )}
    </Form.Item>
  </>
)

const ModalDoctor = ({ title, visible, onCloseHandler, isUpdate, setIsUpdate, dataDoctor, imageDoctor, getDoctor }) => {
  const sigCanvas = useRef()

  const [loading, setLoading] = useState(false)
  const [doctor, setDoctor] = useState(formDoctor)
  const [activeTab, setActiveTab] = useState("profile")
  const [imageList, setImageList] = useState(formImage)
  const [showModalSignature, setShowModalSignature] = useState(false)

  const { file } = imageList
  const { username, email } = doctor

  let config = {
    url: '/users/create-doctor',
    method: 'post'
  }
  if(isUpdate) {
    const { id } = doctor
    config = {
      url: `/users/update-doctor/${id.value}`,
      method: 'put'
    }
  }

  /* IMAGE CHANGE FUNCTION */
  const imageChangeHandler = async ({ fileList: newFileList }) => {
    if(newFileList.length > 0) {
      const imageWithRotation = await fixRotationOfFile(newFileList[0]?.originFileObj)
      const dataNewFileList = {
        ...newFileList[0],
        status: "done",
        originFileObj: imageWithRotation,
      }

      const data = {
        ...imageList,
        file: { value: [dataNewFileList], isValid: true, message: null }
      }

      setImageList(data)
    }
    else {
      setImageList(formImage)
    }
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

  const onCloseModalSignatureHandler = () => {
    onRemoveImageHandler()
    setShowModalSignature(false)
  }

  const onCloseModalHandler = e => {
    e?.preventDefault()
    onCloseHandler()
    setDoctor(formDoctor)
    setActiveTab("profile")
    setImageList(formImage)
    sigCanvas.current?.clear()
  }

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
      thumbUrl: dataUrl,
      sigCanvas: true
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

  const onSubmitHandler = e => {
    e.preventDefault()
    if( formDoctorIsValid(doctor, setDoctor) && formImageIsValid(imageList, setImageList)) {
      setLoading(true)
      const formData = new FormData()
      formData.append("username", "dr. " + username.value)
      formData.append("email", email.value)
      _.forEach(file.value, f => {
        if(!f.hasOwnProperty('url')){
          formData.append('image', f.originFileObj)
        }
      })

      axios[config.method](config.url, formData, formHeaderHandler())
        .then(res => {
          getDoctor()
          formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
          setLoading(false)
          onCloseModalHandler()
        })
        .catch(err => {
          setLoading(false)

          const state = _.cloneDeep(doctor)
          const stateImage = _.cloneDeep(imageList)
          const errDetail = err.response?.data.detail

          if(errDetail === signature_exp) {
            getDoctor()
            onCloseModalHandler()
            formErrorMessage(err.response.status === 404 ? 'error' : 'success', isUpdate ? "Successfully update the doctor." : "Successfully add a new doctor.")
            if(isUpdate) setIsUpdate(false)
          }
          else if(typeof errDetail === "string" && isIn(errDetail, errEmail)) {
            state.email.value = state.email.value
            state.email.isValid = false
            state.email.message = errDetail
          }
          else if(typeof(errDetail) === "string" && !isIn(errDetail, errEmail)) {
            formErrorMessage("error", errDetail)
          }
          else {
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if(state[key]) {
                state[key].isValid = false
                state[key].message = data.msg
              }
              else if(key === "image") {
                stateImage.file.isValid = false
                stateImage.file.message = data.msg
              }
            });
          }
          setDoctor(state)
          setImageList(stateImage)
        })
    }
  }

  const onResetPasswordHandler = e => {
    e.preventDefault()
    const { id } = doctor
    axios.put(`/users/reset-password-doctor/${id.value}`, null, jsonHeaderHandler())
      .then(res => {
        getDoctor()
        formErrorMessage('success', res.data?.detail)
        setLoading(false)
        onCloseModalHandler()
      })
      .catch(err => {
        setLoading(false)
        const errDetail = err.response?.data.detail
        if(errDetail == signature_exp){
          getDoctor()
          onCloseModalHandler()
          formErrorMessage('success', "Successfully reset the password of the doctor.")
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })
  }

  useEffect(() => {
    if(isUpdate) {
      setDoctor(dataDoctor)
      setImageList(imageDoctor)
    }
  }, [isUpdate])

  let modalProps = {}
  if(activeTab === "password") {
    modalProps = { footer: false }
  } else {
    modalProps = {}
  }

  return (
    <>
      <Modal 
        {...modalProps}
        centered
        title={title}
        visible={visible}
        onOk={onSubmitHandler}
        onCancel={onCloseModalHandler}
        okButtonProps={{ disabled: loading, loading: loading }}
        okText="Simpan"
        cancelText="Batal"
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
                  config={config}
                  loading={loading}
                  setLoading={setLoading}
                  imagePreview={imagePreview}
                  imageChangeHandler={imageChangeHandler}
                  onRemoveImageHandler={onRemoveImageHandler}
                  setShowModalSignature={setShowModalSignature}
                />
              </Form>

              <h2 className="fs-14 bold m-b-0 mt-3">Note:</h2>
              <ul className="mb-0" style={{ paddingInlineStart: '25px' }}>
                <li>Ukuran file: maks. 5MB</li>
                <li>Ukuran gambar: 500 × 500 px</li>
              </ul>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Reset Password" key="password">
              <Form layout="vertical">
                <div className="text-center mb-2">
                  <Button
                    loading={loading}
                    disabled={loading}
                    onClick={onResetPasswordHandler}
                  >
                    Reset Password
                  </Button>
                </div>

                <h2 className="fs-14 bold m-b-0">Note:</h2>
                <ul className="mb-0" style={{ paddingInlineStart: '25px' }}>
                  <li>Password lama akan di ubah menjadi <mark>bhaktirahayu</mark></li>
                  <li>Silahkan beritahu dokter yang bersangkutan untuk login menggunakan password 
                      <mark>bhaktirahayu</mark> dan mengubah passwordnya pada halaman profile
                  </li>
                </ul>
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
            <SignatureComponent 
              file={file}
              config={config}
              loading={loading}
              setLoading={setLoading}
              imagePreview={imagePreview}
              imageChangeHandler={imageChangeHandler}
              onRemoveImageHandler={onRemoveImageHandler}
              setShowModalSignature={setShowModalSignature}
            />
            <h2 className="fs-14 bold m-b-0 mt-3">Note:</h2>
            <ul className="mb-0" style={{ paddingInlineStart: '25px' }}>
              <li>Ukuran file: maks. 5MB</li>
              <li>Ukuran gambar: 500 × 500 px</li>
              <li>Password default adalah <mark>bhaktirahayu</mark></li>
              <li>Silahkan beritahu dokter yang bersangkutan untuk login menggunakan password <mark>bhaktirahayu</mark> dan mengubah passwordnya pada halaman profile
              </li>
            </ul>
          </Form>
        )}
      </Modal>


      <Modal 
        centered
        title={<span className="user-select-none">Tanda Tangan</span>}
        visible={showModalSignature}
        onCancel={onCloseModalSignatureHandler}
        footer={false}
        closeIcon={<i className="far fa-times" />}
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
            <Button onClick={() => sigCanvas.current.clear()}>
              Hapus
            </Button>
            <Button type="primary" onClick={onSaveSignatureHandler}>
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
        z-index: 9999;
      }

      :global(.wh-inherit) {
        width: inherit;
        height: inherit;
      }

      :global(.signature-uploader .ant-upload.ant-upload-select-picture-card, .ant-upload-list-picture-card-container, .signature-uploader) {
        width: 170px;
        height: 170px;
      }
      :global(.signature-uploader .ant-upload-list-picture-card .ant-upload-list-item-thumbnail, .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img) {
        object-fit: cover;
      }

      @media only screen and (max-width: 320px) { 
        :global(.signature-uploader .ant-upload.ant-upload-select-picture-card, .ant-upload-list-picture-card-container, .signature-uploader) {
          width: 150px;
          height: 150px;
        }
        :global(.wh-170) {
          width: 150px!important;
          height: 150px!important;
        }
        :global(.w-170) {
          width: 150px!important;
        }
      }

      :global(.wh-170) {
        width: 170px;
        height: 170px;
      }


      :global(.row-signature-upload) {
        flex-flow: row wrap;
        align-items: center;
      }
      @media only screen and (max-width: 472px) { 
        :global(.row-signature-upload) {
          flex-flow: column;
          align-items: start;
        }
        :global(.w-170) {
          width: 170px;
        }
      }

      `}</style>

    </>
  )
}

export default memo(ModalDoctor)
