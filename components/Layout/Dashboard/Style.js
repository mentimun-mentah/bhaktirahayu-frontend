import css from "styled-jsx/css";

const style = css`
:global(.ant-menu) {
  background: transparent!important;
}

:global(.ant-layout-sider) {
  background: #F7FAFA!important;
}

:global(.ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left) {
  border-right: 1px solid #00000000;
}

:global(.ant-layout-sider-trigger) {
  margin: 15px;
  border-radius: 1rem;
}

:global(.ant-layout-sider-light .ant-layout-sider-trigger) {
  color: var(--white)!important;
  background: var(--primary-1)!important;
}

:global(.ant-layout-sider-has-trigger .ant-layout-sider-trigger) {
  width: 170px!important;
}

:global(.ant-layout-sider-collapsed.ant-layout-sider-has-trigger .ant-layout-sider-trigger) {
  width: 50px!important;
}

:global(.ant-layout-sider-custom .ant-layout-sider-children) {
  top: 0;
  height: 100vh;
  width: inherit;
  position: fixed;
}

:global(.ant-layout-sider-has-trigger) {
  padding-bottom: 78px!important;
}

:global(.ant-layout-sider-children) {
  padding: 15px!important;
}

:global(.ant-menu-inline) {
  border-right: unset !important;
}

:global(.ant-menu-inline .ant-menu-item::after, .ant-menu-vertical, .ant-menu-vertical .ant-menu-item::after) {
  border-right: unset !important;
}

:global(.ant-menu, .ant-menu-item a) {
  color: var(--grey)!important;
}

:global(.ant-menu-item-selected .ant-menu-item-icon, .ant-menu-item-selected a:hover, .ant-menu-item-selected .ant-menu-item-icon) {
  color: var(--primary-1)!important;
}

:global(.ant-menu-item-selected, .ant-menu-item-selected a:hover, .ant-menu-item-selected a) {
  color: var(--primary-1)!important;
}

:global(.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected) {
  background-color: #ecf4ee;
}

:global(.ant-menu-item:hover, 
.ant-menu-item a:hover, 
.ant-menu-item-active, 
.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open, 
.ant-menu-submenu-active, .ant-menu-submenu-title:hover,
.ant-menu-item-selected a:hover) {
  color: var(--primary-1)!important;
}

:global(.ant-menu-scroll) {
  overflow: scroll;
  height: calc(100vh - 48px - 96px - 30px);
}

:global(.ant-menu-scroll::-webkit-scrollbar) {
  width: 0;  /* Remove scrollbar space */
  background: transparent;  /* Optional: just make scrollbar invisible */
}

:global(.ant-menu-item) {
  border-radius: .5rem;
}

:global(.ant-menu-inline .ant-menu-item, .ant-menu-inline .ant-menu-submenu-title) {
  width: 100%;
}

:global(.logo) {
  margin-bottom: 15px;
}

:global(.main-layout) {
  padding: 25px;
}
`

export default style
