import 'jspdf-autotable'
import jsPDF from 'jspdf'
import moment from 'moment'
import 'moment/locale/id'
moment.locale('id')

import romanizeNumber from 'lib/romanizeNumber'

import { headerDenpasar, headerTabanan, headerGilimanuk, headerBhaksenaBypass, saran, footerPdf } from 'data/layoutPdf'

const pdfGenerator = async (patientData, index) => {
  const { name, gender, birth_date, address, checkup_date, checkup_time, result } = patientData
  const now = moment()
  const date = moment(birth_date)
  const age = now.diff(date, 'years')

  const doc = new jsPDF('p', 'pt', 'a5')

  const width = doc.internal.pageSize.getWidth()

  if(index < 2) headerDenpasar(doc)
  if(index >= 2 && index < 3) headerGilimanuk(doc)
  if(index >= 3 && index < 4) headerTabanan(doc)
  if(index >= 4) headerBhaksenaBypass(doc)
  
  doc.setFontSize(8)
  doc.setFont('times', 'normal')
  
  doc.text("Report number", 45, 110)
  doc.text(":", 100, 110)
  doc.text(`${index}/ANTIGEN/${romanizeNumber(moment().format('M'))}/${moment().format('YYYY')}`, 105, 110)
  
  doc.text("Date", 45, 120)
  doc.text(":", 100, 120)
  doc.text(moment(new Date).format('DD MMMM YYYY') + ' ' + moment(new Date).format('HH:mm'), 105, 120)

  doc.setFontSize(8)
  doc.setFont('times', 'bold')

  doc.setLineWidth(0.5)
  doc.setDrawColor(0, 0, 0)

  doc.setFillColor(204,204,204)
  doc.rect(40, 140, (width/1.2 - 5), 15, 'F')

  doc.cell(40, 140, width/4+5, 15, 'Description')
  doc.cell(width/4+45, 140, width - (width/4 + (40*2)), 15, 'Item')

  doc.setFont('times', 'normal')
  doc.cell(40, 155, width/4+5, 15, 'Name/ID')
  doc.cell(width/4+45, 155, width - (width/4 + (40*2)), 15, name + '/' + '5171010603980004') // Name/ID

  doc.cell(40, 170, width/4+5, 15, 'Birth Date/Age/Sex')
  doc.cell(width/4+45, 170, 80, 15, moment(birth_date).format('DD MMMM YYYY')) // Birth Date
  doc.cell(width/4+45+80, 170, 75, 15, `${age} Tahun`) // Age
  doc.cell(width/4+39.6+(80*2), 170, 80, 15, gender) // Sex

  doc.cell(40, 185, width/4+5, 15, 'Address')
  doc.cell(width/4+45, 185, width - (width/4 + (40*2)), 15, 'address') // Address

  doc.setFillColor(238,238,238)
  doc.rect(width/4+45, 200, width - (width/4 + (40*2)), 25, 'F')
  doc.cell(40, 200, width/4+5, 25, 'SARS-CoV-Antigen (Covid19)\nRapid Test Result')

  doc.setFont('times', 'bold')
  doc.cell(width/4+45, 200, width - (width/4 + (40*2)), 25, ' ')
  doc.text(width/4+48, 215, 'NEGATIF') // Hasil

  saran(doc)
  footerPdf(doc)

  // doc.setProperties({ title: `Tes result for ${name}` })
  window.open(`/result?req=${doc.output('bloburl')}&fn=${name}`)
  // window.open(doc.output('bloburl', { filename: name }))
}

export default pdfGenerator
