import { useState } from 'react'
import { setCookie } from 'nookies'
import { useRouter } from 'next/router'
import { Container } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Input, Select, Button, Form, Image as AntImage } from 'antd'

import { enterPressHandler } from 'lib/utility'
import { resNotification, signature_exp } from 'lib/axios'
import { formLogin, formLoginIsValid } from 'formdata/login'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'

import axios from 'lib/axios'
import * as actions from 'store/actions'
import ErrorMessage from 'components/ErrorMessage'

const per_page = 20

const LoginPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const institutions = useSelector(state => state.institution.institution)
  const locationServices = useSelector(state => state.locationService.locationService)

  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState(formLogin)

  const { email, password, institution_id, location_service_id } = login

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;
    if(item) {
      const data = {
        ...login,
        [item]: { ...login[item], value: e, isValid: true, message: null }
      }
      setLogin(data)
    }
    else {
      const data = {
        ...login,
        [name]: { ...login[name], value: value, isValid: true, message: null },
      };
      setLogin(data)
    }
  }
  /* INPUT CHANGE FUNCTION */

  const setCookieHandler = (location_service_id, institution_id) => {
    if(institution_id && institution_id.length > 0){
      setCookie(null, 'institution_id', institution_id, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
    }
    if(location_service_id && location_service_id.length > 0){
      setCookie(null, 'location_service_id', location_service_id, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
    }
  }

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
          setCookieHandler(location_service_id.value, institution_id.value)
          resNotification('success', 'Success', res.data.detail, 'topRight')
          router.replace("/dashboard")
          setLoading(false)
          dispatch(actions.getUser())
          setLogin(formLogin)
        })
        .catch(err => {
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

  const onSearchInstitutionServices = val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(val) queryString["q"] = val
    else delete queryString["q"]
    dispatch(actions.getInstitution({ ...queryString }))
  }

  const onFocusInstitutionServices = () => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page
    dispatch(actions.getInstitution({ ...queryString }))
  }

  const onSearchLocationServices = val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(val) queryString["q"] = val
    else delete queryString["q"]
    dispatch(actions.getLocationService({ ...queryString }))
  }

  const onFocusLocationServices = () => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page
    dispatch(actions.getLocationService({ ...queryString }))
  }

  return (
    <>
      <Container className="py-5" style={{ height: '100vh', maxHeight: '100vh' }}>
        <section className="h-100">
          <Row gutter={[16,16]} className="h-100" align="middle">
            <Col xxl={12} xl={12} lg={11} md={24} sm={24} xs={24}>

              <h4 className="fs-20-s mb-4">Silahkan Masuk</h4>

              <Form name="login" layout="vertical" onKeyUp={e => enterPressHandler(e, onSubmitHandler)}>
                <Form.Item 
                  label="Email"
                  className="mb-3"
                  validateStatus={!email.isValid && email.message && "error"}
                >
                  <Input 
                    name="email"
                    type="email"
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
                    placeholder="Password" 
                    value={password.value}
                    onChange={onChangeHandler}
                  />
                  <ErrorMessage item={password} />
                </Form.Item>

                <Form.Item 
                  label="Pilih Instansi"
                  className="mb-3"
                  validateStatus={!institution_id.isValid && institution_id.message && "error"}
                >
                  <Select 
                    allowClear
                    showSearch 
                    className="w-100"
                    placeholder="Pilih Instansi"
                    value={institution_id.value}
                    onFocus={onFocusInstitutionServices}
                    onSearch={onSearchInstitutionServices}
                    onChange={e => onChangeHandler(e, "institution_id")}
                    getPopupContainer={triggerNode => triggerNode.parentElement}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {institutions?.data?.length > 0 && institutions?.data.map(institution => (
                      <Select.Option value={institution.institutions_id} key={institution.institutions_id}>
                        {institution.institutions_name}
                      </Select.Option>
                    ))}
                  </Select>
                  <ErrorMessage item={institution_id} />
                </Form.Item>

                <Form.Item 
                  label="Pilih Lokasi"
                  validateStatus={!location_service_id.isValid && location_service_id.message && "error"}
                >
                  <Select 
                    allowClear
                    showSearch 
                    className="w-100"
                    placeholder="Pilih Lokasi Pelayanan"
                    value={location_service_id.value}
                    onFocus={onFocusLocationServices}
                    onSearch={onSearchLocationServices}
                    onChange={e => onChangeHandler(e, "location_service_id")}
                    getPopupContainer={triggerNode => triggerNode.parentElement}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {locationServices?.data?.length > 0 && locationServices?.data.map(loct => (
                      <Select.Option value={loct.location_services_id} key={loct.location_services_id}>
                        {loct.location_services_name}
                      </Select.Option>
                    ))}
                  </Select>
                  <ErrorMessage item={location_service_id} />
                </Form.Item>

                <Form.Item className="mt-4">
                  <Button block type="primary" className="fs-14" onClick={onSubmitHandler} disabled={loading} loading={loading}>
                    Masuk
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

      :global(#scrollable-intitution-id) {
        height: 100px;
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
