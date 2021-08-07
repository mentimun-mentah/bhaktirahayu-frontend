import { Upload, Slider, Button, Row, Col, message } from 'antd'
import { useState, useCallback } from 'react'

import { urltoFile } from 'lib/utility'
import { formImage } from 'formdata/image'
import { getCroppedImg } from 'lib/canvasUtils'
import { imagePreview, uploadButton, getBase64 } from 'lib/imageUploader'

import Cropper from 'react-easy-crop'

const MIN_ROTATE = 0, MAX_ROTATE = 360, ZOOM_STEP = 0.00001, MIN_ZOOM = 1, MAX_ZOOM = 3

const RotateContainer = () => {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [imageList, setImageList] = useState(formImage)
  const [loadingImage, setLoadingImage] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const isMinZoom = zoom - ZOOM_STEP < MIN_ZOOM;
  const isMaxZoom = zoom + ZOOM_STEP > MAX_ZOOM;
  const isMinRotate = rotation <= MIN_ROTATE;
  const isMaxRotate = rotation >= MAX_ROTATE;

  const { file } = imageList

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

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

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
      message.error('Terjadi kesalahan saat menyimpan foto!')
      setImageSrc(null)
      setLoadingImage(false)
    }

  }, [imageSrc, croppedAreaPixels, rotation, imageList])

  return (
    <>
      {imageSrc && file.value.length > 0 ? (
        <div className="text-center mt-5 px-lg-5 user-select-none mx-auto" style={{ width: '80vw' }}>
          <div className="crop-container">
            <Cropper
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

          <p>Zoom: {zoom}</p>
          <p>Rotate: {rotation}</p>

          <Row gutter={[20,20]} justify="center" className="mt-3">
            <Col span={16}>
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
                disabled={loadingImage}
                onClick={onSaveCroppedImage}
              >
                Selesai
              </Button>
            </Col>

          </Row>
        </div>
      ) : (
        <>
          <div className="text-center mt-5">
            <Upload
              accept="image/*"
              listType="picture-card"
              className="ktp-kis-uploader text-center user-select-none"
              onPreview={imagePreview}
              onChange={imageChangeHandler}
              fileList={file.value}
              // beforeUpload={f => imageValidationNoHeader(f, "image", "/users/identity-card-ocr", "post", setLoadingImage)}
            >
              {file.value.length >= 1 ? null : uploadButton(loadingImage)}
            </Upload>
          </div>
        </>
      )}

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

export default RotateContainer
