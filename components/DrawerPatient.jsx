import { memo, useState, useEffect } from 'react'
import { Drawer, Form, Row, Col, Input, Select, Grid, DatePicker, Button } from 'antd'

import { formPatient } from 'formdata/patient'
import 'moment/locale/id'
import moment from 'moment'
import id_ID from "antd/lib/date-picker/locale/id_ID"

moment.locale('id')

const useBreakpoint = Grid.useBreakpoint;

const DrawerPatient = ({ visible, data, onClose, onSave }) => {
  const screens = useBreakpoint();

  const [patient, setPatient] = useState(formPatient)
  const { name, birth_place, address } = patient

  const onSaveHandler = () => {
    onSave(patient)
  }

  const onChangePatientHandler = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;
    if(item){
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

  useEffect(() => {
    setPatient(data)
  }, [data])

  return (
    <>
      <Drawer
        width={screens.xl ? "50%" : screens.lg ? "80%" : "100%"}
        placement="right"
        title="Data Pasien"
        visible={visible}
        closeIcon={<i className="fal fa-times" />}
        onClose={onClose}
      >
        <Form layout="vertical">
          <Row gutter={[10, 0]}>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Nama">
                <Input
                  name="name"
                  value={name.value}
                  placeholder="Nama Pasien"
                  onChange={onChangePatientHandler}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Jenis Kelamin">
                <Select defaultValue="laki-laki" className="w-100" placeholder="Jenis Kelamin">
                  <Select.Option value="laki-laki">Laki-laki</Select.Option>
                  <Select.Option value="perempuan">Perempuan</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Tempat Lahir">
                <Input
                  name="birth_place"
                  value={birth_place.value}
                  placeholder="Tempat Lahir"
                  onChange={(e) => onChangePatientHandler(e, "birth_place")}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Tanggal Lahir">
                <DatePicker 
                  inputReadOnly
                  locale={id_ID}
                  className="w-100"
                  format="DD MMMM YYYY"
                  placeholder="Tanggal Lahir"
                  defaultValue={moment().subtract((999*9), 'days')}
                />
              </Form.Item>
            </Col>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Form.Item label="Alamat">
                <Input.TextArea
                  name="address"
                  placeholder="Alamat"
                  value={address.value}
                  onChange={onChangePatientHandler}
                />
              </Form.Item>
            </Col>
            {/*
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Tanggal & Waktu Periksa">
                <DatePicker 
                  locale={id_ID}
                  className="w-100"
                  format="DD MMMM YYYY HH:mm"
                  showTime={{ format: "HH:mm" }}
                  defaultValue={moment(new Date())}
                  placeholder="Tanggal & Waktu Periksa"
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Hasil Pemeriksaan">
                <Select defaultValue={[]} className="w-100" placeholder="Hasil Pemeriksaan">
                  <Select.Option value="negatif">Negatif</Select.Option>
                  <Select.Option value="positif">Positif</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Penanggung Jawab">
                <Select 
                  showSearch 
                  defaultValue={[]} 
                  className="w-100" 
                  placeholder="Dokter Penanggung Jawab"
                >
                  <Select.Option value="dr. Oky Suardana">dr. Oky Suardana</Select.Option>
                  <Select.Option value="dr. Sandra Wijaya">dr. Sandra Wijaya</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Instansi">
                <Select 
                  showSearch 
                  defaultValue={[]}
                  className="w-100"
                  placeholder="Asal Instansi"
                >
                  <Select.Option value="Bhakti Rahayu Denpasar">Bhakti Rahayu Denpasar</Select.Option>
                  <Select.Option value="Bhakti Rahayu Tabanan">Bhakti Rahayu Tabanan</Select.Option>
                  <Select.Option value="Bhaksena Bypass Ngurah Rai">Bhaksena Bypass Ngurah Rai</Select.Option>
                  <Select.Option value="Bhaksena Pelabuhan Gilimanuk">Bhaksena Pelabuhan Gilimanuk</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Lokasi Pelayanan">
                <Select 
                  showSearch 
                  defaultValue={[]}
                  className="w-100"
                  placeholder="Lokasi pelayanan"
                >
                  <Select.Option value="hotel">Hotel</Select.Option>
                  <Select.Option value="lapangan">Lapangan</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Penjamin">
                <Input
                  name="incharge"
                  // value={name.value}
                  placeholder="Penjamin"
                  // onChange={onChangePatientHandler}
                />
              </Form.Item>
            </Col>
            */}
          </Row>
        </Form>

        <Button type="primary" onClick={onSaveHandler}>Simpan</Button>
      </Drawer>
    </>
  )
}

export default memo(DrawerPatient)
