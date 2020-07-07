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
    this.state = {}

    this.modalFooter = (
      <>
        <Button text='Close' pullLeft onClick={this.props.handleOnHide} />
      </>
    )
  }

  render () {
    const token = _this.props.token
    return (
      <>
        <Content
          title={token.name}
          modal
          modalFooter={this.modalFooter}
          show={_this.props.show}
          modalCloseButton
          onHide={_this.props.handleOnHide}
        >
          <Row>
            <Col sm={12}>
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
                          <Col xs={10} sm={8}>
                            {token.tokenId}
                          </Col>
                          <Col xs={2} sm={1}>
                            <FontAwesomeIcon
                              className='icon btn-animation'
                              size='lg'
                              onClick={() => _this.copyToClipBoard('tokenId')}
                              icon='copy'
                            />
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
            </Col>
          </Row>
        </Content>
      </>
    )
  }

  // copy info  to clipboard
  copyToClipBoard (key) {
    const val = _this.props.token[key]
    var textArea = document.createElement('textarea')
    textArea.value = val // copyText.textContent;
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('Copy')
    textArea.remove()
  }
}
TokenModal.propTypes = {
  token: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  handleOnHide: PropTypes.func.isRequired
}
export default TokenModal
