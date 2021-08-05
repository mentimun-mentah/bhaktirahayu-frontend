import { useState, memo } from 'react'
import { Form, Input, Modal } from 'antd'

import { enterPressHandler } from 'lib/utility'
import { jsonHeaderHandler, signature_exp } from 'lib/axios'
import { formVerifyPassword, formVerifyPasswordIsValid } from 'formdata/password'

import _ from 'lodash'

import axios from 'lib/axios'
import ErrorMessage from 'components/ErrorMessage'

const ModalPassword = ({ visible, onCloseHandler, onSubmitPasswordHandler }) => {

  const [loading, setLoading] = useState(false)
  const [verifyPassword, setVerifyPassword] = useState(formVerifyPassword)

  const { password } = verifyPassword

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value

    const data = {
      ...verifyPassword,
      [name]: { ...verifyPassword[name], value: value, isValid: true, message: null }
    }

    setVerifyPassword(data)
  }
  /* INPUT CHANGE FUNCTION */

  const onCloseModalHandler = e => {
    e?.preventDefault()
    onCloseHandler()
    setVerifyPassword(formVerifyPassword)
  }

  const onSubmitHandler = e => {
    e?.preventDefault()
    if(formVerifyPasswordIsValid(verifyPassword, setVerifyPassword)) {

      setLoading(true)
      const data = { password: password.value }

      axios.post('/users/fresh-token', data, jsonHeaderHandler())
        .then(()=> {
          setLoading(true)
          onSubmitPasswordHandler()
          onCloseModalHandler()
        })
        .catch(err => {
          const state = _.cloneDeep(verifyPassword)
          const errDetail = err.response?.data.detail

          if(typeof errDetail === "string" && errDetail === signature_exp) {
            axios.post("/users/fresh-token", data, jsonHeaderHandler())
              .then(() => {
                setLoading(true)
                onSubmitPasswordHandler()
                onCloseModalHandler()
              })
          }
          if(typeof errDetail === "string" && errDetail !== signature_exp) {
            setLoading(false)
            state.password.value = state.password.value
            state.password.isValid = false
            state.password.message = errDetail
          }
          if(typeof errDetail !== "string") {
            setLoading(false)
            errDetail.map((data) => {
              let key = data.loc[data.loc.length - 1]
              if(state[key]) {
                state[key].value = state[key].value
                state[key].isValid = false
                state[key].message = data.msg
              }
            });
          }
          setVerifyPassword(state)
        })
    }
  }

  return (
    <>
      <Modal 
        centered
        width={500}
        visible={visible}
        title="Konfirmasi Password"
        onOk={onSubmitHandler}
        onCancel={onCloseModalHandler}
        okButtonProps={{ disabled: loading, loading: loading }}
        okText="Konfirmasi"
        cancelText="Batal"
        closeIcon={<i className="far fa-times" />}
      >
        <p className="text-muted">
          Masukkan kata sandi Anda saat ini untuk mengkonfirmasi perubahan kata sandi Anda.
        </p>

        <Form layout="vertical" onKeyUp={e => enterPressHandler(e, onSubmitHandler)}>
          <Form.Item 
            className="mb-3"
            label="Password" 
            validateStatus={!password.isValid && password.message && "error"}
          >
            <Input.Password 
              name="password"
              value={password.value}
              placeholder="Password" 
              onChange={onChangeHandler}
            />
            <ErrorMessage item={password} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default memo(ModalPassword)
