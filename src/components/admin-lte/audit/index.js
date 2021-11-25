import React from 'react'

import { Content, Row, Col, Box } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Audit extends React.Component {
  // state = {}

  render () {
    return (
      <Content>
        <Row>
          <Col sm={4} />
          <Col sm={4}>
            <Box className='hover-shadow border-none mt-2'>
              <Row>
                <Col sm={12} className='text-center'>
                  <h1>
                    <FontAwesomeIcon
                      className='title-icon'
                      size='xs'
                      icon='eye'
                    />
                    <span>Audit</span>
                  </h1>
                </Col>
                <Col sm={12} className='text-center mt-2 mb-2'>
                  <h3>Never trust, always verify.</h3>
                  <p>
                    Check the open source code here. Check and/or change the
                    REST API in Configure. Install, build and run Bitcoin.com
                    Mint locally. Join our public telegram group.
                  </p>
                </Col>
              </Row>
            </Box>
          </Col>
          <Col sm={4} />
        </Row>
      </Content>
    )
  }
}

export default Audit
