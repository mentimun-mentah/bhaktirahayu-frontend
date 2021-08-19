import { useRef, useState } from 'react'
import { Affix, Button, Space, Row, Col, Modal } from 'antd'
import { exportComponentAsJPEG } from 'react-component-export-image'
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import { motion } from 'framer-motion'

import Image from 'next/image'

const Loader = '/static/images/loader.gif'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const LoadingComponent = () => (
  <motion.div className="text-center my-5-ip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <Image width={100} height={100} src={Loader} alt="loader" />
    <div className="fs-14 m-b-10">Loading document...</div>
  </motion.div>
)

const ResultViewer = ({ pdf, filename }) => {
  const pdfRef = useRef()
  const [showButton, setShowButton] = useState(false)

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
    if(pdfRef?.current) exportComponentAsJPEG(pdfRef, { fileName: `Test result for ${filename}` })
  }

  const onDocumentLoadError = () => {
    setShowButton(false)
    Modal.error({
      centered: true,
      title: 'The link has been expired',
      content: 'Please close this page and try again from the client page to see the result.',
    });
  }

  const onDocumentLoadSuccess = () => {
    setShowButton(true)
  }

  return (
    <>
      <div className="container-documentation-pdf">
        <div className="container-documentation-pdf__container__document">
        <Document
          file={{ url: pdf }}
          loading={<LoadingComponent />}
          onLoadError={onDocumentLoadError}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page 
            scale={1.5}
            pageNumber={1} 
            canvasRef={pdfRef}
          />
        </Document>
        </div>
      </div>

      {showButton && (
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
      )}

      <style global jsx>{`
      body {
        background: var(--white-smoke); 
      }
      .container-documentation-pdf__container {
         display: flex;
         flex-direction: column;
         align-items: center;
         margin: 10px 0;
         padding: 10px;
      }
      .container-documentation-pdf__container__load {
         margin-top: 1em;
         color: white;
      }
      .container-documentation-pdf__container__document {
         margin: 1em 0;
      }
      .container-documentation-pdf__container__document .react-pdf__Document {
         display: flex;
         flex-direction: column;
         align-items: center;
      }
      .container-documentation-pdf__container__document .react-pdf__Page {
         max-width: calc(100% - 2em);
         box-shadow: 0 0 8px rgba(0,0,0,0.5);
         margin: 1em;
      }
      .container-documentation-pdf__container__document .react-pdf__Page canvas {
         max-width: 100%;
         height: auto !important;
      }
      .container-documentation-pdf__container__document .react-pdf__message {
         padding: 20px;
         color: white;
      }

      `}</style>
    </>
  )
}

export default ResultViewer
