import { useRouter } from 'next/router'
import { MenuUnfoldOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Menu, Grid, Button, Drawer } from 'antd'
import { useState, useEffect, useCallback, memo } from 'react'

import { dashboard_routes, DASHBOARD, LOGOUT, CLIENTS } from './routes'

import _ from 'lodash'
import Image from 'next/image'
import isIn from 'validator/lib/isIn'

import Style from './Style'
import * as actions from 'store/actions'

const useBreakpoint = Grid.useBreakpoint

const DashboardLayout = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const screens = useBreakpoint()

  const users = useSelector(state => state.auth.user)

  const [isMobile, setIsMobile] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [selected, setSelected] = useState(DASHBOARD)
  const [showDrawer, setShowDrawer] = useState(false)

  useEffect(() => {
    let mounted = true
    if(mounted && ((screens.sm && !screens.lg) || screens.xs)) setCollapsed(true)
    else setCollapsed(false)

    if(mounted && (screens.xs && !screens.sm)) setIsMobile(true)
    else setIsMobile(false)
  }, [screens])

  useEffect(() => {
    let routeNow = router.pathname.split("/")[router.pathname.split("/").length - 1]
    let data = routeNow.toUpperCase()
    if(routeNow.startsWith('[')) {
      data = router.pathname.split("/")[router.pathname.split("/").length - 2].toUpperCase()
    }
    setSelected(data)
  }, [router])


  const onLogoutHandler = () => {
    if(typeof window !== 'undefined') window.location.replace('/')
    router.replace('/')
    dispatch(actions.logout())
  }

  const renderSidemenu = useCallback(() => {
    return dashboard_routes.map(route => {
      if(isIn(users?.role || "", route.role)) {
        return (
          <Menu.Item 
            key={route.key} 
            className="user-select-none"
            icon={<i className={route.icon} />}
            onClick={route.key === LOGOUT ? () => onLogoutHandler() : (router.pathname === "/dashboard/clients" && route.key === CLIENTS) ? () => {} : () => router.push(route.route)}
          >
            {route.label}
          </Menu.Item>
        )
      }
    })
  }, [users])

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        {!isMobile && (
          <Layout.Sider 
            collapsible 
            theme="light"
            breakpoint="md"
            collapsed={collapsed} 
            data-testid="sidebar"
            className="ant-layout-sider-custom"
            onCollapse={val => setCollapsed(val)}
            trigger={
              <i 
                title={collapsed ? 'icon-right' : 'icon-left'}
                className={`far fa-chevron-${collapsed ? 'right' : 'left'}`} 
              />
            }
          >
            <div className="sidebar-inner">
              <div className="logo text-center bold">
                <Image width="100" height="90" src="/static/images/bhaktirahayu_logo.png" alt="bhaktirahayu_logo" />
              </div>
              <Menu 
                mode="inline" 
                theme="light" 
                inlineIndent={15} 
                className="ant-menu-scroll"
                selectedKeys={[selected]}
              >
                {renderSidemenu()}
              </Menu>

            </div>
          </Layout.Sider>
        )}

        <Layout className={!isMobile && "main-layout"}>
          {children}
        </Layout>

      </Layout>

      {isMobile && (
        <Button type="primary" size="large" shape="circle" className="float" onClick={() => setShowDrawer(true)}>
          <MenuUnfoldOutlined style={{ fontSize: '18px' }} />
        </Button>
      )}

      <Drawer
        placement="left"
        closable={false}
        visible={showDrawer}
        onClose={() => setShowDrawer(false)}
        bodyStyle={{ overflow: 'hidden' }}
        title={false}
      >
        <div className="sidebar-inner">
          <div className="logo text-center bold">
            <Image width="80" height="73" src="/static/images/bhaktirahayu_logo.png" alt="bhaktirahayu_logo" />
          </div>
          <Menu 
            mode="inline" 
            theme="light" 
            inlineIndent={15} 
            selectedKeys={[selected]}
            className="ant-menu-scroll"
          >
            {renderSidemenu()}
          </Menu>
        </div>
      </Drawer>

      <style jsx>{Style}</style>
      <style jsx>{`
        @media only screen and (max-width: 575px) {
          :global(.ant-layout-sider-custom) {
            z-index: 2;
            position: ${collapsed ? "unset" : "fixed"};
          }
          :global(.ant-layout-sider-custom .ant-layout-sider-children) {
            background-color: white;
            box-shadow: rgb(0 0 0 / 8%) 3px 8px 20px;
          }
        }
        :global(.ant-layout-sider-custom .ant-layout-sider-children .ant-menu-submenu-selected) {
          color: var(--black);
        }
        :global(.ant-layout-sider-custom .ant-layout-sider-children .ant-menu-submenu-selected .ant-menu-item:active, 
                .ant-layout-sider-custom .ant-layout-sider-children .ant-menu-submenu-selected .ant-menu-submenu-title:active) {
          border-radius: .8rem;
        }
        :global(.ant-menu-submenu:hover > .ant-menu-submenu-title > .ant-menu-submenu-expand-icon, .ant-menu-submenu:hover > .ant-menu-submenu-title > .ant-menu-submenu-arrow) {
          color: var(--black)!important;
        }
        :global(.ant-menu-submenu-arrow) {
          color: var(--grey);
        }
        :global(.float) {
          position: fixed;
          bottom: 15px;
          left: 15px;
          box-shadow: rgb(0 0 0) 0px 5px 14px -5px!important;
          height: 50px;
          width: 50px;
          z-index; 1;
          color: #fff!important;
          border-radius: 50%!important;
          background: #38ab6b!important;
          border-color: #38ab6b!important;
          text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
        }

        :global(.count-check-tag) {
          font-size: ${isMobile ? '10px' : '12px'};
        }
        :global(.ant-table table) {
          font-size: ${isMobile ? '12px' : '14px'};
        }
        :global(.ant-table.ant-table-middle .ant-table-title, .ant-table.ant-table-middle .ant-table-footer, .ant-table.ant-table-middle .ant-table-thead > tr > th, .ant-table.ant-table-middle .ant-table-tbody > tr > td, .ant-table.ant-table-middle tfoot > tr > th, .ant-table.ant-table-middle tfoot > tr > td) {
          padding: ${isMobile ? '10px 8px' : '12px 8px'};
        }
      `}</style>
    </>
  )
}

export default memo(DashboardLayout)
