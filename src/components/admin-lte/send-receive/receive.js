import React from 'react'
import PropTypes from 'prop-types'
import { Content, Row, Col, Box } from 'adminlte-2-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

var QRCode = require('qrcode.react')

let _this
class Receive extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      addr: _this.props.walletInfo.cashAddress
    }
  }

  render () {
    return (
      <>
        <Content>
          <>
            <Row>
              <Col sm={2} />
              <Col sm={8}>
                <Box className=' border-none mt-2'>
                  <Row>
                    <Col sm={12} className='text-center'>
                      <h1>
                        <FontAwesomeIcon
                          className='title-icon'
                          size='xs'
                          icon='wallet'
                        />
                        <span>Receive</span>
                      </h1>
                    </Col>
                    <Col sm={12} className='text-center mt-2 mb-2'>
                      <QRCode
                        value={_this.state.addr}
                        size={256}
                        includeMargin
                        fgColor='#333'
                      />
                      <p>{_this.state.addr}</p>
                      <label className='switch-address' htmlFor='address-checkbox'>
                        <input
                          id='address-checkbox'
                          type='checkbox'
                          onChange={_this.handleChangeAddr}
                        />
                        <span className='slider round' />
                      </label>
                    </Col>
                  </Row>
                </Box>
              </Col>
              <Col sm={2} />
            </Row>
          </>
        </Content>
      </>
    )
  }

  handleChangeAddr () {
    const checkbox = document.getElementById('address-checkbox')
    const { cashAddress, slpAddress } = _this.props.walletInfo

    let addr
    if (checkbox.checked) {
      addr = slpAddress
    } else {
      addr = cashAddress
    }
    _this.setState({
      addr
    })
  }
}
Receive.propTypes = {
  walletInfo: PropTypes.object.isRequired
}

export default Receive
