import { useRef } from 'react'
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image'
import { PDFViewer,  Page, Text, View, Document, StyleSheet  } from '@react-pdf/renderer'

const PdfContainer = () => {
  return (
    <Document>
      <Page size="A5">
        <View>
          <Text>Section #1</Text>
        </View>
        <View>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  )
}
// 
const PDFContainer = () => {
  const page = useRef()
  return (
    <>
        <div ref={ref => { page.current = ref; }}>
          dsadsadas
        </div>
      <PDFViewer>
        <PdfContainer  />
      </PDFViewer>

      <button onClick={() => exportComponentAsJPEG(page)}>
         Export As JPEG
       </button>
       <button onClick={() => exportComponentAsPDF(page)}>
         Export As PDF
       </button>
       <button onClick={() => exportComponentAsPNG(page)}>
         Export As PNG
       </button>

    </>
  )
}

export default PDFContainer
