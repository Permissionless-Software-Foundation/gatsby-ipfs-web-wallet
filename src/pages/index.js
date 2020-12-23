import React from 'react'
import { connect } from 'react-redux'

const AdminLTE =

  typeof window !== 'undefined'
    ? require('../components/admin-lte').default
    : null

// Maps the props that are going to be sended
// to the component connected with Redux
const mapStateToProps = ({ walletInfo, bchBalance, bchWallet, tokensInfo, currentRate, menuNavigation }) => {
  return { walletInfo, bchBalance, bchWallet, tokensInfo, currentRate, menuNavigation }
}

// Send each action of the reducer as props
// to the component connected with Redux
const mapDispatchToProps = dispatch => {
  return {
    setWalletInfo: value => dispatch({ type: 'SET_WALLET_INFO', value }),
    updateBalance: value => dispatch({ type: 'UPDATE_BALANCE', value }),
    setBchWallet: value => dispatch({ type: 'SET_BCH_WALLET', value }),
    setTokensInfo: value => dispatch({ type: 'SET_TOKENS_INFO', value }),
    setMenuNavigation: value => dispatch({ type: 'MENU_NAVIGATION', value })
  }
}

// Component connected with redux
const ConnectedDashboard = AdminLTE
  ? connect(mapStateToProps, mapDispatchToProps)(AdminLTE)
  : null

const AdminLTEPage = props => (
  <>
    {ConnectedDashboard && (
      <ConnectedDashboard menuComponents={props.pageContext.menuComponents} />
    )}
  </>
)

// const AdminLTEPage = props => {
//   <>
//     {ConnectedDashboard &&
//       (<ConnectedDashboard menuComponents={props.pageContext.menuComponents} />)}
//   </>
// }

export default AdminLTEPage
