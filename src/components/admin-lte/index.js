import React from "react"
import Audit from "./audit"
import Configure from "./configure"
import Icons from "./icons"
import Settings from "./settings"

import AdminLTE, { Sidebar } from "adminlte-2-react"

import Layout from "../layout"
import "./admin-lte.css"
const { Item } = Sidebar

let _this
class AdminLTEPage extends React.Component {
  constructor(props) {
    super(props)
    _this = this
    this.state = {
      bchBalance: Math.random().toFixed(8),
    }
  }

  sidebar = [
    <Item icon="fas-cogs" key="Portfolio" text="Settings" to="/Settings" />,
    <Item icon="fas-icons" key="Icons" text="Icons" to="/Icons" />,
    <Item icon="fas-cog" key="Configure" text="Configure" to="/Configure" />,
    <Item icon="fa-tablet-alt" key="Audit" text="Audit" to="/Audit" />,
    <Item icon="fa-link" key="Link" text="Link">
      <Item key="Send" text="Send BCH by Email" />
      <Item key="Faucet" text="Faucet (Free BCH)" />
      <Item key="Exchange" text="Exchange" />
      <Item key="Games" text="Games" />
      <Item key="trade" text="Trade Locally" />
    </Item>,
    <Item icon="fa-qrcode" key="qrScanner" text="Qr Scanner" />,
  ]

  render() {
    return (
      <Layout>
        <AdminLTE
          title={["BCH", "JS"]}
          titleShort={["BCH"]}
          theme="blue"
          /* sidebar={this.sidebar}  */
        >
          <Sidebar.Core>
            <Item key="Balance" text="Balance" icon="fab-bitcoin">
              <div className="sidebar-balance">
                <div>
                  <h3>BCH Balance </h3>

                  <p>{_this.state.bchBalance}</p>
                </div>
              </div>
            </Item>

            {_this.sidebar}
          </Sidebar.Core>
          <Settings path="/Settings" />
          <Icons path="/Icons" />
          <Configure path="/Configure" />
          <Audit path="/Audit" />
        </AdminLTE>
      </Layout>
    )
  }
  goto() {
    console.log("go to")
  }
}

export default AdminLTEPage
