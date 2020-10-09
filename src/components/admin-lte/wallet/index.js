/* eslint-disable */

import React from 'react'
import PropTypes from 'prop-types'
import { Content } from 'adminlte-2-react'
import ImportWallet from './import'
import NewWallet from './create'
import InfoWallets from './info'
import WalletInfo from './wallet-info'

let _this
class Wallet extends React.Component {
  constructor(props) {
    super(props)
    _this = this
    this.state = {}
  }

  render() {
    return (
      <Content>
        <InfoWallets />

        {_this.props.walletInfo.mnemonic && (
          <WalletInfo walletInfo={_this.props.walletInfo} />
        )}

        <NewWallet
          updateBalance={_this.props.updateBalance}
          setWalletInfo={_this.props.setWalletInfo}
          setBchWallet={_this.props.setBchWallet}
          walletInfo={_this.props.walletInfo}
        />

        <ImportWallet
          updateBalance={_this.props.updateBalance}
          setWalletInfo={_this.props.setWalletInfo}
          setBchWallet={_this.props.setBchWallet}
          walletInfo={_this.props.walletInfo}
        />

        {this.props.importComponents}
      </Content>
    )
  }
}

Wallet.propTypes = {
  setWalletInfo: PropTypes.func.isRequired,
  walletInfo: PropTypes.object.isRequired,
  updateBalance: PropTypes.func.isRequired,
  setBchWallet: PropTypes.func.isRequired
}

export default Wallet
