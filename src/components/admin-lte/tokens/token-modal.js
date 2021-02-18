import React from 'react'
import PropTypes from 'prop-types'
import { Content, Row, Col, Box, Button } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './token.css'
let _this
class TokenModal extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      copySuccess: '',
      isBurnView: false
    }

    this.modalFooter = (
      <>
        <Button text='Close' pullLeft onClick={this.handleModal} />
        <Button
          type='primary'
          text='Burn All'
          pullRight
          onClick={this.handleConfirm}
        />
      </>
    )
    this.burnFooter = (
      <>
        <Button text='No' pullLeft onClick={() => this.handleBurnAll(false)} />
        <Button
          type='primary'
          text='Yes'
          pullRight
          onClick={() => this.handleBurnAll(true)}
        />
      </>
    )
  }

  render () {
    const token = _this.props.token
    return (
      <>
        <Content
          title={_this.state.isBurnView ? `Burn All ${token.name}` : token.name}
          modal
          modalFooter={
            _this.state.isBurnView ? this.burnFooter : this.modalFooter
          }
          show={_this.props.show}
          modalCloseButton
          onHide={_this.handleModal}
        >
          <Row>
            <Col sm={12}>
              {_this.state.isBurnView
                ? (
                  <p>
                    Are you sure you want to burn {`${token.qty} `}
                    tokens?
                  </p>
                  )
                : (
                  <Box className=' border-none '>
                    <Row>
                      <Col
                        sm={12}
                        className='text-center   tokenModal-info-container'
                      >
                        <Row className='tokenModal-info-content mt-1 text-left'>
                          <Col xs={12}>
                            <Row>
                              <Col xs={12} sm={3}>
                                <b>TokenId:</b>
                              </Col>
                              <Col xs={9} sm={7}>
                                {token.tokenId}
                              </Col>
                              <Col
                                xs={3}
                                sm={2}
                                className={
                                _this.state.copySuccess ? 'nopadding' : ''
                              }
                              >
                                {_this.state.copySuccess === 'tokenId'
                                  ? (
                                    <div className='copied-text'>
                                      <span>Copied!</span>
                                    </div>
                                    )
                                  : (
                                    <FontAwesomeIcon
                                      className='icon btn-animation'
                                      style={{ cssFloat: 'right' }}
                                      size='lg'
                                      onClick={() =>
                                        _this.copyToClipBoard('tokenId')}
                                      icon='copy'
                                    />
                                    )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className='tokenModal-info-content mt-1 text-left'>
                          <Col xs={12}>
                            <Row>
                              <Col xs={12} sm={3}>
                                <b>URL:</b>
                              </Col>
                              <Col xs={12} sm={9}>
                                <a
                                  href={`http://${token.url}`}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                >
                                  {token.url}
                                </a>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className='tokenModal-info-content mt-1 text-left'>
                          <Col xs={12}>
                            <Row>
                              <Col xs={12} sm={3}>
                                <b>Ticker:</b>
                              </Col>
                              <Col xs={12} sm={9}>
                                {token.ticker}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className='tokenModal-info-content mt-1 text-left'>
                          <Col xs={12}>
                            <Row>
                              <Col xs={12} sm={3}>
                                <b>Name:</b>
                              </Col>
                              <Col xs={12} sm={9}>
                                {token.name}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className='tokenModal-info-content mt-1 text-left'>
                          <Col xs={12}>
                            <Row>
                              <Col xs={12} sm={3}>
                                <b>Balance:</b>
                              </Col>
                              <Col xs={12} sm={9}>
                                {token.qty}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className='tokenModal-info-content mt-1 text-left'>
                          <Col xs={12}>
                            <Row>
                              <Col xs={12} sm={3}>
                                <b>Decimals:</b>
                              </Col>
                              <Col xs={12} sm={9}>
                                {token.decimals}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row className='tokenModal-info-content mt-1 text-left'>
                          <Col xs={12}>
                            <Row>
                              <Col xs={12} sm={3}>
                                <b>TokenType:</b>
                              </Col>
                              <Col xs={12} sm={9}>
                                {token.tokenType}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Box>
                  )}
            </Col>
          </Row>
        </Content>
      </>
    )
  }

  // copy info  to clipboard
  copyToClipBoard (key) {
    const val = _this.props.token[key]
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

  handleConfirm () {
    _this.setState({
      isBurnView: true
    })
  }

  handleModal () {
    _this.props.handleOnHide()
    setTimeout(() => {
      _this.setState({
        isBurnView: false
      })
    }, 200)
  }

  handleBurnAll (isConfirmed) {
    try {
      // Dismiss
      if (!isConfirmed) {
        _this.hideModal()
        return
      }

      /**
       *  BURN ALL
       *
       */
      console.log('Hello Word')
    } catch (error) {}
  }
}
TokenModal.propTypes = {
  token: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  handleOnHide: PropTypes.func.isRequired
}
export default TokenModal
