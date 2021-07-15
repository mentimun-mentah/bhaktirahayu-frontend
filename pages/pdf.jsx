import dynamic from 'next/dynamic'
const PDF = dynamic(() => import('components/PdfTest'), { ssr: false })

const PDFContainer = () => {
    return <PDF/>
}

export default PDFContainer
