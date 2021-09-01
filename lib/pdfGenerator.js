import 'jspdf-autotable'
import jsPDF from 'jspdf'
import moment from 'moment'
import 'moment/locale/id'
moment.locale('id')

import { pcr } from 'lib/pdfPcr'
import { genose } from 'lib/pdfGenose'
import { antigen } from 'lib/pdfAntigen'
import { jsonHeaderHandler } from 'lib/axios'

import axios from 'lib/axios'

const prefixB64 = "data:image/png;base64,"

const getBase64Url = async url => {
  const data = { path_file: url }
  try {
    const result = await axios.post(`/utils/encoding-image-base64`, data, jsonHeaderHandler())
    return result.data
  }
  catch (err) {
    return false
  }
}

const pdfGenerator = async (patientData) => {
  // const openWindow = window.open('', '_blank')

  const { covid_checkups_checking_type, covid_checkups_institution_letterhead, clients_name } = patientData
  const { covid_checkups_check_qrcode, covid_checkups_doctor_signature, covid_checkups_institution_stamp } = patientData

  const institution_letterhead_url = `static/institution/${covid_checkups_institution_letterhead}`
  const institution_letterhead = await getBase64Url(institution_letterhead_url)

  const qr_code_url = `static/qrcode/${covid_checkups_check_qrcode}`
  const qr_code = await getBase64Url(qr_code_url)

  const doctor_signature_url = `static/signature/${covid_checkups_doctor_signature}`
  const doctor_signature = await getBase64Url(doctor_signature_url)

  const institution_stamp_url = `static/institution/${covid_checkups_institution_stamp}`
  const institution_stamp = await getBase64Url(institution_stamp_url)

  const newDataPatient = {
    ...patientData,
    qr_code: `${prefixB64}${qr_code}`,
    doctor_signature: `${prefixB64}${doctor_signature}`,
    institution_stamp: `${prefixB64}${institution_stamp}`,
    institution_letterhead: `${prefixB64}${institution_letterhead}`,
  }

  const doc = new jsPDF('p', 'pt', 'a5')

  if(covid_checkups_checking_type === "pcr") {
    await pcr(doc, newDataPatient)
  }
  if(covid_checkups_checking_type === "antigen") {
    await antigen(doc, newDataPatient)
  }
  if(covid_checkups_checking_type === "genose") {
    await genose(doc, newDataPatient)
  }

  doc.setProperties({ title: `Test result for ${clients_name}` })
  const linkDocument = `${doc.output('bloburl')}`

  window.location.href = linkDocument // work on same tab

  // if(openWindow) openWindow.location = linkDocument // open document on new window
  // else window.location.assign(linkDocument) // work on same tab

  // const linkDocument = `/result?req=${doc.output('bloburl')}&fn=${clients_name}`
  // if(openWindow) openWindow.location = linkDocument // open document on new window
  // else window.location.assign(linkDocument) // work on same tab
}

export default pdfGenerator
