import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { Form, Upload, Radio } from 'antd'

import Image from 'next/image'

import { document_list } from 'data/home'
import { formImage } from 'formdata/image'
import { imagePreview, uploadButton, imageValidationNoHeader, getBase64, fixRotationOfFile } from 'lib/imageUploader'

import ErrorMessage from 'components/ErrorMessage'

const Loader = '/static/images/loader.gif'

const PASPOR = document_list[1].value

const CardUploadContainer = ({ loading, imageList, setImageList, setImageSrc, identityCard, setIdentityCard }) => {
  const [loadingImage, setLoadingImage] = useState(false)

  const { file } = imageList
  const { kind } = identityCard

  /* IMAGE CHANGE FUNCTION */
  const imageChangeHandler = async ({ fileList: newFileList }) => {
    if(newFileList.length > 0) {
      setLoadingImage(true)

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

      if(imageWithRotation) {
        let imageDataUrl = await getBase64(imageWithRotation)
        setImageSrc(imageDataUrl)
      }
      setLoadingImage(false)
      setImageList(data)
    }
    else {
      setImageSrc(null)
      setImageList(formImage)
    }
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

  return (
    <>
      {loading ? (
        <motion.div className="text-center my-5-ip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Image width={100} height={100} src={Loader} alt="loader" />
          <div className="fs-14 m-b-10">Sedang mengekstrak data...</div>
        </motion.div>
      ) : (
        <div className="text-center">
          <Upload
            disabled={kind.value === PASPOR}
            accept="image/jpeg,image/png"
            listType="picture-card"
            className="ktp-kis-uploader text-center user-select-none"
            fileList={file.value}
            onPreview={imagePreview}
            onChange={imageChangeHandler}
            beforeUpload={f => imageValidationNoHeader(f, "image", "/clients/identity-card-ocr", "post", setLoadingImage)}
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

          {kind.value === PASPOR ? (
            <>
              <h5 className="mb-1 mt-2">Sekarang klik berikutnya ya 👌 </h5>
              <p className="text-muted text-center">
                Agar kamu bisa mengisi identitasmu secara manual pada proses selanjutnya ✌
              </p>
            </>
          ) : (
            <>
              <h5 className="mb-1 mt-2">Sekarang foto {kind.value.toUpperCase()} kamu 👤 </h5>
              <p className="text-muted text-center">
                Upload foto {kind.value.toUpperCase()} kamu agar mempercepat registrasi, 
                kamu juga bisa melewati proses ini dan mengisi identitasmu secara manual pada proses selanjutnya ✌
              </p>
            </>
          )}
        </div>
      )}

      <style jsx>{`
      :global(.ktp-kis-uploader .ant-upload.ant-upload-select-picture-card, .ant-upload-list-picture-card-container, .ktp-kis-uploader) {
        width: 323px;
        height: 204px;
      }
      :global(.ktp-kis-uploader .ant-upload-list-picture-card .ant-upload-list-item-thumbnail, .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img) {
        object-fit: cover;
      }
      `}</style>
    </>
  )
}

export default memo(CardUploadContainer)
