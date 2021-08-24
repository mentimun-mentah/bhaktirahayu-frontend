import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'

const pdfFile = '/static/documentation.pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResultViewer = () => {
  const [numPages, setNumPages] = useState(null)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  return (
    <>
      <div className="container-documentation-pdf">
        <div className="container-documentation-pdf__container__document">
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(
              new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                />
              ),
            )}
          </Document>
        </div>
      </div>

      <style jsx global>{`
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
