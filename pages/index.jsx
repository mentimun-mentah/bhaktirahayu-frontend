import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { Container, Media } from 'react-bootstrap'
import { LoadingOutlined, CheckOutlined } from '@ant-design/icons'
import { Row, Col, Steps, Button, Form, Upload, Image as AntImage } from 'antd'
import { DatePicker, message, Select, Radio, Input, Popover, Slider } from 'antd'

import { urltoFile } from 'lib/utility'
import { formImage } from 'formdata/image'
import { getCroppedImg } from 'lib/canvasUtils'
import { formRegister } from 'formdata/register'
import { formIdentityCard } from 'formdata/identityCard'
import { step_list, preparation_list, howToCrop } from 'data/home'
import { imagePreview, uploadButton, imageValidationNoHeader, getBase64 } from 'lib/imageUploader'

import _ from 'lodash'
import 'moment/locale/id'
import moment from 'moment'
import Image from 'next/image'
import isIn from 'validator/lib/isIn'
import ReactCropper from 'react-easy-crop'
import id_ID from "antd/lib/date-picker/locale/id_ID"

import axios from 'lib/axios'
import ErrorMessage from 'components/ErrorMessage'


moment.locale('id')
message.config({ duration: 3, maxCount: 1 });

const Loader = "/static/images/loader.gif";
const MIN_ROTATE = 0, MAX_ROTATE = 360, ZOOM_STEP = 0.00001, MIN_ZOOM = 1, MAX_ZOOM = 3

const ButtonAction = ({ onClick, title, type, disabled }) => (
  <Button block type={type} size="large" className="fs-14" onClick={onClick} disabled={disabled}>
    {title}
  </Button>
)

const Home = () => {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  const [isShowTips, setIsShowTips] = useState(false)
  const [imageList, setImageList] = useState(formImage)
  const [register, setRegister] = useState(formRegister)
  const [loadingImage, setLoadingImage] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [identityCard, setIdentityCard] = useState(formIdentityCard)

  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [crop, setCrop] = useState({ x: 0, y: 0 })

  const isMinZoom = zoom - ZOOM_STEP < MIN_ZOOM;
  const isMaxZoom = zoom + ZOOM_STEP > MAX_ZOOM;
  const isMinRotate = rotation <= MIN_ROTATE;
  const isMaxRotate = rotation >= MAX_ROTATE;

  const { file } = imageList
  const { kind } = identityCard
  const { nik, name, birth_place, birth_date, gender, address } = register

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const onNextStep = val => setStep(val)

  /* IMAGE CHANGE FUNCTION */
  const imageChangeHandler = async ({ fileList: newFileList }) => {
    setLoadingImage(true)

    const data = {
      ...imageList,
      file: { value: newFileList, isValid: true, message: null }
    }

    if(newFileList[0]?.originFileObj) {
      let imageDataUrl = await getBase64(newFileList[0]?.originFileObj)
      setImageSrc(imageDataUrl)
    }
    setLoadingImage(false)
    setImageList(data)
  };
  /* IMAGE CHANGE FUNCTION */

  const onSaveCroppedImage = useCallback(async () => {
    setLoadingImage(true)
    try {
      const imageUrl = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)
      const file = await urltoFile(imageUrl, 'identity-card.png','image/png')
      const imageFile = {
        size: file.size,
        type: file.type,
        name: file.name,
        status: 'done',
        uid: -Math.abs(Math.random()),
        lastModified: new Date().getTime(),
        lastModifiedDate: new Date(),
        originFileObj: file,
        thumbUrl: imageUrl,
      }

      const data = {
        ...imageList,
        file: { value: [imageFile], isvalid: true, message: null }
      }

      setZoom(1)
      setRotation(0)
      setImageList(data)
      setCrop({ x: 0, y: 0 })
      setTimeout(() => {
        setImageSrc(null)
        setLoadingImage(false)
      }, 200)
    } catch (e) {
      message.error('Terjadi kesalahan saat mengunggah foto!')
      setImageSrc(null)
      setLoadingImage(false)
    }

  }, [imageSrc, croppedAreaPixels, rotation, imageList])

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
      setImageList(formImage)
      setRegister(formRegister)
      message.success('Sukses mendaftar!')
    }, 2000)

    setTimeout(() => {
      setStep(0)
    }, 3000)
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

    axios.post('/users/identity-card-ocr', formData)
      .then(res => {
        setLoading(false)
        const state = _.cloneDeep(register)
        for (const [key, value] of Object.entries(res.data)) {
          if(state[key]) {
            state[key].value = value
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

        if(typeof errDetail === "string" && isIn("image", errDetail.split(" "))) {
          stateImage.file.isValid = false
          stateImage.file.message = errDetail
        }
        else {
          errDetail.map((data) => {
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
      <Container style={{ height: '100vh', maxHeight: '100vh' }}>
        <section className="h-100">
          <Row gutter={[16,16]} className="h-100">

            {imageSrc && file.value.length > 0 ? (
              <Col span={24} className="user-select-none">
                <div className="text-center px-lg-5 user-select-none mx-auto" style={{ width: '80vw' }}>
                  <h6 className="text-center font-weight-bold mb-4 mt-4">
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
                  <div className="crop-container">
                    <ReactCropper
                      crop={crop}
                      zoom={zoom}
                      aspect={3 / 2}
                      image={imageSrc}
                      rotation={rotation}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      zoomWithScroll={false}
                      onRotationChange={setRotation}
                      onCropComplete={onCropComplete}
                    />
                  </div>

                  <Row gutter={[20,20]} justify="center" className="mt-3">
                    <Col span={24}>
                      <div className="control-button">
                        <Button 
                          type="text"
                          disabled={isMinZoom}
                          onClick={() => setZoom(s => {
                            if(s - 0.01 <= MIN_ZOOM) return MIN_ZOOM
                            else return s - 0.01
                          })}
                        >
                          <i className="far fa-search-minus fs-16" />
                        </Button>
                        <Slider
                          value={zoom}
                          min={MIN_ZOOM}
                          max={MAX_ZOOM}
                          step={ZOOM_STEP}
                          className="w-100 mx-3"
                          tooltipVisible={false}
                          onChange={val => setZoom(val)}
                        />
                        <Button 
                          type="text"
                          disabled={isMaxZoom}
                          onClick={() => setZoom(s => {
                            if(s + 0.01 >= MAX_ZOOM) return MAX_ZOOM
                            else return s + 0.01
                          })}
                        >
                          <i className="far fa-search-plus fs-16" />
                        </Button>
                      </div>

                      <div className="control-button">
                        <Button 
                          type="text" 
                          disabled={isMinRotate}
                          onClick={() => setRotation(s => {
                            if(s - 1 <= MIN_ROTATE) return MIN_ROTATE
                            else return s - 1
                          })}
                        >
                          <i className="far fa-undo" />
                        </Button>
                        <Slider
                          min={MIN_ROTATE}
                          max={MAX_ROTATE}
                          step={ZOOM_STEP}
                          value={rotation}
                          className="w-100 mx-3"
                          tooltipVisible={false}
                          onChange={val => setRotation(val)}
                        />
                        <Button 
                          type="text" 
                          disabled={isMaxRotate}
                          onClick={() => setRotation(s => {
                            if(s + 1 >= MAX_ROTATE) return MAX_ROTATE
                            else return s + 1
                          })}
                        >
                          <i className="far fa-redo" />
                        </Button>
                      </div>
                    </Col>

                    <Col span={24}>
                      <Button
                        type="primary"
                        loading={loadingImage}
                        disabled={loadingImage || isShowTips}
                        onClick={isShowTips ? () => {} : onSaveCroppedImage}
                        icon={<CheckOutlined />}
                      >
                        Selesai
                      </Button>
                    </Col>

                  </Row>
                </div>
              </Col>
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
                                fileList={file.value}
                                beforeUpload={f => imageValidationNoHeader(f, "image", "/users/identity-card-ocr", "post", setLoadingImage)}
                              >
                                {file.value.length >= 1 ? null : uploadButton(loadingImage)}
                              </Upload>
                              <ErrorMessage item={file} className="text-center" />

                              {!kind.isValid && <br />}

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
                              <p className="text-muted text-center">
                                Upload foto {kind.value.toUpperCase()} kamu agar mempercepat registrasi, 
                                kamu juga bisa melewati proses ini dan mengisi identitasmu secara manual pada proses selanjutnya ✌
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
                                value={birth_date.value ? moment(birth_date.value) : ""}
                              />
                              <ErrorMessage item={birth_date} />
                            </Form.Item>

                            <Form.Item
                              label="Jenis Kelamin"
                              validateStatus={!gender.isValid && gender.message && "error"}
                            >
                              <Select 
                                value={gender.value}
                                placeholder="Jenis Kelamin"
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
                              <Select 
                                defaultValue="antigen" 
                                className="w-100 select-py-2"
                                placeholder="Jenis Pemeriksaan"
                              >
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

      :global(.select-py-2 .ant-select-selector, .select-py-2 .ant-select-selector .ant-select-selection-search-input) {
        height: 40px!important;
      }

      :global(.select-py-2.with-input .ant-select-selector .ant-select-selection-placeholder) {
        line-height: 38px;
      }

      .crop-container {
        position: relative;
        width: 100%;
        height: 50vh;
        background: #ffffff;
      }

      .control-button {
        display: flex;
        align-items: center;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
      }

      :global(.control-button button) {
        width: 46px;
      }

      `}</style>
    </>
  )
}

export default Home
