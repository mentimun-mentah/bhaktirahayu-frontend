import { Card } from 'react-bootstrap'
import { Col, Row, Form, Input, Button } from 'antd'

const ProfileContainer = () => {
  return (
    <>
      <Card className="border-0 shadow-1">
        <Card.Body>
          <Card.Title>Ubah Password</Card.Title>
            <Row gutter={[10,10]} justify="space-between">
              <Col xs={24} sm={24} md={24} lg={16} xl={12}>
                <Form layout="vertical">

                  <Form.Item label="Password Lama" className="mb-3">
                    <Input.Password placeholder="Password Lama" />
                  </Form.Item>

                  <Form.Item label="Password Baru" className="mb-3">
                    <Input.Password placeholder="Password Baru" />
                  </Form.Item>

                  <Form.Item label="Konfirmasi Password" className="mb-3">
                    <Input.Password placeholder="Konfirmasi Password" />
                  </Form.Item>

                  <Form.Item className="m-b-0">
                    <Button 
                      // size="large"
                      type="primary" 
                      className="p-l-30 p-r-30" 
                      // disabled={loading}
                      // onClick={onSubmitHandler}
                    >
                      Simpan
                    </Button>
                  </Form.Item>

                </Form>
              </Col>
            </Row>
        </Card.Body>
      </Card>
    </>
  )
}

export default ProfileContainer
