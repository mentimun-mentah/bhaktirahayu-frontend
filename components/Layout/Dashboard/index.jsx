import { useRouter } from 'next/router'
import { Layout, Menu, Grid } from 'antd'
import { useState, useEffect } from 'react'

import Image from 'next/image'

import Style from './Style'

const useBreakpoint = Grid.useBreakpoint
const HOME = "HOME", GENOSE = "GENOSE", ANTIGEN = "ANTIGEN", LOGOUT = "LOGOUT", DASHBOARD = "DASHBOARD"

const DashboardLayout = ({ children }) => {
  const router = useRouter()
  const screens = useBreakpoint()

  const [collapsed, setCollapsed] = useState(false)
  const [selected, setSelected] = useState(DASHBOARD)

  useEffect(() => {
    let mounted = true
    if(mounted && ((screens.sm && !screens.lg) || screens.xs)) setCollapsed(true)
    else setCollapsed(false)
  }, [screens])

  useEffect(() => {
    let routeNow = router.pathname.split("/")[router.pathname.split("/").length - 1]
    let data = routeNow.toUpperCase()
    if(routeNow.startsWith('[')) {
      data = router.pathname.split("/")[router.pathname.split("/").length - 2].toUpperCase()
    }
    setSelected(data)
  }, [router])

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Sider 
          collapsible 
          theme="light"
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
              <Menu.Item 
                key={HOME} 
                icon={<i className="far fa-door-open" />}
                onClick={() => router.push('/')}
              >
                Home
              </Menu.Item>
              <Menu.Item 
                key={DASHBOARD} 
                icon={<i className="far fa-house-flood" />}
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Menu.Item>
              <Menu.Item 
                key={ANTIGEN} 
                icon={<i className="far fa-sword-laser" />}
                onClick={() => router.push('/dashboard/antigen')}
              >
                Antigen
              </Menu.Item>
              <Menu.Item 
                key={GENOSE} 
                icon={<i className="far fa-wind" />}
                onClick={() => router.push('/dashboard/genose')}
              >
                Genose
              </Menu.Item>
              <Menu.Item 
                key={LOGOUT} 
                icon={<i className="far fa-sign-out" />}
                onClick={() => router.push('/')}
              >
                Log Out
              </Menu.Item>
            </Menu>

          </div>
        </Layout.Sider>

        <Layout className="main-layout">
          {children}
        </Layout>

      </Layout>

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
      `}</style>
    </>
  )
}

export default DashboardLayout
