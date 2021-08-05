import { useState, useEffect, memo } from 'react'
import { Form, Input, Modal } from 'antd'

import { enterPressHandler } from 'lib/utility'
import { formGuardian, formGuardianIsValid } from 'formdata/guardian'
import { jsonHeaderHandler, formErrorMessage, errName, signature_exp } from 'lib/axios'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'

import axios from 'lib/axios'
import ErrorMessage from 'components/ErrorMessage'

const ModalGuardian = ({ title, visible, onCloseHandler, isUpdate, setIsUpdate, getGuardian, dataGuardian }) => {

  const [loading, setLoading] = useState(false)
  const [guardian, setGuardian] = useState(formGuardian)

  const { name } = guardian

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = e => {
    const name = e.target.name
    const value = e.target.value

    const data = {
      ...guardian,
      [name]: { ...guardian[name], value: value, isValid: true, message: null }
    }

    setGuardian(data)
  }
  /* INPUT CHANGE FUNCTION */

  const onCloseModalHandler = e => {
    e?.preventDefault()
    onCloseHandler()
    setGuardian(formGuardian)
  }

  const onSubmitHandler = e => {
    e.preventDefault()
    if(formGuardianIsValid(guardian, setGuardian)) {
      let config = {
        url: 'guardians/create',
        method: 'post'
      }
      if(isUpdate) {
        const { id } = guardian
        config = {
          url: `guardians/update/${id.value}`,
          method: 'put'
        }
      }

      setLoading(true)
      const data = { name: name.value, }

      axios[config.method](config.url, data, jsonHeaderHandler())
        .then(res => {
          getGuardian()
          formErrorMessage('success', res.data?.detail)
          setLoading(false)
          onCloseModalHandler()
        })
        .catch(err => {
          setLoading(false)
          const state = _.cloneDeep(guardian)
          const errDetail = err.response?.data.detail

          if(errDetail == signature_exp) {
            getGuardian()
            onCloseModalHandler()
            formErrorMessage("success", "Successfully add a new guardian.")
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
              if(state[key]){
                state[key].isValid = false
                state[key].message = data.msg
              }
            });
          }
          setGuardian(state)
        })
    }
  }

  useEffect(() => {
    if(isUpdate) {
      setGuardian(dataGuardian)
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
        <Form layout="vertical" onKeyUp={e => enterPressHandler(e, onSubmitHandler)}>
          <Form.Item 
            className="mb-0"
            label="Nama Penjamin"
            validateStatus={!name.isValid && name.message && "error"}
          >
            <Input 
              name="name"
              value={name.value}
              onChange={onChangeHandler}
              placeholder="Nama penjamin" 
            />
            <ErrorMessage item={name} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default memo(ModalGuardian)
