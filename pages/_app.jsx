import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { useRouter } from 'next/router'

import Head from 'next/head'
import nookies from 'nookies'
import withReduxStore from 'lib/with-redux-store'

import '/styles/global.css'
import '/styles/utility.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import Layout from 'components/Layout'

const App = ({ Component, pageProps, store }) => {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = url => {
      if(!url.startsWith('/dashboard/clients')) {
        nookies.destroy(null, 'institution_id_delete', { path: '/' })
        nookies.destroy(null, 'location_service_id_delete', { path: '/' })
      }
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    };
  }, [router.events])

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>RSU Bhakti Rahayu</title>
        <meta name="robots" content="index, follow" />
        <meta name="description" content="RSU Bhakti Rahayu Denpasar. Rumah Sakit Tipe D Terakreditasi Komisi Akreditasi Rumah Sakit Indonesia. Melayani pasien umum maupun BPJS. Layanan rawat jalan, spesialis, rawat inap maupun IGD 24 Jam." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_DOMAIN} />
        <link rel="icon" href="/static/images/bhaktirahayu_logo.png" />
      </Head>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>

      <style jsx>{`
      :global(.select-py-2 .ant-select-selector, .select-py-2 .ant-select-selector .ant-select-selection-search-input) {
        height: 40px!important;
      }

      :global(.select-py-2.with-input .ant-select-selector .ant-select-selection-placeholder) {
        line-height: 38px;
      }
      `}</style>
    </>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return { pageProps };
}

export default withReduxStore(App)
