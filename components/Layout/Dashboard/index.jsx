import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { parseCookies, setCookie } from 'nookies'
import { Layout, Menu, Grid, Button, Drawer } from 'antd'
import { MenuUnfoldOutlined } from '@ant-design/icons'

import { dashboard_routes, DASHBOARD } from './routes'

import Image from 'next/image'

import Style from './Style'

const useBreakpoint = Grid.useBreakpoint

const DashboardLayout = ({ children }) => {
  const router = useRouter()
  const screens = useBreakpoint()

  const [role, setRole] = useState("admin")
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

  useEffect(() => {
    const cookies = parseCookies();
    setRole(cookies.role || "")
  }, [])

  const renderSidemenu = () => {
    return dashboard_routes.map(route => (
      <Menu.Item 
        key={route.key} 
        icon={<i className={route.icon} />}
        onClick={() => router.push(route.route)}
      >
        {route.label}
      </Menu.Item>
    ))
  }

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
                <Image width="90" height="90" src="/static/images/bhaktirahayu_logo_transparent.png" alt="bhaktirahayu_logo" />
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
            <Image width="66" height="65" src="/static/images/bhaktirahayu_logo_transparent.png" alt="bhaktirahayu_logo" />
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
        }
      `}</style>
    </>
  )
}

export default DashboardLayout
