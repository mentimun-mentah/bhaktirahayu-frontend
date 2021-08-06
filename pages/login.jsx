import { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { Container } from 'react-bootstrap'
import { LoadingOutlined } from '@ant-design/icons'
import { Row, Col, Input, Select, Button, Form, Image as AntImage } from 'antd'

import { resNotification, signature_exp } from 'lib/axios'
import { formLogin, formLoginIsValid } from 'formdata/login'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'

import axios from 'lib/axios'
import * as actions from 'store/actions'
import ErrorMessage from 'components/ErrorMessage'

const LoginPage = () => {
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
          router.replace("/dashboard")
          setLoading(false)
          dispatch(actions.getUser())
          setLogin(formLogin)
        })
        .catch((err) => {
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

  return (
    <>
      <Container className="py-5" style={{ height: '100vh', maxHeight: '100vh' }}>
        <section className="h-100">
          <Row gutter={[16,16]} className="h-100" align="middle">
            <Col xxl={12} xl={12} lg={11} md={24} sm={24} xs={24}>

              <h4 className="fs-20-s mb-4">
                Silahkan Masuk
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

                <Form.Item className="mt-4">
                  <Button block type="primary" size="large" className="fs-16" onClick={onSubmitHandler} disabled={loading}>
                    {loading ? <LoadingOutlined /> : "Masuk"}
                  </Button>
                </Form.Item>
              </Form>
            </Col>

            <Col xxl={12} xl={12} lg={13} md={0} sm={0} xs={0}>
              <section className="d-flex flex-column h-100 text-center justify-content-center user-select-none">
                <AntImage
                  preview={false}
                  alt="RSU Bhakti Rahayu"
                  className="text-center px-3"
                  src="/static/images/login.svg"
                />
              </section>
            </Col>
          </Row>
        </section>
      </Container>

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

      :global(.cropper-container) {
        justify-content: space-between;
        align-items: center;
        display: flex;
        flex-direction: column;
        flex: 1;
        height: calc(100vh - 48px - 32px - 130px);
      }
      :global(.cropper-container.cropper-loading) {
        justify-content: center;
      }

      :global(.select-py-2 .ant-select-selector, .select-py-2 .ant-select-selector .ant-select-selection-search-input) {
        height: 40px!important;
      }

      :global(.select-py-2.with-input .ant-select-selector .ant-select-selection-placeholder) {
        line-height: 38px;
      }

      /* LOGIN & REGISTER */
      :global(.modal-login > .ant-modal-content, .modal-login
          > .ant-modal-content
          > .ant-modal-header) {
        border-radius: 10px;
        border: unset;
      }

      `}</style>
    </>
  )
}

LoginPage.getInitialProps = async ctx => {
  if(ctx.req) axios.defaults.headers.get.Cookie = ctx.req.headers.cookie;

  const redirect = (destination) => {
    if(process.browser) {
      router.replace(destination, destination) //redirect from client side
    }
    else if(ctx.res) {
      ctx.res.writeHead(302, { Location: destination }); //redirect from server side
      ctx.res.end();
    }
  }

  const nextRedirect = (user) => {
    if(isIn(user?.role, ['admin', 'doctor'])) redirect("/dashboard")
    else redirect("/")
  }

  try {
    const user = await axios.get("/users/my-user")
    nextRedirect(user.data)
  }
  catch (err) {
    if(err && err?.response && err?.response?.data?.detail === signature_exp){
      const user = await axios.get("/users/my-user")
      nextRedirect(user.data)
    }
    else {
      return err
    }
  }
}

export default LoginPage
