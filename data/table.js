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
  {
      "key": "20",
      "nik": "2626556628656377",
      "name": "AJENG LUKISNA",
      "gender": "Perempuan",
      "birth_place": "PURBALINGGA",
      "birth_date": "16-Aug-2002",
      "address": "PEKALONGAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:02",
      "result": "NEGATIF"
  },
  {
      "key": "21",
      "nik": "5509121350507128",
      "name": "ILONA ARYANTI",
      "gender": "Laki-laki",
      "birth_place": "PURBALINGGA",
      "birth_date": "16-Jan-1994",
      "address": "SELABAYA",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:02",
      "result": "Positif"
  },
  {
      "key": "22",
      "nik": "341406216015813",
      "name": "CHLOE LINOSAY WIBOWO",
      "gender": "Perempuan",
      "birth_place": "SURABAYA",
      "birth_date": "13-Sep-2007",
      "address": "KETEGAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:02",
      "result": "NEGATIF"
  },
  {
      "key": "23",
      "nik": "6406944340738253",
      "name": "HELEN KURNIAWAN",
      "gender": "Laki-laki",
      "birth_place": "SURABAYA",
      "birth_date": "6-Oct-1982",
      "address": "KETEGAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:02",
      "result": "NEGATIF"
  },
  {
      "key": "24",
      "nik": "6881293766531741",
      "name": "LEO HIMAWAN WIBOWO",
      "gender": "Perempuan",
      "birth_place": "SURABAYA",
      "birth_date": "3-Feb-1974",
      "address": "KETEGAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:02",
      "result": "NEGATIF"
  },
  {
      "key": "25",
      "nik": "2204367869557566",
      "name": "naila fatmawati",
      "gender": "Laki-laki",
      "birth_place": "banyuwangi",
      "birth_date": "29-Oct-1990",
      "address": "DUSUN CANGAAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:33",
      "result": "Negatif"
  },
  {
      "key": "26",
      "nik": "6293323629257184",
      "name": "umar efendi ",
      "gender": "Perempuan",
      "birth_place": "BANYUWANGI",
      "birth_date": "12-Aug-1986",
      "address": "DUSUN CANGAAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:48",
      "result": "Negatif"
  },
  {
      "key": "27",
      "nik": "232229367167181",
      "name": "epit",
      "gender": "Perempuan",
      "birth_place": "bondowoso",
      "birth_date": "12-Dec-1983",
      "address": "DUSUN KRAJAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:49",
      "result": "NEGATIF"
  },
  {
      "key": "28",
      "nik": "2929835123600296",
      "name": "ABDUL KARIM",
      "gender": "Perempuan",
      "birth_place": "BONDOWOSO",
      "birth_date": "1-Jul-1970",
      "address": "DUSUN KRAJAN ",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:50",
      "result": "NEGATIF"
  },
  {
      "key": "29",
      "nik": "5392153758830306",
      "name": "PARSULI",
      "gender": "Laki-laki",
      "birth_place": "NGANJUK",
      "birth_date": "27-Nov-1961",
      "address": "KOMPLEK PAJAK MANANGGAL ",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:52",
      "result": "NEGATIF"
  },
  {
      "key": "30",
      "nik": "4720450177071495",
      "name": "HENING WIDYARSIH",
      "gender": "Laki-laki",
      "birth_place": "BOYOLALI",
      "birth_date": "30-Jun-1971",
      "address": "KOMPLEK PAJAK MANANGGAL",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:53",
      "result": "NEGATIF"
  },
  {
      "key": "31",
      "nik": "9344168923114508",
      "name": "SALWA NADIA",
      "gender": "Perempuan",
      "birth_place": "NGANJUK",
      "birth_date": "10-Jan-2007",
      "address": "KOMPLEK PAJAK MANANGGAL",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:55",
      "result": "NEGATIF"
  },
  {
      "key": "32",
      "nik": "2518846059442439",
      "name": "FAIZ WILLY",
      "gender": "Laki-laki",
      "birth_place": "NGANJUK",
      "birth_date": "8-Nov-2005",
      "address": "KOMPLEK PAJAK MANANGGAL",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:56",
      "result": "NEGATIF"
  },
  {
      "key": "33",
      "nik": "4299748567920231",
      "name": "MUHAMMAD EFENDI",
      "gender": "Perempuan",
      "birth_place": "BANYUWANGI",
      "birth_date": "28-Aug-1978",
      "address": "DSN SUMBER SEWU",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "11:58",
      "result": "NEGATIF"
  },
  {
      "key": "34",
      "nik": "2298825324220032",
      "name": "MUALIM ",
      "gender": "Laki-laki",
      "birth_place": "BANYUWANGI11/02/1961",
      "birth_date": "11-Feb-1961",
      "address": "DSN CANTUK KIDUL",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:00",
      "result": "NEGATIF"
  },
  {
      "key": "35",
      "nik": "185453730129007",
      "name": "JUM ATI",
      "gender": "Perempuan",
      "birth_place": "BANYUWANGI",
      "birth_date": "7-Jan-1964",
      "address": "DSN CANTUK KIDUL",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:00",
      "result": "NEGATIF"
  },
  {
      "key": "36",
      "nik": "3230551016241056",
      "name": "RAHAYU SILVIAJI",
      "gender": "Laki-laki",
      "birth_place": "GILIMANUK",
      "birth_date": "2-Aug-1989",
      "address": "KRAJAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:02",
      "result": "NEGATIF"
  },
  {
      "key": "37",
      "nik": "7197468088131746",
      "name": "MOH BAGUS GEDE HERMAN DWIYANTO",
      "gender": "Perempuan",
      "birth_place": "DENPASAR",
      "birth_date": "27-Sep-1989",
      "address": "KRAJAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:02",
      "result": "NEGATIF"
  },
  {
      "key": "38",
      "nik": "8793020200844049",
      "name": "DESINTYA AYU ANGGRAINI",
      "gender": "Laki-laki",
      "birth_place": "DENPASAR",
      "birth_date": "27-Dec-1992",
      "address": "GRBJ CLUSTER VERINA",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:03",
      "result": "NEGATIF"
  },
  {
      "key": "39",
      "nik": "3997553727865266",
      "name": "MUHYIDIN",
      "gender": "Perempuan",
      "birth_place": "BANYUWANGI",
      "birth_date": "4-Mar-1972",
      "address": "JL P.BUNGIN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:04",
      "result": "NEGATIF"
  },
  {
      "key": "40",
      "nik": "125135023639367",
      "name": "SRI UTAMI NINGSIH",
      "gender": "Laki-laki",
      "birth_place": "BANTUL",
      "birth_date": "5-Jan-1971",
      "address": "GRBJ CLUSTER VERINA",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:05",
      "result": "NEGATIF"
  },
  {
      "key": "41",
      "nik": "561650878783259",
      "name": "HAIRUDIN",
      "gender": "Perempuan",
      "birth_place": "BANYUWANGI",
      "birth_date": "2-Apr-1973",
      "address": "JL KESAMBI",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:05",
      "result": "NEGATIF"
  },
  {
      "key": "42",
      "nik": "1388881739777555",
      "name": "ZULFA RIYANA",
      "gender": "Laki-laki",
      "birth_place": "SUMENEP",
      "birth_date": "10-Oct-1999",
      "address": "DUSUN CEN LECEN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:06",
      "result": "NEGATIF"
  },
  {
      "key": "43",
      "nik": "7723420642212465",
      "name": "GHOFUR ALIT WIDY",
      "gender": "Perempuan",
      "birth_place": "BANYUWANGI",
      "birth_date": "5-Apr-1987",
      "address": "KALIGORO",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:07",
      "result": "NEGATIF"
  },
  {
      "key": "44",
      "nik": "5595879238349224",
      "name": "ROSADI",
      "gender": "Laki-laki",
      "birth_place": "BANYUWANGI",
      "birth_date": "17-Apr-1969",
      "address": "BARUREJO",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:07",
      "result": "NEGATIF"
  },
  {
      "key": "45",
      "nik": "695398475997745",
      "name": "MUJIATI",
      "gender": "Perempuan",
      "birth_place": "BANYUWANGI",
      "birth_date": "21-Jun-1978",
      "address": "SUMBER AGUNG",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:08",
      "result": "NEGATIF"
  },
  {
      "key": "46",
      "nik": "5879318336774909",
      "name": "PUTU ARTA DANA",
      "gender": "Laki-laki",
      "birth_place": "TAMBLANG",
      "birth_date": "11-Jul-1976",
      "address": "SUMBER AGUNG",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:09",
      "result": "NEGATIF"
  },
  {
      "key": "47",
      "nik": "3574605086537543",
      "name": "LILIK SULISTYOWATI",
      "gender": "Perempuan",
      "birth_place": "BANYUWANGI",
      "birth_date": "27-Dec-1960",
      "address": "KRAJAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:09",
      "result": "NEGATIF"
  },
  {
      "key": "48",
      "nik": "1022307209511085",
      "name": "NI LUH SOMA ARIANI",
      "gender": "Perempuan",
      "birth_place": "TUNJUNG",
      "birth_date": "28-Dec-1991",
      "address": "BR DINAS PENULISAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:10",
      "result": "NEGATIF"
  },
  {
      "key": "49",
      "nik": "6694968128049196",
      "name": "CECEP SYAIFUDIN",
      "gender": "Perempuan",
      "birth_place": "LUMAJANG",
      "birth_date": "4-Apr-1993",
      "address": "KLAMPOKAN",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:11",
      "result": "NEGATIF"
  },
  {
      "key": "50",
      "nik": "2835671100698890",
      "name": "SEPTYAN EKO CAHYONO",
      "gender": "Laki-laki",
      "birth_place": "BANYUWANGI",
      "birth_date": "23-Sep-1989",
      "address": "BENDOREJO",
      "checkup_date": "19-Jun-2021",
      "checkup_time": "12:12",
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
  {
    key: 'checkup_date',
    title: 'TANGGAL PERIKSA',
    dataIndex: 'checkup_date',
    width: 200,
    render: (item) => <span className="text-uppercase">{moment(item).format('DD MMMM YYYY')}</span>
  },
  {
    key: 'checkup_time',
    title: 'WAKTU PERIKSA',
    align: 'center',
    dataIndex: 'checkup_time',
    width: 150,
    render: (item) => <span className="text-uppercase">{moment(item, 'HH:mm').format('HH:mm')}</span>
  },
  {
    key: 'result',
    title: 'HASIL',
    align: 'center',
    dataIndex: 'result',
    width: 100,
    render: (item) => <span className={`${item.toUpperCase() === 'POSITIF' && 'text-danger font-weight-bold'}`}>{item.toUpperCase()}</span>
  },
  {
    key: 'action',
    title: 'AKSI',
    type: 'action',
    align: 'center',
    fixed: 'right',
    dataIndex: 'action',
    width: 120,
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
