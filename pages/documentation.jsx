import dynamic from 'next/dynamic'
const PDFRender = dynamic(() => import('components/DocumentationViewer'), { ssr: false })

const Documentation = () => {
  return <PDFRender />
}

export default Documentation
