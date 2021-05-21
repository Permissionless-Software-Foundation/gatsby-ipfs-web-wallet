import React from 'react'
import PropTypes from 'prop-types'
import { Content, Row, Col, Box, Inputs, Button } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import BchWallet from 'minimal-slp-wallet'
import ScannerModal from '../../qr-scanner/modal'
const { Text } = Inputs

const BchWallet = typeof window !== 'undefined' ? window.SlpWallet : null

let _this
class Send extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      address: '',
      amountSat: '',
      errMsg: '',
      txId: '',
      showScan: false,
      inFetch: false,
      sendCurrency: 'USD',
      sendMax: false,
      explorerURL: ''
    }
    _this.BchWallet = BchWallet
  }

  render () {
    return (
      <>
        <Content>
          <Row>
            <Col sm={2} />
            <Col sm={8}>
              <Box
                loaded={!_this.state.inFetch}
                className='hover-shadow border-none mt-2'
              >
                <Row>
                  <Col sm={12} className='text-center'>
                    <h1>
                      <FontAwesomeIcon
                        className='title-icon'
                        size='xs'
                        icon='paper-plane'
                      />
                      <span>Send</span>
                    </h1>
                    <Box className='border-none'>
                      <Text
                        id='addressToSend'
                        name='address'
                        placeholder='Enter bch address to send'
                        label='BCH Address'
                        labelPosition='above'
                        onChange={_this.handleUpdate}
                        className='title-icon'
                        buttonRight={
                          <Button
                            icon='fa-qrcode'
                            onClick={_this.handleModal}
                          />
                        }
                      />

                      <Text
                        id='amountToSend'
                        name='amountSat'
                        value={_this.state.amountSat}
                        placeholder={`Enter amount to send in ${_this.state.sendCurrency}`}
                        label='Amount'
                        labelPosition='above'
                        onChange={_this.handleUpdate}
                        addonRight={_this.state.sendCurrency}
                        disabled={_this.state.sendMax}
                        buttonRight={
                          <Button
                            icon='fa-random'
                            onClick={_this.handleChangeCurrency}
                          />
                        }
                        buttonLeft={
                          <Button
                            text={_this.state.sendMax ? 'UNDO' : 'MAX'}
                            onClick={_this.handleSendType}
                          />
                        }
                      />
                      <div className='text-left pb-4'>
                        <p>
                          {_this.state.sendCurrency === 'BCH'
                            ? `USD: ${(
                                _this.state.amountSat *
                                (_this.props.currentRate / 100)
                              ).toFixed(2)}`
                            : `BCH: ${(
                                _this.state.amountSat /
                                (_this.props.currentRate / 100)
                              ).toFixed(8)}`}
                        </p>
                      </div>
                      <Button
                        text='Send'
                        type='primary'
                        className='btn-lg'
                        onClick={
                          _this.state.sendMax
                            ? _this.handleSendAll
                            : _this.handleSend
                        }
                      />
                    </Box>
                  </Col>
                  <Col sm={12} className='text-center'>
                    {_this.state.errMsg && (
                      <p className='error-color'>{_this.state.errMsg}</p>
                    )}
                    {_this.state.txId && (
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href={`${_this.state.explorerURL}/${_this.state.txId}`}
                      >
                        Transaction ID: {_this.state.txId}
                      </a>
                    )}
                  </Col>
                </Row>
              </Box>
            </Col>
            <Col sm={2} />
          </Row>
          <ScannerModal
            show={_this.state.showScan}
            handleOnHide={_this.onHandleToggleScanner}
            handleOnScan={_this.onHandleScan}
          />
        </Content>
      </>
    )
  }

  componentDidMount () {
    _this.defineExplorer()
  }

  // Define the explorer to use
  // depending on the selected chain
  defineExplorer () {
    const bchWalletLib = _this.props.bchWallet
    const bchjs = bchWalletLib.bchjs

    let explorerURL

    if (bchjs.restURL.includes('abc.fullstack')) {
      explorerURL = 'https://explorer.bitcoinabc.org/tx'
    } else {
      explorerURL = 'https://explorer.bitcoin.com/bch/tx'
    }
    _this.setState({
      explorerURL
    })
  }

  handleChangeCurrency () {
    if (_this.state.sendCurrency === 'USD') {
      _this.setState({
        sendCurrency: 'BCH'
      })
      if (_this.state.amountSat > 0) {
        _this.setState({
          amountSat: (
            _this.state.amountSat /
            (_this.props.currentRate / 100)
          ).toFixed(8)
        })
      }
    } else {
      _this.setState({
        sendCurrency: 'USD'
      })
      if (_this.state.amountSat > 0) {
        _this.setState({
          amountSat: (
            _this.state.amountSat *
            (_this.props.currentRate / 100)
          ).toFixed(2)
        })
      }
    }
  }

  handleSendType () {
    const sendMax = !_this.state.sendMax
    _this.setState({
      sendMax
    })
    if (sendMax) {
      _this.getMaxAmount()
    } else {
      _this.setState({
        amountSat: ''
      })
    }
  }

  async getMaxAmount () {
    try {
      const bchWalletLib = _this.props.bchWallet
      // Ensure the wallet UTXOs are up-to-date.
      const walletAddr = bchWalletLib.walletInfo.address
      await bchWalletLib.utxos.initUtxoStore(walletAddr)

      const utxos = bchWalletLib.utxos.utxoStore.bchUtxos
      if (!utxos.length) {
        throw new Error('No BCH Utxos to spend!')
      }

      // Get total of satoshis fron the bch utxos
      let totalAmount = 0
      utxos.map(val => (totalAmount += val.value))

      // Convert satoshis to bch
      let amountSat = totalAmount / 100000000

      // Change the amount to send to USD if is the selected currency
      if (_this.state.sendCurrency === 'USD') {
        const _usdAmount = amountSat * (_this.props.currentRate / 100)
        const usdAmount = Number(_usdAmount.toFixed(2)) // usd Amount
        amountSat = usdAmount
      }

      _this.setState({
        amountSat: amountSat
      })
    } catch (error) {
      console.error(error)
      _this.setState({
        errMsg: error.message,
        sendMax: false
      })
    }
  }

  async handleSendAll () {
    try {
      _this.validateInputs()

      const bchWalletLib = _this.props.bchWallet
      let { address, amountSat } = _this.state

      if (_this.state.sendCurrency === 'USD') {
        amountSat = (amountSat / (_this.props.currentRate / 100)).toFixed(8)
      }

      const amountToSend = Math.floor(Number(amountSat) * 100000000)
      console.log(`Sending ${amountToSend} satoshis to ${address}`)

      if (!bchWalletLib) {
        throw new Error('Wallet not found')
      }
      _this.setState({
        inFetch: true
      })

      // Ensure the wallet UTXOs are up-to-date.
      const walletAddr = bchWalletLib.walletInfo.address
      await bchWalletLib.utxos.initUtxoStore(walletAddr)

      // Send the BCH.
      const result = await bchWalletLib.sendAll(address)
      // console.log('result',result)

      _this.setState({
        txId: result
      })

      // update balance
      setTimeout(async () => {
        const myBalance = await bchWalletLib.getBalance()
        const bchjs = bchWalletLib.bchjs

        let currentRate

        if (bchjs.restURL.includes('abc.fullstack')) {
          currentRate = (await bchjs.Price.getBchaUsd()) * 100
        } else {
          // BCHN price.
          currentRate = (await bchjs.Price.getUsd()) * 100
        }

        _this.props.updateBalance({ myBalance, currentRate })
      }, 1000)

      _this.resetValues()
    } catch (error) {
      _this.handleError(error)
    }
  }

  handleUpdate (event) {
    const value = event.target.value
    _this.setState({
      [event.target.name]: value
    })
  }

  async handleSend () {
    try {
      _this.validateInputs()

      const bchWalletLib = _this.props.bchWallet
      let { address, amountSat } = _this.state

      if (_this.state.sendCurrency === 'USD') {
        amountSat = (amountSat / (_this.props.currentRate / 100)).toFixed(8)
      }

      const amountToSend = Math.floor(Number(amountSat) * 100000000)
      console.log(`Sending ${amountToSend} satoshis to ${address}`)

      const receivers = [
        {
          address,
          // amount in satoshis, 1 satoshi = 0.00000001 Bitcoin
          amountSat: amountToSend
        }
      ]
      // console.log("receivers", receivers)

      if (!bchWalletLib) {
        throw new Error('Wallet not found')
      }
      _this.setState({
        inFetch: true
      })

      // Ensure the wallet UTXOs are up-to-date.
      const walletAddr = bchWalletLib.walletInfo.address
      await bchWalletLib.utxos.initUtxoStore(walletAddr)

      // Used for debugging.
      // console.log(
      //   `bchWalletLib.utxos.bchUtxos: ${JSON.stringify(
      //     bchWalletLib.utxos.bchUtxos,
      //     null,
      //     2
      //   )}`
      // )

      // Send the BCH.
      const result = await bchWalletLib.send(receivers)
      // console.log('result',result)

      _this.setState({
        txId: result
      })

      // update balance
      setTimeout(async () => {
        const myBalance = await bchWalletLib.getBalance()
        const bchjs = bchWalletLib.bchjs

        let currentRate

        if (bchjs.restURL.includes('abc.fullstack')) {
          currentRate = (await bchjs.Price.getBchaUsd()) * 100
        } else {
          // BCHN price.
          currentRate = (await bchjs.Price.getUsd()) * 100
        }

        _this.props.updateBalance({ myBalance, currentRate })
      }, 1000)

      _this.resetValues()
    } catch (error) {
      _this.handleError(error)
    }
  }

  // Reset form and component state
  resetValues () {
    _this.setState({
      address: '',
      amountSat: '',
      errMsg: '',
      inFetch: false,
      sendMax: ''
    })
    const amountEle = document.getElementById('amountToSend')
    amountEle.value = ''

    const addressEle = document.getElementById('addressToSend')
    addressEle.value = ''
  }

  validateInputs () {
    const { address, amountSat } = _this.state
    const amountNumber = Number(amountSat)

    if (!address) {
      throw new Error('Address is required')
    }

    if (!amountSat) {
      throw new Error('Amount is required')
    }

    if (!amountNumber) {
      throw new Error('Amount must be a number')
    }

    if (amountNumber < 0) {
      throw new Error('Amount must be greater than zero')
    }
  }

  onHandleToggleScanner () {
    _this.setState({
      showScan: !_this.state.showScan
    })
  }

  handleModal () {
    _this.setState({
      showScan: !_this.state.showScan
    })
  }

  resetAddressValue () {
    _this.setState({
      address: '',
      errMsg: ''
    })
    const addressEle = document.getElementById('addressToSend')
    addressEle.value = ''
  }

  onHandleScan (data) {
    try {
      _this.resetAddressValue()
      if (!data) {
        throw new Error('No Result!')
      }
      if (typeof data !== 'string') {
        throw new Error('It should scan a bch address or slp address')
      }

      _this.setState({
        address: data,
        errMsg: ''
      })
      const addressEle = document.getElementById('addressToSend')
      addressEle.value = data

      _this.onHandleToggleScanner()
    } catch (error) {
      _this.onHandleToggleScanner()
      _this.setState({
        errMsg: error.message
      })
    }
  }

  handleError (error) {
    // console.error(error)
    let errMsg = ''
    if (error.message) {
      errMsg = error.message
    }
    if (error.error) {
      if (error.error.match('rate limits')) {
        errMsg = (
          <span>
            Rate limits exceeded, increase rate limits with a JWT token from
            <a
              style={{ marginLeft: '5px' }}
              target='_blank'
              href='https://fullstack.cash'
              rel='noopener noreferrer'
            >
              FullStack.cash
            </a>
          </span>
        )
      } else {
        errMsg = error.error
      }
    }
    _this.setState(prevState => {
      return {
        ...prevState,
        errMsg,
        txId: '',
        inFetch: false
      }
    })
  }
}
Send.propTypes = {
  updateBalance: PropTypes.func.isRequired,
  bchWallet: PropTypes.object,
  currentRate: PropTypes.number
}

export default Send
