import React from "react"
import Audit from "./audit"
import Configure from "./configure"
import Icons from "./icons"
import Settings from "./settings"

import AdminLTE, { Sidebar } from "adminlte-2-react"
import ScannerModal from "../qr-scanner/modal"

import Layout from "../layout"
import "./admin-lte.css"

import { BrowserRouter as Router } from "react-router-dom"
const { Item } = Sidebar

// Screen width to hide the side menu on click
const MENU_HIDE_WIDTH = 770 
 
let _this
class AdminLTEPage extends React.Component {
  constructor(props) {
    super(props)
    _this = this
    this.state = {
      bchBalance: Math.random().toFixed(8),
      showScannerModal: false,
      section: "Settings",
      menuIsHide: false,
    }
  }

  sidebar = [
    <Item icon="fas-cogs" key="Portfolio" text="Settings" activeOn="/" />,
    <Item icon="fas-icons" key="Icons" text="Icons" />,
    <Item icon="fas-cog" key="Configure" text="Configure" />,
    <Item icon="fa-tablet-alt" key="Audit" text="Audit" />,
    <Item icon="fa-link" key="Link" text="Link">
      <Item key="Send" text="Send BCH by Email" />
      <Item key="Faucet" text="Faucet (Free BCH)" />
      <Item key="Exchange" text="Exchange" />
      <Item key="Games" text="Games" />
      <Item key="trade" text="Trade Locally" />
    </Item>,
    <Item icon="fa-qrcode" key="qrReader" text="Qr Scanner" />,
  ]

  render() {
    return (
      <>
        <AdminLTE title={["FullStack.cash"]} titleShort={["PSF"]} theme="blue">
          <Sidebar.Core>
            <Item key="Balance" text="Balance" icon="fab-bitcoin" >
              <div className="sidebar-balance">
                <div>
                  <h3>BCH Balance </h3>

                  <p>{_this.state.bchBalance}</p>
                </div>
              </div>
            </Item>

            {_this.sidebar}
          </Sidebar.Core>
          <Layout path="/">
            <div className="components-container">
            {_this.state.section === "Settings" && <Settings  />}
            {_this.state.section === "Icons" && <Icons  />}
            {_this.state.section === "Configure" && <Configure  />}
            {_this.state.section === "Audit" && <Audit  />}
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
    )
  }
  componentDidMount() {
    _this.customMenuItems()
    _this.dropDownBalance()
    _this.addOnClickEventToScanner()

    _this.activeItemById("Settings")
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
      if(windowWidth > MENU_HIDE_WIDTH) return
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

export default AdminLTEPage
