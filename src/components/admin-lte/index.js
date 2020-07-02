import React from "react"
import PropTypes from "prop-types"
import Configure from "./configure"
import Tokens from "./tokens"
import Wallet from "./wallet"

import AdminLTE, { Sidebar, Navbar } from "adminlte-2-react"
import ScannerModal from "../qr-scanner/modal"

import Layout from "../layout"
import "./admin-lte.css"
import BchWallet from "minimal-slp-wallet"
import VersionStatus from "../version-status"
import { BrowserRouter as Router } from "react-router-dom"

import { StaticQuery, graphql } from "gatsby"
import loadable from "@loadable/component"

import SendReceive from "./send-receive"

const { Item } = Sidebar

// Screen width to hide the side menu on click
const MENU_HIDE_WIDTH = 770

let _this
const MenuItemComponent = ({ component }) => {
  const RenderedComponent = loadable(() => import("./audit"))
  return <RenderedComponent />
}

class AdminLTEPage extends React.Component {
  constructor(props) {
    super(props)
    _this = this
    this.state = {
      bchBalance: 0,
      showScannerModal: false,
      section: "Wallet",
      menuIsHide: false,
      walletInfo: {},
    }
    _this.BchWallet = BchWallet
  }

  sidebar = [
    <Item icon="fa-exchange-alt" key="SendReceive" text="Send/Receive" />,
    <Item icon="fas-coins" key="Tokens" text="Tokens" />,
    <Item icon="fa-wallet" key="Wallet" text="Wallet" activeOn="/" />,
    <Item icon="fa-qrcode" key="qrReader" text="Qr Scanner" />,
    <Item icon="fas-cog" key="Configure" text="Configure" />
  ]

  render() {
    return (
      <StaticQuery
        query={graphql`
          query {
            bchWalletPlugins {
              menuItems {
                title
                component
                icon
              }
            }
          }
        `}
        render={data => (
          <>
            <AdminLTE
              title={["FullStack.cash"]}
              titleShort={["PSF"]}
              theme="blue"
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
                {data.bchWalletPlugins.menuItems.map(item => (
                  <Item icon={item.icon} key={item.title} text={item.title} />
                ))}
              </Sidebar.Core>
              <Navbar.Core>
                <VersionStatus></VersionStatus>
              </Navbar.Core>
              <Layout path="/">
                <div className="components-container">
                  {_this.state.section === "Send/Receive" && (
                    <SendReceive
                      setWalletInfo={_this.props.setWalletInfo}
                      walletInfo={_this.props.walletInfo}
                      updateBalance={_this.props.updateBalance}
                      setBchWallet={_this.props.setBchWallet}
                      bchWallet={_this.props.bchWallet}
                    />
                  )}
                  {_this.state.section === "Tokens" && (
                    <Tokens
                      walletInfo={_this.props.walletInfo}
                      bchWallet={_this.props.bchWallet}
                    />
                  )}
                  {_this.state.section === "Wallet" && (
                    <Wallet
                      setWalletInfo={_this.props.setWalletInfo}
                      walletInfo={_this.props.walletInfo}
                      updateBalance={_this.props.updateBalance}
                      setBchWallet={_this.props.setBchWallet}
                    />
                  )}

                  {_this.state.section === "Configure" && (
                    <Configure
                      walletInfo={_this.props.walletInfo}
                      setWalletInfo={_this.props.setWalletInfo}
                      setBchWallet={_this.props.setBchWallet}
                    />
                  )}
                  {data.bchWalletPlugins.menuItems.map(
                    item =>
                      _this.state.section === item.title && (
                        <MenuItemComponent component={item.component} />
                      )
                  )}
                </div>
              </Layout>
            </AdminLTE>
            <Router>
              <ScannerModal
                show={_this.state.showScannerModal}
                onHide={_this.toggleScannerModal}
                path="/"
              />
            </Router>
          </>
        )}
      />
    )
  }
  // Get wallet balance
  async getBalance() {
    try {
      const { mnemonic } = _this.props.walletInfo
      if (mnemonic && _this.props.bchWallet) {
        const bchWalletLib = _this.props.bchWallet
        await bchWalletLib.walletInfoPromise

        const myBalance = await bchWalletLib.getBalance()
        _this.props.updateBalance(myBalance)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async componentDidMount() {
    _this.customMenuItems()
    _this.addOnClickEventToScanner()

    _this.activeItemById("Wallet")

    await _this.updateState()
    setTimeout(() => {
      _this.dropDownBalance()

      _this.getBalance()
    }, 250)
  }

  componentDidUpdate() {
    _this.updateState()
  }
  // Update component state when props change
  updateState() {
    if (_this.props.walletInfo.mnemonic !== _this.state.walletInfo.mnemonic) {
      _this.setState({
        walletInfo: _this.props.walletInfo,
      })
    }
    if (_this.props.bchBalance !== _this.state.bchBalance) {
      _this.setState({
        bchBalance: _this.props.bchBalance,
      })
    }
  }

  // Due to that it is not possible to add the "onClick" method
  // directly to the <Item> component we do it using JS
  customMenuItems() {
    try {
      // Ignore menu items without link to components
      const ignoreItems = ["Balance", "Qr Scanner", "Link"]

      const menu = document.getElementsByClassName("sidebar-menu")
      const ulElement = menu[0]
      const childrens = ulElement.children

      if (childrens && childrens.length) {
        for (let i = 0; i < childrens.length; i++) {
          //const href = childrens[i].children[0].href
          const textValue = childrens[i].children[0].children[1].textContent
          childrens[i].id = textValue
          const ignore = ignoreItems.find(val => textValue === val)
          // Ignore menu items without link to components
          if (!ignore)
            childrens[i].onclick = () => this.changeSection(textValue)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Displays the BCH balance by default
  dropDownBalance() {
    try {
      const balanceEle = document.getElementById("Balance")
      balanceEle.children[0].click()
    } catch (error) {
      console.error(error)
    }
  }

  // Section change, renders the corresponding component
  // to the selected section. each menu item corresponds
  // to a section.
  changeSection(section) {
    _this.activeItemById(section)
    _this.setState({
      section: section,
    })
    _this.hideMenu()
  }

  // Adds a visual mark to the selected item on the menu
  activeItemById(id) {
    try {
      const elementActived = document.getElementsByClassName("active")
      elementActived[0].className = ""
      const element = document.getElementById(id)
      element.className = `${element.className} active`
    } catch (error) {
      console.error(error)
    }
  }

  // Hides the side menu when clicking on mobile devices
  hideMenu() {
    try {
      const windowWidth = window.innerWidth
      //console.log("Window Width : ",windowWidth)
      if (windowWidth > MENU_HIDE_WIDTH) return
      const toggleEle = document.getElementsByClassName("sidebar-toggle")
      toggleEle[0].click()
    } catch (error) {
      console.error(error)
    }
  }

  // Adds the "onClick" event to the QR scanner item
  addOnClickEventToScanner() {
    try {
      const qrScannerEle = document.getElementById("Qr Scanner")
      qrScannerEle.onclick = () => _this.toggleScannerModal()
    } catch (error) {
      console.error(error)
    }
  }

  // Controller to show the QR scanner
  toggleScannerModal() {
    if (!_this.state.showScannerModal) {
      _this.hideMenu()
    }
    _this.setState({
      showScannerModal: !_this.state.showScannerModal,
    })
  }
}
// Props prvided by redux
AdminLTEPage.propTypes = {
  walletInfo: PropTypes.object.isRequired, // wallet info
  bchBalance: PropTypes.number.isRequired, // bch balance
  setWalletInfo: PropTypes.func.isRequired, // set wallet info
  updateBalance: PropTypes.func.isRequired, // update bch balance
  setBchWallet: PropTypes.func.isRequired, // set minimal-slp-wallet instance
  bchWallet: PropTypes.object, // get minimal-slp-wallet instance
}

export default AdminLTEPage

/*
CT 6/20/2020 storing code here for future reference

<Item icon="fa-tablet-alt" key="Audit" text="Audit" />,
<Item icon="fa-link" key="Link" text="Link">
  <Item key="Send" text="Send BCH by Email" />
  <Item key="Faucet" text="Faucet (Free BCH)" />
  <Item key="Exchange" text="Exchange" />
  <Item key="Games" text="Games" />
  <Item key="trade" text="Trade Locally" />
</Item>,
*/
