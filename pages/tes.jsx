import dynamic from 'next/dynamic'

const PDF = dynamic(() => import('components/Pdf'), { ssr: false })

const PDFContainer = () => {
  return <PDF/>
}

export default PDFContainer
