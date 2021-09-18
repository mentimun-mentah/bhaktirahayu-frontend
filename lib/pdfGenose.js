import moment from 'moment'
import 'moment/locale/id'
moment.locale('id')

import { genose_logo } from 'data/header_doc'
import { saran, footerPdf } from 'data/layoutPdf'

export const genose = (doc, patientData) => {
  const { covid_checkups_report_number, clients_address } = patientData
  const { clients_birth_date, clients_name, clients_nik } = patientData
  const { institution_letterhead, qr_code, doctor_signature, institution_stamp } = patientData
  const { covid_checkups_check_date, covid_checkups_check_result, covid_checkups_doctor_username } = patientData

  const add = 20
  const width = doc.internal.pageSize.getWidth()
  const isCheckResultNegative = covid_checkups_check_result === 'negative'

  const img_logo_genose = new Image()
  img_logo_genose.src = genose_logo

  const qr_code_image = new Image()
  qr_code_image.src = qr_code

  const doctor_signature_image = new Image()
  doctor_signature_image.src = doctor_signature

  const institution_stamp_image = new Image()
  institution_stamp_image.src = institution_stamp

  const institution_letterhead_image = new Image()
  institution_letterhead_image.src = institution_letterhead

  doc.addImage(img_logo_genose, 'png', 335, 120, 40, 28)
  doc.addImage(institution_letterhead_image, 'png', 0, 28, width, 84)

  doc.setFontSize(8)
  doc.setFont('times', 'normal')
  
  doc.text("Report number", 45, 110+add)
  doc.text(":", 100, 110+add)
  doc.text(covid_checkups_report_number, 105, 110+add)
  
  doc.text("Date", 45, 120+add)
  doc.text(":", 100, 120+add)
  doc.text(moment(covid_checkups_check_date).format('DD MMMM YYYY HH:mm'), 105, 120+add)
  
  doc.setFontSize(8)
  doc.setFont('times', 'bold')

  doc.setLineWidth(0)
  doc.setDrawColor(0, 0, 0, 0)

  doc.setFillColor(204,204,204)
  doc.rect(40, 140+add, (width/1.2 - 5), 15, 'F')

  doc.cell(40, 140+add, width, 15, 'Description')
  doc.cell(121, 140+add, width, 15, 'Item')

  doc.setFont('times', 'normal')
  doc.cell(40, 155+add, width/4+5, 15, 'ID')
  doc.cell(120, 155+add, width - (width/4 + (40*2)), 15, ': ' + clients_nik) // ID

  doc.cell(40, 170+add, width/4+5, 15, 'Name')
  doc.cell(120, 170+add, width - (width/4 + (40*2)), 15, ': ' + clients_name) // Name

  doc.cell(40, 185+add, width/4+5, 15, 'Birth Date')
  doc.cell(120, 185+add, width - (width/4 + (40*2)), 15, ': ' + moment(clients_birth_date).format('DD MMMM YYYY')) // Birth Date
  
  // doc.cell(40, 200+add, width/4+5, 15, 'Address')
  // doc.cell(120, 200+add, width - (width/4 + (40*2)), 15, ': ' + clients_address) // Address

  doc.cell(40, 200+add, width/4+5, 25, 'Address')
  doc.cell(120, 200+add, width - (width/4 + (40*2)), 25, ': ' + clients_address) // Address

  doc.setFillColor(238,238,238)
  doc.rect(120, 225+add, width/1.6, 15, 'F')
  doc.cell(40, 225+add, width, 15, 'Prediction')

  // doc.setFillColor(238,238,238)
  // doc.rect(120, 215+add, width/1.6, 15, 'F')
  // doc.cell(40, 215+add, width/4+5, 15, 'Prediction')
  
  doc.setFont('times', 'bold')
  doc.cell(40, 225+add, width - (width + (40*2)), 15, ' ')
  doc.text(123, 234.5+add, ': ' + covid_checkups_check_result?.toUpperCase()) // Hasil

  // doc.setFont('times', 'bold')
  // doc.cell(40, 215+add, width - (width/4 + (40*2)), 15, ' ')
  // doc.text(123, 225+add, ': ' + covid_checkups_check_result?.toUpperCase()) // Hasil
  
  doc.setDrawColor(60, 175, 239)
  doc.setLineWidth(1)
  doc.line(40, 245, 382.5, 245)

  saran(doc, 295, isCheckResultNegative)
  // footerPdf(doc, 365, covid_checkups_doctor_username, doctor_signature_image, qr_code_image, institution_stamp_image)
  footerPdf(doc, 390, covid_checkups_doctor_username, doctor_signature_image, qr_code_image, institution_stamp_image)

  return doc
}
