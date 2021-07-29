import { useState } from 'react'
import { Card } from 'react-bootstrap'
import { SearchOutlined } from '@ant-design/icons'
import { Form, Input, Row, Col, Button, Modal, Space } from 'antd'

import { formGuardian, formGuardianIsValid } from 'formdata/guardian'
import { columns_guardian, data_guardian } from 'data/tableGuardian'

import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import ErrorMessage from 'components/ErrorMessage'

const ProductCellEditable = ({ index, record, editable, type, showModal, children, ...restProps }) => {
  let childNode = children

  if(editable){
    childNode = (
      type === "action" && (
        <Space>
          <a onClick={showModal}><i className="fal fa-edit text-center" /></a>
          <a onClick={() => {}}><i className="fal fa-trash-alt text-center" /></a>
        </Space>
      )
    )
  }
  
  return <td {...restProps}>{childNode}</td>
}

const addTitle = "Tambah Penjamin"
const editTitle = "Edit Penjamin"

const GuardiansContainer = () => {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [guardian, setGuardian] = useState(formGuardian)
  const [modalTitle, setModalTitle] = useState(addTitle)

  const { username } = guardian

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = e => {
    const name = e.target.name
    const value = e.target.value

    const data = {
      ...guardian,
      [name]: { ...guardian[name], value: value, isValid: true, message: null }
    }

    setGuardian(data)
  }
  /* INPUT CHANGE FUNCTION */

  const columnsGuardians = columns_guardian.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record, index: index,
        type: col.type, 
        editable: col.editable,
        showModal: () => {
          setIsUpdate(true)
          setShowModal(true)
          setModalTitle(editTitle)
        }
      })
    }
  })

  const onSubmitHandler = e => {
    e.preventDefault()
    if(formGuardianIsValid(guardian, setGuardian, isUpdate)) {
      setLoading(true)
      const data = {
        username: username.value,
      }

      console.log(data)
    }
  }

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
              <Input placeholder="Cari penjamin" prefix={<SearchOutlined />} />
            </Form.Item>
          </Form>

          <TableMemo
            bordered
            size="middle"
            pagination={false} 
            columns={columnsGuardians}
            dataSource={data_guardian} 
            scroll={{ y: 485, x: 800 }} 
            components={{ body: { cell: ProductCellEditable } }}
          />

          <Card.Body className="pb-2 px-0">
            <Row gutter={[10,10]} justify="space-between">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div className="text-center">
                  <Pagination 
                    current={page} 
                    hideOnSinglePage 
                    pageSize={10}
                    total={304} 
                    goTo={val => setPage(val)} 
                  />
                </div>
              </Col>
            </Row>
          </Card.Body>

        </Card.Body>
      </Card>


      <Modal 
        centered
        title={modalTitle}
        visible={showModal}
        onOk={onSubmitHandler}
        onCancel={() => setShowModal(false)}
        okText="Simpan"
        cancelText="Batal"
        closeIcon={<i className="far fa-times" />}
      >
        <Form layout="vertical">

          <Form.Item 
            className="mb-0"
            label="Nama Penjamin"
            validateStatus={!username.isValid && username.message && "error"}
          >
            <Input 
              name="username"
              value={username.value}
              onChange={onChangeHandler}
              placeholder="Nama penjamin" 
            />
            <ErrorMessage item={username} />
          </Form.Item>

        </Form>
      </Modal>
    </>
  )
}

export default GuardiansContainer
