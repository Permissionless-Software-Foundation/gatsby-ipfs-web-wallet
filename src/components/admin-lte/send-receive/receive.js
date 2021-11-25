import React from 'react'
import PropTypes from 'prop-types'
import { Content, Row, Col, Box } from 'adminlte-2-react'
import copy from 'copy-to-clipboard'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const QRCode = require('qrcode.react')

let _this
class Receive extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      addr: _this.props.walletInfo.cashAddress,
      copySuccess: false
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
                      {_this.state.copySuccess &&
                        <div className='copied-message'>
                          Copied!
                        </div>}
                      <QRCode
                        className='qr-code'
                        value={_this.state.addr}
                        size={256}
                        includeMargin
                        fgColor='#333'
                        onClick={_this.handleCopyAddres}
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

  handleCopyAddres () {
    const address = _this.state.addr
    copy(address)
    _this.setState({ copySuccess: true })

    setTimeout(function () {
      _this.setState({ copySuccess: false })
    }, 1500)
  }
}
Receive.propTypes = {
  walletInfo: PropTypes.object.isRequired
}

export default Receive
