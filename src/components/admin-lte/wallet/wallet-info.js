import React from 'react'
import PropTypes from 'prop-types'

import { Row, Col, Box } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './wallet.css'
let _this
class WalletInfo extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      walletInfo: _this.props.walletInfo,
      mnemonic: '',
      privateKey: '',
      cashAddress: '',
      address: '',
      slpAddress: '',
      legacyAddress: '',
      hdPath: ''
    }
  }

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
                    icon='wallet'
                  />
                  <span>My Wallet</span>
                </h1>
              </Col>

              <Col sm={12} className='text-center   wallet-info-container'>
                <Row className='wallet-info-content mt-1 text-left'>
                  <Col xs={10} sm={11}>
                    <span>
                      <b>Mnemonic:</b> {_this.state.mnemonic}
                    </span>
                  </Col>
                  <Col xs={2} sm={1}>
                    <FontAwesomeIcon
                      className='icon btn-animation'
                      size='lg'
                      onClick={() => _this.copyToClipBoard('mnemonic')}
                      icon='copy'
                    />
                  </Col>
                </Row>
                <Row className='wallet-info-content mt-1 text-left'>
                  <Col xs={10} sm={11}>
                    <span>
                      <b>Private Key: </b> {_this.state.privateKey}
                    </span>
                  </Col>
                  <Col xs={2} sm={1}>
                    <FontAwesomeIcon
                      className='icon btn-animation'
                      size='lg'
                      onClick={() => _this.copyToClipBoard('privateKey')}
                      icon='copy'
                    />
                  </Col>
                </Row>
                <Row className='wallet-info-content mt-1 text-left'>
                  <Col xs={10} sm={11}>
                    <span>
                      <b>Cash Address: </b> {_this.state.cashAddress}
                    </span>
                  </Col>
                  <Col xs={2} sm={1}>
                    <FontAwesomeIcon
                      className='icon btn-animation'
                      size='lg'
                      onClick={() => _this.copyToClipBoard('cashAddress')}
                      icon='copy'
                    />
                  </Col>
                </Row>
                <Row className='wallet-info-content mt-1 text-left'>
                  <Col xs={10} sm={11}>
                    <span>
                      <b>Address: </b> {_this.state.address}
                    </span>
                  </Col>
                  <Col xs={2} sm={1}>
                    <FontAwesomeIcon
                      className='icon btn-animation'
                      size='lg'
                      onClick={() => _this.copyToClipBoard('address')}
                      icon='copy'
                    />
                  </Col>
                </Row>
                <Row className='wallet-info-content mt-1 text-left'>
                  <Col xs={10} sm={11}>
                    <span>
                      <b>Slp Address: </b> {_this.state.slpAddress}
                    </span>
                  </Col>
                  <Col xs={2} sm={1}>
                    <FontAwesomeIcon
                      className='icon btn-animation'
                      size='lg'
                      onClick={() => _this.copyToClipBoard('slpAddress')}
                      icon='copy'
                    />
                  </Col>
                </Row>
                <Row className='wallet-info-content mt-1 text-left'>
                  <Col xs={10} sm={11}>
                    <span>
                      <b>Legacy Address: </b> {_this.state.legacyAddress}
                    </span>
                  </Col>
                  <Col xs={2} sm={1}>
                    <FontAwesomeIcon
                      className='icon btn-animation'
                      size='lg'
                      onClick={() => _this.copyToClipBoard('legacyAddress')}
                      icon='copy'
                    />
                  </Col>
                </Row>
                <Row className='wallet-info-content mt-1 text-left'>
                  <Col xs={10} sm={11}>
                    <span>
                      <b>HD Path: </b>
                      <span id='hdpathValue'>{_this.state.hdPath}</span>
                    </span>
                  </Col>
                  <Col xs={2} sm={1}>
                    <FontAwesomeIcon
                      className='icon btn-animation'
                      size='lg'
                      onClick={() => _this.copyToClipBoard('hdPath')}
                      icon='copy'
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Box>
        </Col>
        <Col sm={2} />
      </Row>
    )
  }

  // copy info  to clipboard
  copyToClipBoard (key) {
    const val = _this.state[key]
    var textArea = document.createElement('textarea')
    textArea.value = val // copyText.textContent;
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('Copy')
    textArea.remove()
  }

  componentDidMount () {
    // set component state
    const wallet = _this.props.walletInfo
    Object.entries(wallet).forEach(([key, value]) => {
      _this.setState({
        [key]: value
      })
    })
  }

  componentDidUpdate () {
    // set component state
    if (_this.props.walletInfo.mnemonic !== _this.state.mnemonic) {
      const wallet = _this.props.walletInfo
      Object.entries(wallet).forEach(([key, value]) => {
        _this.setState({
          [key]: value
        })
      })
    }
  }
}
WalletInfo.propTypes = {
  walletInfo: PropTypes.object.isRequired
}

export default WalletInfo
