import 'jspdf-autotable'
import jsPDF from 'jspdf'
import moment from 'moment'
import 'moment/locale/id'
moment.locale('id')

import romanizeNumber from 'lib/romanizeNumber'

import { headerGilimanukGenose, saran, footerPdf } from 'data/layoutPdf'

const pdfGenerator = async (patientData, index) => {
  const { name, birth_date, result } = patientData

  const add = 20
  const doc = new jsPDF('p', 'pt', 'a5')
  const width = doc.internal.pageSize.getWidth()

  headerGilimanukGenose(doc)
  
  doc.setFontSize(8)
  doc.setFont('times', 'normal')
  
  doc.text("Report number", 45, 110+add)
  doc.text(":", 100, 110+add)
  doc.text(`${index}/GENOSE/${romanizeNumber(moment().format('M'))}/${moment().format('YYYY')}`, 105, 110+add)
  
  doc.text("Date", 45, 120+add)
  doc.text(":", 100, 120+add)
  doc.text(moment(new Date).format('DD MMMM YYYY') + ' ' + moment(new Date).format('HH:mm'), 105, 120+add)

  doc.setFontSize(8)
  doc.setFont('times', 'bold')

  doc.setLineWidth(0)
  doc.setDrawColor(0, 0, 0, 0)

  doc.setFillColor(204,204,204)
  doc.rect(40, 140+add, (width/1.2 - 5), 15, 'F')

  doc.cell(40, 140+add, width/4+5, 15, 'Description')
  doc.cell(width/4+45, 140+add, width - (width/4 + (40*2)), 15, 'Item')

  doc.setFont('times', 'normal')
  doc.cell(40, 155+add, width/4+5, 15, 'Name/ID')
  doc.cell(width/4+45, 155+add, width - (width/4 + (40*2)), 15, ': ' + name + '/' + '5171010603980004') // Name/ID

  doc.cell(40, 170+add, width/4+5, 15, 'Birth Date')
  doc.cell(width/4+45, 170+add, width - (width/4 + (40*2)), 15, ': ' + moment(birth_date).format('DD MMMM YYYY')) // Birth Date

  doc.cell(40, 185+add, width/4+5, 15, 'Address')
  doc.cell(width/4+45, 185+add, width - (width/4 + (40*2)), 15, ': ' + 'address') // Birth Date

  doc.setFillColor(238,238,238)
  doc.rect(width/4+45, 200+add, width - (width/4 + (40*2)), 15, 'F')
  doc.cell(40, 200+add, width/4+5, 15, 'Prediction')

  doc.setFont('times', 'bold')
  doc.cell(width/4+45, 200+add, width - (width/4 + (40*2)), 15, ' ')
  doc.text(width/4+48, 210+add, ': ' + 'result') // Hasil

  // saran(doc)
  footerPdf(doc, 270)

  window.open(`/result?req=${doc.output('bloburl')}&fn=${name}`)
}

export default pdfGenerator
