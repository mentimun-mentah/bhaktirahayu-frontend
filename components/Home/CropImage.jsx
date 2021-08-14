import { CheckOutlined } from '@ant-design/icons'
import { memo, useState, useCallback } from 'react'
import { Row, Col, Button, message, Popover, Slider } from 'antd'

import { howToCrop } from 'data/home'
import { urltoFile } from 'lib/utility'
import { getCroppedImg } from 'lib/canvasUtils'

import ReactCropper from 'react-easy-crop'

const MIN_ROTATE = 0, MAX_ROTATE = 360, ZOOM_STEP = 0.00001, MIN_ZOOM = 1, MAX_ZOOM = 3

const CropImageComponent = ({ 
  imageSrc, setImageSrc, imageList, setImageList, croppedAreaPixels, setCroppedAreaPixels, loadingImage, setLoadingImage 
}) => {

  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [isShowTips, setIsShowTips] = useState(false)

  const isMinZoom = zoom - ZOOM_STEP < MIN_ZOOM;
  const isMaxZoom = zoom + ZOOM_STEP > MAX_ZOOM;
  const isMinRotate = rotation <= MIN_ROTATE;
  const isMaxRotate = rotation >= MAX_ROTATE;

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
      message.error('Terjadi kesalahan saat mengunggah foto!')
      setImageSrc(null)
      setLoadingImage(false)
    }

  }, [imageSrc, croppedAreaPixels, rotation, imageList])

  return (
    <>
      <Col span={24} className="user-select-none">
        <div className="text-center px-lg-5 user-select-none mx-auto">
          <h6 className="text-center font-weight-bold mb-4 mt-4">
            Rapikan Foto 
            <Popover 
              title="Tips" 
              trigger="click"
              placement="bottom" 
              content={howToCrop}
              onVisibleChange={val => {
                setTimeout(() => { setIsShowTips(val) }, 500)
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

      <style jsx>{`
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

export default memo(CropImageComponent)
