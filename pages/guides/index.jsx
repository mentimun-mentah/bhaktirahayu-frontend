import { Row, Col } from 'antd'
import { Card, Container, Media } from 'react-bootstrap'

const guides_list = [
  {
    title: 'Cara mendaftarkan client',
    link: 'https://youtu.be/j942wKiXFu8'
  },
  {
    title: 'Cara mendaftarkan dokter',
    link: 'https://youtu.be/j942wKiXFu8'
  },
  {
    title: 'Cara menambahkan instansi',
    link: 'https://youtu.be/j942wKiXFu8'
  },
  {
    title: 'Cara menambahkan lokasi pelayanan',
    link: 'https://youtu.be/j942wKiXFu8'
  },
  {
    title: 'Cara menambahkan penjamin',
    link: 'https://youtu.be/j942wKiXFu8'
  },
  {
    title: 'Cara mengubah profile',
    link: 'https://youtu.be/j942wKiXFu8'
  },
]

const GuidesContainer = () => {
  return (
    <>
      <Container className="my-5">
        <Row gutter={[20,20]} justify="center">
          <Col xxl={18} xl={20} lg={20} md={24} sm={24} xs={24}>
            <h3 className="h1 fs-24-s bold text-center mb-5 text-dark">Panduan penggunaan website www.bhaktirahayugroup.co.id</h3>
            <Row gutter={[10,20]} justify="center" className="mb-5">
              {guides_list.map((data,i) => (
                <Col span={24} key={i}>
                  <a href={data.link} className="text-decoration-none text-dark card-link" target="_blank">
                    <Card className="card-guides border-0">
                      <Card.Body>
                        <Media>
                          <span className="mr-1">{i+1}.</span>
                          <Media.Body> {data.title} </Media.Body>
                        </Media>
                      </Card.Body>
                    </Card>
                  </a>
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
      `}</style>
    </>
  )
}

export default GuidesContainer
