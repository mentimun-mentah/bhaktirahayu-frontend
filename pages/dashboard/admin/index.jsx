import { Card } from 'react-bootstrap'
import { useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Form, Input, Row, Col, Button, Modal, Space } from 'antd'

import { columns_admin, data_admin } from 'data/tableAdmin'
import { formAdmin, formAdminIsValid } from 'formdata/admin'

import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import ErrorMessage from 'components/ErrorMessage'

const ProductCellEditable = ({ index, record, editable, type, children, showModal, ...restProps }) => {
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

const addTitle = "Tambah Admin"
const editTitle = "Edit Admin"

const AdminsContainer = () => {

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [admin, setAdmin] = useState(formAdmin)
  const [isUpdate, setIsUpdate] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState(addTitle)

  const { username, email, password, old_password, confirm_password } = admin


  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = e => {
    const name = e.target.name
    const value = e.target.value

    const data = {
      ...admin,
      [name]: { ...admin[name], value: value, isValid: true, message: null }
    }

    setAdmin(data)
  }
  /* INPUT CHANGE FUNCTION */

  const onSubmitHandler = e => {
    e.preventDefault()
    if(formAdminIsValid(admin, setAdmin, isUpdate)) {
      setLoading(true)
      let data = {
        username: username.value,
        email: email.value,
        password: password.value,
        confirm_password: confirm_password.value,
      }

      if(isUpdate) {
        data = {
          ...data,
          old_password: old_password.value,
        }
      }

      console.log(data)
    }
  }

  const columnsAdmin = columns_admin.map(col => {
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

  const onCloseModalHandler = e => {
    e.preventDefault()
    setShowModal(false)
    setAdmin(formAdmin)
  }

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          <Row gutter={[10,0]} justify="space-between" align="middle">
            <Col span={12}>
              <Card.Title className="mb-0">Daftar Admin</Card.Title>
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
                <i className="far fa-plus mr-1" />Admin
              </Button>
            </Col>
          </Row>
          <hr />

          <Form layout="vertical" className="mb-3">
            <Form.Item className="mb-0">
              <Input placeholder="Cari admin" prefix={<SearchOutlined />} />
            </Form.Item>
          </Form>

          <TableMemo
            bordered
            size="middle"
            pagination={false} 
            columns={columnsAdmin}
            dataSource={data_admin} 
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
        onCancel={onCloseModalHandler}
        okText="Simpan"
        cancelText="Batal"
        closeIcon={<i className="far fa-times" />}
      >
        <Form 
          layout="vertical"
          id="w-modal-body"
        >
          <Form.Item 
            label="Nama" 
            className="mb-3"
            validateStatus={!username.isValid && username.message && "error"}
          >
            <Input 
              name="username"
              value={username.value}
              onChange={onChangeHandler}
              placeholder="Nama" 
            />
            <ErrorMessage item={username} />
          </Form.Item>

          <Form.Item 
            label="Email"
            className="mb-3"
            validateStatus={!email.isValid && email.message && "error"}
          >
            <Input 
              name="email"
              type="email"
              value={email.value}
              onChange={onChangeHandler}
              placeholder="Email" 
            />
            <ErrorMessage item={email} />
          </Form.Item>

          {isUpdate && (
            <Form.Item 
              label="Password Lama" 
              className="mb-3"
              validateStatus={!old_password.isValid && old_password.message && "error"}
            >
              <Input.Password 
                name="old_password"
                value={old_password.value}
                onChange={onChangeHandler}
                placeholder="Password lama" 
              />
              <ErrorMessage item={old_password} />
            </Form.Item>
          )}

          <Form.Item 
            label="Password Baru" 
            className="mb-3"
            validateStatus={!password.isValid && password.message && "error"}
          >
            <Input.Password 
              name="password"
              value={password.value}
              onChange={onChangeHandler}
              placeholder="Password baru"
            />
            <ErrorMessage item={password} />
          </Form.Item>

          <Form.Item 
            label="Konfirmasi Password" 
            className="mb-3"
            validateStatus={!confirm_password.isValid && confirm_password.message && "error"}
          >
            <Input.Password 
              name="confirm_password"
              value={confirm_password.value}
              onChange={onChangeHandler}
              placeholder="Konfirmasi password" 
            />
            <ErrorMessage item={confirm_password} />
          </Form.Item>

        </Form>
      </Modal>

      <style jsx>{`

      .square {
        position: relative;
        width: 100%;
      }

      .square:after {
        content: "";
        display: block;
        padding-bottom: 100%;
      }

      :global(.content) {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      :global(.wh-inherit) {
        width: inherit;
        height: inherit;
      }

      :global(.signature-uploader .ant-upload.ant-upload-select-picture-card, .ant-upload-list-picture-card-container, .signature-uploader) {
        width: 200px;
        height: 200px;
      }
      :global(.signature-uploader .ant-upload-list-picture-card .ant-upload-list-item-thumbnail, .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img) {
        object-fit: cover;
      }

      @media only screen and (max-width: 320px) { 
        :global(.signature-uploader .ant-upload.ant-upload-select-picture-card, .ant-upload-list-picture-card-container, .signature-uploader) {
          width: 150px;
          height: 150px;
        }
      }

      `}</style>
    </>
  )
}

export default AdminsContainer
