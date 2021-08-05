import { motion } from 'framer-motion'
import { EditOutlined } from '@ant-design/icons'
import { Form, Row, Col, Upload, Button } from 'antd'

import { uploadButton, imageValidation } from 'lib/imageUploader'

import ErrorMessage from 'components/ErrorMessage'

const SignatureComponent = ({ file, loading, setLoading, imagePreview, imageChangeHandler, onRemoveImageHandler, setShowModalSignature }) => (
  <>
    <Form.Item 
      label="Tanda tangan" 
      className="mb-3"
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
            beforeUpload={(f) => imageValidation(f, "image", "/users/update-account", "put", setLoading, () => {}, "")}
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
                beforeUpload={(f) => imageValidation(f, "image", "/users/update-account", "put", setLoading, () => {}, "")}
              >
                {file.value.length >= 1 ? null : uploadButton(loading)}
              </Upload>
            </Col>
          </Row>
          <ErrorMessage item={file} />
        </motion.div>
      )}
    </Form.Item>

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

export default SignatureComponent
