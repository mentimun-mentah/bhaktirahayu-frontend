import { memo, useState, useEffect } from 'react'
import { Drawer, Grid, Space, Tooltip, Popconfirm } from 'antd'

import { formPatient } from 'formdata/patient'

import 'moment/locale/id'
import moment from 'moment'
import TableMemo from 'components/TableMemo'

moment.locale('id')

const useBreakpoint = Grid.useBreakpoint;

const dataSource = [
  {
    "key": "1",
    "nik": "5129365972846713",
    "name": "SUPIATUN",
    "gender": "Laki-laki",
    "birth_place": "GEROGAK",
    "birth_date": "31-Dec-1984",
    "address": "GEROGAK",
    "checkup_date": "19-Jun-2021",
    "checkup_time": "10:20",
    "result": "NEGATIF",
  },
  {
    "key": "42",
    "nik": "1388881739777555",
    "name": "ZULFA RIYANA",
    "gender": "Laki-laki",
    "birth_place": "SUMENEP",
    "birth_date": "10-Oct-1999",
    "address": "DUSUN CEN LECEN",
    "checkup_date": "30-Jun-2021",
    "checkup_time": "12:06",
    "result": "POSITIF"
  },
  {
    "key": "50",
    "nik": "2835671100698890",
    "name": "SEPTYAN EKO CAHYONO",
    "gender": "Laki-laki",
    "birth_place": "BANYUWANGI",
    "birth_date": "23-Sep-1989",
    "address": "BENDOREJO",
    "checkup_date": "14-Jul-2021",
    "checkup_time": "12:12",
    "result": "NEGATIF"
  }
]

export const columnsReports = [
  {
    key: 'institution',
    title: 'INSTANSI',
    align: 'center',
    dataIndex: 'institution',
    width: 80,
    render: () => <span className="text-uppercase">Bhaktirahayu Denpasar</span>
  },
  {
    key: 'pic',
    title: 'PENANGGUNG JAWAB',
    align: 'center',
    dataIndex: 'pic',
    width: 70,
    render: () => <span className="text-uppercase">dr. Okky Suardhana</span>
  },
  {
    key: 'location-service',
    title: 'LOKASI PELAYANAN',
    align: 'center',
    dataIndex: 'location-service',
    width: 60,
    render: () => <span className="text-uppercase">Hotel</span>
  },
  {
    key: 'guardian',
    title: 'PENJAMIN',
    align: 'center',
    dataIndex: 'guardian',
    width: 50,
    render: () => <span className="text-uppercase">-</span>
  },
  {
    key: 'checkup_date',
    title: 'TANGGAL PERIKSA',
    align: 'center',
    dataIndex: 'checkup_date',
    width: 60,
    render: (item) => <span className="text-uppercase">{moment(item).format('DD MMMM YYYY')}</span>
  },
  {
    key: 'checkup_time',
    title: 'WAKTU PERIKSA',
    align: 'center',
    dataIndex: 'checkup_time',
    width: 50,
    render: (item) => <span className="text-uppercase">{moment(item, 'HH:mm').format('HH:mm')}</span>
  },
  {
    key: 'result',
    title: 'HASIL',
    align: 'center',
    dataIndex: 'result',
    width: 30,
    render: (item) => <span className={`${item.toUpperCase() === 'POSITIF' && 'text-danger font-weight-bold'}`}>{item.toUpperCase()}</span>
  },
  {
    key: 'action',
    title: 'AKSI',
    type: 'action',
    align: 'center',
    fixed: 'right',
    dataIndex: 'action',
    width: 40,
    editable: true
  },
]

const ProductCellEditable = ({ index, record, editable, type, children, onShowDrawer, onShowDetailPatient, ...restProps }) => {
  let childNode = children

  if(editable){
    childNode = (
      type === "action" && (
        <Space>
          <Tooltip placement="top" title="Ubah">
            <a onClick={() => onShowDrawer(record)}><i className="fal fa-edit text-center" /></a>
          </Tooltip>
          <Tooltip placement="top" title="Hasil">
            <a onClick={() => pdfGenerator(record, index)}><i className="fal fa-eye text-center" /></a>
          </Tooltip>
          <Tooltip placement="top" title="Hapus">
            <Popconfirm
              placement="bottomRight"
              title="Hapus data ini?"
              onConfirm={() => message.info('Data berhasil dihapus!')}
              okText="Ya"
              cancelText="Batal"
            >
              <a><i className="fal fa-trash-alt text-danger text-center" /></a>
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    )
  }
  
  return <td {...restProps}>{childNode}</td>
}

const DrawerPatient = ({ visible, data, onClose }) => {
  const screens = useBreakpoint();

  const [patient, setPatient] = useState(formPatient)

  const columnsPatient = columnsReports.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record, index: index,
        type: col.type, 
        editable: col.editable,
        onShowDrawer: () => {},
        onShowDetailPatient: () => {}
      })
    }
  })

  useEffect(() => {
    setPatient(data)
  }, [data])

  return (
    <>
      <Drawer
        width={screens.xl ? "50%" : screens.lg ? "80%" : "100%"}
        placement="right"
        title="Riwayat Pemeriksaan"
        visible={visible}
        closeIcon={<i className="fal fa-times" />}
        onClose={onClose}
      >
        <table className="table mb-4">
          <tbody>
            <tr>
              <th className="border-0" scope="row">NIK</th>
              <td className="border-0">23131298343477</td>
            </tr>
            <tr>
              <th scope="row">Nama</th>
              <td>Paulus Bonatua Simanjuntak</td>
            </tr>
            <tr>
              <th scope="row">Tempat Tanggal Lahir</th>
              <td>Denpasar, 6 September 1999</td>
            </tr>
            <tr>
              <th scope="row">Jenis Kelamin</th>
              <td>Laki-laki</td>
            </tr>
            <tr>
              <th scope="row">Alamat</th>
              <td>Jl. Raya Puputan No.86, Dangin Puri Klod, Kec. Denpasar Timur</td>
            </tr>
          </tbody>
        </table>

        <TableMemo
          bordered
          size="middle"
          pagination={false} 
          columns={columnsPatient}
          dataSource={dataSource} 
          scroll={{ y: 485, x: 1180 }} 
          components={{ body: { cell: ProductCellEditable } }}
        />

      </Drawer>

      <style jsx>{`
      .table td, .table th {
        border-top: 1px solid #f0f0f0;
      }
      `}</style>
    </>
  )
}

export default memo(DrawerPatient)
