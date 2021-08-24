import { Image } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

export const columns_instansi = [
  {
    title: 'Nama',
    dataIndex: 'institutions_name',
    key: 'institutions_name',
    width: 250,
  },
  {
    title: 'Antigen',
    dataIndex: 'institutions_antigen',
    key: 'institutions_antigen',
    align: 'center',
    width: 200,
    render: (item) => item ? (
      <Image 
        className="bor-rad-5px"
        height={40}
        src={`${process.env.NEXT_PUBLIC_API_URL}/static/institution/${item}`}
        alt="kop-antigen" 
      />
    ) : <i className="far fa-times"></i>,
  },
  {
    title: 'GeNose',
    dataIndex: 'institutions_genose',
    key: 'institutions_genose',
    align: 'center',
    width: 200,
    render: (item) => item ? (
      <Image
        className="bor-rad-5px"
        height={40}
        src={`${process.env.NEXT_PUBLIC_API_URL}/static/institution/${item}`}
        alt="kop-genose" 
      />
    ) : <i className="far fa-times"></i>,
  },
  {
    title: 'PCR',
    dataIndex: 'institutions_pcr',
    key: 'institutions_pcr',
    align: 'center',
    width: 200,
    render: (item) => item ? (
      <Image
        className="bor-rad-5px"
        height={40}
        src={`${process.env.NEXT_PUBLIC_API_URL}/static/institution/${item}`}
        alt="kop-pcr" 
      />
    ) : <i className="far fa-times"></i>,
  },
  {
    title: 'Cap',
    dataIndex: 'institutions_stamp',
    key: 'institutions_stamp',
    align: 'center',
    width: 100,
    render: (item) => item ? (
      <Image 
        height={40} 
        preview={{ mask: <EyeOutlined /> }}
        src={`${process.env.NEXT_PUBLIC_API_URL}/static/institution/${item}`}
        className="bor-rad-5px" 
        alt="kop-stamp"
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
    width: 110,
    editable: true
  },
];
