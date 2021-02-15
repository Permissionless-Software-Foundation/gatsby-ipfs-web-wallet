import React from 'react'

import { Row, Col, Box } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class InfoWallets extends React.Component {
  // state = {}

  render () {
    return (
      <Row>
        <Col sm={2} />
        <Col sm={8}>
          <Box className='hover-shadow border-none mt-2'>
            <Row>
              <Col sm={12} className='text-center'>
                <h1>
                  <FontAwesomeIcon
                    className='title-icon'
                    size='xs'
                    icon='exclamation-triangle'
                  />
                  <span>Web Wallet</span>
                </h1>
              </Col>

              <Col sm={12} className='text-center mt-2 mb-2'>
                <p>
                  This is an open source, non-custodial web wallet
                  supporting Bitcoin Cash (BCH) and SLP tokens. Web wallets
                  offer user convenience, but they are inherently insecure and
                  bad for privacy.{' '}
                  <b>Storing large amounts of money on a web wallet is not
                    recommended!
                  </b>
                </p>
              </Col>
            </Row>
          </Box>
        </Col>
        <Col sm={2} />
      </Row>
    )
  }
}

export default InfoWallets
