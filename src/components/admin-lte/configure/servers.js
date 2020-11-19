import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Box, Inputs, Button } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import BchWallet from 'minimal-slp-wallet'

const BchWallet =
typeof window !== 'undefined'
  ? window.SlpWallet
  : null

const { Text, Select } = Inputs

let _this
class Servers extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      selectOptions: [],
      errMsg: '',
      selectedServer: '',
      showAddField: false,
      newServer: '',
      inFetch: false
    }
    _this.BchWallet = BchWallet
  }

  render () {
    return (
      <Row>
        <Col sm={12}>
          <Box
            className='hover-shadow border-none mt-2'
            loaded={!_this.state.inFetch}
          >
            <Row>
              <Col sm={12} className='text-center'>
                <h1>
                  <FontAwesomeIcon
                    className='title-icon'
                    size='xs'
                    icon='server'
                  />
                  <span>Back End Server</span>
                </h1>
                <Box className='border-none'>
                  <Row>
                    <Col xs={12}>
                      {_this.state.showAddField ? (
                        <Text
                          id='newServer'
                          name='newServer'
                          placeholder='Add New Server url'
                          label='Add New Server Url'
                          labelPosition='above'
                          onChange={_this.handleUpdate}
                          value={_this.state.newServer}
                          buttonRight={
                            <Button
                              text={_this.state.newServer ? ' ADD ' : 'CLOSE'}
                              type='primary'
                              onClick={_this.handleNewServerUrl}
                            />
                          }
                        />
                      ) : (
                        <Select
                          name='selectedServer'
                          label='Select Server Url'
                          labelPosition='above'
                          options={_this.state.selectOptions}
                          value={_this.state.selectedServer}
                          onChange={_this.handleUpdate}
                          buttonRight={
                            <Button
                              icon='fa-plus'
                              onClick={_this.handleTextField}
                            />
                          }
                        />
                      )}
                    </Col>
                    <Col sm={12} />
                  </Row>

                  <Button
                    text='Update'
                    type='primary'
                    className='btn-lg'
                    onClick={_this.handleUpdateServer}
                  />
                </Box>
              </Col>
              <Col sm={12} className='text-center'>
                {_this.state.errMsg && (
                  <p className='error-color'>{_this.state.errMsg}</p>
                )}
              </Col>
            </Row>
          </Box>
        </Col>
      </Row>
    )
  }

  // turn on / off text field
  handleTextField () {
    _this.setState({
      showAddField: !_this.state.showAddField
    })
  }

  // Add the new server value to the select field
  handleNewServerUrl () {
    _this.setState({
      errMsg: ''
    })
    const { newServer, selectOptions } = _this.state
    try {
      if (newServer) {
        if (newServer.match(' ')) {
          throw new Error('backend url must have no spaces')
        }

        const alreadyExist = selectOptions.find(val => {
          return val.value === newServer
        })

        // Prevent duplicate options
        if (alreadyExist) {
          _this.setState({
            showAddField: false,
            selectedServer: newServer
          })
          _this.resetForm()

          return
        }
        const option = {
          value: newServer,
          text: newServer
        }

        // add the new select option
        selectOptions.push(option)
      }

      _this.setState({
        selectOptions,
        showAddField: false,
        selectedServer: newServer || _this.state.selectedServer
      })
      _this.resetForm()
    } catch (error) {
      _this.setState({
        errMsg: error.message
      })
    }
  }

  // populate select field with select options from localstorage
  populateSelect () {
    try {
      const walletInfo = _this.props.walletInfo

      const selectOptions = []

      // populate select field with data from localstorage
      for (let i = 0; i < walletInfo.servers.length; i++) {
        const option = {
          value: walletInfo.servers[i],
          text: walletInfo.servers[i]
        }
        selectOptions.push(option)
      }
      _this.setState({
        selectOptions,
        selectedServer: walletInfo.selectedServer
      })
    } catch (error) {
      console.warn(error)
    }
  }

  componentDidMount () {
    _this.populateSelect()
  }

  handleUpdate (event) {
    const value = event.target.value
    _this.setState({
      [event.target.name]: value
    })
  }

  handleUpdateServer () {
    // Show loader spinner
    _this.setState({
      inFetch: true
    })

    _this.handleNewServerUrl()
    // await for state update delay
    setTimeout(() => {
      _this.updateWalletInstance()
    }, 500)
  }

  // Update the wallet instance state
  updateWalletInstance () {
    try {
      const { mnemonic, JWT } = _this.props.walletInfo
      const apiToken = JWT
      const restURL = _this.state.selectedServer

      // Update instance with the selected url
      if (mnemonic) {
        const bchjsOptions = {}
        if (apiToken) {
          bchjsOptions.apiToken = apiToken
        }

        bchjsOptions.restURL = restURL

        const bchWalletLib = new _this.BchWallet(mnemonic, bchjsOptions)

        // Update bchjs instances  of minimal-slp-wallet libraries
        bchWalletLib.tokens.sendBch.bchjs = new bchWalletLib.BCHJS(bchjsOptions)
        bchWalletLib.tokens.utxos.bchjs = new bchWalletLib.BCHJS(bchjsOptions)

        _this.props.setBchWallet(bchWalletLib)

        // update server current price
        _this.handleUpdateBalance(bchWalletLib)
      } else {
        // Hide loader spinner
        _this.setState({
          inFetch: false
        })
      }
      _this.saveServer()
    } catch (error) {
      console.warn(error)
      _this.setState({
        errMsg: error.message,
        inFetch: false
      })
    }
  }

  // store servers in the localstorage
  saveServer () {
    try {
      // store the new server in the localstorage if it does not exist

      const walletInfo = _this.props.walletInfo
      const { servers } = walletInfo

      const selectedValue = _this.state.selectedServer
      if (!selectedValue) {
        return
      }

      const alreadyExist = servers.find(val => {
        return val === selectedValue
      })
      // Prevent duplicate values
      if (!alreadyExist) {
        servers.push(selectedValue)
      }

      walletInfo.servers = servers
      walletInfo.selectedServer = selectedValue
      _this.props.setWalletInfo(walletInfo)
    } catch (error) {
      console.warn(error)
    }
  }

  // Get wallet balance
  async handleUpdateBalance (bchWallet) {
    try {
      const { mnemonic } = _this.props.walletInfo
      if (mnemonic && bchWallet) {
        const bchWalletLib = bchWallet
        await bchWalletLib.walletInfoPromise
        const myBalance = await bchWalletLib.getBalance()

        const bchjs = bchWalletLib.bchjs

        let currentRate

        if (bchjs.restURL.includes('abc.fullstack')) {
          currentRate = await bchjs.Price.getBchaUsd() * 100
        } else {
          // BCHN price.
          currentRate = (await bchjs.Price.getUsd()) * 100
        }

        _this.setState({
          currentRate: currentRate
        })
        _this.props.updateBalance({ myBalance, currentRate })
      }
      // Hide loader spinner
      _this.setState({
        inFetch: false
      })
    } catch (error) {
      console.error(error)
      // Hide loader spinner
      _this.setState({
        inFetch: false
      })
    }
  }

  // clean the text form field
  resetForm () {
    _this.setState({
      newServer: ''
    })
  }
}
Servers.propTypes = {
  setWalletInfo: PropTypes.func.isRequired,
  walletInfo: PropTypes.object.isRequired,
  setBchWallet: PropTypes.func.isRequired,
  updateBalance: PropTypes.func.isRequired
}

export default Servers
