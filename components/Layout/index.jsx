import { memo, useEffect } from 'react'
import { parseCookies } from 'nookies'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import dynamic from 'next/dynamic'
import * as actions from 'store/actions'

const DasboardLayout = dynamic(import('components/Layout/Dashboard'), { ssr: false })

const Layout = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const isDashboard = router.pathname.startsWith('/dashboard')

  const { csrf_access_token, csrf_refresh_token } = parseCookies()

  useEffect(() => {
    if (csrf_access_token && csrf_refresh_token) {
      dispatch(actions.getUser())
    }
  }, [parseCookies])

  let layout = <>{children}</>
  if(isDashboard) layout = <DasboardLayout>{children}</DasboardLayout>

  return layout
}

export default memo(Layout)
