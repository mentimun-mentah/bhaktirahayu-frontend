import { useRef } from 'react'
import { Affix, Button, Space } from 'antd'
import { exportComponentAsJPEG } from 'react-component-export-image'

import PDFViewer from 'mgr-pdf-viewer-react'

const ResultViewer = ({ pdf, filename }) => {
  const pdfRef = useRef()

  const downloadFile = (blob, fileName) => {
    const link = document.createElement('a');
    link.href = blob;
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
  };

  const onDownload = () => {
    downloadFile(pdf, `Test result for ${filename}`)
  }

  const capture = () => {
    const element = document.getElementById("some-element")
    // element.style = "width: 629.295px;height: 892.92px;"
        
    window && window.scrollTo(0, 0)
    import('html2canvas').then(html2canvas => {
      html2canvas.default(element).then(canvas => {
        downloadFile(canvas.toDataURL(), `Test result for ${filename}`)
      })
    })

  }

  const exportToJpegHandler = () => {
    window && window.scrollTo(0, 0)
    exportComponentAsJPEG(pdfRef, { fileName: `Test result for ${filename}` })
  }

  return (
    <>
      <div className="page A5" id="some-element">
        <PDFViewer 
          scale={1.5}
          ref={pdfRef}
          document={{ url: pdf }} 
        />
      </div>

      <Affix offsetBottom={10}>
        <Space>
          <Button onClick={capture}>
            Capture html2canvas
          </Button>

          <Button onClick={exportToJpegHandler}>
            Export As JPEG
          </Button>

          <Button onClick={onDownload}>
            Download As PDF
          </Button>
        </Space>
      </Affix>

      <style global jsx>{`
      body {
        background: var(--white-smoke); 
      }
      .page {
        background: white;
        display: block;
        margin: 0 auto;
        box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
      }
      .page.A5 {
        width: 629.295px;
        height: 892.92px;
      }
      @media print {
        body, page {
          margin: 0;
          box-shadow: 0;
        }
      }


      @media only screen and (max-width: 629.295px) {
        canvas, .page.A5 {
          width: 100vw!important;
          height: auto!important;
        }
      }

      .mgrpdf-navigation {
        display: none!important;
      }

      `}</style>
    </>
  )
}

export default ResultViewer
