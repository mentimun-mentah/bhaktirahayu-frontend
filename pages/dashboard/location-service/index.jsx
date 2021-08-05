import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { SearchOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Row, Col, Button, Modal, Space, Tooltip, Popconfirm, message } from 'antd'

import { enterPressHandler } from 'lib/utility'
import { columns_location } from 'data/tableLocation'
import { formLocation, formLocationIsValid } from 'formdata/locationService'
import { jsonHeaderHandler, formErrorMessage, errName, signature_exp } from 'lib/axios'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'

import axios from 'lib/axios'
import * as actions from 'store/actions'
import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import ErrorMessage from 'components/ErrorMessage'

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
              onConfirm={() => onDeleteHandler(record.location_services_id)}
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
const addTitle = "Tambah Lokasi"
const editTitle = "Edit Lokasi"
message.config({ maxCount: 1 });

const LocationServiceContainer = () => {
  const dispatch = useDispatch()

  const locationServices = useSelector(state => state.locationService.locationService)

  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState(addTitle)
  const [locationService, setLocationService] = useState(formLocation)

  const { name } = locationService

  /* INPUT CHANGE FUNCTION */
  const onChangeHandler = e => {
    const name = e.target.name
    const value = e.target.value

    const data = {
      ...locationService,
      [name]: { ...locationService[name], value: value, isValid: true, message: null }
    }

    setLocationService(data)
  }
  /* INPUT CHANGE FUNCTION */

  const onCloseModalHandler = () => {
    setShowModal(false)
    setLocationService(formLocation)
  }

  const columnsLocations = columns_location.map(col => {
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

  const onSubmitHandler = e => {
    e.preventDefault()
    if(formLocationIsValid(locationService, setLocationService, isUpdate)) {
      let config = {
        url: 'location-services/create',
        method: 'post'
      }
      if(isUpdate) {
        const { id } = locationService
        config = {
          url: `location-services/update/${id.value}`,
          method: 'put'
        }
      }

      setLoading(true)
      const data = {
        name: name.value,
      }

      axios[config.method](config.url, data, jsonHeaderHandler())
        .then(res => {
          formErrorMessage('success', res.data?.detail)
          setLoading(false)
          setShowModal(false)
          setLocationService(formLocation)
          dispatch(actions.getLocationService({ page: 1, per_page: per_page, q: '' }))
        })
        .catch(err => {
          setLoading(false)
          const state = _.cloneDeep(locationService)
          const errDetail = err.response?.data.detail

          if(errDetail == signature_exp) {
            onCloseModalHandler()
            formErrorMessage("success", "Successfully add a new location-service.")
            dispatch(actions.getLocationService({ page: 1, per_page: per_page, q: '' }))
            if(isUpdate) setIsUpdate(false)
          }
          else if(typeof errDetail === "string" && isIn(errDetail, errName)) {
            state.name.value = state.name.value
            state.name.isValid = false
            state.name.message = errDetail
          }
          else if(typeof(errDetail) === "string" && !isIn(errDetail, errName)) {
            formErrorMessage("error", errDetail)
          }
          else {
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if(state[key]){
                state[key].isValid = false
                state[key].message = data.msg
              }
            });
          }
          setLocationService(state)
        })
    }
  }

  const onEditHandler = (record) => {
    const data = {
      id: { value: record.location_services_id, isValid: true, message: null },
      name: { value: record.location_services_name, isValid: true, message: null },
    }
    setLocationService(data)
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

    axios.delete(`/location-services/delete/${id}`, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getLocationService({ ...queryString }))
        formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail == signature_exp){
          dispatch(actions.getLocationService({ ...queryString }))
          formErrorMessage('success', "Successfully delete the location-service.")
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

    dispatch(actions.getLocationService({...queryString}))
  }, [page])

  useEffect(() => {
    setPage(1)
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(q) queryString["q"] = q
    else delete queryString["q"]

    dispatch(actions.getLocationService({...queryString}))
  }, [q])

  useEffect(() => {
    if(locationServices && locationServices.data && 
      locationServices.data.length < 1 && locationServices.page > 1 && locationServices.total > 1
    ){
      setPage(locationServices.page - 1)
    }
  }, [locationServices])

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          <Row gutter={[10,0]} justify="space-between" align="middle">
            <Col span={12}>
              <Card.Title className="mb-0">Lokasi Pelayanan</Card.Title>
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
                <i className="far fa-plus mr-1" />Lokasi
              </Button>
            </Col>
          </Row>
          <hr />

          <Form layout="vertical" className="mb-3">
            <Form.Item className="mb-0">
              <Input 
                placeholder="Cari lokasi pelayanan" 
                prefix={<SearchOutlined />} 
                onChange={e => setQ(e.target.value)}
              />
            </Form.Item>
          </Form>

          <TableMemo
            bordered
            size="middle"
            pagination={false} 
            columns={columnsLocations}
            dataSource={locationServices?.data} 
            rowKey={record => record.location_services_id}
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
                  total={locationServices?.total} 
                  goTo={val => setPage(val)} 
                />
              </div>
            </Col>
          </Row>

        </Card.Body>
      </Card>


      <Modal 
        centered
        title={modalTitle}
        visible={showModal}
        onOk={onSubmitHandler}
        onCancel={onCloseModalHandler}
        okButtonProps={{ disabled: loading, loading: loading }}
        okText="Simpan"
        cancelText="Batal"
        closeIcon={<i className="far fa-times" />}
      >
        <Form layout="vertical" onKeyUp={e => enterPressHandler(e, onSubmitHandler)}>
          <Form.Item 
            label="Lokasi"
            className="mb-0"
            validateStatus={!name.isValid && name.message && "error"}
          >
            <Input
              name="name"
              value={name.value}
              onChange={onChangeHandler}
              placeholder="Lokasi pelayanan" 
            />
            <ErrorMessage item={name} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default withAuth(LocationServiceContainer)
