const withAntdLess = require('next-plugin-antd-less')
const { theme } = require('./styles/theme')

module.exports = withAntdLess({
  modifyVars: theme,
  reactStrictMode: false,
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    domains: ['ecs7.tokopedia.net', 'os.alipayobjects.com'],
    path: '/_next/image',
    loader: 'default',
  },

  webpack(config) {
    return config;
  }
})
