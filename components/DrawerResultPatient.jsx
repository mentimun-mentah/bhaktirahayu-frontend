import { useRouter } from 'next/router'
import { CloseCircleFilled } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { memo, useState, useEffect, useCallback, useMemo } from 'react'
import { Drawer, Form, Row, Col, Select, Grid, DatePicker, Button } from 'antd'

import { checkResultListOnly } from 'data/all'
import { disabledTomorrow, DATE_FORMAT } from 'lib/disabledDate'
import { formCheckup, formCheckupIsValid } from 'formdata/checkup'
import { jsonHeaderHandler, formErrorMessage, signature_exp } from 'lib/axios'

import _ from 'lodash'
import 'moment/locale/id'
import moment from 'moment'
import id_ID from "antd/lib/date-picker/locale/id_ID"

import axios from 'lib/axios'
import * as actions from 'store/actions'
import ErrorMessage from 'components/ErrorMessage'
import NotFoundSelect from 'components/NotFoundSelect'

moment.locale('id')

const per_page = 10
const useBreakpoint = Grid.useBreakpoint;

const selectProps = {
  allowClear: true,
  showSearch: true,
  className: "w-100",
  filterOption: (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
  getPopupContainer: triggerNode => triggerNode.parentElement
}

const DrawerResultPatient = ({ visible, patient, setPatient, dataCheckup, onCloseHandler }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const screens = useBreakpoint()

  const doctors = useSelector(state => state.doctor.doctor)
  const loadingDoctors = useSelector(state => state.doctor.loading)

  const guardians = useSelector(state => state.guardian.guardian)
  const loadingGuardians = useSelector(state => state.guardian.loading)

  const institutions = useSelector(state => state.institution.institution)
  const loadingInstitutions = useSelector(state => state.institution.loading)

  const locationServices = useSelector(state => state.locationService.locationService)
  const loadingLocationServices = useSelector(state => state.locationService.loading)

  const [loading, setLoading] = useState(false)
  const [checkup, setCheckup] = useState(formCheckup)

  const { id, check_date, check_result, doctor_id, institution_id, guardian_id, location_service_id, checking_type } = checkup

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = (value, item) => {
    const data = {
      ...checkup,
      [item]: { ...checkup[item], value: value, isValid: true, message: null }
    }
    setCheckup(data)
  }

  const onClearSelectHandler = (item) => {
    const data = {
      ...checkup,
      [item]: { ...checkup[item], value: [], isValid: true, message: null }
    }
    setCheckup(data)
  }

  const onCheckDateChangeHandler = (date) => {
    if(moment(date).isValid()) {
      const data = {
        ...checkup,
        check_date: { ...checkup['check_date'], value: moment(date).format(`${DATE_FORMAT} HH:mm`), isValid: true, message: null }
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

  const onUpdateCovidCheckupHandler = async () => {
    const covidCheckupsIndex = _.findIndex(patient?.covid_checkups?.value, { covid_checkups_id: id?.value })
    if(covidCheckupsIndex !== -1) {
      const copyPatient = _.cloneDeep(patient)
      const copyCovidCheckups = _.cloneDeep(patient?.covid_checkups?.value)

      await axios.get(`/covid-checkups/get-covid-checkup/${id?.value}`)
        .then(res => {
          setLoading(false)
          copyCovidCheckups[covidCheckupsIndex] = res.data
        })
        .catch(async err => {
          setLoading(false)
          const errDetail = err.response?.data.detail
          if(errDetail === signature_exp){
            await axios.get(`/covid-checkups/get-covid-checkup/${id?.value}`)
              .then(res => {
                copyCovidCheckups[covidCheckupsIndex] = res.data
              })
              .catch(() => {
                formErrorMessage("error", "Something was wrong when updating the covid-checkup.")
              })
          }
          else if(typeof errDetail === "string") {
            formErrorMessage("error", errDetail)
          }
          else {
            formErrorMessage("error", "Something was wrong when updating the covid-checkup.")
          }
        })

      const finalData = {
        ...copyPatient,
        covid_checkups: { value: copyCovidCheckups, isValid: true, message: null }
      }

      setPatient(finalData)
      onCloseCheckupDrawerHandler()
    }
    else {
      setLoading(false)
      onCloseCheckupDrawerHandler()
    }
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

      axios.put(`/covid-checkups/update/${id.value}`, data, jsonHeaderHandler())
        .then(res => {
          formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
          onUpdateCovidCheckupHandler()
          dispatch(actions.getClient({ ...router.query }))
        })
        .catch(err => {
          const state = _.cloneDeep(checkup)
          const errDetail = err.response?.data.detail

          if(errDetail === signature_exp) {
            onUpdateCovidCheckupHandler()
            dispatch(actions.getClient({ ...router.query }))
            formErrorMessage(err.response.status === 404 ? 'error' : 'success', 'Successfully update the checkup.')
          }
          else if(typeof errDetail === "string") {
            setLoading(false)
            formErrorMessage("error", errDetail)
          }
          else {
            setLoading(false)
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

  const fetchInstitution = useCallback(val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page
    queryString["checking_type"] = checking_type?.value

    if(val) queryString["q"] = val
    else delete queryString["q"]

    dispatch(actions.getInstitution({ ...queryString }))
  }, [checking_type?.value])

  const onSearchInstitution = useMemo(() => {
    const loadOptions = val => {
      fetchInstitution(val)
    }
    return _.debounce(loadOptions, 500)
  }, [fetchInstitution])

  const fetchDoctor = useCallback(val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(val) queryString["q"] = val
    else delete queryString["q"]
    dispatch(actions.getDoctor({ ...queryString }))
  }, [])

  const onSearchDoctor = useMemo(() => {
    const loadOptions = val => {
      fetchDoctor(val)
    }
    return _.debounce(loadOptions, 500)
  }, [fetchDoctor])

  const fetchLocationService = useCallback(val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(val) queryString["q"] = val
    else delete queryString["q"]
    dispatch(actions.getLocationService({ ...queryString }))
  }, [])

  const onSearchLocationService = useMemo(() => {
    const loadOptions = val => {
      fetchLocationService(val)
    }
    return _.debounce(loadOptions, 500)
  }, [fetchLocationService])

  const fetchGuardian = useCallback(val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(val) queryString["q"] = val
    else delete queryString["q"]
    dispatch(actions.getGuardian({ ...queryString }))
  }, [])

  const onSearchGuardian = useMemo(() => {
    const loadOptions = val => {
      fetchGuardian(val)
    }
    return _.debounce(loadOptions, 500)
  }, [fetchGuardian])


  useEffect(() => {
    setCheckup(dataCheckup)
    if(dataCheckup?.doctor_id?.value?.length) {
      const list_id = dataCheckup?.doctor_id?.value?.split(',')
      dispatch(actions.getMultipleDoctors({ list_id: list_id, state: doctors }))
    } else {
      fetchDoctor()
    }

    if(dataCheckup?.guardian_id?.value?.length) {
      const list_id = dataCheckup?.guardian_id?.value?.split(',')
      dispatch(actions.getMultipleGuardians({ list_id: list_id, state: guardians }))
    } else {
      fetchGuardian()
    }

    if(dataCheckup?.institution_id?.value?.length) {
      const list_id = dataCheckup?.institution_id?.value?.split(',')
      dispatch(actions.getMultipleInstitutions({ list_id: list_id, state: institutions }))
    } else {
      fetchInstitution()
    }

    if(dataCheckup?.location_service_id?.value?.length) {
      const list_id = dataCheckup?.location_service_id?.value?.split(',')
      dispatch(actions.getMultipleLocationsServices({ list_id: list_id, state: locationServices }))
    } else {
      fetchLocationService()
    }
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
                  inputReadOnly
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
                  {...selectProps}
                  value={doctor_id.value}
                  onSearch={val => {
                    onSearchDoctor(val)
                    dispatch(actions.getDoctorStart())
                  }}
                  placeholder="Dokter Penanggung Jawab"
                  onChange={val => onChangeHandler(val, 'doctor_id')}
                  notFoundContent={<NotFoundSelect loading={loadingDoctors} />}
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
                  {...selectProps}
                  placeholder="Asal Instansi"
                  value={institution_id.value}
                  onSearch={val => {
                    onSearchInstitution(val)
                    dispatch(actions.getInstitutionStart())
                  }}
                  onChange={e => onChangeHandler(e, "institution_id")}
                  notFoundContent={<NotFoundSelect loading={loadingInstitutions} />}
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
                  {...selectProps}
                  placeholder="Lokasi pelayanan"
                  value={location_service_id.value}
                  onSearch={val => {
                    onSearchLocationService(val)
                    dispatch(actions.getLocationServiceStart())
                  }}
                  onChange={e => onChangeHandler(e, "location_service_id")}
                  onClear={() => onClearSelectHandler("location_service_id")}
                  clearIcon={<CloseCircleFilled onClick={() => onClearSelectHandler("location_service_id")} />}
                  notFoundContent={<NotFoundSelect loading={loadingLocationServices} />}
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
                  {...selectProps}
                  placeholder="Penjamin"
                  value={guardian_id.value}
                  onSearch={val => {
                    onSearchGuardian(val)
                    dispatch(actions.getGuardianStart())
                  }}
                  onChange={e => onChangeHandler(e, "guardian_id")}
                  onClear={() => onClearSelectHandler("guardian_id")}
                  clearIcon={<CloseCircleFilled onClick={() => onClearSelectHandler("guardian_id")} />}
                  notFoundContent={<NotFoundSelect loading={loadingGuardians} />}
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
