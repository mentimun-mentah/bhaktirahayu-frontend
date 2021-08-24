import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { SearchOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Row, Col, Button, Space, Tooltip, Popconfirm, message, Grid } from 'antd'

import { useDebounce } from 'lib/useDebounce'
import { columns_location } from 'data/tableLocation'
import { formLocation } from 'formdata/locationService'
import { jsonHeaderHandler, formErrorMessage, signature_exp } from 'lib/axios'

import axios from 'lib/axios'
import * as actions from 'store/actions'
import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import ModalLocation from 'components/LocationService/ModalLocation'

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

const per_page = 20
const addTitle = "Tambah Lokasi"
const editTitle = "Edit Lokasi"
const useBreakpoint = Grid.useBreakpoint
message.config({ maxCount: 1 });

const LocationServiceContainer = () => {
  const dispatch = useDispatch()
  const screens = useBreakpoint()

  const locationServices = useSelector(state => state.locationService.locationService)

  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [isUpdate, setIsUpdate] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState(addTitle)
  const [locationService, setLocationService] = useState(formLocation)

  const debouncedSearchGuardian = useDebounce(q, 500)

  const onCloseModalHandler = () => {
    setShowModal(false)
    setModalTitle(addTitle)
    setLocationService(formLocation)
    if(isUpdate) setIsUpdate(false)
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
        if(errDetail === signature_exp){
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

    dispatch(actions.getLocationService({ ...queryString }))
  }, [page])


  const fetchLocationService = val => {
    setPage(1)
    let queryString = {}
    queryString["page"] = 1
    queryString["per_page"] = per_page

    if(val) queryString["q"] = val
    else delete queryString["q"]
    dispatch(actions.getLocationService({ ...queryString }))
  }

  useEffect(() => {
    fetchLocationService(debouncedSearchGuardian)
  }, [debouncedSearchGuardian])


  useEffect(() => {
    if(locationServices && locationServices?.data && locationServices?.data?.length < 1 && locationServices?.page > 1 && locationServices?.total > 1){
      setPage(locationServices?.page - 1)
    }
  }, [locationServices])

  let scrollY = 'calc(100vh - 300px)'
  if(locationServices?.iter_pages?.length === 1) { // if pagination is hidden
    if(screens.xs) scrollY = 'calc(88vh - 195px)'
    else if(screens.sm && !screens.md) scrollY = 'calc(100vh - 255px)'
    else scrollY = 'calc(100vh - 255px)'
  }
  else { // when pagination is shown
    if(screens.xs) scrollY = 'calc(88vh - 234px)'
    else if(screens.sm && !screens.md) scrollY = 'calc(100vh - 300px)'
    else scrollY = 'calc(100vh - 300px)'
  } 

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
                value={q}
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
            scroll={{ y: scrollY, x: 800 }} 
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


      <ModalLocation 
        title={modalTitle}
        visible={showModal}
        isUpdate={isUpdate}
        dataLocation={locationService}
        setIsUpdate={setIsUpdate}
        getLocationService={() => dispatch(actions.getLocationService({ page: page, per_page: per_page, q: q }))}
        onCloseHandler={onCloseModalHandler}
      />
    </>
  )
}

export default withAuth(LocationServiceContainer)
