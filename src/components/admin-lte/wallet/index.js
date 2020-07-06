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
  constructor (props) {
    super(props)
    _this = this
    this.state = {}
  }

  render () {
    return (
      <>
        <Content>
          <NewWallet
            updateBalance={_this.props.updateBalance}
            setWalletInfo={_this.props.setWalletInfo}
            setBchWallet={_this.props.setBchWallet}
            walletInfo={_this.props.walletInfo}
          />

          {_this.props.walletInfo.mnemonic &&
            _this.props.walletInfo.from === 'created' && (
            <WalletInfo walletInfo={_this.props.walletInfo} />
          )}

          <ImportWallet
            updateBalance={_this.props.updateBalance}
            setWalletInfo={_this.props.setWalletInfo}
            setBchWallet={_this.props.setBchWallet}
            walletInfo={_this.props.walletInfo}
          />

          {_this.props.walletInfo.mnemonic &&
            _this.props.walletInfo.from === 'imported' && (
            <WalletInfo walletInfo={_this.props.walletInfo} />
          )}

          <InfoWallets />
        </Content>
      </>
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
