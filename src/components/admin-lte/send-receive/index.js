import React from "react"
import PropTypes from "prop-types"
import { Content } from "adminlte-2-react"
import Receive from "./receive"
import Send from "./send"

import './send-receive.css'
let _this
class SendReceive extends React.Component {
  constructor(props) {
    super(props)
    _this = this
    this.state = {}
  }

  render() {
    return (
      <>
        <Content>
          <Receive
            walletInfo={_this.props.walletInfo}
          />  
          <Send 
          updateBalance={_this.props.updateBalance}
          bchWallet={_this.props.bchWallet}
          />
          
        </Content>
      </>
    )
  }
}
SendReceive.propTypes = {
  setWalletInfo: PropTypes.func.isRequired,
  walletInfo: PropTypes.object.isRequired,
  updateBalance: PropTypes.func.isRequired,
  setBchWallet: PropTypes.func.isRequired,
  bchWallet:PropTypes.object, 
}

export default SendReceive
