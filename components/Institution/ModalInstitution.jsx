import { motion } from 'framer-motion'
import { useState, useEffect, memo } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Form, Input, Row, Col, Modal, Select, Upload } from 'antd'

import { checkTypeList } from 'data/all'
import { formImage, formImageIsValid } from 'formdata/image'
import { formHeaderHandler, formErrorMessage, errName, signature_exp } from 'lib/axios'
import { imagePreview, uploadButton, imageValidation, fixRotationOfFile } from 'lib/imageUploader'
import { formInstitution, formInstitutionIsValid, formImageAntigenGenoseIsValid } from 'formdata/institution'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'

import axios from 'lib/axios'
import ErrorMessage from 'components/ErrorMessage'

const ModalInstitution = ({ title, visible, onCloseHandler, isUpdate, setIsUpdate, getInstitution, dataInstitution, dataStamp, dataPcr, dataGenose, dataAntigen }) => {
  const [loading, setLoading] = useState(false)
  const [imagePcr, setImagePcr] = useState(formImage)
  const [removedImage, setRemovedImage] = useState([])
  const [imageStamp, setImageStamp] = useState(formImage)
  const [imageGenose, setImageGenose] = useState(formImage)
  const [imageAntigen, setImageAntigen] = useState(formImage)
  const [institution, setInstitution] = useState(formInstitution)

  const { file: filePcr } = imagePcr
  const { file: fileStamp } = imageStamp
  const { file: fileGenose } = imageGenose
  const { file: fileAntigen } = imageAntigen
  const { name, checking_type } = institution

  let config = {
    url: '/institutions/create',
    method: 'post'
  }
  if(isUpdate) {
    const { id } = institution
    config = {
      url: `/institutions/update/${id.value}`,
      method: 'put'
    }
  }

  /* IMAGE CHANGE FUNCTION */
  const imageChangeHandler = async ({ fileList: newFileList }, state, setState, type) => {
    if(newFileList.length > 0) {
      const imageWithRotation = await fixRotationOfFile(newFileList[0]?.originFileObj)

      const dataNewFileList = {
        ...newFileList[0],
        status: "done",
        originFileObj: imageWithRotation,
      }

      const data = {
        ...state,
        file: { value: [dataNewFileList], isValid: true, message: null }
      }
      setState(data)
    }
    else {
      setState(formImage)
    }

    /* for deleting invalid message from other type of antigen */
    if(type === "genose" || type === "pcr") {
      const dataAntigen = {
        ...imageAntigen,
        file: { ...imageAntigen['file'], isValid: true, message: null }
      }
      setImageAntigen(dataAntigen)
    } 
  };

  const onRemoveImageHandler = file => {
    if(file.url){
      const imgSplit = file.url.split("/")
      const imgUrl = imgSplit[imgSplit.length - 1]
      setRemovedImage(str => str.concat(imgUrl))
    }
  }

  /* IMAGE CHANGE FUNCTION */

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = e => {
    const name = e.target.name
    const value = e.target.value

    const data = {
      ...institution,
      [name]: { ...institution[name], value: value, isValid: true, message: null }
    }

    setInstitution(data)
  }
  /* INPUT CHANGE FUNCTION */

  /* CHECKING TYPE CHANGE FUNCTION*/
  const onCheckingTypeHandler = value => {
    const data = {
      ...institution,
      checking_type: { ...institution['checking_type'], value: value, isValid: true, message: null }
    }
    setInstitution(data)

    const dataAntigen = {
      ...imageAntigen,
      file: { ...imageAntigen['file'], isValid: true, message: null }
    }
    setImageAntigen(dataAntigen)

    const dataGenose = {
      ...imageGenose,
      file: { ...imageGenose['file'], isValid: true, message: null }
    }
    setImageGenose(dataGenose)

    const dataPcr = {
      ...imagePcr,
      file: { ...imagePcr['file'], isValid: true, message: null }
    }
    setImagePcr(dataPcr)
  }

  const onDeselectCheckingTypeHandler = value => {
    const element = document.getElementById(`id-kop-image-${value}`)
    element?.parentNode?.click()
    if(value === "antigen") {
      setImageAntigen(formImage)
    }
    else if (value === "genose") {
      setImageGenose(formImage)
    } 
    else if (value === "pcr") {
      setImagePcr(formImage)
    } 
    else {
      setImageAntigen(formImage)
      setImageGenose(formImage)
      setImagePcr(formImage)
    }
  }
  /* CHECKING TYPE CHANGE FUNCTION*/

  const onCloseModalHandler = e => {
    e?.preventDefault()
    onCloseHandler()
    setIsUpdate(false)
    setRemovedImage([])
    setImagePcr(formImage)
    setImageStamp(formImage)
    setImageGenose(formImage)
    setImageAntigen(formImage)
    setInstitution(formInstitution)
  }

  const onSubmitHandler = e => {
    e.preventDefault()
    if(formInstitutionIsValid(institution, setInstitution) && 
       formImageIsValid(imageStamp, setImageStamp) && 
       formImageAntigenGenoseIsValid (imageAntigen, setImageAntigen, imageGenose, imagePcr)
    ) {
      setLoading(true)
      const formData = new FormData()
      formData.append("name", name.value)

      _.forEach(fileStamp.value, f => {
        if(!f.hasOwnProperty('url')){
          formData.append('stamp', f.originFileObj)
        }
      })

      _.forEach(fileGenose.value, f => {
        if(!f.hasOwnProperty('url')){
          formData.append('genose', f.originFileObj)
        }
      })

      _.forEach(fileAntigen.value, f => {
        if(!f.hasOwnProperty('url')){
          formData.append('antigen', f.originFileObj)
        }
      })

      _.forEach(filePcr.value, f => {
        if(!f.hasOwnProperty('url')){
          formData.append('pcr', f.originFileObj)
        }
      })

      if(isUpdate) {
        if(removedImage.length > 0){
          formData.append("image_delete", removedImage.join(","))
        }
      }

      axios[config.method](config.url, formData, formHeaderHandler())
        .then(res => {
          getInstitution()
          setLoading(false)
          formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
          onCloseModalHandler()
        })
        .catch(err => {
          setLoading(false)
          const state = _.cloneDeep(institution)
          const stateStamp = _.cloneDeep(imageStamp)
          const errDetail = err.response?.data.detail

          if(errDetail === signature_exp) {
            getInstitution()
            onCloseModalHandler()
            formErrorMessage(err?.response?.status === 404 ? 'error' : 'success', isUpdate ? 'Successfully update the institution.' : 'Successfully add a new institution.')
            if(isUpdate) setIsUpdate(false)
          }
          else if(typeof errDetail === "string" && isIn(errDetail, errName)) {
            state.name.value = state.name.value
            state.name.isValid = false
            state.name.message = errDetail
          }
          else if(typeof(errDetail) === "string" && !isIn(errDetail, errName)) {
            formErrorMessage("error", errDetail)
          }
          else {
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if(state[key]) {
                state[key].isValid = false
                state[key].message = data.msg
              }
              else if(key === "stamp") {
                stateStamp.file.isValid = false
                stateStamp.file.message = data.msg
              }
            });
          }
          setInstitution(state)
          setImageStamp(stateStamp)
        })
    }
  }

  useEffect(() => {
    if(isUpdate) {
      setImagePcr(dataPcr)
      setImageStamp(dataStamp)
      setImageGenose(dataGenose)
      setImageAntigen(dataAntigen)
      setInstitution(dataInstitution)
    }
  }, [isUpdate])

  return (
    <>
      <Modal 
        centered
        title={title}
        visible={visible}
        onOk={onSubmitHandler}
        onCancel={onCloseModalHandler}
        okButtonProps={{ disabled: loading, loading: loading }}
        okText="Simpan"
        cancelText="Batal"
        closeIcon={<i className="far fa-times" />}
      >
        <Form layout="vertical">

          <Form.Item 
            className="mb-3"
            label="Nama Instansi"
            validateStatus={!name.isValid && name.message && "error"}
          >
            <Input 
              name="name"
              value={name.value}
              onChange={onChangeHandler}
              placeholder="Nama instansi" 
            />
            <ErrorMessage item={name} />
          </Form.Item>

          <Form.Item 
            className="mb-3"
            label="Jenis Pemeriksaan"
            validateStatus={!checking_type.isValid && checking_type.message && "error"}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              value={checking_type.value}
              onChange={onCheckingTypeHandler}
              placeholder="Pilih jenis pemeriksaan"
              removeIcon={<i className="fal fa-times" />}
              onDeselect={onDeselectCheckingTypeHandler}
              getPopupContainer={triggerNode => triggerNode.parentElement}
            >
              {checkTypeList.map(data => (
                <Select.Option value={data.value} key={data.value}>
                  {data.label}
                </Select.Option>
              ))}
            </Select>
            <ErrorMessage item={checking_type} />
          </Form.Item>

          <Row gutter={[10,0]} className="mb-1">
            {checking_type?.value?.map(checkType => {
              let uploadProps = {
                accept: "image/jpeg,image/png",
                listType: "picture-card",
                onPreview: imagePreview,
                onRemove: onRemoveImageHandler,
                beforeUpload: (f) => imageValidation(f, checkType, config.url, config.method, setLoading, () => {}, ""),
                showUploadList: { removeIcon: <DeleteOutlined id={`id-kop-image-${checkType}`} /> }
              }
              let child = fileAntigen.value.length >= 1 ? null : uploadButton(loading)
              if(checkType === "antigen") {
                uploadProps = {
                  ...uploadProps,
                  fileList: fileAntigen.value,
                  onChange: e => imageChangeHandler(e, imageAntigen, setImageAntigen, "antigen"),
                }
                child = fileAntigen.value.length >= 1 ? null : uploadButton(loading)
              }
              else if(checkType === "genose") {
                uploadProps = {
                  ...uploadProps,
                  fileList: fileGenose.value,
                  onChange: e => imageChangeHandler(e, imageGenose, setImageGenose, "genose"),
                }
                child = fileGenose.value.length >= 1 ? null : uploadButton(loading)
              }
              else if(checkType === "pcr") {
                uploadProps = {
                  ...uploadProps,
                  fileList: filePcr.value,
                  onChange: e => imageChangeHandler(e, imagePcr, setImagePcr, "pcr"),
                }
                child = filePcr.value.length >= 1 ? null : uploadButton(loading)
              }

              return (
                <Col key={checkType}>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Form.Item 
                      label={`Kop ${checkType}`}
                      className="m-b-0 text-capitalize"
                    >
                      <Upload {...uploadProps}>
                        {child}
                      </Upload>
                    </Form.Item>
                  </motion.div>
                </Col>
              )
            })}

            {isIn('antigen', checking_type.value) && false && (
              <Col>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Form.Item 
                    label="Kop Antigen"
                    className="m-b-0"
                  >
                    <Upload
                      accept="image/jpeg,image/png"
                      listType="picture-card"
                      onPreview={imagePreview}
                      fileList={fileAntigen.value}
                      onRemove={onRemoveImageHandler}
                      onChange={e => imageChangeHandler(e, imageAntigen, setImageAntigen)}
                      beforeUpload={(f) => imageValidation(f, "antigen", config.url, config.method, setLoading, () => {}, "")}
                      showUploadList={{ removeIcon: <DeleteOutlined id="id-kop-image-antigen" /> }}
                    >
                      {fileAntigen.value.length >= 1 ? null : uploadButton(loading)}
                    </Upload>
                  </Form.Item>
                </motion.div>
              </Col>
            )}
            {isIn('genose', checking_type.value) && false && (
              <Col>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Form.Item 
                    label="Kop GeNose"
                    className="m-b-0"
                  >
                    <Upload
                      accept="image/jpeg,image/png"
                      listType="picture-card"
                      onPreview={imagePreview}
                      fileList={fileGenose.value}
                      onRemove={onRemoveImageHandler}
                      onChange={e => imageChangeHandler(e, imageGenose, setImageGenose, "genose")}
                      beforeUpload={(f) => imageValidation(f, "genose", config.url, config.method, setLoading, () => {}, "")}
                      showUploadList={{ removeIcon: <DeleteOutlined id="id-kop-image-genose" /> }}
                    >
                      {fileGenose.value.length >= 1 ? null : uploadButton(loading)}
                    </Upload>
                  </Form.Item>
                </motion.div>
              </Col>
            )}
            <Col span={24}>
              <ErrorMessage item={fileAntigen} />
            </Col>
          </Row>

          <Form.Item 
            label="Cap Instansi"
            className="m-b-0"
          >
            <Upload
              accept="image/jpeg,image/png"
              listType="picture-card"
              onPreview={imagePreview}
              fileList={fileStamp.value}
              onRemove={onRemoveImageHandler}
              onChange={e => imageChangeHandler(e, imageStamp, setImageStamp)}
              beforeUpload={(f) => imageValidation(f, "stamp", config.url, config.method, setLoading, () => {}, "")}
            >
              {fileStamp.value.length >= 1 ? null : uploadButton(loading)}
            </Upload>
            <ErrorMessage item={fileStamp} />
          </Form.Item>
        </Form>

        <h2 className="fs-14 bold m-b-0 mt-3">Note:</h2>
        <ul className="mb-0" style={{ paddingInlineStart: '25px' }}>
          <li>Ukuran file: maks. 5MB</li>
          <li>Ukuran cap: 500 × 500 px</li>
          <li>Ukuran kop: 1000 × 200 px</li>
        </ul>
      </Modal>
    </>
  )
}

export default memo(ModalInstitution)
