import { Row, Col, Collapse  } from 'antd'
import { Card, Container } from 'react-bootstrap'

const guides_list = [
  {
    title: 'Cara Menambahkan Instansi',
    link: 'https://youtu.be/irMcANz9Hxg',
    embed: 'https://www.youtube.com/embed/irMcANz9Hxg'
  },
  {
    title: 'Cara Menambahkan Penjamin',
    link: 'https://youtu.be/YCzvK8CTmd0',
    embed: 'https://www.youtube.com/embed/YCzvK8CTmd0'
  },
  {
    title: 'Cara Menambahkan Lokasi Pelayanan',
    link: 'https://youtu.be/poH1t7tjY1Q',
    embed: 'https://www.youtube.com/embed/poH1t7tjY1Q'
  },
  {
    title: 'Cara Menambahkan Dokter',
    link: 'https://youtu.be/aHeYMdLqWo0',
    embed: 'https://www.youtube.com/embed/aHeYMdLqWo0'
  },
  {
    title: 'Cara Mendaftarkan Client / Pasien',
    link: 'https://youtu.be/t7rTRs56d1c',
    embed: 'https://www.youtube.com/embed/t7rTRs56d1c'
  },
  {
    title: 'Cara Menginputkan Hasil Pemeriksaan dan Penggunaan Filter Pada Halaman Client',
    link: 'https://youtu.be/r5JfetvMppQ',
    embed: 'https://www.youtube.com/embed/r5JfetvMppQ'
  },
]

const GuidesContainer = () => {
  return (
    <>
      <Container className="my-5">
        <Row gutter={[20,20]} justify="center">
          <Col xxl={18} xl={20} lg={20} md={24} sm={24} xs={24}>
            <h3 className="fs-24-s bold text-center mb-5 text-dark">Panduan penggunaan website www.bhaktirahayugroup.co.id</h3>
            <Row gutter={[10,20]} justify="center" className="mb-5">
              {guides_list.map((data,i) => (
                <Col span={24} key={i}>
                  <Card className="card-guides border-0">
                    <Collapse ghost>
                      <Collapse.Panel header={<b>{data.title}</b>} key={i} className="collapse-guides">
                        <div className="embed-responsive embed-responsive-16by9 border-radius-iframe">
                          <iframe
                            allowFullScreen
                            className="embed-responsive-item border-radius-iframe"
                            src={data.embed}
                          />
                        </div>
                      </Collapse.Panel>
                    </Collapse>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
      :global(.card-guides) {
        transition: .5s ease;
        padding: .7rem!important;
        box-shadow: 0 4px 8px 0 #eee, 0 6px 20px 0 #eee;
      }
      :global(.card-guides:hover) {
        padding: 1.8rem 1rem!important;
        box-shadow: 0 10px 20px 0 #eee, 0 10px 30px 0 #eee;
      }
      :global(a.card-link:hover) {
        color: black!important;
      }
      :global(.ant-collapse > .ant-collapse-item.collapse-guides > .ant-collapse-header .ant-collapse-arrow) {
        vertical-align: 2px!important;
      }
      :global(.border-radius-iframe) {
        -webkit-border-radius: 5px; 
        -moz-border-radius: 5px; 
        border-radius: 5px;
      }
      `}</style>
    </>
  )
}

export default GuidesContainer
