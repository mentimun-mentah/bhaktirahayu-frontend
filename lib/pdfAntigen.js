import moment from 'moment'
import 'moment/locale/id'
moment.locale('id')

import { saran, footerPdf } from 'data/layoutPdf'

export const antigen = async (doc, patientData) => {
  const { covid_checkups_report_number, clients_address, clients_age } = patientData
  const { clients_birth_date, clients_gender, clients_name, clients_nik } = patientData
  const { institution_letterhead, qr_code, doctor_signature, institution_stamp } = patientData
  const { covid_checkups_check_date, covid_checkups_check_result, covid_checkups_doctor_username } = patientData

  const width = doc.internal.pageSize.getWidth()
  const isCheckResultNegative = covid_checkups_check_result === 'negative'

  const qr_code_image = new Image()
  qr_code_image.src = qr_code

  const doctor_signature_image = new Image()
  doctor_signature_image.src = doctor_signature

  const institution_stamp_image = new Image()
  institution_stamp_image.src = institution_stamp

  const institution_letterhead_image = new Image()
  institution_letterhead_image.src = institution_letterhead

  doc.addImage(institution_letterhead_image, 'png', 0, 0, width, 84)
  
  doc.setFontSize(8)
  doc.setFont('times', 'normal')
  
  doc.text("Report number", 45, 110)
  doc.text(":", 100, 110)
  doc.text(covid_checkups_report_number, 105, 110)
  
  doc.text("Date", 45, 120)
  doc.text(":", 100, 120)
  doc.text(moment(covid_checkups_check_date).format('DD MMMM YYYY HH:mm'), 105, 120)

  doc.setFontSize(8)
  doc.setFont('times', 'bold')

  doc.setLineWidth(0.5)
  doc.setDrawColor(0, 0, 0)

  doc.setFillColor(204,204,204)
  doc.rect(40, 140, (width/1.2 - 5), 15, 'F')

  doc.cell(40, 140, width/4+5, 15, 'Description')
  doc.cell(width/4+45, 140, width - (width/4 + (40*2)), 15, 'Item')

  doc.setFont('times', 'normal')
  doc.cell(40, 155, width/4+5, 15, 'ID')
  doc.cell(width/4+45, 155, width - (width/4 + (40*2)), 15, clients_nik) // Name/ID

  doc.setFont('times', 'normal')
  doc.cell(40, 170, width/4+5, 15, 'Name')
  doc.cell(width/4+45, 170, width - (width/4 + (40*2)), 15, clients_name) // Name/ID

  doc.cell(40, 185, width/4+5, 15, 'Birth Date/Age/Sex')
  doc.cell(width/4+45, 185, 80, 15, moment(clients_birth_date).format('DD MMMM YYYY')) // Birth Date
  doc.cell(width/4+45+80, 185, 75, 15, `${clients_age} Tahun`) // Age
  doc.cell(width/4+39.6+(80*2), 185, 80, 15, clients_gender) // Sex

  doc.cell(40, 200, width/4+5, 25, 'Address')
  doc.cell(width/4+45, 200, width - (width/4 + (40*2)), 25, clients_address) // Address

  doc.setFillColor(238,238,238)
  doc.rect(width/4+45, 225, width - (width/4 + (40*2)), 25, 'F')
  doc.cell(40, 225, width/4+5, 25, 'SARS-CoV-Antigen (Covid19)\nRapid Test Result')

  doc.setFont('times', 'bold')
  doc.cell(width/4+45, 225, width - (width/4 + (40*2)), 25, ' ')
  doc.text(width/4+48, 240, covid_checkups_check_result?.toUpperCase()) // Hasil

  saran(doc, 0, isCheckResultNegative)
  footerPdf(doc, 365, covid_checkups_doctor_username, doctor_signature_image, qr_code_image, institution_stamp_image)

  return doc
}
