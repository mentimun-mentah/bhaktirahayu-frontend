import { useRef } from 'react'
import { Affix, Button, Space, Row, Col } from 'antd'
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

      <Row justify="center">
        <Col>
          <Affix offsetBottom={20}>
            <Space>
              <Button type="primary" size="large" className="shadow-lg" onClick={exportToJpegHandler}>
                Download JPEG
              </Button>

              <Button onClick={onDownload} size="large" className="shadow-lg">
                Download PDF
              </Button>
            </Space>
          </Affix>
        </Col>
      </Row>

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
