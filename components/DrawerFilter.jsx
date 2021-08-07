import { memo, useState } from 'react'
import { Drawer, Form, Input, Select, Grid, DatePicker, Button, Space, Tag } from 'antd'

import 'moment/locale/id'
import moment from 'moment'
import id_ID from "antd/lib/date-picker/locale/id_ID"

moment.locale('id')

const useBreakpoint = Grid.useBreakpoint;

const genderList = [
  {
    label: 'Laki-laki',
    value: 'LAKI-LAKI'
  },
  {
    label: 'Perempuan',
    value: 'PEREMPUAN'
  }
];
const checkTypeList = [
  {
    label: 'GeNose',
    value: 'genose'
  },
  {
    label: 'Antigen',
    value: 'antigen'
  }
];
const checkResultList = [
  {
    label: 'Positive',
    value: 'positive'
  },
  {
    label: 'Negative',
    value: 'negative'
  },
  {
    label: 'Belum diperiksa',
    value: 'empty'
  }
];

const DrawerFilter = ({ visible, onClose }) => {
  const screens = useBreakpoint();
  const [gender, setGender] = useState([])
  const [checkType, setCheckType] = useState([])
  const [checkResult, setCheckResult] = useState([])

  const onChangeGender = (tag) => {
    if(tag === gender[0]) setGender([])
    else setGender([tag])
  }

  const onChangeCheckType = (tag) => {
    if(tag === checkType[0]) setCheckType([])
    else setCheckType([tag])
  }

  const onChangeCheckResult = (tag) => {
    if(tag === checkResult[0]) setCheckResult([])
    else setCheckResult([tag])
  }

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
            <Button onClick={onClose} type="text">
              Hapus
            </Button>
            <Button onClick={onClose} type="primary">
              Terapkan
            </Button>
          </Space>
        }
      >

        <Form layout="vertical" className="mb-3">
          <div className="p-3">
            <Form.Item 
              label={<span className="filter-title">Jenis Pemeriksaan</span>}
            >
              {checkTypeList.map(tag => (
                <Tag.CheckableTag
                  key={tag.value}
                  className="py-1 user-select-none"
                  checked={checkType.indexOf(tag.value) > -1}
                  onChange={() => onChangeCheckType(tag.value)}
                >
                  {tag.label}
                </Tag.CheckableTag>
              ))}
            </Form.Item>

            <Form.Item 
              label={<span className="filter-title">Jenis Kelamin</span>}
            >
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

            <Form.Item 
              label={<span className="filter-title">Hasil Pemeriksaan</span>}
            >
              {checkResultList.map(tag => (
                <Tag.CheckableTag
                  key={tag.value}
                  className="py-1 user-select-none"
                  checked={checkResult.indexOf(tag.value) > -1}
                  onChange={() => onChangeCheckResult(tag.value)}
                >
                  {tag.label}
                </Tag.CheckableTag>
              ))}
            </Form.Item>

            <Form.Item 
              label={<span className="filter-title">Instansi</span>}
            >
              <Select 
                showSearch 
                allowClear
                mode="multiple"
                defaultValue={[]}
                className="w-100"
                placeholder="Cari instansi"
              >
                <Select.Option value="Denpasar">
                  Denpasar
                </Select.Option>
                <Select.Option value="Tabanan">
                  Tabanan
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item 
              label={<span className="filter-title">Dokter</span>}
            >
              <Select 
                showSearch 
                allowClear
                mode="multiple"
                defaultValue={[]}
                className="w-100"
                placeholder="Cari dokter"
              >
                <Select.Option value="Okky Suardhana">
                  Okky Suardhana
                </Select.Option>
                <Select.Option value="Suardhana Okky">
                  Suardhana Okky
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item 
              label={<span className="filter-title">Penjamin</span>}
            >
              <Select 
                showSearch 
                allowClear
                mode="multiple"
                defaultValue={[]}
                className="w-100"
                placeholder="Cari penjamin"
              >
                <Select.Option value="I Komang Okky">
                  I Komang Okky
                </Select.Option>
                <Select.Option value="Suardhana">
                  Suardhana
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item 
              label={<span className="filter-title">Lokasi pelayanan</span>}
            >
              <Select 
                showSearch 
                allowClear
                mode="multiple"
                defaultValue={[]}
                className="w-100"
                placeholder="Cari lokasi pelayanan"
              >
                {[...Array(30)].map((_, i) => (
                  <Select.Option value={`Hotel${i}`} key={i}>
                    Hotel {i}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item 
              label={<span className="filter-title">Tanggal</span>}
            >
              <DatePicker.RangePicker
                inputReadOnly
                locale={id_ID}
                className="w-100"
                format="DD MMM YYYY HH:mm"
                showTime={{ format: 'HH:mm' }}
                ranges={{
                  'Hari ini': [moment(), moment()],
                  'Bulan ini': [moment().startOf('month'), moment()],
                }}
              />
              <p className="small font-italic text-muted">untuk pasien yang sudah diperiksa</p>

              <DatePicker.RangePicker
                inputReadOnly
                locale={id_ID}
                className="w-100"
                format="DD MMM YYYY"
                ranges={{
                  'Hari ini': [moment(), moment()],
                  'Bulan ini': [moment().startOf('month'), moment()],
                }}
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
