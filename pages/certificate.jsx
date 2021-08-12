import { Row, Col } from 'antd'

const CertificateContainer = () => {
  return (
    <>
      <div className="vh-100 user-select-none">
        <Row justify="center" align="middle" className="h-100">

          <Col xxl={16} xl={16} lg={18} md={22} sm={24} xs={24} className="card border-0 shadow bg-certificate-fail">

            <div className="p-lg-5 p-md-4 p-3 py-lg-5 py-md-5 py-sm-4 py-4">
              <div className="mx-auto mb-3" style={{ width: '80%' }}>
                <p className="text-center font-weight-bold size-title">DATA TIDAK DITEMUKAN!</p>
              </div>

              <div className="text-center size-isi" style={{ opacity: .8 }}>
                <p>Kami tidak menemukan data pasien pada sistem kami,</p> 
                <p>silahkan menghubungi instansi yang bersangkutan untuk info lebih lanjut.</p>
              </div>
              
              <div className="text-center text-muted size-isi mt-4">
                <h2 className="size-isi font-weight-bold m-b-0">
                  <i>Note: <span className="font-weight-normal text-muted">
                    Hanya hasil dari website www.bhaktirahayugroup.co.id yang dinyatakan <b>VALID</b>
                  </span></i>
                </h2>
              </div>

            </div>

          </Col>

        </Row>
      </div>

      <div className="vh-100 user-select-none">
        <Row justify="center" align="middle" className="h-100">
          <Col xxl={16} xl={16} lg={18} md={22} sm={24} xs={24} className="card border-0 shadow bg-certificate">
            <div className="p-lg-5 p-md-4 p-3 py-lg-5 py-md-5 py-sm-4 py-4">
              <div className="mx-auto pb-3 text-dark">
                <p className="text-center font-weight-bold size-instansi">Bhakti Rahayu Denpasar</p>
                <p className="text-center mb-4">Hasil Pemeriksaan Covid-19</p>
              </div>
              <div className="box-client">
                <div className="mx-auto py-3 pb-0" style={{ width: '80%' }}>
                  <p className="text-center font-weight-bold size-title">PAULUS BONATUA SIMANJUNTAK</p>
                </div>
                <hr className="my-2" />
                <Row gutter={[10,10]} justify="space-around" className="text-center py-2">
                  <Col span={8}>
                    <p className="fw-500 size-subtitle">NIK</p>
                    <p className="size-isi lead">5171010609990002</p>
                  </Col>
                  <Col span={8}>
                    <p className="fw-500 size-subtitle">TTL</p>
                    <p className="size-isi lead">DENPASAR, 06 SEPTEMBER 1999</p>
                  </Col>
                  <Col span={8}>
                    <p className="fw-500 size-subtitle">SEX</p>
                    <p className="size-isi lead">LAKI-LAKI</p>
                  </Col>
                </Row>
                <p className="text-center fw-500 size-subtitle pt-4">ADDRESS</p>
                <p className="text-center size-isi lead pb-3">JALAN DANAU POSO. DESA SANUR KAUH, DENPASAR SELATAN</p>
              </div>

              <div className="text-center text-dark size-isi" style={{ opacity: .8 }}>
                <p className="mb-3 fw-500 font-id">Test ID: 3443278468247324823742</p>
                <p>Pasien telah melakukan test <b className="text-uppercase">GeNose</b> Covid-19,</p> 
                <p>pada tanggal 12 Januari 2020 pukul 12:12, dan hasil</p>
                <p>pemeriksaan pasien dinyatakan <b className="text-uppercase">NEGATIVE</b> dari Covid-19.</p>
              </div>
              
              <div className="text-center text-muted size-isi mt-4">
                <h2 className="size-isi font-weight-bold m-b-0">
                  <i>Note: <span className="font-weight-normal text-muted">
                    Hanya hasil dari website www.bhaktirahayugroup.co.id yang dinyatakan <b>VALID</b>
                  </span></i>
                </h2>
              </div>

            </div>
          </Col>
        </Row>
      </div>

      <style jsx>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;600;700;800&family=Source+Code+Pro:wght@500&display=swap');
      :global(p) {
        margin-bottom: 0;
      }
      :global(body) {
        font-family: 'Nunito', sans-serif;
        background-color: #f5f5f5;
      }
      :global(.bg-certificate) {
        background-color: #ffffff;
        opacity: 1;
        background: linear-gradient(135deg, #e7f6e855 25%, transparent 25%) -4px 0/ 8px 8px, linear-gradient(225deg, #e7f6e8 25%, transparent 25%) -4px 0/ 8px 8px, linear-gradient(315deg, #e7f6e855 25%, transparent 25%) 0px 0/ 8px 8px, linear-gradient(45deg, #e7f6e8 25%, #ffffff 25%) 0px 0/ 8px 8px;
        background-image: url("/static/images/wave-10.svg");
        background-size: cover;
        background-repeat: no-repeat;
      }
      :global(.bg-certificate-fail) {
        background-image: url("/static/images/wave-fail-2.svg");
        background-size: cover;
        background-repeat: no-repeat;
      }

      .size-instansi {
        font-size: 25px;
      }
      .size-title {
        font-size: 20px;
      }
      .size-subtitle {
        font-size: 18px;
      }
      .size-isi {
        font-size: 14px;
      }

      .font-id {
        font-family: 'Source Code Pro', monospace;
      }
      .text-green-1 {
        color: #074321;
      }
      .box-client {
        padding: 10px;
        margin-bottom: 2rem;
        color: #074321;
        border-radius: 5px;
        background: rgb(246,255,248);
        background: linear-gradient(141deg,rgb(221 221 221 / 80%) 0%,rgb(231 247 224 / 50%) 100%);
      }

      .box-client-fail {
        padding: 10px;
        margin-bottom: 2rem;
        color: #0d6032;
        border-radius: 5px;
        background: rgb(255,229,238);
        background: linear-gradient(141deg, rgba(255,229,238,0.6152836134453781) 0%, rgba(255,236,236,0.6460959383753502) 100%);
      }

      @media only screen and (max-width: 600px) {
        :global(body) {
          font-size: 70%;
        }
        .size-instansi {
          font-size: 20px;
        }
        .size-title {
          font-size: 16px;
        }
        .size-subtitle {
          font-size: 14px;
        }
        .size-isi {
          font-size: 10px;
        }
      }
      `}</style>
    </>
  )
}

export default CertificateContainer
