import { document_list } from 'data/home'
import { Tag, Tooltip } from 'antd'

import _ from "lodash"
import moment from 'moment'
import 'moment/locale/id'
moment.locale('id')

const NIK = document_list[0].value
const PASPOR = document_list[1].value

export const columnsReports = [
  {
    key: 'clients',
    title: 'NIK / Paspor',
    dataIndex: 'clients',
    width: 220,
    render: (item) => (
      <>
        <Tag color="#87d068" className="count-check-tag">{item.clients_covid_checkups?.length}×</Tag>
        <span className="text-uppercase">{item.clients_nik}</span>
      </>
    )
  },
  {
    key: 'clients_name',
    title: 'NAMA',
    dataIndex: 'clients_name',
    width: 250,
    ellipsis: { showTitle: false },
    render: (item) => (
      <Tooltip placement="topLeft" title={item}>
        <span className="text-uppercase">{item}</span>
      </Tooltip>
    )
  },
  {
    key: 'clients_gender',
    title: 'JENIS KELAMIN',
    dataIndex: 'clients_gender',
    width: 150,
    render: (item) => <span className="text-uppercase">{item}</span>
  },
  {
    key: 'clients_birth_place',
    title: 'TEMPAT LAHIR',
    dataIndex: 'clients_birth_place',
    width: 200,
    render: (item) => <span className="text-uppercase">{item}</span>
  },
  {
    key: 'clients_birth_date',
    title: 'TANGGAL LAHIR',
    dataIndex: 'clients_birth_date',
    width: 200,
    render: (item) => item && <span className="text-uppercase">{moment(item).format('DD MMMM YYYY')}</span>
  },
  {
    key: 'clients_address',
    title: 'ALAMAT',
    dataIndex: 'clients_address',
    width: 200,
    ellipsis: { showTitle: false },
    render: (item) => (
      <Tooltip placement="topLeft" title={item}>
        <span className="text-uppercase">{item}</span>
      </Tooltip>
    )
  },
  {
    key: 'clients_phone',
    title: 'NO. TELEPON',
    dataIndex: 'clients_phone',
    width: 200,
    render: (item) => <span className="text-uppercase">{item}</span>
  },
  {
    key: 'action',
    title: 'AKSI',
    type: 'action',
    align: 'center',
    fixed: 'right',
    dataIndex: 'action',
    width: 90,
    editable: true
  },
]

export const columnsRiwayatPatient = [
  {
    key: 'covid_checkups_checking_type',
    title: 'JENIS PEMERIKSAAN',
    align: 'center',
    dataIndex: 'covid_checkups_checking_type',
    width: 200,
    render: (item) => <span className="text-uppercase">{item}</span>
  },
  {
    key: 'covid_checkups_institution_name',
    title: 'INSTANSI',
    align: 'center',
    dataIndex: 'covid_checkups_institution_name',
    width: 200,
    ellipsis: { showTitle: false },
    render: (item) => (
      <Tooltip placement="topLeft" title={item}>
        <span className="text-uppercase">{item}</span>
      </Tooltip>
    )
  },
  {
    key: 'covid_checkups_doctor_username',
    title: 'PENANGGUNG JAWAB',
    align: 'center',
    dataIndex: 'covid_checkups_doctor_username',
    width: 200,
    ellipsis: { showTitle: false },
    render: (item) => (
      <Tooltip placement="topLeft" title={item}>
        <span className="text-uppercase">{item ? item : '-'}</span>
      </Tooltip>
    )
  },
  {
    key: 'covid_checkups_location_service_name',
    title: 'LOKASI PELAYANAN',
    align: 'center',
    dataIndex: 'covid_checkups_location_service_name',
    width: 200,
    render: (item) => <span className="text-uppercase">{item ? item : '-'}</span>
  },
  {
    key: 'covid_checkups_guardian_name',
    title: 'PENJAMIN',
    align: 'center',
    dataIndex: 'covid_checkups_guardian_name',
    width: 150,
    render: (item) => <span className="text-uppercase">{item ? item : '-'}</span>
  },
  {
    key: 'covid_checkups_check_date',
    title: 'TANGGAL & WAKTU PERIKSA',
    align: 'center',
    dataIndex: 'covid_checkups_check_date',
    width: 250,
    render: (item) => <span className="text-uppercase">{item ? moment(item).format('DD MMMM YYYY HH:mm') : '-'}</span>
  },
  {
    key: 'covid_checkups_check_result',
    title: 'HASIL',
    align: 'center',
    dataIndex: 'covid_checkups_check_result',
    width: 100,
    render: (item) => <span className="text-uppercase">{item ? item : '-'}</span>
  },
  {
    key: 'action',
    title: 'AKSI',
    type: 'action',
    align: 'center',
    fixed: 'right',
    dataIndex: 'action',
    width: 100,
    editable: true
  },
]

export const reformatData = listData => {
  const copyData = _.cloneDeep(listData)

  copyData.forEach(data => {
    let documentType = 'KTP / KIS'
    if(data?.clients_type_identity?.toLowerCase() === PASPOR) documentType = 'PASPOR'
    if(data?.clients_type_identity?.toLowerCase() === NIK) documentType = 'KTP / KIS'

    data['No'] = data.clients_no ? data?.clients_no : '-'
    data['Tipe Dokumen'] = documentType ? documentType?.toUpperCase() : '-'
    data['NIK'] = data?.clients_nik ? data?.clients_nik?.toUpperCase() : '-'
    data['Nama'] = data?.clients_gender ? data?.clients_name?.toUpperCase() : '-'
    data['Jenis Kelamin'] = data?.clients_gender ? data?.clients_gender?.toUpperCase() : '-'
    data['Tempat Lahir'] = data?.clients_birth_place ? data?.clients_birth_place?.toUpperCase() : '-'
    data['Tanggal Lahir'] = data?.clients_birth_date ? moment(data?.clients_birth_date, 'YYYY-MM-DD').format('DD MMMM YYYY').toUpperCase() : '-'
    data['Alamat'] = data?.clients_address?.toUpperCase()
    data['Tanggal & Waktu Periksa'] = data?.covid_checkups_check_date ? moment(data?.covid_checkups_check_date).format('DD MMMM YYYY HH:mm').toUpperCase() : '-'
    data['Hasil'] = data?.covid_checkups_check_result ? data?.covid_checkups_check_result?.toUpperCase() : '-'
    data['Tipe Pemeriksaan'] = data?.covid_checkups_checking_type ? data?.covid_checkups_checking_type?.toUpperCase() : '-'
    data['Dokter Penanggung Jawab'] = data?.covid_checkups_doctor_username ? data?.covid_checkups_doctor_username?.toUpperCase() : '-'
    data['Instansi'] = data?.covid_checkups_institution_name ? data?.covid_checkups_institution_name?.toUpperCase() : '-'
    data['Lokasi Pelayanan'] = data?.covid_checkups_location_service_name ? data?.covid_checkups_location_service_name?.toUpperCase() : '-'
    data['Penjamin'] = data?.covid_checkups_guardian_name ? data?.covid_checkups_guardian_name?.toUpperCase() : '-'
    Object.keys(listData[0]).forEach(key => delete data[key])
  })

  return copyData
}
