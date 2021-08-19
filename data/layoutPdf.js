export const saran = (doc, h) => {
  const width = doc.internal.pageSize.getWidth()

  let hi = 275
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

export const footerPdf = (doc, h, doctor_name, doctor_signature, qrcode, stamp) => {
  let hi = 375
  if(h) hi = h

  /* FOOTER SIGNATURE */
  doc.setFontSize(8)
  doc.setTextColor("#000000")
  doc.setFont('times', 'bold')
  doc.text("Dokter Penanggung Jawab", 270, hi+10, null, null, "center")
  doc.setFont('times', 'normal')
  doc.text(doctor_name, 270, hi+60, null, null, "center")
  doc.addImage(doctor_signature, 'png', 250, hi+12, 40, 40, "center")
 
  doc.addImage(stamp, 'png', 220, hi+12, 40, 40)
  doc.addImage(qrcode, 'png', 45, hi, 65, 65)
  /* FOOTER SIGNATURE */

  return doc
}
