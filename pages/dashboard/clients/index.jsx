import { Card } from 'react-bootstrap'
import { withAuth } from 'lib/withAuth'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Space, Grid, Tooltip, Popconfirm, Button, Form, Input, Badge, message } from 'antd'

import { useDebounce } from 'lib/useDebounce'
import { reformatClients } from 'lib/utility'
import { DATE_FORMAT } from 'lib/disabledDate'
import { formPatient } from 'formdata/patient'
import { exportToExcel } from 'lib/exportToExcel'
import { columnsReports, reformatData } from 'data/table'
import { jsonHeaderHandler, signature_exp, formErrorMessage } from 'lib/axios'

import _ from 'lodash'
import 'moment/locale/id'
import moment from 'moment'
import nookies from 'nookies'
import isIn from 'validator/lib/isIn'

import axios from 'lib/axios'
import * as actions from 'store/actions'
import TableMemo from 'components/TableMemo'
import Pagination from 'components/Pagination'
import DrawerFilter from 'components/DrawerFilter'
import DrawerPatient from 'components/DrawerPatient'
import DrawerDetailPatient from 'components/DrawerDetailPatient'

moment.locale('id')
const per_page = 20
const useBreakpoint = Grid.useBreakpoint
message.config({ maxCount: 1 })

const ProductCellEditable = (
  { index, record, editable, type, children, onEditPatientHandler, onShowDetailPatient, onDeleteClientHandler, ...restProps }
) => {
  let childNode = children

  if(editable){
    childNode = (
      type === "action" && (
        <Space>
          <Tooltip placement="top" title="Riwayat">
            <a onClick={() => onShowDetailPatient(record)}><i className="fal fa-clipboard-list text-center" /></a>
          </Tooltip>
          <Tooltip placement="top" title="Ubah">
            <a onClick={() => onEditPatientHandler(record)}><i className="fal fa-edit text-center" /></a>
          </Tooltip>
          <Tooltip placement="top" title="Hapus">
            <Popconfirm
              placement="bottomRight"
              title="Hapus data ini?"
              onConfirm={() => onDeleteClientHandler(record.clients_id)}
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

const ClientsContainer = ({ searchQuery }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const screens = useBreakpoint()

  const clients = useSelector(state => state.client.client)

  const [q, setQ] = useState("")
  const [page, setPage] = useState(clients?.page)
  const [patient, setPatient] = useState(formPatient)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [activeFilter, setActiveFilter] = useState(false)
  const [showDetailPatient, setShowDetailPatient] = useState(false)

  const debouncedSearchClient = useDebounce(q, 500)

  const columnsPatient = columnsReports.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record, index: index,
        type: col.type, 
        editable: col.editable,
        onShowDetailPatient: record => onShowDetailPatient(record),
        onEditPatientHandler: record => onEditPatientHandler(record),
        onDeleteClientHandler: id => onDeleteClientHandler(id)
      })
    }
  })

  const onEditPatientHandler = record => {
    const realPhone = record.clients_phone.split(' ')
    realPhone.shift()

    const data = {
      ...patient, 
      id: { value: record.clients_id, isValid: true, message: null },
      nik: { value: record.clients_nik, isValid: true, message: null },
      name: { value: record.clients_name, isValid: true, message: null },
      birth_place: { value: record.clients_birth_place, isValid: true, message: null },
      birth_date: { value: moment(record.clients_birth_date).format(DATE_FORMAT), isValid: true, message: null },
      gender: { value: record.clients_gender, isValid: true, message: null },
      address: { value: record.clients_address, isValid: true, message: null },
      phone: { value: realPhone.join(""), isValid: true, message: null },
      covid_checkups: { value: record.covid_checkups, isValid: true, message: null }
    }
    setPatient(data)
    setShowDrawer(true)
  }

  const onShowDetailPatient = record => {
    const data = {
      ...patient, 
      id: { value: record.clients_id, isValid: true, message: null },
      nik: { value: record.clients_nik, isValid: true, message: null },
      name: { value: record.clients_name, isValid: true, message: null },
      birth_place: { value: record.clients_birth_place, isValid: true, message: null },
      birth_date: { value: moment(record.clients_birth_date).format(DATE_FORMAT), isValid: true, message: null },
      gender: { value: record.clients_gender, isValid: true, message: null },
      address: { value: record.clients_address, isValid: true, message: null },
      phone: { value: record.clients_phone, isValid: true, message: null },
      covid_checkups: { value: record.covid_checkups, isValid: true, message: null }
    }
    setPatient(data)
    setShowDetailPatient(true)
  }

  const onDeleteClientHandler = id => {
    axios.delete(`/clients/delete/${id}`, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getClient({ ...router.query }))
        formErrorMessage(res.status === 404 ? 'error' : 'success', res.data?.detail)
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp){
          dispatch(actions.getClient({ ...router.query }))
          formErrorMessage('success', "Successfully delete the client.")
        } else if(typeof(errDetail) === "string") {
          formErrorMessage('error', errDetail)
        } else {
          formErrorMessage('error', errDetail[0].msg)
        }
      })
  }

  // function for close drawer data pasien
  const onClosePatientDrawerHandler = () => {
    setShowDrawer(false)
    setPatient(formPatient)
    dispatch(actions.getClient({ ...router.query }))
  }

  // function for close drawer data riwayat pasien
  const onCloseDetailPatientDrawerHandler = () => {
    setShowDetailPatient(false)
    setPatient(formPatient)
    dispatch(actions.getClient({ ...router.query }))
  }

  const onExportHandler = () => {
    const copySearchQuery = { ...router.query }
    delete copySearchQuery?.page
    delete copySearchQuery?.per_page

    axios.get('/clients/all-clients-export', { params: copySearchQuery })
      .then(res => {
        exportToExcel(reformatData(res?.data), new Date())
      })
      .catch(err => {
        const errDetail = err.response?.data.detail
        if(errDetail === signature_exp){
          axios.get('/clients/all-clients-export', { params: copySearchQuery })
            .then(res => {
              exportToExcel(reformatData(res?.data), new Date())
            })
            .catch(() => {})
        }
        else return
      })
  }

  useEffect(() => {
    let query = { ...searchQuery }
    if(!query) return

    if(page) query["page"] = page

    router.replace({
      pathname: "/dashboard/clients",
      query: query
    })
  },[page])


  const fetchClient = val => {
    setPage(1)
    let query = { ...searchQuery }

    query["page"] = 1
    if(q) query["q"] = val
    else if(!q) delete query["q"]
    else if(query?.q) query["q"] = query?.q
    else delete query["q"]
    
    router.replace({
      pathname: "/dashboard/clients",
      query: query
    })
  }

  useEffect(() => {
    fetchClient(debouncedSearchClient)
  }, [debouncedSearchClient])

  // useEffect(() => {
  //   let query = { ...searchQuery }

  //   query["page"] = 1
  //   if(q) query["q"] = q
  //   else if(!q) delete query["q"]
  //   else if(query?.q) query["q"] = query?.q
  //   else delete query["q"]

  //   router.replace({
  //     pathname: "/dashboard/clients",
  //     query: query
  //   })
  // },[q])

  useEffect(() => {
    if(!searchQuery) return

    const copySearchQuery = { ...searchQuery }
    for(let [key, _] of Object.entries(copySearchQuery)) {
      if(isIn(key, ['q', 'page', 'per_page', 'register_end_date', 'check_end_date'])) {
        delete copySearchQuery[key]
      }
    }

    setActiveFilter(Object.keys(copySearchQuery).length)

    if(searchQuery.q) setQ(searchQuery.q)

    if(searchQuery.page && clients?.data?.length > 1) setPage(+searchQuery.page)

  }, [searchQuery])

  useEffect(() => {
    const emptyClient = clients && clients?.data && clients?.data?.length < 1 && clients?.page > 1 && clients?.total > 1
    if(emptyClient){
      const newPage = clients?.iter_pages
      setPage(+newPage[newPage?.length - 1 || 0])
    }
    else if(clients && clients?.data && clients?.data?.length && router?.query?.hasOwnProperty("page")){
      setPage(+router.query.page)
    }
    else if(!router?.query?.hasOwnProperty("page")){
      setPage(1)
    }
  }, [clients])

  let scrollY = 'calc(100vh - 246px)'
  if(clients?.iter_pages?.length === 1) { // if pagination is hidden
    if(screens.xs) scrollY = 'calc(100vh - 156px)'
    else if(screens.sm && !screens.md) scrollY = 'calc(100vh - 215px)'
    else scrollY = 'calc(100vh - 215px)'
  }
  else { // when pagination is shown
    if(screens.xs) scrollY = 'calc(100vh - 180px)'
    else if(screens.sm && !screens.md) scrollY = 'calc(100vh - 246px)'
    else scrollY = 'calc(100vh - 246px)'
  } 

  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          
          <Row gutter={[10, 10]} justify="space-between" className="mb-3">
            <Col xl={6} lg={12} md={12} sm={10} xs={10}>
              <Form.Item className="mb-0">
                <Input 
                  value={q}
                  placeholder="Cari nik / nama pasien" 
                  onChange={e => {
                    setQ(e.target.value)
                    setPage(1)
                  }}
                  prefix={<i className="far fa-search pr-2" />}
                />
              </Form.Item>
            </Col>
            <Col xl={5} lg={8} md={10} sm={14} xs={14}>
              <Space className="float-right">
                <Button 
                  type="text" 
                  className="border" 
                  icon={<i className="far fa-download mr-2" />}
                  onClick={onExportHandler}
                >
                  Export
                </Button>
                <Button 
                  type="text" 
                  className="border" 
                  onClick={() => setShowFilter(true)}
                  icon={activeFilter ? <Badge count={activeFilter} className="mr-2 fs-12 badge-filter" /> : <i className="far fa-filter mr-2" />}
                >
                  Filter
                </Button>
              </Space>
            </Col>
          </Row>

          <TableMemo
            bordered
            size="middle"
            pagination={false} 
            columns={columnsPatient}
            dataSource={reformatClients(clients?.data)} 
            rowKey={record => record.clients_id}
            scroll={{ y: scrollY, x: 1180 }} 
            components={{ body: { cell: ProductCellEditable } }}
          />

          <Card.Body className="pb-2 px-0">
            <div className="text-center">
              <Pagination 
                current={page} 
                hideOnSinglePage 
                pageSize={per_page}
                total={clients?.total} 
                goTo={val => setPage(val)} 
              />
            </div>
          </Card.Body>
        </Card.Body>
      </Card>

      <DrawerFilter
        per_page={per_page}
        visible={showFilter}
        onClose={() => setShowFilter(false)}
      />

      <DrawerPatient 
        visible={showDrawer} 
        dataPatient={patient}
        onCloseHandler={onClosePatientDrawerHandler}
      />

      <DrawerDetailPatient
        visible={showDetailPatient} 
        dataPatient={patient}
        onCloseHandler={onCloseDetailPatientDrawerHandler}
      />

      <style jsx>{`
      :global(.badge-filter) {
        vertical-align: sub;
      }
      :global(.badge-filter .ant-badge-count) {
        height: 18px;
        width: 18px;
        min-width: 18px;
        font-size: 10px;
        line-height: 18px;
      }
      `}</style>

    </>
  )
}

ClientsContainer.getInitialProps = async ctx => {
  if(ctx?.req) axios.defaults.headers.get.Cookie = ctx?.req.headers.cookie
  const searchQuery = { ...ctx.query }
  const cookies = nookies.get(ctx)

  if(isIn('institution_id', Object.keys(cookies)) &&
    !isIn('institution_id_delete', Object.keys(cookies)) &&
    !isIn('institution_id', Object.keys(searchQuery))
  ) {
    if(cookies?.institution_id) {
      searchQuery['institution_id'] = cookies?.institution_id
    }
    else {
      delete searchQuery['institution_id']
    }
  }

  if(isIn('location_service_id', Object.keys(cookies)) &&
    !isIn('location_service_id_delete', Object.keys(cookies)) &&
    !isIn('location_service_id', Object.keys(searchQuery))
  ) {
    if(cookies?.location_service_id) {
      searchQuery['location_service_id'] = cookies?.location_service_id
    }
    else {
      delete searchQuery['location_service_id']
    }
  }

  await ctx.store.dispatch(actions.getClient({ ...searchQuery, per_page: per_page }))
  return { searchQuery: searchQuery }
}

export default withAuth(ClientsContainer)
