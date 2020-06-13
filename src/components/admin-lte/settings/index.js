import React from "react"

import { Content } from "adminlte-2-react"
import ImportWallet from "./import"
import NewWallet from "./create"
import InfoWallets from "./info"

class Settings extends React.Component {
  state = {}

  render() {
    return (
      <>
        <Content>
          <NewWallet />
          <ImportWallet />
          <InfoWallets />
        </Content>
      </>
    )
  }
}

export default Settings
