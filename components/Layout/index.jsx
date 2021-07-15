import { useRouter } from 'next/router'

import dynamic from 'next/dynamic'

const DasboardLayout = dynamic(import('components/Layout/Dashboard'), { ssr: false })

const Layout = ({ children }) => {
  const router = useRouter()

  const isDashboard = router.pathname.startsWith('/dashboard')

  let layout = <>{children}</>
  if(isDashboard) layout = <DasboardLayout>{children}</DasboardLayout>

  return layout
}

export default Layout
