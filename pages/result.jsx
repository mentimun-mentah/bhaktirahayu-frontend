import dynamic from 'next/dynamic'
const PDFRender = dynamic(() => import('components/ResultViewer'), { ssr: false })

const Result = ({ pdf, filename }) => {
  return <PDFRender pdf={pdf} filename={filename} />
}

Result.getInitialProps = async ctx => {
  const { req, fn } = ctx.query
  return { pdf: req, filename: fn }
}

export default Result
