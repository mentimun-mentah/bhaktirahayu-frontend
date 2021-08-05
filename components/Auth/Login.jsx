import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { LoadingOutlined } from '@ant-design/icons'
import { Form, Input, Button, Select } from 'antd'

import { resNotification } from 'lib/axios'
import { formLogin, formLoginIsValid } from 'formdata/login'

import _ from 'lodash'
import axios from 'lib/axios'
import * as actions from 'store/actions'
import ErrorMessage from 'components/ErrorMessage'

const LoginContainer = ({ isShow, onClose }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState(formLogin)

  const { email, password } = login

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = e => {
    const name = e.target.name
    const value = e.target.value

    const data = {
      ...login,
      [name]: { ...login[name], value: value, isValid: true, message: null },
    };
    setLogin(data)
  }
  /* INPUT CHANGE FUNCTION */

  /* SUBMIT FORM FUNCTION */
  const onSubmitHandler = e => {
    e.preventDefault()

    if(formLoginIsValid(login, setLogin)) {
      setLoading(true)
      const data = {
        email: email.value,
        password: password.value,
      }

      axios.post("/users/login", data)
        .then(res => {
          resNotification('success', 'Success', res.data.detail, 'topRight')
          onClose()
          setLoading(false)
          dispatch(actions.getUser())
          router.replace("/dashboard")
        })
        .catch((err) => {
          console.log(err.response)
          setLoading(false)
          const state = _.cloneDeep(login)
          const errDetail = err.response?.data.detail;
          if (typeof errDetail === "string") {
            state.password.value = state.password.value;
            state.password.isValid = false;
            state.password.message = errDetail;
          } else {
            errDetail?.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if (state[key]) {
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            });
          }
          setLogin(state)
        })
    }
  }
  /* SUBMIT FORM FUNCTION */

  useEffect(() => {
    if(!isShow) setLogin(formLogin)
  }, [isShow])

  return (
    <div>
      <h4 className="fs-20-s">
        Masuk
      </h4>

      <Form name="login" layout="vertical">
        <Form.Item 
          label="Email"
          className="mb-3"
          validateStatus={!email.isValid && email.message && "error"}
        >
          <Input 
            name="email"
            type="email"
            className="py-2"
            placeholder="Email" 
            value={email.value}
            onChange={onChangeHandler}
          />
          <ErrorMessage item={email} />
        </Form.Item>
        <Form.Item 
          label="Password"
          className="mb-3"
          validateStatus={!password.isValid && password.message && "error"}
        >
          <Input.Password 
            name="password"
            className="py-2"
            placeholder="Password" 
            value={password.value}
            onChange={onChangeHandler}
          />
          <ErrorMessage item={password} />
        </Form.Item>

        <Form.Item 
          label="Pilih Instansi"
          className="mb-3"
        >
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

        <Form.Item 
          label="Pilih Lokasi"
        >
          <Select 
            showSearch 
            defaultValue={[]}
            className="w-100 select-py-2 with-input"
            placeholder="Pilih Instansi"
          >
            <Select.Option value="Hotel">
              <span className="va-sub">Hotel</span>
            </Select.Option>
            <Select.Option value="Lapangan">
              <span className="va-sub">Lapangan</span>
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item className="mb-0 mt-4">
          <Button block type="primary" size="large" className="fs-16" onClick={onSubmitHandler} disabled={loading}>
            {loading ? <LoadingOutlined /> : "Masuk"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default LoginContainer
