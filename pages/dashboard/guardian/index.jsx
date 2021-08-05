import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { useState, useEffect } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Row, Col, Button, Space, Tooltip, Popconfirm, message } from 'antd'

import { formGuardian } from 'formdata/guardian'
import { columns_guardian } from 'data/tableGuardian'
import { jsonHeaderHandler, formErrorMessage, signature_exp } from 'lib/axios'

import axios from 'lib/axios'
import * as actions from 'store/actions'
import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import ModalGuardian from 'components/Guardian/ModalGuardian'

const ProductCellEditable = ({ index, record, editable, type, onDeleteHandler, onEditHandler, children, ...restProps }) => {
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
              onConfirm={() => onDeleteHandler(record.guardians_id)}
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
const addTitle = "Tambah Penjamin"
const editTitle = "Edit Penjamin"
message.config({ maxCount: 1 })

const GuardiansContainer = () => {
  const dispatch = useDispatch()

  const guardians = useSelector(state => state.guardian.guardian)

  const [q, setQ] = useState("")
  const [isUpdate, setIsUpdate] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(guardians?.page)
  const [guardian, setGuardian] = useState(formGuardian)
  const [modalTitle, setModalTitle] = useState(addTitle)

  const onCloseModalHandler = () => {
    setShowModal(false)
    setGuardian(formGuardian)
    setModalTitle(addTitle)
    if(isUpdate) setIsUpdate(false)
  }

  const columnsGuardians = columns_guardian.map(col => {
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
    const data = {
      id: { value: record.guardians_id, isValid: true, message: null },
      name: { value: record.guardians_name, isValid: true, message: null },
    }
    setGuardian(data)
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

    axios.delete(`/guardians/delete/${id}`, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getGuardian({ ...queryString }))
        formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail == signature_exp){
          dispatch(actions.getGuardian({ ...queryString }))
          formErrorMessage('success', "Successfully delete the guardian.")
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })
  }

  useEffect(() => {
    let queryString = {}
    queryString["page"] = page
    queryString["per_page"] = per_page

    if(q) queryString["q"] = q
    else delete queryString["q"]

    dispatch(actions.getGuardian({...queryString}))
  }, [page])

  useEffect(() => {
    setPage(1)
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(q) queryString["q"] = q
    else delete queryString["q"]

    dispatch(actions.getGuardian({...queryString}))
  }, [q])

  useEffect(() => {
    if(guardians && guardians.data && guardians.data.length < 1 && guardians.page > 1 && guardians.total > 1){
      setPage(guardians.page - 1)
    }
  }, [guardians])



  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          <Row gutter={[10,0]} justify="space-between" align="middle">
            <Col span={12}>
              <Card.Title className="mb-0">Daftar Penjamin</Card.Title>
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
                <i className="far fa-plus mr-1" />Penjamin
              </Button>
            </Col>
          </Row>
          <hr />

          <Form layout="vertical" className="mb-3">
            <Form.Item className="mb-0">
              <Input 
                placeholder="Cari penjamin"
                prefix={<SearchOutlined />} 
                onChange={e => setQ(e.target.value)}
              />
            </Form.Item>
          </Form>

          <TableMemo
            bordered
            size="middle"
            pagination={false} 
            columns={columnsGuardians}
            dataSource={guardians?.data} 
            rowKey={record => record.guardians_id}
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
                  total={guardians?.total}
                  goTo={val => setPage(val)} 
                />
              </div>
            </Col>
          </Row>

        </Card.Body>
      </Card>


      <ModalGuardian 
        title={modalTitle}
        visible={showModal}
        isUpdate={isUpdate}
        dataGuardian={guardian}
        setIsUpdate={setIsUpdate}
        getGuardian={() => dispatch(actions.getGuardian({ page: 1, per_page: per_page, q: '' }))}
        onCloseHandler={onCloseModalHandler}
      />
    </>
  )
}

export default withAuth(GuardiansContainer)
