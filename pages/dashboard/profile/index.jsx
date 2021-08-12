import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Row, Col, Button, Modal, Space, message } from 'antd'

import { urltoFile } from 'lib/utility'
import { formImage, formImageIsValid } from 'formdata/image'
import { formDoctor, formDoctorIsValid } from 'formdata/doctor'
import { imagePreview } from 'lib/imageUploader'
import { formConfigPassword, formConfigPasswordIsValid } from 'formdata/password'
import { jsonHeaderHandler, formHeaderHandler, formErrorMessage, errEmail, signature_exp } from 'lib/axios'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'
import SignatureCanvas from 'react-signature-canvas'

import axios from 'lib/axios'
import * as actions from 'store/actions'
import ErrorMessage from 'components/ErrorMessage'
import ModalPassword from 'components/Profile/ModalPassword'
import SignatureComponent from 'components/Profile/Signature'

const ProfileContainer = () => {
  const dispatch = useDispatch()
  const sigCanvas = useRef()
  const user = useSelector(state => state.auth.user)
  const isAdmin = user?.role === "admin"

  const [loading, setLoading] = useState(false)
  const [doctor, setDoctor] = useState(formDoctor)
  const [imageList, setImageList] = useState(formImage)
  const [showModalSignature, setShowModalSignature] = useState(false)
  const [formPassword, setFormPassword] = useState(formConfigPassword)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { file } = imageList
  const { username, email } = doctor
  const { password, old_password, confirm_password } = formPassword

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
  const onChangeHandler = (e, state, setState) => {
    const name = e.target.name
    const value = e.target.value

    const data = {
      ...state,
      [name]: { ...state[name], value: value, isValid: true, message: null }
    }

    setState(data)
  }
  /* INPUT CHANGE FUNCTION */

  const onCloseModalSignatureHandler = () => {
    onRemoveImageHandler()
    setShowModalSignature(false)
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

  const onCloseModalHandler = () => {
    setShowConfirmPassword(false)
  }

  const onSubmitHandler = () => {
    setLoading(true)

    let name = "dr. " + username.value
    if(isAdmin) name = username.value

    const formData = new FormData()
    formData.append("username", name)
    formData.append("email", email.value)

    if(!isAdmin) {
      _.forEach(file.value, f => {
        if(!f.hasOwnProperty('url')){
          formData.append('image', f.originFileObj)
        }
      })
    }

    axios.put('/users/update-account', formData, formHeaderHandler())
      .then(res => {
        setLoading(false)
        dispatch(actions.getUser())
        formErrorMessage('success', res.data?.detail)
      })
      .catch(err => {
        setLoading(false)

        const state = _.cloneDeep(doctor)
        const stateImage = _.cloneDeep(imageList)
        const errDetail = err.response?.data.detail

        if(errDetail === signature_exp) {
          dispatch(actions.getUser())
          formErrorMessage("success", "Success updated your account.")
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

  const onSubmitProfileHandler = e => {
    e?.preventDefault()
    if(isAdmin) {
      if(formDoctorIsValid(doctor, setDoctor)) {
        onSubmitHandler()
      }
    } 
    else {
      if(formDoctorIsValid(doctor, setDoctor) && formImageIsValid(imageList, setImageList, "Pastikan value tidak kosong")) {
        onSubmitHandler()
      }
    }
  }

  const onSubmitPasswordHandler = e => {
    e?.preventDefault()
    if(formConfigPasswordIsValid(formPassword, setFormPassword)) {
      const data = {
        old_password: old_password.value,
        password: password.value,
        confirm_password: confirm_password.value
      }

      setLoading(true)
      axios.put('/users/update-password', data, jsonHeaderHandler())
        .then(res => {
          setLoading(false)
          setFormPassword(formConfigPassword)
          formErrorMessage('success', res.data?.detail)
        })
        .catch(err => {
          setLoading(false)
          const state = _.cloneDeep(formPassword)
          const errDetail = err.response?.data.detail

          const freshRequired = "Fresh token required"
          if (typeof errDetail === "string" && errDetail === freshRequired) {
            setShowConfirmPassword(true)
          }
          else if (typeof errDetail === "string" && errDetail) {
            state.old_password.value = state.old_password.value
            state.old_password.isValid = false
            state.old_password.message = errDetail
          }
          else {
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1]
              if (state[key]) {
                state[key].value = state[key].value
                state[key].isValid = false
                state[key].message = data.msg
              }
            });
          }
          setFormPassword(state)
        })
    }
  }

  useEffect(() => {
    if(user){
      const realName = user.username.split(" ")
      realName.shift()

      const dataDoctor = {
        ...doctor,
        username: { value: isAdmin ? user.username : realName.join(" "), isValid: true, message: null },
        email: { value: user.email, isValid: true, message: null },
      };
      setDoctor(dataDoctor)

      const imageData = {
        file: { 
          value: [{
            uid: -Math.abs(Math.random()),
            url: `${process.env.NEXT_PUBLIC_API_URL}/static/signature/${user.signature}`
          }], 
          isValid: true, message: null 
        },
      }
      setImageList(imageData)
    }
  }, [user])

  return (
    <>
      <Row gutter={[20,20]}>
        <Col span={24}>
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
                    addonBefore={isAdmin ? false : 'dr.'}
                    value={username.value}
                    onChange={e => onChangeHandler(e, doctor, setDoctor)}
                    placeholder="Nama" 
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
                    onChange={e => onChangeHandler(e, doctor, setDoctor)}
                    placeholder="Email" 
                  />
                  <ErrorMessage item={email} />
                </Form.Item>
                
                {!isAdmin && (
                  <SignatureComponent 
                    file={file}
                    loading={loading}
                    setLoading={setLoading}
                    imagePreview={imagePreview}
                    imageChangeHandler={imageChangeHandler}
                    onRemoveImageHandler={onRemoveImageHandler}
                    setShowModalSignature={setShowModalSignature}
                  />
                )}

                <Form.Item className="m-b-0">
                  <Button 
                    type="primary" 
                    loading={loading}
                    disabled={loading}
                    className="p-l-30 p-r-30" 
                    onClick={onSubmitProfileHandler}
                  >
                    Simpan
                  </Button>
                </Form.Item>

              </Form>
            </Card.Body>
          </Card>
        </Col>


        <Col span={24}>
          <Card className="border-0 shadow-1 h-100">
            <Card.Header className="bg-transparent border-bottom">
              <Card.Title className="mb-0">Atur Kata Sandi</Card.Title>
              <small className="text-muted">
                Untuk keamanan akun, mohon untuk tidak menyebarkan password Anda ke orang lain.
              </small>
            </Card.Header>

            <Card.Body>
              <Form layout="vertical">

                <Form.Item 
                  className="mb-3"
                  label="Password Lama" 
                  validateStatus={!old_password.isValid && old_password.message && "error"}
                >
                  <Input.Password 
                    name="old_password"
                    value={old_password.value}
                    placeholder="Password Lama" 
                    onChange={e => onChangeHandler(e, formPassword, setFormPassword)}
                  />
                  <ErrorMessage item={old_password} />
                </Form.Item>

                <Form.Item 
                  className="mb-3"
                  label="Password Baru" 
                  validateStatus={!password.isValid && password.message && "error"}
                >
                  <Input.Password 
                    name="password"
                    value={password.value}
                    placeholder="Password Baru" 
                    onChange={e => onChangeHandler(e, formPassword, setFormPassword)}
                  />
                  <ErrorMessage item={password} />
                </Form.Item>

                <Form.Item 
                  className="mb-3"
                  label="Konfirmasi Password" 
                  validateStatus={!confirm_password.isValid && confirm_password.message && "error"}
                >
                  <Input.Password 
                    name="confirm_password"
                    value={confirm_password.value}
                    placeholder="Konfirmasi Password" 
                    onChange={e => onChangeHandler(e, formPassword, setFormPassword)}
                  />
                  <ErrorMessage item={confirm_password} />
                </Form.Item>

                <Form.Item className="m-b-0">
                  <Button 
                    type="primary" 
                    loading={loading}
                    disabled={loading}
                    className="p-l-30 p-r-30" 
                    onClick={onSubmitPasswordHandler}
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

      <ModalPassword 
        visible={showConfirmPassword}
        onCloseHandler={onCloseModalHandler}
        onSubmitPasswordHandler={onSubmitPasswordHandler}
      />

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
      `}</style>
    </>
  )
}

export default withAuth(ProfileContainer)
