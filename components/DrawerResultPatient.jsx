import { memo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Drawer, Form, Row, Col, Input, Select, Grid, DatePicker, Button } from 'antd'

import { checkResultListOnly } from 'data/all'
import { disabledTomorrow, DATE_FORMAT } from 'lib/disabledDate'
import { formCheckup, formCheckupIsValid } from 'formdata/checkup'
import { jsonHeaderHandler, formErrorMessage, signature_exp } from 'lib/axios'

import _ from 'lodash'
import 'moment/locale/id'
import moment from 'moment'
import isIn from 'validator/lib/isIn'
import id_ID from "antd/lib/date-picker/locale/id_ID"

import axios from 'lib/axios'
import * as actions from 'store/actions'
import ErrorMessage from 'components/ErrorMessage'

const per_page = 30
const useBreakpoint = Grid.useBreakpoint;

moment.locale('id')
const DrawerResultPatient = ({ visible, dataCheckup, onCloseHandler }) => {
  const dispatch = useDispatch()
  const screens = useBreakpoint()

  const doctors = useSelector(state => state.doctor.doctor)
  const guardians = useSelector(state => state.guardian.guardian)
  const institutions = useSelector(state => state.institution.institution)
  const locationServices = useSelector(state => state.locationService.locationService)

  const [loading, setLoading] = useState(false)
  const [checkup, setCheckup] = useState(formCheckup)

  const { id, check_date, check_result, doctor_id, institution_id, guardian_id, location_service_id } = checkup

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = (value, item) => {
    const data = {
      ...checkup,
      [item]: { ...checkup[item], value: value, isValid: true, message: null }
    }
    setCheckup(data)
  }

  const onCheckDateChangeHandler = (date) => {
    if(moment(date).isValid()) {
      const data = {
        ...checkup,
        check_date: { ...checkup['check_date'], value: moment(date).format('DD-MM-YYYY HH:mm'), isValid: true, message: null }
      }
      setCheckup(data)
    }
  }
  /* INPUT CHANGE FUNCTION */

  const onCloseCheckupDrawerHandler = e => {
    e?.preventDefault()
    onCloseHandler()
    setCheckup(formCheckup)
  }

  const onSearchDoctor = val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(val) queryString["q"] = val
    else delete queryString["q"]
    dispatch(actions.getDoctor({ ...queryString }))
  } 

  const onFocusDoctor = () => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    dispatch(actions.getDoctor({ ...queryString }))
  }

  const onSubmitHandler = e => {
    e.preventDefault()
    if(formCheckupIsValid(checkup, setCheckup)) {
      setLoading(true)
      const data = {
        check_date: check_date.value,
        check_result: check_result.value,
        doctor_id: doctor_id.value,
        guardian_id: guardian_id.value,
        location_service_id: location_service_id.value,
        institution_id: institution_id.value
      }

      axios.put(`/covid_checkups/update/${id.value}`, data, jsonHeaderHandler())
        .then(res => {
          formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
          setLoading(false)
          onCloseCheckupDrawerHandler()
          dispatch(actions.getClient({ page: 1, per_page: 100 }))
        })
        .catch(err => {
          setLoading(false)
          const state = _.cloneDeep(checkup)
          const errDetail = err.response?.data.detail

          if(errDetail === signature_exp) {
            onCloseCheckupDrawerHandler()
            dispatch(actions.getClient({ page: 1, per_page: 100 }))
            formErrorMessage(err.response.status === 404 ? 'error' : 'success', 'Successfully update the checkup.')
          }
          else if(typeof errDetail === "string") {
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
          setCheckup(state)
        })
    }
  }


  useEffect(() => {
    setCheckup(dataCheckup)
    dispatch(actions.getGuardian({ page: 1, per_page: 100 }))
    dispatch(actions.getInstitution({ page: 1, per_page: 100 }))
    dispatch(actions.getLocationService({ page: 1, per_page: 100 }))
  }, [dataCheckup])

  return (
    <>
      <Drawer
        push
        placement="right"
        visible={visible}
        title="Hasil Pemeriksaan"
        onClose={onCloseCheckupDrawerHandler}
        closeIcon={<i className="fal fa-times" />}
        width={screens.xl ? "50%" : screens.lg ? "80%" : screens.md ? "80%" : "100%"}
      >
        <Form layout="vertical">
          <Row gutter={[10, 0]}>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Tanggal & Waktu Periksa">
                <DatePicker 
                  locale={id_ID}
                  className="w-100"
                  format="DD MMMM YYYY HH:mm"
                  showTime={{ format: "HH:mm" }}
                  placeholder="Tanggal & Waktu Periksa"
                  disabledDate={disabledTomorrow}
                  onChange={onCheckDateChangeHandler}
                  value={check_date?.value ? moment(check_date?.value, 'DD-MM-YYYY HH:mm') : ''}
                />
                <ErrorMessage item={check_date} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Hasil Pemeriksaan">
                <Select 
                  allowClear
                  className="w-100"
                  value={check_result.value}
                  onChange={val => onChangeHandler(val, 'check_result')}
                  placeholder="Hasil Pemeriksaan"
                >
                  {checkResultListOnly.map(data => (
                    <Select.Option value={data.value} key={data.value}>{data.label}</Select.Option>
                  ))}
                </Select>
                <ErrorMessage item={check_result} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Penanggung Jawab">
                <Select 
                  allowClear
                  showSearch 
                  // labelInValue
                  className="w-100" 
                  value={doctor_id.value}
                  onFocus={onFocusDoctor}
                  onSearch={onSearchDoctor}
                  placeholder="Dokter Penanggung Jawab"
                  onChange={val => onChangeHandler(val, 'doctor_id')}
                  getPopupContainer={triggerNode => triggerNode.parentElement}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {doctors?.data?.length > 0 && doctors?.data.map(doctor => (
                    <Select.Option value={doctor.users_id} key={doctor.users_id}>
                      {doctor.users_username}
                    </Select.Option>
                  ))}
                </Select>
                <ErrorMessage item={doctor_id} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Instansi">
                <Select 
                  allowClear
                  showSearch 
                  className="w-100"
                  placeholder="Asal Instansi"
                  value={institution_id.value}
                  onChange={e => onChangeHandler(e, "institution_id")}
                >
                  {institutions?.data?.length > 0 && institutions?.data.map(institution => (
                    <Select.Option value={institution.institutions_id} key={institution.institutions_id}>
                      {institution.institutions_name}
                    </Select.Option>
                  ))}
                </Select>
                <ErrorMessage item={institution_id} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Lokasi Pelayanan">
                <Select 
                  allowClear
                  showSearch 
                  className="w-100"
                  placeholder="Lokasi pelayanan"
                  value={location_service_id.value}
                  onChange={e => onChangeHandler(e, "location_service_id")}
                >
                  {locationServices?.data?.length > 0 && locationServices?.data.map(loct => (
                    <Select.Option value={loct.location_services_id} key={loct.location_services_id}>
                      {loct.location_services_name}
                    </Select.Option>
                  ))}
                </Select>
                <ErrorMessage item={location_service_id} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Penjamin">
                <Select 
                  allowClear
                  showSearch 
                  className="w-100"
                  placeholder="Penjamin"
                  value={guardian_id.value}
                  onChange={e => onChangeHandler(e, "guardian_id")}
                >
                  {guardians?.data?.length > 0 && guardians?.data.map(guardian => (
                    <Select.Option value={guardian.guardians_id} key={guardian.guardians_id}>
                      {guardian.guardians_name}
                    </Select.Option>
                  ))}
                </Select>
                <ErrorMessage item={guardian_id} />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Button 
          type="primary" 
          loading={loading}
          disabled={loading}
          onClick={onSubmitHandler}
        >
          Simpan
        </Button>
      </Drawer>
    </>
  )
}

export default memo(DrawerResultPatient)
