import React from 'react'
import PropTypes from 'prop-types'
import { Content } from 'adminlte-2-react'
import MenuComponents from './menu-components'
import Servers from './servers'
import JsonWebTokens from './jwt'
import ConfigureInfo from './info'
import TabsMenu from './TabsMenu'

const BchWallet = typeof window !== 'undefined' ? window.SlpWallet : null

let _this
class Configure extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      menuItem: 'Configure'
    }

    _this.BchWallet = BchWallet
    _this.tabsComponents = MenuComponents(props)
    this.handleSelect = key => {
      _this.setState({ menuItem: key })
    }
  }

  render () {
    return (
      <Content>
        <TabsMenu onSelect={this.handleSelect} />
        {/* // Default View */}
        {_this.state.menuItem === 'Configure' && (
          <>
            <Servers
              setWalletInfo={_this.props.setWalletInfo}
              walletInfo={_this.props.walletInfo}
              setBchWallet={_this.props.setBchWallet}
              updateBalance={_this.props.updateBalance}
            />

            <JsonWebTokens
              setWalletInfo={_this.props.setWalletInfo}
              walletInfo={_this.props.walletInfo}
              setBchWallet={_this.props.setBchWallet}
            />

            <ConfigureInfo />
          </>
        )}

        {/* // Load Plugin Views */}
        {_this.state.menuItem !== 'Configure' &&
          _this.tabsComponents.filter(
            menuItem => menuItem.key === _this.state.menuItem
          )[0].component}
      </Content>
    )
  }
}

Configure.propTypes = {
  setWalletInfo: PropTypes.func.isRequired,
  walletInfo: PropTypes.object.isRequired,
  setBchWallet: PropTypes.func.isRequired,
  updateBalance: PropTypes.func.isRequired
}

export default Configure
