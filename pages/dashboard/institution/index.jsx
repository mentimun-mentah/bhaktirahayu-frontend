import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { SearchOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Row, Col, Button, Space, Tooltip, Popconfirm } from 'antd'

import { formImage } from 'formdata/image'
import { columns_instansi } from 'data/tableInstansi'
import { formInstitution } from 'formdata/institution'
import { jsonHeaderHandler, formErrorMessage, signature_exp } from 'lib/axios'

import axios from 'lib/axios'
import * as actions from 'store/actions'
import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import ModalInstitution from 'components/Institution/ModalInstitution'

const ProductCellEditable = ({ index, record, editable, type, onEditHandler, onDeleteHandler, children, ...restProps }) => {
  let childNode = children

  if(editable){
    childNode = (
      type === "action" && (
        <Space>
          <Tooltip placement="top" title="Ubah">
            <a onClick={() => onEditHandler(record)}><i className="fal fa-edit text-center" /></a>
          </Tooltip>
          <Tooltip placement="top" title="Pratinjau">
            <a onClick={() => pdfGenerator(record, index)}><i className="fal fa-eye text-center" /></a>
          </Tooltip>
          <Tooltip placement="top" title="Hapus">
            <Popconfirm
              placement="bottomRight"
              title={<span>Menghapus instansi juga akan <br/> menghapus seluruh data pasien <br /> yang telah terdaftar pada instansi ini, lanjutkan?</span>}
              onConfirm={() => onDeleteHandler(record.institutions_id)}
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
const addTitle = "Tambah Instansi"
const editTitle = "Edit Instansi"

const InstitutionContainer = () => {
  const dispatch = useDispatch()

  const institutions = useSelector(state => state.institution.institution)

  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [isUpdate, setIsUpdate] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState(addTitle)
  const [imageStamp, setImageStamp] = useState(formImage)
  const [imageGenose, setImageGenose] = useState(formImage)
  const [imageAntigen, setImageAntigen] = useState(formImage)
  const [institution, setInstitution] = useState(formInstitution)

  const columnsInstitution = columns_instansi.map(col => {
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
    let checking_type = []

    if(record.institutions_antigen !== null) {
      const dataAntigen = {
        file: { 
          value: [{
            uid: -Math.abs(Math.random()),
            url: `${process.env.NEXT_PUBLIC_API_URL}/static/institution/${record.institutions_antigen}`
          }], 
          isValid: true, 
          message: null 
        }
      }
      setImageAntigen(dataAntigen)
      checking_type.push('antigen')
    }

    if(record.institutions_genose !== null) {
      const dataGenose = {
        file: { 
          value: [{
            uid: -Math.abs(Math.random()),
            url: `${process.env.NEXT_PUBLIC_API_URL}/static/institution/${record.institutions_genose}`
          }], 
          isValid: true, 
          message: null 
        }
      }
      setImageGenose(dataGenose)
      checking_type.push('genose')
    }

    const dataStamp = {
      file: { 
        value: [{
          uid: -Math.abs(Math.random()),
          url: `${process.env.NEXT_PUBLIC_API_URL}/static/institution/${record.institutions_stamp}`
        }], 
        isValid: true, 
        message: null 
      }
    }

    const dataInstitution = {
      id: { value: record.institutions_id, isValid: true, message: null },
      name: { value: record.institutions_name, isValid: true, message: null },
      checking_type: { value: checking_type, isValid: true, message: null },
    }

    setImageStamp(dataStamp)
    setInstitution(dataInstitution)
    setIsUpdate(true)
    setShowModal(true)
    setModalTitle(editTitle)
  }

  const onDeleteHandler = (id) => {
    let queryString = {}
    queryString["page"] = page
    queryString["per_page"] = per_page

    if(q) queryString["q"] = q
    else delete queryString["q"]

    axios.delete(`/institutions/delete/${id}`, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getInstitution({ ...queryString }))
        formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail == signature_exp){
          dispatch(actions.getInstitution({ ...queryString }))
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
    setModalTitle(addTitle)
    setImageStamp(formImage)
    setImageGenose(formImage)
    setImageAntigen(formImage)
    setInstitution(formInstitution)
    if(isUpdate) setIsUpdate(false)
  }

  useEffect(() => {
    let queryString = {}
    queryString["page"] = page
    queryString["per_page"] = per_page

    if(q) queryString["q"] = q
    else delete queryString["q"]

    dispatch(actions.getInstitution({...queryString}))
  }, [page])

  useEffect(() => {
    setPage(1)
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(q) queryString["q"] = q
    else delete queryString["q"]

    dispatch(actions.getInstitution({...queryString}))
  }, [q])

  useEffect(() => {
    if(institutions && institutions.data && institutions.data.length < 1 && institutions.page > 1 && institutions.total > 1){
      setPage(institutions.page - 1)
    }
  }, [institutions])

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          <Row gutter={[10,0]} justify="space-between" align="middle">
            <Col span={12}>
              <Card.Title className="mb-0">Daftar Instansi</Card.Title>
            </Col>
            <Col span={12}>
              <Button 
                type="primary" 
                className="float-right"
                onClick={() => {
                  setShowModal(true)
                  setIsUpdate(false)
                  setModalTitle(addTitle)
                }}
              >
                <i className="far fa-plus mr-1" />Instansi
              </Button>
            </Col>
          </Row>
          <hr />

          <Form layout="vertical" className="mb-3">
            <Form.Item className="mb-0">
              <Input 
                placeholder="Cari instansi"
                prefix={<SearchOutlined />} 
                onChange={e => setQ(e.target.value)}
              />
            </Form.Item>
          </Form>

          <TableMemo
            bordered
            size="middle"
            pagination={false} 
            columns={columnsInstitution}
            dataSource={institutions?.data} 
            rowKey={record => record.institutions_id}
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
                  total={institutions?.total}
                  goTo={val => setPage(val)} 
                />
              </div>
            </Col>
          </Row>

        </Card.Body>
      </Card>

      <ModalInstitution 
        title={modalTitle}
        visible={showModal}
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
        dataStamp={imageStamp}
        dataGenose={imageGenose}
        dataAntigen={imageAntigen}
        dataInstitution={institution}
        onCloseHandler={onCloseModalHandler}
        getInstitution={() => dispatch(actions.getInstitution({ page: 1, per_page: per_page, q: '', checking_type: '' }))}
      />
    </>
  )
}

export default withAuth(InstitutionContainer)
