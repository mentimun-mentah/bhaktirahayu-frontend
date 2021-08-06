import { Space, Button, Tag } from 'antd'
import _ from "lodash"
import moment from 'moment'
import 'moment/locale/id'
moment.locale('id')

export const dataSourceReports = [
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
      "key": "2",
      "nik": "1747547650338991",
      "name": "ARIF ISDANI",
      "gender": "Perempuan",
      "birth_place": "JATIM",
      "birth_date": "2-Jan-1983",
      "address": "GEROGAK",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "10:20",
      "result": "Positif"
  },
  {
      "key": "3",
      "nik": "8782364515914821",
      "name": "ABDILLAH",
      "gender": "Laki-laki",
      "birth_place": "PATAS",
      "birth_date": "10-Jun-1983",
      "address": "GEROGAK",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "10:20",
      "result": "NEGATIF"
  },
  {
      "key": "4",
      "nik": "369806642680487",
      "name": "RUSMAWATI",
      "gender": "Perempuan",
      "birth_place": "GEROGAK",
      "birth_date": "25-Nov-1981",
      "address": "GEROGAK",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "10:20",
      "result": "NEGATIF"
  },
  {
      "key": "5",
      "nik": "4915944666893620",
      "name": "AHMAD RAMLI",
      "gender": "Laki-laki",
      "birth_place": "GEROGAK",
      "birth_date": "9-Nov-1979",
      "address": "GEROGAK",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "10:20",
      "result": "NEGATIF"
  },
  {
      "key": "6",
      "nik": "8809566547695417",
      "name": "MOHAMAD SYAKIRUN NIAM",
      "gender": "Perempuan",
      "birth_place": "BONDOWOSO",
      "birth_date": "30-Dec-1987",
      "address": "KUTA UTARA",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "10:20",
      "result": "NEGATIF"
  },
  {
      "key": "7",
      "nik": "81342254354850",
      "name": "rionald r p raintung",
      "gender": "Laki-laki",
      "birth_place": "menado",
      "birth_date": "14-Mar-1982",
      "address": "TANJUNG PRIOK",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "10:47",
      "result": "NEGATIF"
  },
  {
      "key": "8",
      "nik": "1785568604098662",
      "name": "JEINNE T T TAWALUYAN",
      "gender": "Perempuan",
      "birth_place": "MENADO",
      "birth_date": "17-Jan-1971",
      "address": "TANJUNG PRIOK",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "10:47",
      "result": "Positif"
  },
  {
      "key": "9",
      "nik": "5240226290705972",
      "name": "EKO SULISTYO",
      "gender": "Laki-laki",
      "birth_place": "BANYUWANGI",
      "birth_date": "18-Jan-1969",
      "address": "KUTA UTARA",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "10:47",
      "result": "NEGATIF"
  },
  {
      "key": "10",
      "nik": "8337462814715106",
      "name": "NI MADE MARTHA",
      "gender": "Perempuan",
      "birth_place": "GIANYAR",
      "birth_date": "15-Dec-1966",
      "address": "KUTA UTARA",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "10:47",
      "result": "NEGATIF"
  },
  {
      "key": "11",
      "nik": "5768919838513968",
      "name": "MASHARATI",
      "gender": "Laki-laki",
      "birth_place": "PENGASTULAN",
      "birth_date": "7-Sep-1977",
      "address": "SERIRIT",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "10:47",
      "result": "NEGATIF"
  },
  {
      "key": "12",
      "nik": "5789426154360209",
      "name": "DIAN MARDIYANA",
      "gender": "Perempuan",
      "birth_place": "SERIRIT",
      "birth_date": "21-Aug-1987",
      "address": "SERIRIT",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "10:47",
      "result": "NEGATIF"
  },
  {
      "key": "13",
      "nik": "6487913547418569",
      "name": "NUR HADI",
      "gender": "Laki-laki",
      "birth_place": "NEGARA",
      "birth_date": "10-Feb-1980",
      "address": "NEGARA",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:02",
      "result": "NEGATIF"
  },
  {
      "key": "14",
      "nik": "7886343046549264",
      "name": "MOHAHAMAD FIRMANSYAH",
      "gender": "Perempuan",
      "birth_place": "JEMBER",
      "birth_date": "1-Oct-1985",
      "address": "GUMUK MAS",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:02",
      "result": "NEGATIF"
  },
  {
      "key": "15",
      "nik": "564381072746813",
      "name": "KIKI RISKIANA",
      "gender": "Laki-laki",
      "birth_place": "BANYUWANGI",
      "birth_date": "30-Jun-1994",
      "address": "TERONGAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:02",
      "result": "Positif"
  },
  {
      "key": "16",
      "nik": "1585232150177736",
      "name": "BAGUS FAJAR SUBEKI",
      "gender": "Perempuan",
      "birth_place": "JEMBER",
      "birth_date": "12-Feb-1994",
      "address": "SUMBERSARI",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:02",
      "result": "NEGATIF"
  },
  {
      "key": "17",
      "nik": "9473404647502884",
      "name": "SUPRIYADI",
      "gender": "Laki-laki",
      "birth_place": "BANYUWANGI",
      "birth_date": "17-Aug-1983",
      "address": "KEDUNGAN SARI",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:02",
      "result": "NEGATIF"
  },
  {
      "key": "18",
      "nik": "9874611027878804",
      "name": "HASAN MALIKI",
      "gender": "Perempuan",
      "birth_place": "BONDOWOSO",
      "birth_date": "24-Sep-1981",
      "address": "SEMBORO",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:02",
      "result": "NEGATIF"
  },
  {
      "key": "19",
      "nik": "7366861365435814",
      "name": "YUSUF PRIBADI SETIAWAN",
      "gender": "Laki-laki",
      "birth_place": "SLEMAN ",
      "birth_date": "10-Apr-1988",
      "address": "SELABAYA",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:02",
      "result": "NEGATIF"
  },
];

export const columnsReports = [
  {
    key: 'nik',
    title: 'NIK',
    dataIndex: 'nik',
    width: 220,
    render: (item) => <><Tag color="#87d068" className="count-check-tag">2×</Tag><span className="text-uppercase">{item}</span></>
  },
  {
    key: 'name',
    title: 'NAMA',
    dataIndex: 'name',
    width: 200,
    render: (item) => <span className="text-uppercase">{item}</span>
  },
  {
    key: 'gender',
    title: 'JENIS KELAMIN',
    dataIndex: 'gender',
    width: 150,
    render: (item) => <span className="text-uppercase">{item}</span>
  },
  {
    key: 'birth_place',
    title: 'TEMPAT LAHIR',
    dataIndex: 'birth_place',
    width: 200,
    render: (item) => <span className="text-uppercase">{item}</span>
  },
  {
    key: 'birth_date',
    title: 'TANGGAL LAHIR',
    dataIndex: 'birth_date',
    width: 200,
    render: (item) => item && <span className="text-uppercase">{moment(item).format('DD MMMM YYYY')}</span>
  },
  {
    key: 'address',
    title: 'ALAMAT',
    dataIndex: 'address',
    width: 200,
    render: (item) => <span className="text-uppercase">{item}</span>
  },
  // {
  //   key: 'checkup_date',
  //   title: 'TANGGAL PERIKSA',
  //   dataIndex: 'checkup_date',
  //   width: 200,
  //   render: (item) => <span className="text-uppercase">{moment(item).format('DD MMMM YYYY')}</span>
  // },
  // {
  //   key: 'checkup_time',
  //   title: 'WAKTU PERIKSA',
  //   align: 'center',
  //   dataIndex: 'checkup_time',
  //   width: 150,
  //   render: (item) => <span className="text-uppercase">{moment(item, 'HH:mm').format('HH:mm')}</span>
  // },
  // {
  //   key: 'result',
  //   title: 'HASIL',
  //   align: 'center',
  //   dataIndex: 'result',
  //   width: 100,
  //   render: (item) => <span className={`${item.toUpperCase() === 'POSITIF' && 'text-danger font-weight-bold'}`}>{item.toUpperCase()}</span>
  // },
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

export const columnsDaftarPasien = [
  {
    key: 'name',
    title: 'NAMA',
    dataIndex: 'name',
    render: (item) => <span className="text-uppercase">{item}</span>
  },
  {
    key: 'gender',
    title: 'JENIS KELAMIN',
    dataIndex: 'gender',
    render: (item) => <span className="text-uppercase">{item}</span>
  },
  {
    key: 'pob',
    title: 'TEMPAT LAHIR',
    dataIndex: 'pob',
    render: (item) => <span className="text-uppercase">{item}</span>
  },
  {
    key: 'dob',
    title: 'TANGGAL LAHIR',
    dataIndex: 'dob',
    render: (item) => <span className="text-uppercase">{moment(item, 'MM-DD-YY').format('DD MMMM YYYY')}</span>
  },
  {
    key: 'address',
    title: 'ALAMAT',
    dataIndex: 'address',
    render: (item) => <span className="text-uppercase">{item}</span>
  },
  {
    key: 'checkupDate',
    title: 'JENIS PEMERIKSAAN',
    dataIndex: 'checkupDate',
    render: () => (
      <Space>
        <Button>Antigen</Button>
        <Button>Genose</Button>
      </Space>
    )
  },
]

export const reformatData = listData => {
  const copyData = _.cloneDeep(listData)
  copyData.forEach((data, i) => {
    data['No'] = i+1
    data['NIK'] = data.nik?.toUpperCase()
    data['Nama'] = data.name?.toUpperCase()
    data['Jenis Kelamin'] = data.gender?.toUpperCase()
    data['Tempat Lahir'] = data.birth_place?.toUpperCase()
    data['Tanggal Lahir'] = moment(data.birth_date).format('DD MMMM YYYY').toUpperCase()
    data['Alamat'] = data.address?.toUpperCase()
    data['Tanggal Periksa'] = moment(data.checkup_date).format('DD MMMM YYYY').toUpperCase()
    data['Waktu Periksa'] = moment(data.checkup_time, 'HH:mm').format('HH:mm')
    data['Hasil'] = data.result?.toUpperCase()
    delete data.key; delete data.nik; delete data.name; delete data.gender; delete data.birth_date; delete data.birth_place; delete data.address; delete data.checkup_date; delete data.result; delete data.time; delete data.checkup_time;
  })

  return copyData
}
