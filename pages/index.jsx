import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Container, Card } from 'react-bootstrap'
import { LoadingOutlined } from '@ant-design/icons'
import { message, Modal, Row, Col, Steps, Button, Image as AntImage, Radio } from 'antd'

import { formImage } from 'formdata/image'
import { formErrorMessage, errPhone } from 'lib/axios'
import { formIdentityCard } from 'formdata/identityCard'
import { DATE_FORMAT } from 'lib/disabledDate'
import { step_list, document_list, role_list } from 'data/home'
import { formRegister, formRegisterIsValid } from 'formdata/register'

import _ from 'lodash'
import 'moment/locale/id'
import moment from 'moment'
import isIn from 'validator/lib/isIn'

import axios from 'lib/axios'
import CropImageContainer from 'components/Home/CropImage'
import CardUploadContainer from 'components/Home/CardUpload'
import PreparationContainer from 'components/Home/Preparation'
import FormRegisterContainer from 'components/Home/FormRegister'

moment.locale('id')
message.config({ duration: 3, maxCount: 1 });

const ButtonAction = ({ onClick, title, type, disabled }) => (
  <Button block type={type} size="large" className="fs-14" onClick={onClick} disabled={disabled}>
    {title}
  </Button>
)

const DOCTOR = role_list[1].value
const PATIENT = role_list[0].value
const PASPOR = document_list[1].value

const Home = () => {
  const user = useSelector(state => state.auth.user)

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  const [imageList, setImageList] = useState(formImage)
  const [register, setRegister] = useState(formRegister)
  const [loadingImage, setLoadingImage] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [identityCard, setIdentityCard] = useState(formIdentityCard)
  const [userRole, setUserRole] = useState(role_list[0].value)

  const { file } = imageList
  const { kind } = identityCard
  const { nik, name, birth_place, birth_date, gender, address, phone, checking_type, institution_id, location_service_id, type_identity } = register

  const onNextStep = val => setStep(val)
  const LAST_STEP = step === (step_list.length - 1)

  const onSubmitHandler = e => {
    e.preventDefault()
    let isPaspor = false
    if(type_identity?.value?.toLowerCase() === PASPOR) isPaspor = true
    else isPaspor = false

    if(formRegisterIsValid(register, setRegister, isPaspor)) {
      setLoading(true)

      const data = {
        nik: nik?.value.toUpperCase(),
        name: name?.value.toUpperCase(),
        birth_place: birth_place?.value.toUpperCase(),
        birth_date: birth_date?.value,
        gender: gender?.value,
        address: address?.value.toUpperCase(),
        phone: phone?.value,
        checking_type: checking_type?.value,
        institution_id: institution_id?.value,
        type_identity: type_identity?.value?.toLowerCase(),
      }
      if(location_service_id && location_service_id?.value && location_service_id?.value.length > 0) {
        data['location_service_id'] = location_service_id?.value
      }

      axios.post('/clients/create', data)
        .then(res => {
          setStep(0)
          setLoading(false)
          setImageSrc(null)
          setImageList(formImage)
          setRegister(formRegister)
          setCroppedAreaPixels(null)
          setIdentityCard(formIdentityCard)
          formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
        })
        .catch(err => {
          setLoading(false)
          const state = _.cloneDeep(register)
          const errDetail = err.response?.data.detail
          if(typeof errDetail === "string" && isIn(errDetail, errPhone)) {
            state['phone'].value = state['phone'].value
            state['phone'].isValid = false
            state['phone'].message = errDetail
          }
          else if(typeof errDetail === "string" && !isIn(errDetail, errPhone)) {
            Modal.error({ content: errDetail, centered: true })
          }
          else {
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if(key === "type_identity") {
                state['nik'].isValid = false
                state['nik'].message = data.msg
              }
              else if(state[key]) {
                state[key].isValid = false
                state[key].message = data.msg
              }
            });
          }
          setRegister(state)
        })
    }
  }

  const onUploadPhotoHandler = e => {
    e.preventDefault()

    if(file.value.length <= 0) {
      setStep(type_identity?.value?.toLowerCase() === PASPOR ? 4 : 4)
      return
    }
    setLoading(true)

    const formData = new FormData()
    formData.append("kind", kind.value)
    _.forEach(file.value, f => {
      if(!f.hasOwnProperty('url')){
        formData.append('image', f.originFileObj)
      }
    })

    axios.post('/clients/identity-card-ocr', formData)
      .then(res => {
        setLoading(false)
        const state = _.cloneDeep(register)
        for (const [key, value] of Object.entries(res.data)) {
          if(state[key]) {
            state[key].value = value
            state[key].isValid = true
            state[key].message = null
          }
          if(key === "birth_date" && value) {
            state[key].value = moment(value).format(DATE_FORMAT)
            state[key].isValid = true
            state[key].message = null
          }
        }
        setRegister(state)
        setStep(4)
      })
      .catch(err => {
        setLoading(false)
        const state = _.cloneDeep(identityCard)
        const stateImage = _.cloneDeep(imageList)
        const errDetail = err.response?.data.detail

        if(typeof errDetail === "string" && isIn("image", errDetail.split(" "))) {
          stateImage.file.isValid = false
          stateImage.file.message = errDetail
        }
        else if(typeof errDetail === "string" && !isIn("image", errDetail.split(" "))) {
          stateImage.file.isValid = false
          stateImage.file.message = errDetail
        }
        else {
          errDetail?.map((data) => {
            const key = data.loc[data.loc.length - 1];
            if(state[key]){
              state[key].value = state[key].value
              state[key].isValid = false
              state[key].message = data.msg
            }
            if(key === "image"){
              stateImage.file.value = stateImage.file.value
              stateImage.file.isValid = false
              stateImage.file.message = data.msg
            }
          })
        }

        setIdentityCard(state)
        setImageList(stateImage)
      })
  }

  /* REGISTER CHANGE FUNCTION */
  const onChangeHandler = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;

    const data = {
      ...register,
      [name]: { ...register[name], value: value, isValid: true, message: null }
    }
    setRegister(data)
  }
  /* REGISTER CHANGE FUNCTION */

  return (
    <>
      <Container className="container-height">
        <section className="h-100">
          <Row gutter={[16,16]} className="h-100">

            {imageSrc && file.value.length > 0 ? (
              <>
                <CropImageContainer 
                  imageSrc={imageSrc}
                  setImageSrc={setImageSrc}
                  imageList={imageList}
                  setImageList={setImageList}
                  loadingImage={loadingImage}
                  setLoadingImage={setLoadingImage}
                  croppedAreaPixels={croppedAreaPixels}
                  setCroppedAreaPixels={setCroppedAreaPixels}
                />
              </>
            ) : (
              <>
                <Col xxl={12} xl={12} lg={14} md={24} sm={24} xs={24} className="py-5">

                  <section className="d-flex flex-column justify-content-between h-100 px-lg-5">
                    <div className="w-100 user-select-none">
                      <h6 className="text-center font-weight-bold mb-4">{step_list[step].title}</h6>
                      <Steps size="small" current={step} className="w-100 check-item-step mb-2">
                        {[...Array(step_list.length)].map((_,i) => (
                          <Steps.Step 
                            key={i} 
                            icon={i === (step_list.length - 1) ?
                              <AntImage 
                                preview={false} 
                                width={24} height={24} 
                                src={`/static/images/fireworks${step === (step_list.length - 1) ? '-green' : ''}.svg`} 
                              /> : false
                            } 
                          />
                        ))}
                      </Steps>
                    </div>

                    <br />

                    {step == 0 && (
                      <>
                        <div className="d-flex flex-column justify-content-center">
                          <h5 className="mb-4">Kamu disini sebagai apa ?</h5>
                          <Radio.Group 
                            value={userRole} 
                            onChange={e => setUserRole(e?.target?.value)} 
                          >
                            {role_list.map((data) => (
                              <motion.div
                                key={data.value} 
                                whileHover={{ boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)' }}
                                whileTap={{ scale: 0.97, y: 0 }}
                                className="card card-checkup-type mb-3"
                              >
                                <Card.Body className="p-2 pl-3 user-select-none">
                                  <Radio value={data.value} key={data.value} className="radio-checkup-list"> 
                                    <Row align="middle">
                                      <Col span={18}>{data.title}</Col>
                                      <Col span={6}>
                                        <div className="float-right">
                                          <AntImage
                                            width={50}
                                            height={50}
                                            preview={false}
                                            src={data.image}
                                            alt="chekcup-list"
                                          />
                                        </div>
                                      </Col>
                                    </Row>
                                  </Radio>
                                </Card.Body>
                              </motion.div>
                            ))}
                          </Radio.Group>
                        </div>

                        <br />
                        <Row gutter={[10,10]}>
                          <Col span={24}>
                            {userRole === DOCTOR && (
                              <a href="/login">
                                <ButtonAction type="primary" title="Berikutnya" />
                              </a>
                            )}
                            {userRole === PATIENT && (
                              <ButtonAction 
                                type="primary" 
                                title="Berikutnya"
                                onClick={() => onNextStep(1)}
                              />
                            )}
                          </Col>
                        </Row>
                      </>
                    )}

                    {step == 1 && (
                      <>
                        <PreparationContainer />
                        <br />
                        <Row gutter={[10,10]} className="mb-3">
                          <Col span={12}>
                            <ButtonAction 
                              type="text" 
                              title="Sebelumnya"
                              disabled={loading}
                              onClick={() => onNextStep(0)}
                            />
                          </Col>
                          <Col span={12}>
                            <ButtonAction 
                              type="primary"
                              title="Berikutnya"
                              disabled={loading}
                              onClick={() => onNextStep(2)}
                            />
                          </Col>
                        </Row>
                      </>
                    )}

                    {step == 2 && (
                      <>
                        <div className="d-flex flex-column justify-content-center">
                          <h5 className="mb-4">Pilih Jenis Dokumen</h5>
                          <Radio.Group 
                            name="type_identity"
                            value={type_identity.value?.toLowerCase()}
                            onChange={onChangeHandler} 
                          >
                            {document_list.map((data) => (
                              <motion.div
                                key={data.value} 
                                whileHover={{ boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)' }}
                                whileTap={{ scale: 0.97, y: 0 }}
                                className="card card-checkup-type mb-3"
                              >
                                <Card.Body className="p-2 pl-3 user-select-none">
                                  <Radio value={data.value} key={data.value} className="radio-checkup-list"> 
                                    <Row align="middle">
                                      <Col span={18}>{data.title}</Col>
                                      <Col span={6}>
                                        <div className="float-right">
                                          <AntImage
                                            width={50}
                                            height={50}
                                            preview={false}
                                            src={data.image}
                                            alt="chekcup-list"
                                          />
                                        </div>
                                      </Col>
                                    </Row>
                                  </Radio>
                                </Card.Body>
                              </motion.div>
                            ))}
                          </Radio.Group>
                        </div>

                        <br />
                        <Row gutter={[10,10]}>
                          <Col span={12}>
                            <ButtonAction 
                              type="text" 
                              title="Sebelumnya"
                              disabled={loading}
                              onClick={() => onNextStep(1)}
                            />
                          </Col>
                          <Col span={12}>
                            <ButtonAction 
                              type="primary"
                              title="Berikutnya"
                              disabled={loading}
                              onClick={() => onNextStep(type_identity?.value?.toLowerCase() === PASPOR ? 4 : 3)}
                            />
                          </Col>
                        </Row>
                      </>
                    )}

                    {step == 3 && (
                      <>
                        <div className="d-flex flex-column justify-content-center">
                          <CardUploadContainer 
                            loading={loading}
                            imageList={imageList}
                            setImageList={setImageList}
                            setImageSrc={setImageSrc}
                            identityCard={identityCard}
                            setIdentityCard={setIdentityCard}
                          />
                        </div>

                        <br />
                        <Row gutter={[10,10]}>
                          <Col span={12}>
                            <ButtonAction 
                              type="text" 
                              title="Sebelumnya"
                              disabled={loading}
                              onClick={() => onNextStep(2)}
                            />
                          </Col>
                          <Col span={12}>
                            <ButtonAction 
                              type="primary"
                              title="Berikutnya"
                              disabled={loading}
                              onClick={onUploadPhotoHandler}
                            />
                          </Col>
                        </Row>
                      </>
                    )}

                    {LAST_STEP && (
                      <>
                        <div className="d-flex flex-column w-100">
                          <h5 className="mb-3">Cek dulu data KTP / KIS / Paspor kamu yuk 👌</h5>
                          <FormRegisterContainer 
                            register={register}
                            setRegister={setRegister}
                          />
                        </div>

                        <br />
                        <Row gutter={[10,10]} className="mb-3">
                          <Col span={12}>
                            <ButtonAction 
                              type="text" 
                              title="Sebelumnya"
                              disabled={loading}
                              onClick={() => onNextStep(type_identity?.value?.toLowerCase() === PASPOR ? 2 : 3)}
                            />
                          </Col>
                          <Col span={12}>
                            <ButtonAction 
                              type="primary"
                              disabled={loading}
                              onClick={onSubmitHandler}
                              title={loading ? <LoadingOutlined /> : 'Daftar Sekarang'}
                            />
                          </Col>
                        </Row>
                      </>
                    )}

                  </section>
                </Col>

                <Col xxl={12} xl={12} lg={10} md={0} sm={0} xs={0} className="py-5">
                  <section className="d-flex flex-column h-100 text-center justify-content-center user-select-none">
                    <AntImage
                      preview={false}
                      alt="RSU Bhakti Rahayu"
                      className="text-center px-3"
                      src="/static/images/write2.gif"
                    />
                  </section>
                </Col>
              </>
            )}

          </Row>
        </section>
      </Container>

      <style jsx>{`
      :global(.check-item-step .ant-steps-item-icon .ant-steps-finish-icon) {
        vertical-align: 0;
      }
      :global(.ktp-kis-uploader .ant-upload.ant-upload-select-picture-card, .ant-upload-list-picture-card-container, .ktp-kis-uploader) {
        width: 323px;
        height: 204px;
      }
      :global(.ktp-kis-uploader .ant-upload-list-picture-card .ant-upload-list-item-thumbnail, .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img) {
        object-fit: cover;
      }

      :global(.container-height) {
        height: 100vh;
        max-height: 100vh;
      }

      :global(.radio-checkup-list, .radio-checkup-list > span:last-child) {
        width: 100%!important;
      }

      @media only screen and (max-device-width: 667px) and (-webkit-device-pixel-ratio: 2) {
        :global(.container-height) {
          height: 100%;
        }
        :global(.my-5-ip) {
          margin-top: 6rem!important;
          margin-bottom: 6rem!important;
        }
      }
      `}</style>
    </>
  )
}

export default Home
