import { useRef } from 'react'
import { Container } from 'react-bootstrap'
import { PDFViewer,  Page, Text, View, Document, StyleSheet  } from '@react-pdf/renderer'
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image'

// import * as html2canvas from 'html2canvas'

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald'
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: 'Oswald'
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const PdfContainer = () => {
  const page = useRef()
  const pdfRef = useRef()

  const element = document.getElementById("some-element");

  const capture = () => {
    import('html2canvas').then(html2canvas => {
      html2canvas.default(element).then(canvas => {
        var imgData = canvas.toDataURL("image/png");
        const image = new Image();
        image.src = imgData;
        const imgWindow = window.open(imgData);
        imgWindow.document.write(image.outerHTML)
      }
        // document.body.appendChild(canvas)
      )
    }).catch(e => {console("load failed")})

    // html2canvas(element).then(function(canvas) {
    //   // Export the canvas to its data URI representation
    //   var imgData = canvas.toDataURL("image/png");
    //   const image = new Image();
    //   image.src = imgData;
    //   const imgWindow = window.open(imgData);
    //   imgWindow.document.write(image.outerHTML)

    //   // Open the image in a new window
    //   // window.open(base64image , "_blank");
    // });
  }

  return (
    <>
        <page className="A5" ref={ref => { page.current = ref; }} id="some-element">
          <Page size="A4" ref={ ref => { pdfRef.current = ref; } }>
            <Text>Section #1</Text>
            <Text>Section #2 dsakjdhsakdhsakjdhsajdhjasddsadjsahdgsajhdghjsagdhjasghjdgashjdgjhasgdhjagshjdgas</Text>
            <Text>Section #1</Text>
            <Text>Section #2 dsakjdhsakdhsakjdhsajdhjasddsadjsahdgsajhdghjsagdhjasghjdgashjdgjhasgdhjagshjdgas</Text>
            <Text>Section #1</Text>
            <Text>Section #2 dsakjdhsakdhsakjdhsajdhjasddsadjsahdgsajhdghjsagdhjasghjdgashjdgjhasgdhjagshjdgas</Text>
          </Page>
        </page>

      <button onClick={() => exportComponentAsJPEG(pdfRef)}>
        Export As JPEG
      </button>
      
      <button onClick={() => exportComponentAsJPEG(page)}>
        Export As JPEG
      </button>
      <button onClick={() => exportComponentAsPDF(page)}>
        Export As PDF
      </button>
      <button onClick={() => exportComponentAsPNG(page)}>
        Export As PNG
      </button>

      <button onClick={capture}>Capture</button>

      <style global jsx>{`
      body {
        background: rgb(204,204,204); 
      }
      page {
        background: white;
        display: block;
        margin: 0 auto;
        margin-bottom: 0.5cm;
        box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
      }
      page.A5 {
        width: 14.8cm;
        height: 21cm;
      }
      @media print {
        body, page {
          margin: 0;
          box-shadow: 0;
        }
      }
      `}</style>
    </>
  )
}

export default PdfContainer
