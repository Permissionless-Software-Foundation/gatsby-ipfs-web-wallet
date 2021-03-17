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
      hdPath: '',
      blurredMnemonic: true,
      blurredPrivateKey: true,
      copySuccess: ''
    }
  }

  render () {
    const eyeIcon = {
      mnemonic: _this.state.blurredMnemonic ? 'eye-slash' : 'eye',
      privateKey: _this.state.blurredPrivateKey ? 'eye-slash' : 'eye'
    }

    return (
      <Row>
        <Col sm={3} lg={2} />
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
                  <Col xs={8} sm={9} lg={10}>
                    <span>
                      <b>Mnemonic:</b>{' '}
                      <span
                        className={_this.state.blurredMnemonic ? 'blurred' : ''}
                      >
                        {' '}
                        {_this.state.mnemonic}{' '}
                      </span>
                    </span>
                  </Col>
                  <Col xs={4} sm={3} lg={2} className='text-right'>
                    {_this.state.copySuccess === 'mnemonic'
                      ? (
                        <div className='copied-text'>
                          <span>Copied!</span>
                        </div>
                        )
                      : (
                        <>
                          <FontAwesomeIcon
                            className='icon btn-animation'
                            size='lg'
                            onClick={() => _this.blurMnemonic()}
                            icon={eyeIcon.mnemonic}
                          />
                          <FontAwesomeIcon
                            className='icon btn-animation ml-1'
                            size='lg'
                            onClick={() => _this.copyToClipBoard('mnemonic')}
                            icon='copy'
                          />
                        </>
                        )}
                  </Col>
                </Row>
                <Row className='wallet-info-content mt-1 text-left'>
                  <Col xs={8} sm={9} lg={10}>
                    <span>
                      <b>Private Key: </b>{' '}
                      <span
                        className={
                          _this.state.blurredPrivateKey ? 'blurred' : ''
                        }
                      >
                        {' '}
                        {_this.state.privateKey}{' '}
                      </span>
                    </span>
                  </Col>
                  <Col xs={4} sm={3} lg={2} className='text-right'>
                    {_this.state.copySuccess === 'privateKey'
                      ? (
                        <div className='copied-text'>
                          <span>Copied!</span>
                        </div>
                        )
                      : (
                        <>
                          <FontAwesomeIcon
                            className='icon btn-animation'
                            size='lg'
                            onClick={() => _this.blurPrivateKey()}
                            icon={eyeIcon.privateKey}
                          />
                          <FontAwesomeIcon
                            className='icon btn-animation ml-1'
                            size='lg'
                            onClick={() => _this.copyToClipBoard('privateKey')}
                            icon='copy'
                          />
                        </>
                        )}
                  </Col>
                </Row>
                <Row className='wallet-info-content mt-1 text-left'>
                  <Col xs={8} sm={9} lg={10}>
                    <span>
                      <b>Cash Address: </b> {_this.state.cashAddress}
                    </span>
                  </Col>
                  <Col xs={4} sm={3} lg={2} className='text-right'>
                    {_this.state.copySuccess === 'cashAddress'
                      ? (
                        <div className='copied-text'>
                          <span>Copied!</span>
                        </div>
                        )
                      : (
                        <FontAwesomeIcon
                          className='icon btn-animation'
                          size='lg'
                          onClick={() => _this.copyToClipBoard('cashAddress')}
                          icon='copy'
                        />
                        )}
                  </Col>
                </Row>
                <Row className='wallet-info-content mt-1 text-left'>
                  <Col xs={8} sm={9} lg={10}>
                    <span>
                      <b>Slp Address: </b> {_this.state.slpAddress}
                    </span>
                  </Col>
                  <Col xs={4} sm={3} lg={2} className='text-right'>
                    {_this.state.copySuccess === 'slpAddress'
                      ? (
                        <div className='copied-text'>
                          <span>Copied!</span>
                        </div>
                        )
                      : (
                        <FontAwesomeIcon
                          className='icon btn-animation'
                          size='lg'
                          onClick={() => _this.copyToClipBoard('slpAddress')}
                          icon='copy'
                        />
                        )}
                  </Col>
                </Row>
                <Row className='wallet-info-content mt-1 text-left'>
                  <Col xs={8} sm={9} lg={10}>
                    <span>
                      <b>Legacy Address: </b> {_this.state.legacyAddress}
                    </span>
                  </Col>
                  <Col xs={4} sm={3} lg={2} className='text-right'>
                    {_this.state.copySuccess === 'legacyAddress'
                      ? (
                        <div className='copied-text'>
                          <span>Copied!</span>
                        </div>
                        )
                      : (
                        <FontAwesomeIcon
                          className='icon btn-animation'
                          size='lg'
                          onClick={() => _this.copyToClipBoard('legacyAddress')}
                          icon='copy'
                        />
                        )}
                  </Col>
                </Row>
                <Row className='wallet-info-content mt-1 text-left'>
                  <Col xs={8} sm={9} lg={10}>
                    <span>
                      <b>HD Path: </b>
                      <span id='hdpathValue'>{_this.state.hdPath}</span>
                    </span>
                  </Col>
                  <Col xs={4} sm={3} lg={2} className='text-right'>
                    {_this.state.copySuccess === 'hdPath'
                      ? (
                        <div className='copied-text'>
                          <span>Copied!</span>
                        </div>
                        )
                      : (
                        <FontAwesomeIcon
                          className='icon btn-animation'
                          size='lg'
                          onClick={() => _this.copyToClipBoard('hdPath')}
                          icon='copy'
                        />
                        )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Box>
        </Col>
        <Col sm={3} lg={2} />
      </Row>
    )
  }

  blurMnemonic () {
    _this.setState({
      blurredMnemonic: !_this.state.blurredMnemonic
    })
  }

  blurPrivateKey () {
    _this.setState({
      blurredPrivateKey: !_this.state.blurredPrivateKey
    })
  }

  // copy info  to clipboard
  copyToClipBoard (key) {
    const val = _this.state[key]
    const textArea = document.createElement('textarea')
    textArea.value = val // copyText.textContent;
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('Copy')
    textArea.remove()

    _this.handleCopySuccess(key)
  }

  handleCopySuccess (key) {
    _this.setState({
      copySuccess: key
    })
    setTimeout(() => {
      _this.setState({
        copySuccess: ''
      })
    }, 1000)
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
