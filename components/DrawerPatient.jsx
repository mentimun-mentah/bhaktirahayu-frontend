import { memo, useState, useEffect } from 'react'
import { Drawer, Form, Row, Col, Input, Select, Grid, DatePicker, Button } from 'antd'

import { formPatient } from 'formdata/patient'
import moment from 'moment'

const useBreakpoint = Grid.useBreakpoint;

const DrawerPatient = ({ visible, data, onClose, onSave }) => {
  const screens = useBreakpoint();

  const [patient, setPatient] = useState(formPatient)
  const { name, pob, gender, address, result } = patient

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
                  name="pob"
                  value={pob.value}
                  placeholder="Tempat Lahir"
                  onChange={(e) => onChangePatientHandler(e, "pob")}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Tanggal Lahir">
                <DatePicker 
                  className="w-100"
                  placeholder="Tanggal Lahir"
                  defaultValue={moment().subtract((999*9), 'days')}
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>
            <Col xl={24} lg={24} md={12} sm={24} xs={24}>
              <Form.Item label="Alamat">
                <Input.TextArea
                  name="address"
                  value={address.value}
                  placeholder="Alamat"
                  onChange={onChangePatientHandler}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Tanggal & Waktu Periksa">
                <DatePicker 
                  showTime={{ format: "HH:mm" }}
                  className="w-100"
                  placeholder="Tanggal & Waktu Periksa"
                  defaultValue={moment(new Date())}
                  format="DD-MM-YYYY HH:mm"
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
                <Select defaultValue={[]} className="w-100" placeholder="Dokter Penanggung Jawab">
                  <Select.Option value="negatif">dr. Oky Suardana</Select.Option>
                  <Select.Option value="positif">dr. Sandra Wijaya</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="No RM">
                <Input
                  name="no_rm"
                  placeholder="No RM"
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item label="Instansi">
                <Select defaultValue={[]} className="w-100" placeholder="Asal Instansi">
                  <Select.Option value="denpasar">Bhakti Rahayu Denpasar</Select.Option>
                  <Select.Option value="tabanan">Bhakti Rahayu Tabanan</Select.Option>
                  <Select.Option value="ngurah_rai">Bhaksena Bypass Ngurah Rai</Select.Option>
                  <Select.Option value="gilimanuk">Bhaksena Pelabuhan Gilimanuk</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Button type="primary" onClick={onSaveHandler}>Simpan</Button>
      </Drawer>
    </>
  )
}

export default memo(DrawerPatient)
