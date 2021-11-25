import React from 'react'
import PropTypes from 'prop-types'
import { Content, Row, Col, Box } from 'adminlte-2-react'
import Receive from './receive'
import Send from './send'

import './send-receive.css'

let _this
class SendReceive extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {}
  }

  render () {
    return (
      <>
        {_this.props.walletInfo.mnemonic
          ? (
            <Content>
              <Receive walletInfo={_this.props.walletInfo} />
              <Send
                updateBalance={_this.props.updateBalance}
                bchWallet={_this.props.bchWallet}
                currentRate={_this.props.currentRate}
              />
            </Content>
            )
          : (
            <Content>
              <Box padding='true' className='container-nofound'>
                <Row>
                  <Col xs={12}>
                    <em>You need to create or import a wallet first</em>
                  </Col>
                </Row>
              </Box>
            </Content>
            )}
      </>
    )
  }
}
SendReceive.propTypes = {
  setWalletInfo: PropTypes.func.isRequired,
  walletInfo: PropTypes.object.isRequired,
  updateBalance: PropTypes.func.isRequired,
  setBchWallet: PropTypes.func.isRequired,
  bchWallet: PropTypes.object,
  currentRate: PropTypes.number
}

export default SendReceive
