import { memo, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DatePicker, Select, Input, Row, Col, Form } from 'antd'

import { genderList, checkTypeList } from 'data/all'
import { disabledTomorrow, DATE_FORMAT } from 'lib/disabledDate'

import _ from 'lodash'
import 'moment/locale/id'
import moment from 'moment'
import id_ID from "antd/lib/date-picker/locale/id_ID"

import axios from 'lib/axios'
import * as actions from 'store/actions'
import ErrorMessage from 'components/ErrorMessage'

const per_page = 20

const FormRegisterContainer = ({ register, setRegister }) => {
  const dispatch = useDispatch()
  const institutions = useSelector(state => state.institution.institution)

  const { nik, name, birth_place, birth_date, gender, address, phone, checking_type, institution_id } = register

  const getDataByNik = (nik) => {
    const query = { nik: nik }
    axios.get('/clients/get-data-by-nik', { params: query })
      .then(res => {
        if(res?.data) {
          const state = _.cloneDeep(register)
          for (const [key, value] of Object.entries(res.data)) {
            if(state[key] && key !== "nik") {
              state[key].value = value
              state[key].isValid = true
              state[key].message = null
            }
            if(state[key] && key === "phone") {
              const realPhone = value?.split(' ')
              realPhone?.shift()
              state[key].value = realPhone?.join("")
              state[key].isValid = true
              state[key].message = null
            }
            if(key === "birth_date" && value) {
              state[key].value = moment(value).format(DATE_FORMAT)
              state[key].isValid = true
              state[key].message = null
            }
          }
          setRegister(state)
        }
        else if(res?.data === null) {
          getInfoByNik(nik)
        }
        else {
          return null
        }
      })
      .catch(() => {
        return null
      })
  }

  const getInfoByNik = (nik) => {
    const query = { nik: nik }
    axios.get('/clients/get-info-by-nik', { params: query })
      .then(res => {
        if(res?.data?.valid) {
          const state = _.cloneDeep(register)
          if(res?.data?.gender) {
            state['gender'].value = res?.data?.gender
            state['gender'].isValid = true
            state['gender'].message = null
          }
          if(res?.data?.birth_date) {
            state['birth_date'].value = moment(res?.data?.birth_date).format(DATE_FORMAT)
            state['birth_date'].isValid = true
            state['birth_date'].message = null
          }
          setRegister(state)
        }
      })
      .catch(() => {
        return null
      })
  }

  /* REGISTER CHANGE FUNCTION */
  const onChangeHandler = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;

    if(item === "nik"){
      const { value } = e.target;
      const reg = /^-?\d*(\.\d*)?$/;
      if ((!isNaN(value) && reg.test(value)) || value === '') {
        const data = {
          ...register,
          nik: { ...register['nik'], value: value, isValid: true, message: null }
        }
        setRegister(data)
      }
    } 
    else if(item === "checking_type") {
      const data = {
        ...register,
        [item]: { ...register[item], value: e, isValid: true, message: null },
        institution_id: { ...register['institution_id'], value: [] }
      }
      setRegister(data)
    }
    else if(item) {
      const data = {
        ...register,
        [item]: { ...register[item], value: e, isValid: true, message: null }
      }
      setRegister(data)
    }
    else {
      const data = {
        ...register,
        [name]: { ...register[name], value: value, isValid: true, message: null }
      }
      setRegister(data)
    }
  }

  const onBirthDateChangeHandler = (date) => {
    if(moment(date).isValid()) {
      const data = {
        ...register,
        birth_date: { ...register['birth_date'], value: moment(date).format(DATE_FORMAT), isValid: true, message: null }
      }
      setRegister(data)
    }
  }
  /* REGISTER CHANGE FUNCTION */

  const onSearchInstitution = useCallback(val => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page
    queryString["checking_type"] = checking_type?.value

    if(val) queryString["q"] = val
    else delete queryString["q"]

    dispatch(actions.getInstitution({ ...queryString }))
  }, [checking_type.value])

  const onFocusInstitution = () => {
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page
    queryString["checking_type"] = checking_type?.value

    dispatch(actions.getInstitution({ ...queryString }))
  }

  useEffect(() => {
    if(nik?.value?.length === 16) {
      getDataByNik(nik.value)
    }
  }, [nik.value])

  return (
    <>
      <Form layout="vertical" className="w-100">
        <Form.Item 
          label="NIK"
          validateStatus={!nik.isValid && nik.message && "error"}
        >
          <Input 
            name="nik"
            value={nik.value}
            className="py-2 text-uppercase"
            onChange={(e) => onChangeHandler(e, "nik")}
            placeholder="Nomor Induk Kependudukan"
          />
          <ErrorMessage item={nik} />
        </Form.Item>

        <Form.Item
          label="Nama Lengkap"
          validateStatus={!name.isValid && name.message && "error"}
        >
          <Input 
            name="name"
            className="py-2 text-uppercase"
            value={name.value}
            onChange={onChangeHandler}
            placeholder="Nama Lengkap"
          />
          <ErrorMessage item={name} />
        </Form.Item>
        
        <Row gutter={[10,10]}>
          <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
            <Form.Item
              label="Tempat Lahir"
              validateStatus={!birth_place.isValid && birth_place.message && "error"}
            >
              <Input 
                name="birth_place"
                className="py-2 text-uppercase"
                value={birth_place.value}
                onChange={onChangeHandler}
                placeholder="Tempat Lahir"
              />
              <ErrorMessage item={birth_place} />
            </Form.Item>
          </Col>
          <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
            <Form.Item 
              label="Tanggal Lahir"
              validateStatus={!birth_date.isValid && birth_date.message && "error"}
            >
              <DatePicker 
                inputReadOnly
                locale={id_ID}
                format="DD MMMM YYYY"
                className="w-100 fs-14 py-2"
                placeholder="Tanggal Lahir"
                disabledDate={disabledTomorrow}
                onChange={onBirthDateChangeHandler}
                value={birth_date?.value ? moment(birth_date?.value, DATE_FORMAT) : ''}
              />
              <ErrorMessage item={birth_date} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={[10,0]}>
          <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
            <Form.Item
              label="Jenis Kelamin"
              validateStatus={!gender.isValid && gender.message && "error"}
            >
              <Select 
                value={gender.value}
                placeholder="Jenis Kelamin"
                className="w-100 select-py-2"
                onChange={e => onChangeHandler(e, "gender")}
                getPopupContainer={triggerNode => triggerNode.parentElement}
              >
                {genderList.map(data => (
                  <Select.Option value={data.value} key={data.value}>
                    <span className="va-sub text-uppercase">{data.value}</span>
                  </Select.Option>
                ))}
              </Select>
              <ErrorMessage item={gender} />
            </Form.Item>
          </Col>

          <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
            <Form.Item
              label="No. Telepon"
              validateStatus={!phone.isValid && phone.message && "error"}
            >
              <Input
                name="phone"
                className="py-2 text-uppercase"
                value={phone.value}
                onChange={onChangeHandler}
                placeholder="Nomor Telepon"
                prefix="+62"
              />
              <ErrorMessage item={phone} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Alamat"
          validateStatus={!address.isValid && address.message && "error"}
        >
          <Input
            name="address"
            className="py-2 text-uppercase"
            value={address.value}
            onChange={onChangeHandler}
            placeholder="Alamat"
          />
          <ErrorMessage item={address} />
        </Form.Item>

        <Row gutter={[10,0]}>
          <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
            <Form.Item 
              label="Jenis Pemeriksaan"
              validateStatus={!checking_type.isValid && checking_type.message && "error"}
            >
              <Select 
                className="w-100 select-py-2"
                placeholder="Jenis Pemeriksaan"
                onChange={e => onChangeHandler(e, "checking_type")}
                getPopupContainer={triggerNode => triggerNode.parentElement}
              >
                {checkTypeList.map(data => (
                  <Select.Option value={data.value} key={data.value}>
                    <span className="va-sub">{data.label}</span>
                  </Select.Option>
                ))}
              </Select>
              <ErrorMessage item={checking_type} />
            </Form.Item>
          </Col>

          <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
            <Form.Item 
              label="Pilih Instansi"
              validateStatus={!institution_id.isValid && institution_id.message && "error"}
            >
              <Select 
                showSearch 
                placeholder="Pilih Instansi"
                className="w-100 select-py-2 with-input"
                value={institution_id.value}
                onFocus={onFocusInstitution}
                onSearch={onSearchInstitution}
                onChange={e => onChangeHandler(e, "institution_id")}
                getPopupContainer={triggerNode => triggerNode.parentElement}
                filterOption={(input, option) =>
                  option?.children?.props?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {institutions?.data?.length > 0 && institutions?.data.map(institution => (
                  <Select.Option value={institution.institutions_id} key={institution.institutions_id}>
                    <span className="va-sub">{institution.institutions_name}</span>
                  </Select.Option>
                ))}
              </Select>
              <ErrorMessage item={institution_id} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default memo(FormRegisterContainer)
