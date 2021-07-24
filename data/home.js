import { Image as AntImage } from 'antd'

export const step_list = [
  { title: 'Persiapan', },
  { title: 'Foto KTP / KIS', },
  { title: 'Registrasi', }
]

export const preparation_list = [
  { 
    image: '/static/images/ktp_4.png',
    title: 'Pastikan posisi ponsel tegak lurus / vertikal',
  },
  { 
    image: '/static/images/ktp_1.png',
    title: 'Pastikan KTP / KIS terbaca dengan jelas',
  },
  { 
    image: '/static/images/ktp_2.png',
    title: 'Pastikan KTP / KIS tidak buram, silau, dan gelap'
  },
  { 
    image: '/static/images/ktp_3.png',
    title: 'Pastikan KTP / KIS tidak terpotong'
  }
]

export const cardOptions = [
  { label: 'KTP', value: 'ktp' },
  { label: 'KIS', value: 'kis' },
]

export const howToCrop = (
  <>
    <AntImage
      src="/static/images/how_to_crop.png"
      alt="how to crop"
    />
    <p className="mb-0">
      Pastikan kamu memberikan jarak antara garis dengan pinggiran kartu
    </p>
  </>
)
