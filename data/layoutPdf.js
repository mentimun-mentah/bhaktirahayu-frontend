import { qr_code, signature, logo_bhakti_rahayu, logo_klinik_bhaksena, logo_bhaksena, genose_logo } from 'data/header_doc'

export const headerDenpasar = doc => {
  const img_logo_bhakti_rahayu = new Image()
  img_logo_bhakti_rahayu.src = logo_bhakti_rahayu

  doc.setFontSize(20)
  doc.setTextColor("#34b050")
  doc.setFont('times', 'bold')
  doc.text("LABORATORIUM", 250, 30, null, null, "center")
  
  doc.setFontSize(12)
  doc.text("RUMAH SAKIT UMUM BHAKTI RAHAYU", 250, 45, null, null, "center")
  
  doc.setFontSize(8)
  doc.setTextColor("#000000")

  doc.text("JL.GATOT SUBROTO II NO. 11 DENPASAR - BALI", 250, 57, null, null, "center")
  doc.text("TELP. (0361) 430270, 430245", 250, 66, null, null, "center")
  doc.text("EMAIL :info@bhaktirahayu.com", 250, 75, null, null, "center")
  
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(1)
  doc.line(30, 82, 390, 82)
  doc.setLineWidth(0.5)
  doc.line(30, 84, 390, 84)

  doc.addImage(img_logo_bhakti_rahayu, 'png', 45, 12, 60, 60)

  return doc
}

export const headerTabanan = doc => {
  const img_logo_bhakti_rahayu = new Image()
  img_logo_bhakti_rahayu.src = logo_bhakti_rahayu

  doc.setFontSize(12)
  doc.setFont('times', 'bold')
  doc.text("RUMAH SAKIT UMUM BHAKTI RAHAYU", 250, 30, null, null, "center")
  doc.setFontSize(8)
  doc.text("JL. BATUKARU NO 2 TUAKILANG TABANAN-BALI", 250, 50, null, null, "center")
  
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(1)
  doc.line(30, 82, 390, 82)
  doc.setLineWidth(0.5)
  doc.line(30, 84, 390, 84)

  doc.addImage(img_logo_bhakti_rahayu, 'png', 45, 12, 60, 60)

  return doc
}

export const headerGilimanuk = doc => {
  const img_logo_klinik_bhaksena = new Image()
  img_logo_klinik_bhaksena.src = logo_klinik_bhaksena
  
  doc.addImage(img_logo_klinik_bhaksena, 'png', 45, 12, 90, 21)

  doc.setFontSize(16)
  doc.setFont('times', 'bold')
  doc.text("ANTIGEN", 58, 50)
  
  doc.setFontSize(8)
  doc.setFont('times', 'normal')
  doc.text("Test", 135, 44)
  
  doc.setFontSize(8)
  doc.setFont('times', 'bold')
  doc.text("Covid-19", 153, 44)
  doc.setFont('times', 'normal')
  doc.text('Jl. Pelabuhan Gilimanuk, Negara, Jembrana - Bali', 58, 60)

  doc.setFontSize(12)
  doc.setFont('times', 'bold')
  doc.text("Antigen Swab Test Report", 215, 78, null, null, "center")
  
  doc.setDrawColor(60, 175, 239)
  doc.setLineWidth(1)
  doc.line(30, 84, 390, 84)
  return doc
}

export const headerBhaksenaBypass = doc => {
  const img_logo_bhaksena = new Image()
  img_logo_bhaksena.src = logo_bhaksena

  doc.setFontSize(14)
  doc.setFont('times', 'bold')
  doc.text("KLINIK BHAKSENA", 240, 30, null, null, "center")
  
  doc.setFontSize(8)
  doc.text("Jl. Bypass Ngurah Rai, Komplek Pertokoan Tragia", 240, 45, null, null, "center")
  doc.text("Blok D21-22, Kuta Selatan, Badung, Bali", 240, 55, null, null, "center")
  doc.text("Telp. (+62) 8113986396", 240, 65, null, null, "center")
  doc.text("Email : klinikbhaksenatragianusadua@gmail.com", 240, 75, null, null, "center")
  
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(1)
  doc.line(30, 82, 390, 82)
  doc.setLineWidth(0.5)
  doc.line(30, 84, 390, 84)

  doc.addImage(img_logo_bhaksena, 'png', 65, 12, 60, 60)
  return doc
}

export const headerGilimanukGenose = doc => {
  const img_logo_klinik_bhaksena = new Image()
  img_logo_klinik_bhaksena.src = logo_klinik_bhaksena
  
  const img_logo_genose = new Image()
  img_logo_genose.src = genose_logo
  
  doc.addImage(img_logo_klinik_bhaksena, 'png', 45, 32, 90, 21)

  doc.setFontSize(16)
  doc.setFont('times', 'bold')
  doc.text("GeNose C19", 58, 70)
  
  doc.setFontSize(8)
  doc.setFont('times', 'normal')
  doc.text('Jl. Pelabuhan Gilimanuk, Negara, Jembrana - Bali', 58, 80)

  doc.setFontSize(12)
  doc.setFont('times', 'bold')
  doc.text("GeNose C19 Report", 215, 105, null, null, "center")
  
  doc.setDrawColor(60, 175, 239)
  doc.setLineWidth(1)
  // doc.line(30, 84, 390, 84)
  doc.line(40, 221, 384.5, 221)

  doc.addImage(img_logo_genose, 'png', 335, 120, 40, 28)
  return doc
}

export const saran = (doc, h) => {
  const width = doc.internal.pageSize.getWidth()

  let hi = 250
  if(h) hi = h

  doc.setFontSize(8)
  doc.setFont('times', 'normal')
  doc.text('Saran: ', 45, hi)
  doc.text('\u2022' + ' ' + 'Pemeriksaan konfirmasi dengan pemeriksaan RT-PCR', 45, hi+15)
  doc.text('\u2022' + ' ' + 'Lakukan karantina atau isolasi sesuai dengan kriteria', 45, hi+(15*2))
  doc.text('\u2022' + ' ' + 'Menerapkan PHBS (perilaku hidup bersih dan sehat: mencuci tangan, menerapkan etika batuk,', 45, hi+(15*3), { maxWidth: width/1.2 })
  doc.text('menggunakan masker, menjaga stamina) dan physical distancing', 50, hi+(15*3)+9)

  return doc
}

export const footerPdf = (doc, h) => {
  let hi = 350
  if(h) hi = h

  /* FOOTER SIGNATURE */
  doc.setFontSize(8)
  doc.setTextColor("#000000")
  doc.setFont('times', 'bold')
  doc.text("Dokter Penanggung Jawab", 270, hi+10, null, null, "center")
  doc.setFont('times', 'normal')
  doc.text('dr. I Nym.Gede Bayu Wiratama S., MARS', 270, hi+60, null, null, "center")
  doc.addImage(signature, 'png', 250, hi+12, 40, 40, "center")
 
  doc.addImage(qr_code, 'png', 45, hi, 60, 60)
  /* FOOTER SIGNATURE */

  return doc
}
