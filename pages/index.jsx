import { motion } from 'framer-motion'
import { Container, Media } from 'react-bootstrap'
import { useState, useCallback, useRef } from 'react'
import { LoadingOutlined, CheckOutlined } from '@ant-design/icons'
import { Row, Col, Steps, Button, Form, Upload, Image as AntImage } from 'antd'
import { DatePicker, Spin, message, Select, Radio, Input, Popover, Modal } from 'antd'

import { deepCopy } from 'lib/utility'
import { formImage } from 'formdata/image'
import { formRegister } from 'formdata/register'
import { useWindowSize } from 'lib/useWindowSize'
import { formIdentityCard } from 'formdata/identityCard'
import { imagePreview, uploadButton } from 'lib/imageUploader'
import { step_list, preparation_list, howToCrop } from 'data/home'

import _ from 'lodash'
import 'moment/locale/id'
import moment from 'moment'
import Image from 'next/image'
import id_ID from "antd/lib/date-picker/locale/id_ID"

import axios from 'lib/axios'
import Cropper from 'react-perspective-cropper'
import ErrorMessage from 'components/ErrorMessage'
import LoginContainer from 'components/Auth/Login'

moment.locale('id')
message.config({ duration: 3, maxCount: 1 });

const Loader = "/static/images/loader.gif";

const ButtonAction = ({ onClick, title, type, disabled }) => (
  <Button block type={type} size="large" className="fs-14" onClick={onClick} disabled={disabled}>
    {title}
  </Button>
)

const Home = () => {
  const cropperRef = useRef()
  const size = useWindowSize()

  const [step, setStep] = useState(0)
  const [cropState, setCropState] = useState()
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isShowTips, setIsShowTips] = useState(false)
  const [imageList, setImageList] = useState(formImage)
  const [showCropper, setShowCropper] = useState(false)
  const [register, setRegister] = useState(formRegister)
  const [identityCard, setIdentityCard] = useState(formIdentityCard)


  const onCropperDragStop = useCallback((s) => setCropState(s), [])
  const onCropperChange = useCallback((s) => setCropState(s), [])

  const { file } = imageList
  const { kind } = identityCard
  const { nik, name, birth_place, birth_date, gender, address } = register

  const onCropSaveHandler = async () => {
    try {
      const res = await cropperRef.current.done({ preview: true })
      setShowCropper(false)
      const file = new File([res], res.name, { type: res.type, lastModified: new Date().getTime() })
      const dataImage = {
        size: res.size,
        type: res.type,
        name: res.name,
        uid: -Math.abs(Math.random()),
        lastModified: new Date().getTime(),
        originFileObj: file
      }
      const data = {
        ...imageList,
        file: { value: [dataImage], isValid: true, message: null }
      }
      setImageList(data)
    } catch (e) {
      message.error('Terjadi kesalahan saat mengunggah foto!')
    }
  }


  const onNextStep = val => setStep(val)

  /* IMAGE CHANGE FUNCTION */
  const imageChangeHandler = ({ fileList: newFileList, file }) => {
    if(file.status === "done") {
      setTimeout(() => {
        setShowCropper(true)
      }, 200)
    }
    const data = {
      ...imageList,
      file: { value: newFileList, isValid: true, message: null }
    }
    setImageList(data)
  };
  /* IMAGE CHANGE FUNCTION */

  /* CARD KIND CHANGE FUNCTION */
  const identityCardChangeHandler = e => {
    const value = e.target.value
    const data = {
      ...identityCard,
      kind: { ...identityCard.kind, value: value, isValid: true, message: null }
    }
    setIdentityCard(data)
  }
  /* CARD KIND CHANGE FUNCTION */

  /* REGISTER CHANGE FUNCTION */
  const onChangeHandler = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;
    if(item){
      const data = {
        ...register,
        [item]: { ...register[item], value: e, isValid: true, message: null }
      }
      setRegister(data)
    }
    else {
      const data = {
        ...register,
        [name]: { ...register[name], value: value, isValid: true, message: null }
      }
      setRegister(data)
    }
  }
  /* REGISTER CHANGE FUNCTION */



  const onSubmitHandler = e => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      message.success('Sukses mendaftar!')
    }, 2000)

    setTimeout(() => {
      setStep(0)
    }, 3000)
  }

  const onUploadPhotoHandler = e => {
    e.preventDefault()
    setLoading(true)


    const formData = new FormData()
    formData.append("kind", kind.value)
    _.forEach(imageList.file.value, file => {
      if(!file.hasOwnProperty('url')){
        formData.append('image', file.originFileObj)
      }
    })


    axios.post('/users/identity-card-ocr', formData)
      .then(res => {
        setLoading(false)
        const state = deepCopy(register)
        for (const [key, value] of Object.entries(res.data)) {
          if(state[key]) {
            state[key].value = value
            state[key].isValid = true
            state[key].message = null
          }
        }
        setRegister(state)
        // const resData = {
        //   ...register,
        //   no_card: { value: res.data?.no_card, isValid: true, message: null },
        //   nik: { value: nik, isValid: true, message: null },
        //   name: { value: name, isValid: true, message: null },
        //   birth_place: { value: birth_place, isValid: true, message: null },
        //   birth_date: { value: birth_date, isValid: true, message: null },
        //   gender: { value: gender, isValid: true, message: null },
        //   address: { value: address, isValid: true, message: null },
        // }
        // setRegister(resData)
        setStep(2)
      })
      .catch(err => {
        console.log(err.response)
      })
      setStep(2)

    // setTimeout(() => {
    //   setLoading(false)
    // }, 2000)

    // setTimeout(() => {
    //   setStep(2)
    // }, 3000)
  }

  return (
    <>
      <Container className="py-5" style={{ height: '100vh', maxHeight: '100vh' }}>
        <section className="h-100">
          <Row gutter={[16,16]} className="h-100">

            {file.value[0]?.originFileObj && showCropper ? (
              <Col span={24} className="user-select-none">
                {cropState?.loading && ( 
                  <div className="cropper-container cropper-loading">
                    <Spin />
                  </div>
                )}
                <div className="cropper-container">
                  {!cropState?.loading && file.value[0]?.originFileObj && ( 
                    <h6 className="text-center font-weight-bold mb-4">
                      Rapikan Foto 
                      <Popover 
                        title="Tips" 
                        trigger="click"
                        placement="bottom" 
                        content={howToCrop}
                        onVisibleChange={val => {
                          setTimeout(() => {
                            setIsShowTips(val)
                          }, 500)
                        }}
                      >
                        <i className="far fa-info-circle text-muted hover-pointer ml-1" />
                      </Popover>
                    </h6> 
                  )}
                  <Cropper
                    ref={cropperRef}
                    openCvPath="/static/opencv/opencv.js"
                    onChange={onCropperChange}
                    image={file.value[0]?.originFileObj}
                    onDragStop={onCropperDragStop}
                    maxWidth={size.width - 200}
                    maxHeight={size.height - 200}
                    lineColor="#00ff6f"
                    pointBorder="5px solid #00ff6f"
                    lineWidth={5}
                  />

                  {!cropState?.loading && file.value[0]?.originFileObj && (
                    <Button 
                      type="primary"
                      className="mt-3"
                      onClick={isShowTips ? () => {} : onCropSaveHandler}
                      disabled={isShowTips}
                      icon={<CheckOutlined />}
                    >
                      Selesai
                    </Button>
                  )}
                </div>
              </Col>
            ) : (
              <>
                <Col xxl={12} xl={12} lg={14} md={24} sm={24} xs={24}>

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

                    {step == 0 && (
                      <>
                        <div className="d-flex justify-content-center flex-column w-100">
                          <h5 className="mb-3">Persiapan dulu yuk 👌 </h5>

                          <ul className="list-unstyled">
                            {preparation_list.map((data, i) => (
                              <Media as="li" className={`${i !== (data.length - 1) && 'mb-2'} user-select-none`} key={i}>
                                <div className="mr-3">
                                  <AntImage
                                    width={90}
                                    height={90}
                                    src={data.image}
                                    alt="preparation"
                                  />
                                </div>
                                <Media.Body>
                                  <h6 className="mb-0 mt-3 text-muted font-weight-normal">{data.title}</h6>
                                </Media.Body>
                              </Media>
                            ))}
                          </ul>
                        </div>

                        <Row gutter={[10,10]} className="mb-3">
                          <Col span={24}>
                            <ButtonAction 
                              type="primary" 
                              title="Berikutnya"
                              onClick={() => onNextStep(1)}
                            />
                          </Col>
                          <Col span={24}>
                            <ButtonAction 
                              title="Masuk"
                              onClick={() => setIsLogin(true)}
                            />
                          </Col>
                        </Row>
                      </>
                    )}

                    {step == 1 && (
                      <>
                        <div className="d-flex flex-column justify-content-center">

                          {loading ? (
                            <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              <Image width={100} height={100} src={Loader} alt="loader" />
                              <div className="fs-14 m-b-10">Sedang mengekstrak data...</div>
                            </motion.div>
                          ) : (
                            <div className="text-center">
                              <Upload
                                accept="image/*"
                                listType="picture-card"
                                className="ktp-kis-uploader text-center user-select-none"
                                onPreview={imagePreview}
                                onChange={imageChangeHandler}
                                fileList={imageList.file.value}
                              >
                                {imageList.file.value.length >= 1 ? null : uploadButton(false)}
                              </Upload>

                              <br />

                              <Form layout="vertical">
                                <Form.Item 
                                  className="mb-2"
                                  validateStatus={!kind.isValid && kind.message && "error"}
                                >
                                  <Radio.Group
                                    optionType="button"
                                    className="mt-3 user-select-none"
                                    value={kind.value}
                                    onChange={identityCardChangeHandler}
                                  >
                                    <Radio.Button value="ktp">KTP</Radio.Button>
                                    <Radio.Button value="kis">KIS</Radio.Button>
                                  </Radio.Group>
                                  <ErrorMessage item={kind} className="text-center" />
                                </Form.Item>
                              </Form>

                              <h5 className="mb-1 mt-2">Sekarang foto {kind.value.toUpperCase()} kamu 👤 </h5>
                              <p className="text-muted text-left">
                                Kamu perlu mengupload foto {kind.value.toUpperCase()} terlebih dahulu, 
                                agar kami dapat memverifikasi identitasmu ✌
                              </p>
                            </div>
                          )}

                        </div>

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

                          <Form layout="vertical" className="w-100">
                            <Form.Item 
                              label="NIK"
                              validateStatus={!nik.isValid && nik.message && "error"}
                            >
                              <Input 
                                name="nik"
                                className="py-2"
                                value={nik.value}
                                onChange={onChangeHandler}
                                placeholder="Nomor Induk Kependudukan"
                              />
                              <ErrorMessage item={nik} />
                            </Form.Item>

                            <Form.Item
                              label="Nama Lengkap"
                              validateStatus={!name.isValid && name.message && "error"}
                            >
                              <Input 
                                name="name"
                                className="py-2"
                                value={name.value}
                                onChange={onChangeHandler}
                                placeholder="Nama Lengkap"
                              />
                              <ErrorMessage item={name} />
                            </Form.Item>
                            
                            <Form.Item
                              label="Tempat Lahir"
                              validateStatus={!birth_place.isValid && birth_place.message && "error"}
                            >
                              <Input 
                                name="birth_place"
                                className="py-2"
                                value={birth_place.value}
                                onChange={onChangeHandler}
                                placeholder="Tempat Lahir"
                              />
                              <ErrorMessage item={birth_place} />
                            </Form.Item>

                            <Form.Item 
                              label="Tanggal Lahir"
                              validateStatus={!birth_date.isValid && birth_date.message && "error"}
                            >
                              <DatePicker 
                                inputReadOnly
                                locale={id_ID}
                                format="DD MMMM YYYY"
                                className="w-100 fs-14 py-2"
                                placeholder="Tanggal Lahir"
                                value={moment(birth_date.value ? birth_date.value : new Date(), 'DD-MM-YYYY')}
                              />
                              <ErrorMessage item={birth_date} />
                            </Form.Item>

                            <Form.Item
                              label="Jenis Kelamin"
                              validateStatus={!gender.isValid && gender.message && "error"}
                            >
                              <Select 
                                value={gender.value}
                                className="w-100 select-py-2"
                                onChange={e => onChangeHandler(e, "gender")}
                              >
                                <Select.Option value="LAKI-LAKI">
                                  <span className="va-sub">LAKI-LAKI</span>
                                </Select.Option>
                                <Select.Option value="PEREMPUAN">
                                  <span className="va-sub">PEREMPUAN</span>
                                </Select.Option>
                              </Select>
                              <ErrorMessage item={gender} />
                            </Form.Item>

                            <Form.Item
                              label="Alamat"
                              validateStatus={!address.isValid && address.message && "error"}
                            >
                              <Input 
                                name="address"
                                className="py-2"
                                value={address.value}
                                onChange={onChangeHandler}
                                placeholder="Alamat"
                              />
                              <ErrorMessage item={address} />
                            </Form.Item>

                            <Form.Item label="Jenis Pemeriksaan">
                              <Select defaultValue="antigen" className="w-100 select-py-2">
                                <Select.Option value="antigen">
                                  <span className="va-sub">Antigen</span>
                                </Select.Option>
                                <Select.Option value="genose">
                                  <span className="va-sub">Genose</span>
                                </Select.Option>
                              </Select>
                            </Form.Item>

                            <Form.Item label="Pilih Instansi">
                              <Select 
                                showSearch 
                                defaultValue={[]}
                                className="w-100 select-py-2 with-input"
                                placeholder="Pilih Instansi"
                              >
                                <Select.Option value="Bhakti Rahayu Denpasar">
                                  <span className="va-sub">Bhakti Rahayu Denpasar</span>
                                </Select.Option>
                                <Select.Option value="Bhakti Rahayu Tabanan">
                                  <span className="va-sub">Bhakti Rahayu Tabanan</span>
                                </Select.Option>
                                <Select.Option value="Bhaksena Bypass Ngurah Rai">
                                  <span className="va-sub">Bhaksena Bypass Ngurah Rai</span>
                                </Select.Option>
                                <Select.Option value="Bhaksena Pelabuhan Gilimanuk">
                                  <span className="va-sub">Bhaksena Pelabuhan Gilimanuk</span>
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Form>
                        </div>

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
                              title={loading ? <LoadingOutlined /> : 'Daftar Sekarang'}
                              disabled={loading}
                              onClick={onSubmitHandler}
                            />
                          </Col>
                        </Row>
                      </>
                    )}

                  </section>
                </Col>

                <Col xxl={12} xl={12} lg={10} md={0} sm={0} xs={0}>
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


      <Modal
        centered
        title=" "
        zIndex="1030"
        footer={null}
        visible={isLogin}
        maskClosable={false}
        className="modal-login"
        onOk={() => setIsLogin(false)}
        onCancel={() => setIsLogin(false)}
        closeIcon={<i className="fas fa-times" />}
      >
        <LoginContainer />
      </Modal>

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

      :global(.cropper-container) {
        justify-content: space-between;
        align-items: center;
        display: flex;
        flex-direction: column;
        flex: 1;
        height: calc(100vh - 48px - 32px - 130px);
      }
      :global(.cropper-container.cropper-loading) {
        justify-content: center;
      }

      :global(.select-py-2 .ant-select-selector, .select-py-2 .ant-select-selector .ant-select-selection-search-input) {
        height: 40px!important;
      }

      :global(.select-py-2.with-input .ant-select-selector .ant-select-selection-placeholder) {
        line-height: 38px;
      }

      /* LOGIN & REGISTER */
      :global(.modal-login > .ant-modal-content, .modal-login
          > .ant-modal-content
          > .ant-modal-header) {
        border-radius: 10px;
        border: unset;
      }

      `}</style>
    </>
  )
}

export default Home
