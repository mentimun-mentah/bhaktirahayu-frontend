import { Image } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

export const columns_instansi = [
  {
    title: 'Nama',
    dataIndex: 'name',
    key: 'name',
    width: 250,
  },
  {
    title: 'Antigen',
    dataIndex: 'antigen',
    key: 'antigen',
    align: 'center',
    width: 200,
    render: (item) => item ? <Image className="bor-rad-5px" height={40} src={item} /> : <i className="far fa-times"></i>,
  },
  {
    title: 'GeNose',
    dataIndex: 'genose',
    key: 'genose',
    align: 'center',
    width: 200,
    render: (item) => item ? <Image className="bor-rad-5px" height={40} src={item} /> : <i className="far fa-times"></i>,
  },
  {
    title: 'Cap',
    dataIndex: 'stamp',
    key: 'stamp',
    align: 'center',
    width: 100,
    render: (item) => item ? (
      <Image 
        src={item} 
        height={40} 
        preview={{ mask: <EyeOutlined /> }}
        className="bor-rad-5px" 
      />
    ) : <i className="far fa-times"></i>,
  },
  {
    title: 'AKSI',
    dataIndex: 'action',
    key: 'action',
    type: 'action',
    align: 'center',
    fixed: 'right',
    width: 100,
    editable: true
  },
];

export const data_instansi = [
  {
    key: '1',
    name: 'Bhakti Rahayu Denpasar',
    genose: null,
    antigen: 'https://bit.ly/3xiX7hi',
    stamp: 'https://bit.ly/3iipOqt'
  },
  {
    key: '4',
    name: 'Bhakti Rahayu Tabanan',
    genose: null,
    antigen: 'https://bit.ly/3C8AmAw',
    stamp: 'https://bit.ly/3iipOqt'
  },
  {
    key: '5',
    name: 'Bhaksena Bypass Ngurah Rai',
    genose: null,
    antigen: 'https://bit.ly/3linoKx',
    stamp: 'https://bit.ly/3iipOqt'
  },
  {
    key: '6',
    name: 'Bhaksena Pelabuhan Gilimanuk',
    genose: 'https://bit.ly/3xgVdhq',
    antigen: 'https://bit.ly/3yiTSYN',
    stamp: 'https://bit.ly/3iipOqt'
  },
];
