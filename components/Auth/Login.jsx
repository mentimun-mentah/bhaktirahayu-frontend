import { useState } from 'react'
import { useRouter } from 'next/router'
import { Form, Input, Row, Col, Button, Select } from 'antd'

import { formLogin, formLoginIsValid } from 'formdata/login'

import _ from 'lodash'
import ErrorMessage from 'components/ErrorMessage'

const LoginContainer = () => {
  const router = useRouter()

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
  }

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

        <Form.Item label="Pilih Instansi">
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
  

        <Form.Item className="mb-0 mt-4">
          <Button block type="primary" size="large" onClick={onSubmitHandler}>
            <b>Masuk</b>
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default LoginContainer
