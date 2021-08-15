import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { LoadingOutlined } from '@ant-design/icons'
import { message, Modal, Row, Col, Steps, Button, Image as AntImage } from 'antd'

import { createLogs } from 'lib/logsCreator'
import { formImage } from 'formdata/image'
import { formErrorMessage, errPhone } from 'lib/axios'
import { formIdentityCard } from 'formdata/identityCard'
import { DATE_FORMAT } from 'lib/disabledDate'
import { step_list } from 'data/home'
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

const Home = () => {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  const [imageList, setImageList] = useState(formImage)
  const [register, setRegister] = useState(formRegister)
  const [loadingImage, setLoadingImage] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [identityCard, setIdentityCard] = useState(formIdentityCard)

  const { file } = imageList
  const { kind } = identityCard
  const { nik, name, birth_place, birth_date, gender, address, phone, checking_type, institution_id } = register

  const onNextStep = val => setStep(val)

  const onSubmitHandler = e => {
    e.preventDefault()
    if(formRegisterIsValid(register, setRegister)) {
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
        institution_id: institution_id?.value
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
              if(state[key]) {
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
      setStep(2)
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

    createLogs({ req: 'onUploadPhotoHandler()', image: { size: file?.value[0]?.originFileObj?.size, name: file?.value[0]?.originFileObj?.name}, kind: kind.value })
    axios.post('/clients/identity-card-ocr', formData)
      .then(res => {
        console.log("CARD OCR => ", res.data)
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
        setStep(2)
      })
      .catch(err => {
        setLoading(false)
        const state = _.cloneDeep(identityCard)
        const stateImage = _.cloneDeep(imageList)
        const errDetail = err.response?.data.detail
        console.log(err.response)

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
                        <Steps.Step />
                        <Steps.Step />
                        <Steps.Step 
                          icon={
                            <AntImage 
                              preview={false} 
                              width={24} height={24} 
                              src={`/static/images/fireworks${step == 2 ? '-green' : ''}.svg`} 
                            />
                          } 
                        />
                      </Steps>
                    </div>

                    <br />

                    {step == 0 && (
                      <>
                        <PreparationContainer />
                        <br />
                        <Row gutter={[10,10]} className="mb-3">
                          <Col span={24}>
                            <ButtonAction 
                              type="primary" 
                              title="Berikutnya"
                              onClick={() => onNextStep(1)}
                            />
                          </Col>
                        </Row>
                      </>
                    )}

                    {step == 1 && (
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
                              onClick={() => onNextStep(0)}
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

                    {step == 2 && (
                      <>
                        <div className="d-flex flex-column w-100">
                          <h5 className="mb-3">Cek dulu data KTP / KIS kamu yuk 👌</h5>
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
                              onClick={() => onNextStep(1)} 
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
                      src="/static/images/write2.svg"
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
