import { useState, useEffect, memo } from 'react'
import { Form, Input, Modal } from 'antd'

import { enterPressHandler } from 'lib/utility'
import { formLocation, formLocationIsValid } from 'formdata/locationService'
import { jsonHeaderHandler, formErrorMessage, errName, signature_exp } from 'lib/axios'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'

import axios from 'lib/axios'
import ErrorMessage from 'components/ErrorMessage'

const ModalLocation = ({ title, visible, onCloseHandler, isUpdate, setIsUpdate, dataLocation, getLocationService }) => {

  const [loading, setLoading] = useState(false)
  const [locationService, setLocationService] = useState(formLocation)

  const { name } = locationService

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = e => {
    const name = e.target.name
    const value = e.target.value

    const data = {
      ...locationService,
      [name]: { ...locationService[name], value: value, isValid: true, message: null }
    }

    setLocationService(data)
  }
  /* INPUT CHANGE FUNCTION */

  const onCloseModalHandler = e => {
    e?.preventDefault()
    onCloseHandler()
    setLocationService(formLocation)
  }

  const onSubmitHandler = e => {
    e.preventDefault()
    if(formLocationIsValid(locationService, setLocationService)) {
      let config = {
        url: '/location-services/create',
        method: 'post'
      }
      if(isUpdate) {
        const { id } = locationService
        config = {
          url: `/location-services/update/${id.value}`,
          method: 'put'
        }
      }

      setLoading(true)
      const data = { name: name.value, }

      axios[config.method](config.url, data, jsonHeaderHandler())
        .then(res => {
          getLocationService()
          formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
          setLoading(false)
          onCloseModalHandler()
        })
        .catch(err => {
          setLoading(false)
          const state = _.cloneDeep(locationService)
          const errDetail = err.response?.data.detail

          if(errDetail === signature_exp) {
            getLocationService()
            onCloseModalHandler()
            formErrorMessage(err.response.status === 404 ? 'error' : 'success', isUpdate ? 'Successfully update the location-service.' : 'Successfully add a new location-service.')
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
          setLocationService(state)
        })
    }
  }

  useEffect(() => {
    if(isUpdate) {
      setLocationService(dataLocation)
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
            label="Lokasi"
            className="mb-0"
            validateStatus={!name.isValid && name.message && "error"}
          >
            <Input
              name="name"
              value={name.value}
              onChange={onChangeHandler}
              placeholder="Lokasi pelayanan" 
            />
            <ErrorMessage item={name} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default memo(ModalLocation)
