import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { useState, useEffect } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Row, Col, Button, Space, Tooltip, Popconfirm } from 'antd'

import { formImage } from 'formdata/image'
import { formDoctor } from 'formdata/doctor'
import { columns_doctor } from 'data/tableDoctor'
import { jsonHeaderHandler, formErrorMessage, signature_exp } from 'lib/axios'

import axios from 'lib/axios'
import * as actions from 'store/actions'
import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import ModalDoctor from 'components/Doctor/ModalDoctor'

const ProductCellEditable = ({ index, record, editable, type, children, onEditHandler, onDeleteHandler, ...restProps }) => {
  let childNode = children

  if(editable){
    childNode = (
      type === "action" && (
        <Space>
          <Tooltip placement="top" title="Ubah">
            <a onClick={() => onEditHandler(record)}><i className="fal fa-edit text-center" /></a>
          </Tooltip>
          <Tooltip placement="top" title="Hapus">
            <Popconfirm
              placement="bottomRight"
              title="Hapus data ini?"
              onConfirm={() => onDeleteHandler(record.users_id)}
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

const per_page = 10
const addTitle = "Tambah Dokter"
const editTitle = "Edit Dokter"

const DoctorsContainer = () => {
  const dispatch = useDispatch()

  const doctors = useSelector(state => state.doctor.doctor)

  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [isUpdate, setIsUpdate] = useState(false)
  const [doctor, setDoctor] = useState(formDoctor)
  const [showModal, setShowModal] = useState(false)
  const [imageList, setImageList] = useState(formImage)
  const [modalTitle, setModalTitle] = useState(addTitle)

  const columnsDoctors = columns_doctor.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record, index: index,
        type: col.type, 
        editable: col.editable,
        onDeleteHandler: id => onDeleteHandler(id),
        onEditHandler: record => onEditHandler(record),
      })
    }
  })

  const onEditHandler = (record) => {
    const realName = record.users_username.split(" ")
    realName.shift()

    const dataDoctor = {
      id: { value: record.users_id, isValid: true, message: null },
      username: { value: realName.join(" "), isValid: true, message: null },
      email: { value: record.users_email, isValid: true, message: null },
    }

    const imageDoctor = {
      file: { 
        value: [{
          uid: -Math.abs(record.users_id),
          url: `${process.env.NEXT_PUBLIC_API_URL}/static/signature/${record.users_signature}`
        }], 
        isValid: true, 
        message: null 
      }
    }
    setIsUpdate(true)
    setShowModal(true)
    setDoctor(dataDoctor)
    setModalTitle(editTitle)
    setImageList(imageDoctor)
  }

  const onDeleteHandler = (id) => {
    let queryString = {}
    queryString["page"] = page
    queryString["per_page"] = per_page

    if(q) queryString["q"] = q
    else delete queryString["q"]

    axios.delete(`/users/delete-doctor/${id}`, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getDoctor({ ...queryString }))
        formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail == signature_exp){
          dispatch(actions.getDoctor({ ...queryString }))
          formErrorMessage('success', "Successfully delete the doctor.")
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })

  }
  
  const onCloseModalHandler = () => {
    setShowModal(false)
    setDoctor(formDoctor)
    setImageList(formImage)
    setModalTitle(addTitle)
    if(isUpdate) setIsUpdate(false)
  }

  useEffect(() => {
    let queryString = {}
    queryString["page"] = page
    queryString["per_page"] = per_page

    if(q) queryString["q"] = q
    else delete queryString["q"]

    dispatch(actions.getDoctor({...queryString}))
  }, [page])

  useEffect(() => {
    setPage(1)
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(q) queryString["q"] = q
    else delete queryString["q"]

    dispatch(actions.getDoctor({...queryString}))
  }, [q])

  useEffect(() => {
    if(doctors && doctors.data && doctors.data.length < 1 && doctors.page > 1 && doctors.total > 1){
      setPage(doctors.page - 1)
    }
  }, [doctors])

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          <Row gutter={[10,0]} justify="space-between" align="middle">
            <Col span={12}>
              <Card.Title className="mb-0">Daftar Dokter</Card.Title>
            </Col>
            <Col span={12}>
              <Button 
                type="primary" 
                className="float-right"
                onClick={() => {
                  setIsUpdate(false)
                  setShowModal(true)
                  setModalTitle(addTitle)
                }}
              >
                <i className="far fa-plus mr-1" />Dokter
              </Button>
            </Col>
          </Row>
          <hr />

          <Form layout="vertical" className="mb-3">
            <Form.Item className="mb-0">
              <Input 
                placeholder="Cari nama / email dokter" 
                prefix={<SearchOutlined />} 
                onChange={e => setQ(e.target.value)}
              />
            </Form.Item>
          </Form>

          <TableMemo
            bordered
            size="middle"
            pagination={false} 
            columns={columnsDoctors}
            dataSource={doctors?.data} 
            rowKey={record => record.users_id}
            scroll={{ y: 485, x: 800 }} 
            components={{ body: { cell: ProductCellEditable } }}
          />

          <Row gutter={[10,10]} justify="space-between">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="text-center">
                <Pagination 
                  className="mt-3"
                  current={page} 
                  hideOnSinglePage 
                  pageSize={per_page}
                  total={doctors?.total}
                  goTo={val => setPage(val)} 
                />
              </div>
            </Col>
          </Row>
          
        </Card.Body>
      </Card>

      <ModalDoctor 
        title={modalTitle}
        isUpdate={isUpdate}
        visible={showModal}
        dataDoctor={doctor}
        imageDoctor={imageList}
        setIsUpdate={setIsUpdate}
        getDoctor={() => dispatch(actions.getDoctor({ page: 1, per_page: per_page, q: '' }))}
        onCloseHandler={onCloseModalHandler}
      />
    </>
  )
}

export default withAuth(DoctorsContainer)
