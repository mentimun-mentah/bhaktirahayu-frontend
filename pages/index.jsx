import { Container, Media } from 'react-bootstrap'
import { useState, useCallback, useRef } from 'react'
import { LoadingOutlined, CheckOutlined } from '@ant-design/icons'
import { Row, Col, Steps, Button, Form, Upload, Image as AntImage } from 'antd'
import { DatePicker, Spin, message, Select, Radio, Input, Popover } from 'antd'

import { useWindowSize } from 'lib/useWindowSize'
import { imagePreview, uploadButton } from 'lib/imageUploader'

import moment from 'moment'
import Cropper from 'react-perspective-cropper'

message.config({ duration: 3, maxCount: 1 });

const step_list = [
  { title: 'Persiapan', },
  { title: 'Foto KTP / KIS', },
  { title: 'Registrasi', }
]

const preparation_list = [
  { 
    image: '/static/images/ktp_4.png',
    title: 'Pastikan posisi ponsel tegak lurus / vertikal',
  },
  { 
    image: '/static/images/ktp_1.png',
    title: 'Pastikan KTP / KIS terbaca dengan jelas',
  },
  { 
    image: '/static/images/ktp_2.png',
    title: 'Pastikan KTP / KIS tidak buram, silau, dan gelap'
  },
  { 
    image: '/static/images/ktp_3.png',
    title: 'Pastikan KTP / KIS tidak terpotong'
  }
]

export const formImage = {
  file: { value: [], isValid: true, message: null },
};

const cardOptions = [
  { label: 'KTP', value: 'ktp' },
  { label: 'KIS', value: 'kis' },
]

const howToCrop = (
  <>
    <AntImage
      src="/static/images/how_to_crop.png"
      alt="how to crop"
    />
    <p className="mb-0">
      Pastikan kamu memberikan jarak antara garis dengan pinggiran kartu
    </p>
  </>
)

const Home = () => {
  const size = useWindowSize()

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState("ktp")
  const [isShowTips, setIsShowTips] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [imageList, setImageList] = useState(formImage)


  const cropperRef = useRef()
  const [cropState, setCropState] = useState()


  const onCropperDragStop = useCallback((s) => setCropState(s), [])
  const onCropperChange = useCallback((s) => setCropState(s), [])

  const { file } = imageList

  const doSomething = async () => {
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
      console.log('error', e)
    }
  }


  const onNextStep = val => setStep(val)

  /* IMAGE CHANGE FUNCTION */
  const imageChangeHandler = ({ fileList: newFileList }) => {
    const data = {
      ...imageList,
      file: { value: newFileList, isValid: true, message: null }
    }
    setImageList(data)
    setShowCropper(true)
  };
  /* IMAGE CHANGE FUNCTION */


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

  return (
    <>
      <Container className="py-5" style={{ height: '100vh', maxHeight: '100vh' }}>
        <section className="h-100">
          <Row gutter={[16,16]} className="h-100">

            {file.value[0]?.originFileObj && showCropper ? (
              <Col span={24}>
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
                    image={file.value[0]?.originFileObj}
                    ref={cropperRef}
                    onChange={onCropperChange}
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
                      onClick={isShowTips ? () => {} : doSomething}
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
                    <div className="w-100">
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
                              <Media as="li" className={`${i !== 2 && 'mb-2'}`} key={i}>
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
                            <Button size="large" type="primary" onClick={() => onNextStep(1)} block>Berikutnya</Button>
                          </Col>
                        </Row>
                      </>
                    )}

                    {step == 1 && (
                      <>
                        <div className="d-flex flex-column justify-content-center">
                          <div className="text-center">

                            <Upload
                              accept="image/*"
                              listType="picture-card"
                              className="ktp-kis-uploader text-center"
                              onPreview={imagePreview}
                              onChange={imageChangeHandler}
                              fileList={imageList.file.value}
                            >
                              {imageList.file.value.length >= 1 ? null : uploadButton(false)}
                            </Upload>

                            <br />

                            <Radio.Group
                              className="mt-3 mb-2"
                              options={cardOptions}
                              onChange={e => setSelected(e.target.value)}
                              value={selected}
                              optionType="button"
                            />

                            <h5 className="mb-1 mt-2">Sekarang foto {selected.toUpperCase()} kamu 👤 </h5>
                            <p className="text-muted text-left">
                              Kamu perlu mengupload foto {selected.toUpperCase()} terlebih dahulu, 
                              agar kami dapat memverifikasi identitasmu ✌
                            </p>

                          </div>
                        </div>

                        <Row gutter={[10,10]}>
                          <Col span={12}>
                            <Button size="large" type="text" className="fs-14" onClick={() => onNextStep(0)} block>Sebelumnya</Button>
                          </Col>
                          <Col span={12}>
                            <Button size="large" type="primary" className="fs-14" onClick={() => onNextStep(2)} block>Berikutnya</Button>
                          </Col>
                        </Row>
                      </>
                    )}

                    {step == 2 && (
                      <>
                        <div className="d-flex flex-column w-100">
                          <h5 className="mb-3">Cek dulu data KTP / KIS kamu yuk 👌</h5>

                          <Form layout="vertical" className="w-100">
                            <Form.Item label="NIK">
                              <Input 
                                name="nik"
                                className="py-2"
                                defaultValue="5175101060319920003"
                                placeholder="Nomor Induk Kependudukan"
                              />
                            </Form.Item>
                            <Form.Item label="Nama Lengkap">
                              <Input 
                                name="name"
                                className="py-2"
                                defaultValue="PAULUS BONATUA SIMANJUNTAK"
                                placeholder="Nama Lengkap"
                              />
                            </Form.Item>
                            <Form.Item label="Tanggal Lahir">
                              <DatePicker 
                                className="w-100 fs-14 py-2"
                                placeholder="Tanggal Lahir"
                                defaultValue={moment().subtract((999*9), 'days')}
                                format="DD-MM-YYYY"
                              />
                            </Form.Item>
                            <Form.Item label="Jenis Kelamin">
                              <Select defaultValue="laki-laki" className="w-100 select-py-2">
                                <Select.Option value="laki-laki">
                                  <span className="va-sub">Laki-laki</span>
                                </Select.Option>
                                <Select.Option value="perempuan">
                                  <span className="va-sub">Perempuan</span>
                                </Select.Option>
                              </Select>
                            </Form.Item>
                            <Form.Item label="Alamat">
                              <Input 
                                name="address"
                                className="py-2"
                                defaultValue="JALAN RAYA BYPASS, JIMBARAN CLIFF, NOMOR 3"
                                placeholder="Alamat"
                              />
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
                          </Form>
                        </div>

                        <Row gutter={[10,10]} className="mb-3">
                          <Col span={12}>
                            <Button 
                              block
                              size="large"
                              type="text"
                              className="fs-14"
                              onClick={() => onNextStep(1)} 
                            >
                              Sebelumnya
                            </Button>
                          </Col>
                          <Col span={12}>
                            <Button 
                              block
                              size="large"
                              type="primary"
                              className="fs-14"
                              onClick={onSubmitHandler}
                            >
                              {loading ? <LoadingOutlined /> : 'Daftar Sekarang'}
                            </Button>
                          </Col>
                        </Row>
                      </>
                    )}

                  </section>
                </Col>

                <Col xxl={12} xl={12} lg={10} md={0} sm={0} xs={0}>
                  <section className="d-flex flex-column h-100 text-center justify-content-center">
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

      {/*
      <Drawer
        height="100vh"
        placement="bottom"
        closable={false}
        getContainer={false}
        visible={file.value[0]?.originFileObj && showCropper}
      >
        <div className="cropper-container p-3">
          {!cropState?.loading && file.value[0]?.originFileObj && ( <h3 className="mt-3">Rapikan Foto</h3> )}
          {cropState?.loading && ( <Spin />)}
          <Cropper
            image={file.value[0]?.originFileObj}
            ref={cropperRef}
            onChange={onCropperChange}
            onDragStop={onCropperDragStop}
            maxWidth={size.width - 200}
            maxHeight={size.height - 200}
            lineColor="#00ff6f"
            pointBorder="5px solid #00ff6f"
            lineWidth={5}
          />

          {!cropState?.loading && file.value[0]?.originFileObj && (
            <Button type="primary" onClick={doSomething} icon={<CheckOutlined />} className="mt-3">
              Selesai
            </Button>
          )}
        </div>
      </Drawer>
      */}


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

      :global(.select-py-2 .ant-select-selector) {
        height: 40px!important;
      }

      `}</style>
    </>
  )
}

export default Home
