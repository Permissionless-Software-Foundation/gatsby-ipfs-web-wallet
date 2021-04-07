import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Box, Button } from 'adminlte-2-react'
import Jdenticon from 'react-jdenticon'
import './token.css'
let _this
class TokenCard extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {}
  }

  render () {
    const token = _this.props.token
    // console.log(`token: ${JSON.stringify(token, null, 2)}`)

    return (
      <>
        <Box className='hover-shadow border-none mt-2' id='token-card'>
          <Row className='text-center'>
            <Col sm={12} className='text-center mt-2 '>
              <Jdenticon size='100' value={token.tokenId} />
              <hr />
            </Col>
            <Col sm={12} className='flex justify-content-center  '>
              <div className='info-container'>
                <p className='info-content'>
                  <b>Ticker: </b>
                  <span> {token.ticker}</span>
                </p>
                <p className='info-content'>
                  <b>Name: </b>
                  <span>{token.name}</span>
                </p>

                <p className='info-content'>
                  <b>Balance</b>
                  <span>{_this.round(token.qty, token.decimals)}</span>
                </p>
              </div>
            </Col>

            <Col xs={6} className='text-center mb-1'>
              <Button
                text='Info'
                type='primary'
                className='btn-lg max-width'
                onClick={() => {
                  _this.props.showToken(token)
                }}
              />
            </Col>
            <Col xs={6} className='text-center'>
              <Button
                text='Send'
                type='primary'
                className='btn-lg max-width'
                onClick={() => {
                  _this.props.selectToken(token)
                }}
              />
            </Col>
          </Row>
        </Box>
      </>
    )
  }

  shouldComponentUpdate () {
    return false
  }

  round (value, decimals) {
    return Number(Math.round(value + `e${decimals}`) + `e-${decimals}`)
  }
}
TokenCard.propTypes = {
  token: PropTypes.object.isRequired,
  showToken: PropTypes.func.isRequired,
  selectToken: PropTypes.func.isRequired
}
export default TokenCard
