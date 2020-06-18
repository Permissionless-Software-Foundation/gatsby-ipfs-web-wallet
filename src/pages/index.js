import React from "react"
import { connect } from "react-redux"

let AdminLTE =
  typeof window !== `undefined`
    ? require("../components/admin-lte").default
    : null
const mapStateToProps = ({ walletInfo, bchBalance }) => {
  return { walletInfo,bchBalance }
}

const mapDispatchToProps = dispatch => {
  return {
    setWallet: value => dispatch({ type: `SET_WALLET`, value }),
    updateBalance: value =>dispatch({ type: `UPDATE_BALANCE`, value })
  }
}

let ConnectedDashboard = AdminLTE
  ? connect(mapStateToProps, mapDispatchToProps)(AdminLTE)
  : null

class AdminLTEPage extends React.Component {
  state = {}

  render() {
    return <>{ConnectedDashboard && <ConnectedDashboard />}</>
  }
}

export default AdminLTEPage
