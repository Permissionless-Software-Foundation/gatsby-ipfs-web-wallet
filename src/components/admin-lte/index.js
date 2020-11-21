import React from 'react'
import PropTypes from 'prop-types'

import siteConfig from '../site-config'
// import Audit from "./audit"

import AdminLTE, { Sidebar, Navbar, Box } from 'adminlte-2-react'
// import ScannerModal from '../qr-scanner/modal'

import Layout from '../layout'
import './admin-lte.css'
// import BchWallet from 'minimal-slp-wallet'
import VersionStatus from '../version-status'
// import { BrowserRouter as Router } from 'react-router-dom'
import menuComponents from '../menu-components.js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const { Item } = Sidebar

// Screen width to hide the side menu on click
const MENU_HIDE_WIDTH = 770

const BchWallet = typeof window !== 'undefined' ? window.SlpWallet : null

let _this

class AdminLTEPage extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      bchBalance: 0,
      showScannerModal: false,
      section: '',
      menuIsHide: false,
      walletInfo: {},
      inFetch: false,
      usdBalance: 0,
      currentRate: 0
    }

    _this.BchWallet = BchWallet

    _this.sidebar = []

    // This variables don't get added to
    // the state to avoid 'setState()' errors inside render()
    _this.activedItem = ''
    _this.menuLoaded = false

    /* If no wallet exists the default section will be 'Wallet' */
    const { mnemonic } = _this.props.walletInfo
    _this.defaultSection = mnemonic ? 'Tokens' : 'Wallet'
  }

  render () {
    return (
      <>
        <AdminLTE
          title={[siteConfig.title]}
          titleShort={[siteConfig.titleShort]}
          theme='blue'
        >
          <Sidebar.Core>
            <Item key='Balance' text='Balance' icon={siteConfig.balanceIcon}>
              <Box
                className='hover-shadow border-none background-none'
                loaded={!_this.state.inFetch}
              >
                <div className='sidebar-balance'>
                  <div>
                    {!_this.state.inFetch && (
                      <div className='siderbar-balance-content'>
                        <span>
                          <h3>{siteConfig.balanceText}</h3>

                          <span style={{ fontSize: '18px' }}>
                            {_this.state.bchBalance}
                          </span>
                          <small>USD: ${_this.state.usdBalance}</small>
                        </span>
                        <FontAwesomeIcon
                          className='ml-1 icon'
                          size='lg'
                          icon='redo'
                          onClick={_this.handleGetBalance}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Box>
            </Item>

            {_this.sidebar}

            {_this.renderNewMenuItems(_this.props)}
          </Sidebar.Core>

          <Navbar.Core>
            <VersionStatus />
          </Navbar.Core>
          <Layout path='/'>
            <div className='components-container'>
              {_this.renderNewViewItems(_this.props)}
            </div>
          </Layout>
        </AdminLTE>
        {/*
        <Router>
          <ScannerModal
            show={_this.state.showScannerModal}
            handleOnHide={_this.onHandleToggleScannerModal}
            path='/'
          />
        </Router> */}
      </>
    )
  }

  // Get wallet balance
  async handleGetBalance () {
    try {
      _this.setState({
        inFetch: true
      })

      const { mnemonic } = _this.props.walletInfo
      if (mnemonic && _this.props.bchWallet) {
        const bchWalletLib = _this.props.bchWallet
        await bchWalletLib.walletInfoPromise
        const myBalance = await bchWalletLib.getBalance()

        const bchjs = bchWalletLib.bchjs

        let currentRate

        if (bchjs.restURL.includes('abc.fullstack')) {
          currentRate = (await bchjs.Price.getBchaUsd()) * 100
        } else {
          // BCHN price.
          currentRate = (await bchjs.Price.getUsd()) * 100
        }

        _this.setState({
          currentRate: currentRate
        })
        _this.props.updateBalance({ myBalance, currentRate })
      }

      _this.setState({
        inFetch: false
      })
    } catch (error) {
      console.error(error)
      _this.setState({
        inFetch: false
      })
    }
  }

  hideSplashLoader () {
    try {
      const loader = document.getElementById('___loader')
      loader.className = 'display-none'
    } catch (error) {
      console.error(error)
    }
  }

  async componentDidMount () {
    _this.customMenuItems()
    // _this.addOnClickEventToScanner()

    _this.setDefaultServers()

    await _this.updateState()
    setTimeout(() => {
      _this.dropDownBalance()

      _this.handleGetBalance()

      _this.hideSplashLoader()
    }, 250)
  }

  componentDidUpdate () {
    _this.updateState()
  }

  componentWillUpdate () {
    // Update state with the active item-menu selected in component-menu.js
    if (_this.menuLoaded && !_this.state.section) {
      if (_this.activedItem) {
        _this.changeSection(_this.activedItem)
      } else {
        _this.changeSection(_this.defaultSection)
      }
    }
    _this.updateState()
  }

  // Update component state when props change
  updateState () {
    if (_this.props.walletInfo.mnemonic !== _this.state.walletInfo.mnemonic) {
      _this.setState({
        walletInfo: _this.props.walletInfo
      })
    }
    if (_this.props.bchBalance.bchBalance !== _this.state.bchBalance) {
      _this.setState({
        bchBalance: _this.props.bchBalance.bchBalance
      })
    }
    if (_this.props.bchBalance.usdBalance !== _this.state.usdBalance) {
      _this.setState({
        usdBalance: _this.props.bchBalance.usdBalance
      })
    }
  }

  // Due to that it is not possible to add the "onClick" method
  // directly to the <Item> component we do it using JS
  customMenuItems () {
    try {
      // Ignore menu items without link to components
      const ignoreItems = ['Balance', 'Qr Scanner', 'Link']

      const menu = document.getElementsByClassName('sidebar-menu')
      const ulElement = menu[0]
      const childrens = ulElement.children

      if (childrens && childrens.length) {
        for (let i = 0; i < childrens.length; i++) {
          // const href = childrens[i].children[0].href
          const textValue = childrens[i].children[0].children[1].textContent
          childrens[i].id = textValue
          const ignore = ignoreItems.find(val => textValue === val)
          // Ignore menu items without link to components
          if (!ignore && childrens[i]) {
            childrens[i].onclick = () => this.changeSection(textValue)
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Displays the BCH balance by default
  dropDownBalance () {
    try {
      const balanceEle = document.getElementById('Balance')
      balanceEle.children[0].click()
    } catch (error) {
      console.error(error)
    }
  }

  // Section change, renders the corresponding component
  // to the selected section. each menu item corresponds
  // to a section.
  changeSection (section) {
    if (_this.state.section === section) return
    _this.activeItemById(section)
    _this.setState({
      section: section
    })
    _this.hideMenu()
  }

  // Adds a visual mark to the selected item on the menu
  activeItemById (id) {
    try {
      const elementActived = document.getElementsByClassName('active')
      if (elementActived[0]) {
        elementActived[0].className = ''
      }
      const element = document.getElementById(id)
      if (element) element.className = `${element.className} active`
    } catch (error) {
      console.error(error)
    }
  }

  // Hides the side menu when clicking on mobile devices
  hideMenu () {
    try {
      const windowWidth = window.innerWidth
      // console.log("Window Width : ",windowWidth)
      if (windowWidth > MENU_HIDE_WIDTH) return
      const toggleEle = document.getElementsByClassName('sidebar-toggle')
      toggleEle[0].click()
    } catch (error) {
      console.error(error)
    }
  }

  // Adds the "onClick" event to the QR scanner item
  addOnClickEventToScanner () {
    try {
      const qrScannerEle = document.getElementById('Qr Scanner')
      qrScannerEle.onclick = () => _this.onHandleToggleScannerModal()
    } catch (error) {
      console.error(error)
    }
  }

  // Controller to show the QR scanner
  onHandleToggleScannerModal () {
    if (!_this.state.showScannerModal) {
      _this.hideMenu()
    }
    _this.setState({
      showScannerModal: !_this.state.showScannerModal
    })
    setTimeout(() => {
      console.log(_this.state.showScannerModal)
    }, 500)
  }

  // Render non-default menu items. The catch ensures that the render function
  // won't be interrupted if there is an issue porting new menu items.
  renderNewMenuItems (props) {
    try {
      const _menuComponents = menuComponents(props)
      return (
        _menuComponents &&
        _menuComponents.map((m, i) => {
          if (m.active && !_this.activedItem && !_this.menuLoaded) {
            _this.activedItem = m.key // Prevents this action from being repeated
          }
          if (!_this.menuLoaded && i === _menuComponents.length - 1) {
            _this.menuLoaded = true
          }
          return m.menuItem
        })
      )
    } catch (err) {
      // TODO: Figure out how to return an invisible Item.
      return _this.getInvisibleMenuItem() // <Item style={{ display: 'none' }} />
    }
  }

  // Displays the View corresponding to the dynamically loaded menu item.
  renderNewViewItems (props) {
    try {
      const _menuComponents = menuComponents(props)
      return (
        _menuComponents &&
        _menuComponents.map(m => {
          if (_this.state.section === m.key) {
            return m.component
          }
          return ''
        })
      )
    } catch (err) {}
  }

  getInvisibleMenuItem () {
    return (
      <li style={{ display: 'none' }}>
        {/* Adding this childrens prevents console errors */}
        <a href='#'>
          <span />
          <span />
        </a>
      </li>
    )
  }

  // Define backends servers configuration by default
  setDefaultServers () {
    try {
      const walletInfo = _this.props.walletInfo
      const accessLocation = window.location.hostname
      console.log('accessLocation', accessLocation)

      // return if servers configurations exist
      if (walletInfo.selectedServer) return null

      const server1 = 'https://bchn.fullstack.cash/v3/'
      const server2 = 'https://abc.fullstack.cash/v3/'

      const servers = [server1, server2]

      // Default server is BCHN.
      let selectedServer = server1

      if (accessLocation === 'wallet.fullstack.cash') {
        selectedServer = server1
      }

      // BCHN wallet.
      if (accessLocation === 'bchn-wallet.fullstack.cash') {
        selectedServer = server1
      }

      if (accessLocation === 'abc-wallet.fullstack.cash') {
        selectedServer = server2
      }

      // Split uses BCHN by default
      if (accessLocation === 'splitbch.com') {
        selectedServer = server1
      }

      walletInfo.selectedServer = selectedServer
      walletInfo.servers = servers

      _this.props.setWalletInfo(walletInfo)
    } catch (error) {
      console.warn(error)
    }
  }
}

// Props prvided by redux
AdminLTEPage.propTypes = {
  walletInfo: PropTypes.object.isRequired, // wallet info
  bchBalance: PropTypes.object.isRequired, // bch balance
  setWalletInfo: PropTypes.func.isRequired, // set wallet info
  updateBalance: PropTypes.func.isRequired, // update bch balance
  setBchWallet: PropTypes.func.isRequired, // set minimal-slp-wallet instance
  bchWallet: PropTypes.object, // get minimal-slp-wallet instance
  setTokensInfo: PropTypes.func.isRequired, // set tokens info
  tokensInfo: PropTypes.array // tokens info
}

export default AdminLTEPage
