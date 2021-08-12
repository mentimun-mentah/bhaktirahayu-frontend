import { memo, useState, useEffect } from 'react'
import { Drawer, Form, Row, Col, Input, Select, Grid, DatePicker, Button } from 'antd'

import { genderList } from 'data/all'
import { formPatient } from 'formdata/patient'
import { disabledTomorrow, DATE_FORMAT } from 'lib/disabledDate'
import { jsonHeaderHandler, formErrorMessage, errNik, errPhone, signature_exp } from 'lib/axios'

import _ from 'lodash'
import 'moment/locale/id'
import moment from 'moment'
import isIn from 'validator/lib/isIn'
import id_ID from "antd/lib/date-picker/locale/id_ID"

import axios from 'lib/axios'
import ErrorMessage from 'components/ErrorMessage'

moment.locale('id')

const useBreakpoint = Grid.useBreakpoint;

const DrawerPatient = ({ visible, dataPatient, onCloseHandler }) => {
  const screens = useBreakpoint();

  const [loading, setLoading] = useState(false)
  const [patient, setPatient] = useState(formPatient)
  const { id, nik, name, birth_place, birth_date, gender, address, phone } = patient

  const onClosePatientDrawerHandler = e => {
    e?.preventDefault()
    onCloseHandler()
    setPatient(formPatient)
  }

  const onSubmitHandler = e => {
    e.preventDefault()
    const data ={
      nik: nik?.value.toUpperCase(),
      name: name?.value.toUpperCase(),
      birth_place: birth_place?.value.toUpperCase(),
      birth_date: birth_date.value,
      gender: gender?.value.toUpperCase(),
      address: address?.value.toUpperCase(),
      phone: phone?.value
    }

    setLoading(true)
    axios.put(`/clients/update/${id.value}`, data, jsonHeaderHandler())
      .then(res => {
        setLoading(false)
        formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
        onClosePatientDrawerHandler()
      })
      .catch(err => {
        setLoading(false)
        const state = _.cloneDeep(patient)
        const errDetail = err.response?.data.detail

        if(errDetail === signature_exp) {
          formErrorMessage(err.response.status === 404 ? 'error' : 'success', 'Successfully update the client.')
          onClosePatientDrawerHandler()
        }
        else if(typeof errDetail === "string" && isIn(errDetail, errNik)) {
          state.nik.value = state.nik.value
          state.nik.isValid = false
          state.nik.message = errDetail
        }
        else if(typeof errDetail === "string" && isIn(errDetail, errPhone)) {
          state.phone.value = state.phone.value
          state.phone.isValid = false
          state.phone.message = errDetail
        }
        else if(typeof errDetail === "string" && !isIn(errDetail, errNik) && !isIn(errDetail, errPhone)) {
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
        setPatient(state)
      })
  }

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;

    if(item === "nik"){
      const { value } = e.target;
      const reg = /^-?\d*(\.\d*)?$/;
      if ((!isNaN(value) && reg.test(value)) || value === '') {
        const data = {
          ...patient,
          nik: { ...patient['nik'], value: value, isValid: true, message: null }
        }
        setPatient(data)
      }
    } 
    else if(item) {
      const data = {
        ...patient,
        [item]: { ...patient[item], value: e, isValid: true, message: null }
      }
      setPatient(data)
    }
    else {
      const data = {
        ...patient,
        [name]: { ...patient[name], value: value, isValid: true, message: null }
      }
      setPatient(data)
    }
  }

  const onBirthDateChangeHandler = (date) => {
    if(moment(date).isValid()) {
      const data = {
        ...patient,
        birth_date: { ...patient['birth_date'], value: moment(date).format('DD-MM-YYYY'), isValid: true, message: null }
      }
      setPatient(data)
    }
  }
  /* INPUT CHANGE FUNCTION */

  useEffect(() => {
    setPatient(dataPatient)
  }, [dataPatient])

  return (
    <>
      <Drawer
        placement="right"
        title="Data Pasien"
        visible={visible}
        onClose={onClosePatientDrawerHandler}
        closeIcon={<i className="fal fa-times" />}
        width={screens.xl ? "50%" : screens.lg ? "80%" : "100%"}
      >
        <Form layout="vertical">
          <Row gutter={[10, 0]}>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item 
                label="NIK"
                validateStatus={!nik.isValid && nik.message && "error"}
              >
                <Input 
                  name="nik"
                  value={nik.value}
                  className="text-uppercase"
                  onChange={(e) => onChangeHandler(e, "nik")}
                  placeholder="Nomor Induk Kependudukan"
                />
                <ErrorMessage item={nik} />
              </Form.Item>
            </Col>

            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Nama Lengkap"
                validateStatus={!name.isValid && name.message && "error"}
              >
                <Input 
                  name="name"
                  className="text-uppercase"
                  value={name.value}
                  onChange={onChangeHandler}
                  placeholder="Nama Lengkap"
                />
                <ErrorMessage item={name} />
              </Form.Item>
            </Col>

            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Jenis Kelamin"
                validateStatus={!gender.isValid && gender.message && "error"}
              >
                <Select 
                  value={gender.value}
                  placeholder="Jenis Kelamin"
                  className="w-100"
                  onChange={e => onChangeHandler(e, "gender")}
                >
                  {genderList.map(data => (
                    <Select.Option value={data.value} key={data.value}>{data.value}</Select.Option>
                  ))}
                </Select>
                <ErrorMessage item={gender} />
              </Form.Item>
            </Col>

            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="Tempat Lahir"
                validateStatus={!birth_place.isValid && birth_place.message && "error"}
              >
                <Input 
                  name="birth_place"
                  className="text-uppercase"
                  value={birth_place.value}
                  onChange={onChangeHandler}
                  placeholder="Tempat Lahir"
                />
                <ErrorMessage item={birth_place} />
              </Form.Item>
            </Col>

            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item 
                label="Tanggal Lahir"
                validateStatus={!birth_date.isValid && birth_date.message && "error"}
              >
                <DatePicker 
                  inputReadOnly
                  locale={id_ID}
                  format="DD MMMM YYYY"
                  className="w-100"
                  placeholder="Tanggal Lahir"
                  disabledDate={disabledTomorrow}
                  onChange={onBirthDateChangeHandler}
                  value={birth_date?.value ? moment(birth_date?.value, DATE_FORMAT) : ''}
                />
                <ErrorMessage item={birth_date} />
              </Form.Item>
            </Col>

            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label="No. Telepon"
                validateStatus={!phone.isValid && phone.message && "error"}
              >
                <Input
                  name="phone"
                  className="text-uppercase"
                  value={phone.value}
                  onChange={onChangeHandler}
                  placeholder="Nomor Telepon"
                  prefix="+62"
                />
                <ErrorMessage item={phone} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Alamat"
                validateStatus={!address.isValid && address.message && "error"}
              >
                <Input.TextArea
                  name="address"
                  className="text-uppercase"
                  value={address.value}
                  onChange={onChangeHandler}
                  placeholder="Alamat"
                />
                <ErrorMessage item={address} />
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

export default memo(DrawerPatient)
