import { memo, useState, useEffect } from 'react'
import { Drawer, Form, Row, Col, Input, Select, Grid, DatePicker, Button } from 'antd'

import { formPatient } from 'formdata/patient'
import 'moment/locale/id'
import moment from 'moment'
import id_ID from "antd/lib/date-picker/locale/id_ID"

moment.locale('id')

const useBreakpoint = Grid.useBreakpoint;

const DrawerResultPatient = ({ visible, data, onClose, onSave }) => {
  const screens = useBreakpoint();

  const [patient, setPatient] = useState(formPatient)

  const onSaveHandler = () => {
    onSave(patient)
  }

  useEffect(() => {
    setPatient(data)
  }, [data])

  return (
    <>
      <Drawer
        push
        width={screens.xl ? "50%" : screens.lg ? "80%" : screens.md ? "80%" : "100%"}
        placement="right"
        title="Hasil Pemeriksaan"
        visible={visible}
        closeIcon={<i className="fal fa-times" />}
        onClose={onClose}
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
                <Select 
                  showSearch 
                  defaultValue={[]}
                  className="w-100"
                  placeholder="Penjamin"
                >
                  <Select.Option value="Okky">Okky</Select.Option>
                  <Select.Option value="Komang">Komang</Select.Option>
                  <Select.Option value="Suardhana">Suardhana</Select.Option>
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

export default memo(DrawerResultPatient)
