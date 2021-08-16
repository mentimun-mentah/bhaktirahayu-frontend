import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { memo, useState, useEffect, useCallback, useMemo } from 'react'
import { Drawer, Form, Select, Grid, DatePicker, Button, Space, Tag, message } from 'antd'

import _ from 'lodash'
import 'moment/locale/id'
import moment from 'moment'
import nookies from 'nookies'
import isIn from 'validator/lib/isIn'
import id_ID from "antd/lib/date-picker/locale/id_ID"

import { formFilter } from 'formdata/filter'
import { disabledTomorrow, DATE_FORMAT } from 'lib/disabledDate'
import { genderList, checkTypeList, checkResultList } from 'data/all'
import { jsonHeaderHandler, formErrorMessage, signature_exp } from 'lib/axios'

import axios from 'lib/axios'
import * as actions from 'store/actions'
import NotFoundSelect from 'components/NotFoundSelect'

moment.locale('id')
message.config({ maxCount: 1 })

const per_page = 10
const useBreakpoint = Grid.useBreakpoint;

const selectProps = {
  showSearch: true,
  allowClear: true,
  labelInValue: true,
  mode: "multiple",
  className: "w-100",
  filterOption: (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
  getPopupContainer: triggerNode => triggerNode.parentElement
}

const datePickerProps = {
  inputReadOnly: true,
  locale: id_ID,
  className: "w-100",
  disabledDate: disabledTomorrow,
  getPopupContainer: triggerNode => triggerNode.parentElement,
  ranges: {
    'Hari ini': [moment(), moment()],
    'Bulan ini': [moment().startOf('month'), moment()],
  },
}

const DrawerFilter = ({ visible, onClose }) => {
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

  const [filter, setFilter] = useState(formFilter)

  const { gender, checking_type, check_result, doctor_id, guardian_id, location_service_id, institution_id } = filter
  const { register_start_date, register_end_date, check_start_date, check_end_date } = filter

  const onChangeGender = (tag) => {
    if(tag === gender[0]) {
      const data = { ...filter, gender: [] }
      setFilter(data)
    }
    else {
      const data = { ...filter, gender: [tag] }
      setFilter(data)
    }
  }

  const onChangeCheckType = (tag) => {
    if(tag === checking_type[0]) {
      const data = { ...filter, checking_type: [] }
      setFilter(data)
    }
    else {
      const data = { ...filter, checking_type: [tag] }
      setFilter(data)
    }
  }

  const onChangeCheckResult = (tag) => {
    if(tag === check_result[0]) {
      const data = { ...filter, check_result: [] }
      setFilter(data)
    }
    else {
      const data = { ...filter, check_result: [tag] }
      setFilter(data)
    }
  }

  const onChangeRegisterDate = date => {
    if(date && moment(date[0]).isValid() && moment(date[1]).isValid()) {
      const data = {
        ...filter,
        register_start_date: moment(date[0]).format(DATE_FORMAT),
        register_end_date: moment(date[1]).format(DATE_FORMAT)
      }
      setFilter(data)
    } else {
      const data = {
        ...filter,
        register_start_date: "",
        register_end_date: ""
      }
      setFilter(data)
    }
  }

  const onChangeCheckDate = date => {
    if(date && moment(date[0]).isValid() && moment(date[1]).isValid()) {
      const data = {
        ...filter,
        check_start_date: moment(date[0]).format(`${DATE_FORMAT} HH:mm`),
        check_end_date: moment(date[1]).format(`${DATE_FORMAT} HH:mm`)
      }
      setFilter(data)
    } else {
      const data = {
        ...filter,
        check_start_date: "",
        check_end_date: ""
      }
      setFilter(data)
    }
  }

  const onFilterChange = (value, item) => {
    const data = { ...filter, [item]: value }
    setFilter(data)
  }

  const onClearFilterHandler = e => {
    e?.preventDefault()
    setFilter(formFilter)
    let query = { ...router.query }

    for(const [key, _] of Object.entries(query)) {
      if(formFilter[key]) {
        delete query[key]
      }
    }

    for(let key of Object.keys(query)){
      if(!isIn(key, ['page', 'per_page', 'q'])){
        delete query[key]
      }
    }

    router.replace({
      pathname: "/dashboard/clients",
      query: query
    })

    nookies.set(null, 'institution_id_delete', true, { maxAge: 30 * 24 * 60 * 60, path: '/' })
    nookies.set(null, 'location_service_id_delete', true, { maxAge: 30 * 24 * 60 * 60, path: '/' })

    onClose()
  }

  const onSubmitSearch = e => {
    e?.preventDefault()
    let query = { ...router.query }
    query['page'] = 1

    if(gender?.length > 0) query['gender'] = gender[0]
    else delete query['gender']

    if(checking_type?.length > 0) query['checking_type'] = checking_type[0]
    else delete query['checking_type']

    if(check_result?.length > 0) query['check_result'] = check_result[0]
    else delete query['check_result']

    if(doctor_id?.length > 0) query['doctor_id'] = doctor_id.map(x => x.key).join(',')
    else delete query['doctor_id']

    if(guardian_id?.length > 0) query['guardian_id'] = guardian_id.map(x => x.key).join(',')
    else delete query['guardian_id']

    if(location_service_id?.length > 0) query['location_service_id'] = location_service_id.map(x => x.key).join(',')
    else delete query['location_service_id']

    if(institution_id?.length > 0) query['institution_id'] = institution_id.map(x => x.key).join(',')
    else delete query['institution_id']

    if(register_start_date) query['register_start_date'] = register_start_date
    else delete query['register_start_date']

    if(register_end_date) query['register_end_date'] = register_end_date
    else delete query['register_end_date']

    if(check_start_date) query['check_start_date'] = check_start_date
    else delete query['check_start_date']

    if(check_end_date) query['check_end_date'] = check_end_date
    else delete query['check_end_date']

    router.replace({
      pathname: "/dashboard/clients",
      query: query
    })
    
    onClose()
  }


  const fetchInstitution = useCallback(val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(val) queryString["q"] = val
    else delete queryString["q"]

    if(checking_type[0]) queryString["checking_type"] = checking_type[0]
    else delete queryString["checking_type"]

    dispatch(actions.getInstitution({ ...queryString }))
  }, [checking_type])

  const onSearchInstitution = useMemo(() => {
    const loadOptions = val => {
      fetchInstitution(val)
    }
    return _.debounce(loadOptions, 500)
  }, [fetchInstitution])

  const onFocusInstitution = () => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(!isIn('institution_id', Object.keys(router.query))){
      dispatch(actions.getInstitution({ ...queryString }))
    }
  }


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

  const onFocusDoctor = () => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(!isIn('doctor_id', Object.keys(router.query))){
      dispatch(actions.getDoctor({ ...queryString }))
    }
  }


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

  const onFocusGuardian = () => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(!isIn('guardian_id', Object.keys(router.query))){
      dispatch(actions.getGuardian({ ...queryString }))
    }
  }


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

  const onFocusLocationServices = () => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(!isIn('location_service_id', Object.keys(router.query))){
      dispatch(actions.getLocationService({ ...queryString }))
    }
  }


  const getMultipleInstitutions = (list_id, state) => {
    const data = { list_id: list_id }
    axios.post('/institutions/get-multiple-institutions', data, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getInstitutionSuccess({ data: res.data }))
        const copyRes = _.cloneDeep(res?.data)
        if(copyRes.length > 0) {
          copyRes.map(x => {
            x['key'] = x['institutions_id']
            x['value'] = x['institutions_id']
            x['label'] = x['institutions_name']
            delete x['institutions_id']; delete x['institutions_name']
            return x
          })
          state['institution_id'] = copyRes
          setFilter(state)
        }
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp){
          axios.post('/institutions/get-multiple-institutions', data, jsonHeaderHandler())
            .then(res => {
              dispatch(actions.getInstitutionSuccess({ data: res.data }))
              const copyRes = _.cloneDeep(res?.data)
              if(copyRes.length > 0) {
                copyRes.map(x => {
                  x['key'] = x['institutions_id']
                  x['value'] = x['institutions_id']
                  x['label'] = x['institutions_name']
                  delete x['institutions_id']; delete x['institutions_name']
                  return x
                })
                state['institution_id'] = copyRes
                setFilter(state)
              }
            })
            .catch(() => {})
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })
  }

  const getMultipleLocationService = (list_id, state) => {
    const data = { list_id: list_id }
    axios.post('/location-services/get-multiple-location-services', data, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getLocationServiceSuccess({ data: res.data }))
        const copyRes = _.cloneDeep(res?.data)
        if(copyRes.length > 0) {
          copyRes.map(x => {
            x['key'] = x['location_services_id']
            x['value'] = x['location_services_id']
            x['label'] = x['location_services_name']
            delete x['location_services_id']; delete x['location_services_name']
            return x
          })
          state['location_service_id'] = copyRes
          setFilter(state)
        }
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp){
          axios.post('/location-services/get-multiple-location-services', data, jsonHeaderHandler())
            .then(res => {
              dispatch(actions.getLocationServiceSuccess({ data: res.data }))
              const copyRes = _.cloneDeep(res?.data)
              if(copyRes.length > 0) {
                copyRes.map(x => {
                  x['key'] = x['location_services_id']
                  x['value'] = x['location_services_id']
                  x['label'] = x['location_services_name']
                  delete x['location_services_id']; delete x['location_services_name']
                  return x
                })
                state['location_service_id'] = copyRes
                setFilter(state)
              }
            })
            .catch(() => {})
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })
  }

  const getMultipleDoctor = (list_id, state) => {
    const data = { list_id: list_id }
    axios.post('/users/get-multiple-doctors', data, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getDoctorSuccess({ data: res.data }))
        const copyRes = _.cloneDeep(res?.data)
        if(copyRes.length > 0) {
          copyRes.map(x => {
            x['key'] = x['users_id']
            x['value'] = x['users_id']
            x['label'] = x['users_username']
            delete x['users_id']; delete x['users_username']
            return x
          })
          state['doctor_id'] = copyRes
          setFilter(state)
        }
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp){
          axios.post('/users/get-multiple-doctors', data, jsonHeaderHandler())
            .then(res => {
              dispatch(actions.getDoctorSuccess({ data: res.data }))
              const copyRes = _.cloneDeep(res?.data)
              if(copyRes.length > 0) {
                copyRes.map(x => {
                  x['key'] = x['users_id']
                  x['value'] = x['users_id']
                  x['label'] = x['users_username']
                  delete x['users_id']; delete x['users_username']
                  return x
                })
                state['doctor_id'] = copyRes
                setFilter(state)
              }
            })
            .catch(() => {})
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })
  }

  const getMultipleGuardian = (list_id, state) => {
    const data = { list_id: list_id }
    axios.post('/guardians/get-multiple-guardians', data, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getGuardianSuccess({ data: res.data }))
        const copyRes = _.cloneDeep(res?.data)
        if(copyRes.length > 0) {
          copyRes.map(x => {
            x['key'] = x['guardians_id']
            x['value'] = x['guardians_id']
            x['label'] = x['guardians_name']
            delete x['guardians_id']; delete x['guardians_name']
            return x
          })
          state['guardian_id'] = copyRes
          setFilter(state)
        }
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp){
          axios.post('/guardians/get-multiple-guardians', data, jsonHeaderHandler())
            .then(res => {
              dispatch(actions.getGuardianSuccess({ data: res.data }))
              const copyRes = _.cloneDeep(res?.data)
              if(copyRes.length > 0) {
                copyRes.map(x => {
                  x['key'] = x['guardians_id']
                  x['value'] = x['guardians_id']
                  x['label'] = x['guardians_name']
                  delete x['guardians_id']; delete x['guardians_name']
                  return x
                })
                state['guardian_id'] = copyRes
                setFilter(state)
              }
            })
            .catch(() => {})
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })
  }

  useEffect(() => {
    const state = _.cloneDeep(filter)
    for(const [key, value] of Object.entries(router.query)) {
      if(key && isIn(key, ['gender', 'checking_type', 'check_result'])) {
        state[key] = [value]
      }
      else if(key && isIn(key, ['institution_id'])) {
        getMultipleInstitutions(value.split(','), state)
      }
      else if(key && isIn(key, ['location_service_id'])) {
        getMultipleLocationService(value.split(','), state)
      }
      else if(key && isIn(key, ['doctor_id'])) {
        getMultipleDoctor(value.split(','), state)
      }
      else if(key && isIn(key, ['guardian_id'])) {
        getMultipleGuardian(value.split(','), state)
      }
      else {
        state[key] = value
      }
    }
    setFilter(state)
  }, [router.query])

  useEffect(() => {
    const cookies = nookies.get()
    const state = _.cloneDeep(filter)
    let query = { ...router.query }

    if(isIn('institution_id', Object.keys(cookies)) && 
      !isIn('institution_id_delete', Object.keys(cookies)) &&
      !isIn('institution_id', Object.keys(query))
    ) {
      getMultipleInstitutions(cookies['institution_id'].split(','), state)
      query['page'] = query?.page || 1
      query['institution_id'] = cookies['institution_id']
    }

    if(isIn('location_service_id', Object.keys(cookies)) && 
      !isIn('location_service_id_delete', Object.keys(cookies)) &&
      !isIn('location_service_id', Object.keys(query))
    ) {
      getMultipleLocationService(cookies['location_service_id'].split(','), state)
      query['page'] = query?.page || 1
      query['location_service_id'] = cookies['location_service_id']
    }

    if(!isIn('register_start_date', Object.keys(query)) &&
       !isIn('register_end_date', Object.keys(query))
    ) {
      query['register_start_date'] = state?.register_start_date
      query['register_end_date'] = state?.register_end_date
    }

    router.replace({
      pathname: "/dashboard/clients",
      query: query
    })
  }, [])


  return (
    <>
      <Drawer
        push={true}
        title="FILTER"
        visible={visible}
        onClose={onClose}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ padding: '16px', borderBottom: '2px solid #dee2e6' }}
        height={screens.xs ? "80vh" : false}
        closeIcon={<i className="fal fa-times" />}
        placement={screens.xs ? "bottom" : "right"}
        width={screens.xl ? "30%" : screens.lg ? "40%" : screens.md ? "50%" : screens.sm ? "60%" : screens.xs ? "100%" : "100%"}
        footer={
          <Space className="float-right">
            <Button onClick={onClearFilterHandler} type="text">
              Hapus
            </Button>
            <Button onClick={onSubmitSearch} type="primary">
              Terapkan
            </Button>
          </Space>
        }
      >

        <Form layout="vertical" className="mb-3">
          <div className="p-3">
            <Form.Item label={<span className="filter-title">Jenis Pemeriksaan</span>}>
              {checkTypeList.map(tag => (
                <Tag.CheckableTag
                  key={tag.value}
                  className="py-1 user-select-none"
                  checked={checking_type.indexOf(tag.value) > -1}
                  onChange={() => onChangeCheckType(tag.value)}
                >
                  {tag.label}
                </Tag.CheckableTag>
              ))}
            </Form.Item>

            <Form.Item label={<span className="filter-title">Jenis Kelamin</span>}>
              {genderList.map(tag => (
                <Tag.CheckableTag
                  key={tag.value}
                  className="py-1 user-select-none"
                  checked={gender.indexOf(tag.value) > -1}
                  onChange={() => onChangeGender(tag.value)}
                >
                  {tag.label}
                </Tag.CheckableTag>
              ))}
            </Form.Item>

            <Form.Item label={<span className="filter-title">Hasil Pemeriksaan</span>}>
              {checkResultList.map(tag => (
                <Tag.CheckableTag
                  key={tag.value}
                  className="py-1 user-select-none"
                  checked={check_result.indexOf(tag.value) > -1}
                  onChange={() => onChangeCheckResult(tag.value)}
                >
                  {tag.label}
                </Tag.CheckableTag>
              ))}
            </Form.Item>

            <Form.Item label={<span className="filter-title">Instansi</span>}>
              <Select 
                {...selectProps}
                value={institution_id}
                placeholder="Cari instansi"
                onFocus={onFocusInstitution}
                onSearch={val => {
                  onSearchInstitution(val)
                  dispatch(actions.getInstitutionStart())
                }}
                onChange={(val) => onFilterChange(val, "institution_id")}
                notFoundContent={<NotFoundSelect loading={loadingInstitutions} />}
              >
                {institutions?.data?.length > 0 && institutions?.data.map(institution => (
                  <Select.Option value={institution.institutions_id} key={institution.institutions_id}>
                    {institution.institutions_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label={<span className="filter-title">Dokter</span>}>
              <Select 
                {...selectProps}
                value={doctor_id}
                placeholder="Cari dokter"
                onFocus={onFocusDoctor}
                onSearch={val => {
                  onSearchDoctor(val)
                  dispatch(actions.getDoctorStart())
                }}
                onChange={(val) => onFilterChange(val, "doctor_id")}
                notFoundContent={<NotFoundSelect loading={loadingDoctors} />}
              >
                {doctors?.data?.length > 0 && doctors?.data.map(doctor => (
                  <Select.Option value={doctor.users_id} key={doctor.users_id}>
                    {doctor.users_username}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label={<span className="filter-title">Penjamin</span>}>
              <Select 
                {...selectProps}
                value={guardian_id}
                placeholder="Cari penjamin"
                onFocus={onFocusGuardian}
                onSearch={val => {
                  onSearchGuardian(val)
                  dispatch(actions.getGuardianStart())
                }}
                onChange={(val) => onFilterChange(val, "guardian_id")}
                notFoundContent={<NotFoundSelect loading={loadingGuardians} />}
              >
                {guardians?.data?.length > 0 && guardians?.data.map(guardian => (
                  <Select.Option value={guardian.guardians_id} key={guardian.guardians_name}>
                    {guardian.guardians_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label={<span className="filter-title">Lokasi pelayanan</span>}>
              <Select 
                {...selectProps}
                value={location_service_id}
                placeholder="Cari lokasi pelayanan"
                onFocus={onFocusLocationServices}
                onSearch={val => {
                  onSearchLocationService(val)
                  dispatch(actions.getLocationServiceStart())
                }}
                onChange={(val) => onFilterChange(val, "location_service_id")}
                notFoundContent={<NotFoundSelect loading={loadingLocationServices} />}
              >
                {locationServices?.data?.length > 0 && locationServices?.data.map(loct => (
                  <Select.Option value={loct.location_services_id} key={loct.location_services_id}>
                    {loct.location_services_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label={<span className="filter-title">Tanggal</span>} className="mb-0">
              <DatePicker.RangePicker
                {...datePickerProps}
                format="DD MMM YYYY HH:mm"
                showTime={{ format: 'HH:mm' }}
                onChange={onChangeCheckDate}
                value={[
                  moment(check_start_date, `${DATE_FORMAT} HH:mm`).isValid() ? moment(check_start_date, `${DATE_FORMAT} HH:mm`) : "", 
                  moment(check_end_date, `${DATE_FORMAT} HH:mm`).isValid() ? moment(check_end_date, `${DATE_FORMAT} HH:mm`) : ""
                ]}
              />
              <p className="small font-italic text-muted">untuk pasien yang sudah diperiksa</p>

              <DatePicker.RangePicker
                {...datePickerProps}
                format="DD MMM YYYY"
                onChange={onChangeRegisterDate}
                value={[
                  moment(register_start_date, `${DATE_FORMAT}`).isValid() ? moment(register_start_date, `${DATE_FORMAT}`) : "", 
                  moment(register_end_date, `${DATE_FORMAT}`).isValid() ? moment(register_end_date, `${DATE_FORMAT}`) : ""
                ]}
              />
              <p className="small font-italic text-muted mb-0">untuk pasien yang belum diperiksa</p>
            </Form.Item>
          </div>
        </Form>

      </Drawer>

      <style jsx>{`
      :global(.filter-title) {
        font-weight: 500;
      }
      :global(.ant-tag-checkable) {
        background: rgb(0 0 0 / 2%);
      }
      :global(.ant-tag-checkable-checked) {
        background-color: #38ab6b;
      }
      `}</style>
    </>
  )
}

export default memo(DrawerFilter)
