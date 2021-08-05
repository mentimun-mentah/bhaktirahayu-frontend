import { Provider } from 'react-redux'

import Head from 'next/head'
import withReduxStore from 'lib/with-redux-store'

import '/styles/global.css'
import '/styles/utility.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import Layout from 'components/Layout'

const App = ({ Component, pageProps, store }) => {
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
    </>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return { pageProps };
}

export default withReduxStore(App)
