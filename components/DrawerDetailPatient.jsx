import { useRouter } from 'next/router'
import { memo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Drawer, Grid, Space, Tooltip, Popconfirm } from 'antd'

import { formCheckup } from 'formdata/checkup'
import { formPatient } from 'formdata/patient'
import { DATE_FORMAT } from 'lib/disabledDate'
import { columnsRiwayatPatient } from 'data/table'
import { jsonHeaderHandler, formErrorMessage, signature_exp } from 'lib/axios'

import 'moment/locale/id'
import moment from 'moment'

import axios from 'lib/axios'
import * as actions from 'store/actions'
import pdfGenerator from 'lib/pdfGenerator'
import TableMemo from 'components/TableMemo'
import DrawerResultPatient from 'components/DrawerResultPatient'

moment.locale('id')

const useBreakpoint = Grid.useBreakpoint;

const ProductCellEditable = (
  { index, record, editable, type, children, isDoctor, onSeeDocument, onShowCheckupPatient, onDeleteCovidCheckupHandler, ...restProps }
) => {
  let childNode = children

  if(editable){

    let isSeenable = record.covid_checkups_doctor_id && record.covid_checkups_check_date && record.covid_checkups_check_result && record.covid_checkups_institution_id

    childNode = (
      type === "action" && (
        <Space>
          {isSeenable && (
            <Tooltip placement="top" title="Hasil">
              <a onClick={() => onSeeDocument(record.covid_checkups_id)}><i className="fal fa-eye text-center" /></a>
            </Tooltip>
          )}
          {isDoctor && (
            <Tooltip placement="top" title="Ubah">
              <a onClick={() => onShowCheckupPatient(record)}><i className="fal fa-edit text-center" /></a>
            </Tooltip>
          )}
          <Tooltip placement="top" title="Hapus">
            <Popconfirm
              placement="bottomRight"
              title="Hapus data ini?"
              onConfirm={() => onDeleteCovidCheckupHandler(record.covid_checkups_id)}
              okText="Ya"
              cancelText="Batal"
            >
              <a><i className="fal fa-trash-alt text-danger text-center" /></a>
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    )
  }
  
  return <td {...restProps}>{childNode}</td>
}

const DrawerPatient = ({ visible, dataPatient, onCloseHandler }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const screens = useBreakpoint()

  const users = useSelector(state => state.auth.user)
  const isDoctor = users?.role === "doctor"

  const [patient, setPatient] = useState(formPatient)
  const [checkup, setCheckup] = useState(formCheckup)
  const [showCheckupDrawer, setShowCheckupDrawer] = useState(false)

  const { nik, name, birth_place, birth_date, gender, address, covid_checkups } = patient

  const onCloseDetailPatientDrawerHandler = e => {
    e?.preventDefault()
    onCloseHandler()
    setPatient(formPatient)
  }

  const onCloseCheckupDrawerHandler = () => {
    setCheckup(formCheckup)
    setShowCheckupDrawer(false)
  }

  const columnsPatient = columnsRiwayatPatient.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record, index: index,
        type: col.type, 
        editable: col.editable,
        isDoctor: users?.role === 'doctor',
        onSeeDocument: covid_checkups_id => onSeeDocument(covid_checkups_id),
        onDeleteCovidCheckupHandler: id => onDeleteCovidCheckupHandler(id),
        onShowCheckupPatient: record => onShowCheckupPatient(record),
      })
    }
  })

  const onDeleteCovidCheckupHandler = id => {
    axios.delete(`/covid_checkups/delete/${id}`, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getClient({ ...router.query }))
        formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp){
          dispatch(actions.getClient({ ...router.query }))
          formErrorMessage('success', "Successfully delete the covid-checkup.")
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })
  }

  const onSeeDocument = async id => {
    await axios.get(`/covid_checkups/see-document/${id}`)
      .then(async res => {
        pdfGenerator(res.data)
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp){
          axios.get(`/covid_checkups/see-document/${id}`)
            .then(res => {
              pdfGenerator(res.data)
            })
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })
  }

  const getMultipleDoctor = (list_id) => {
    const data = { list_id: list_id }
    axios.post('/users/get-multiple-doctors', data, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getDoctorSuccess({ data: res.data }))
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp){
          axios.post('/users/get-multiple-doctors', data, jsonHeaderHandler())
            .then(res => {
              dispatch(actions.getDoctorSuccess({ data: res.data }))
            })
            .catch(() => {})
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })
  }

  const onShowCheckupPatient = record => {
    let doctor_id = record.covid_checkups_doctor_id
    if(record.covid_checkups_doctor_id) {
      getMultipleDoctor(record.covid_checkups_doctor_id.split(','))
    } 
    if(!record.covid_checkups_doctor_id && isDoctor) {
      doctor_id = users.id
      getMultipleDoctor(users.id.split(','))
    }

    const data = {
      ...checkup, 
      id: { value: record.covid_checkups_id, isValid: true, message: null },
      check_date: { 
        value: record.covid_checkups_check_date ? moment(record.covid_checkups_check_date).format(`${DATE_FORMAT} HH:mm`) : moment().format(`${DATE_FORMAT} HH:mm`), 
        isValid: true, 
        message: null 
      },
      check_result: { value: record.covid_checkups_check_result, isValid: true, message: null },
      doctor_id: { 
        value: doctor_id, 
        isValid: true, 
        message: null 
      },
      guardian_id: { value: record.covid_checkups_guardian_id, isValid: true, message: null },
      location_service_id: { value: record.covid_checkups_location_service_id, isValid: true, message: null },
      institution_id: { value: record.covid_checkups_institution_id, isValid: true, message: null },
      checking_type: { value: record.covid_checkups_checking_type, isValid: true, message: null }
    }
    setCheckup(data)
    setShowCheckupDrawer(true)
  }

  useEffect(() => {
    setPatient(dataPatient)
  }, [dataPatient])

  return (
    <>
      <Drawer
        visible={visible}
        placement="right"
        title="Riwayat Pemeriksaan"
        closeIcon={<i className="fal fa-times" />}
        onClose={onCloseDetailPatientDrawerHandler}
        width={screens.xl ? "50%" : screens.lg ? "80%" : "100%"}
      >
        <table className="table mb-4">
          <tbody>
            <tr>
              <th className="border-0" scope="row">NIK</th>
              <td className="border-0">{nik.value}</td>
            </tr>
            <tr>
              <th scope="row">Nama</th>
              <td>{name.value}</td>
            </tr>
            <tr>
              <th scope="row">Tempat Tanggal Lahir</th>
              <td>{birth_place.value}, {moment(birth_date.value, DATE_FORMAT).format('DD MMMM YYYY')}</td>
            </tr>
            <tr>
              <th scope="row">Jenis Kelamin</th>
              <td>{gender.value}</td>
            </tr>
            <tr>
              <th scope="row">Alamat</th>
              <td>{address.value}</td>
            </tr>
          </tbody>
        </table>

        <TableMemo
          bordered
          size="middle"
          pagination={false} 
          columns={columnsPatient}
          dataSource={covid_checkups.value} 
          scroll={{ y: 300, x: 1180 }} 
          rowKey={record => record.covid_checkups_id}
          components={{ body: { cell: ProductCellEditable } }}
        />

        <DrawerResultPatient
          dataCheckup={checkup}
          patient={patient}
          setPatient={setPatient}
          visible={showCheckupDrawer}
          onCloseHandler={onCloseCheckupDrawerHandler}
        />

      </Drawer>

      <style jsx>{`
      .table td, .table th {
        border-top: 1px solid #f0f0f0;
      }
      `}</style>
    </>
  )
}

export default memo(DrawerPatient)
