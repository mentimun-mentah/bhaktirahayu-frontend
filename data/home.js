import { Image as AntImage } from 'antd'

export const step_list = [
  { title: 'Pendahuluan', },
  { title: "Dokumen" },
  { title: 'Persiapan', },
  { title: 'Foto KTP / KIS', },
  { title: 'Registrasi', }
]

export const document_list = [
  {
    title: 'KTP / KIS',
    value: 'nik',
    image: '/static/images/id-card.png'
  },
  {
    title: 'PASPOR',
    value: 'paspor',
    image: '/static/images/passport.png'
  }
]

export const role_list = [
  {
    title: 'Pasien',
    value: 'patient',
    image: '/static/images/customer.png'
  },
  {
    title: 'Dokter',
    value: 'doctor',
    image: '/static/images/medical-team.png'
  }
]

export const preparation_list = [
  { 
    image: '/static/images/ktp_4.png',
    title: 'Pastikan posisi KTP / KIS tegak lurus',
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
