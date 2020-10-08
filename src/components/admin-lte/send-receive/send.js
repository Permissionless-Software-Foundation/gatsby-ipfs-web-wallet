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
      sendCurrency: 'USD'
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
                        buttonRight={
                          <Button
                            icon='fa-random'
                            onClick={_this.handleChangeCurrency}
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
                        onClick={_this.handleSend}
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
                        href={`https://explorer.bitcoin.com/bch/tx/${_this.state.txId}`}
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

      const receivers = [
        {
          address,
          // amount in satoshis, 1 satoshi = 0.00000001 Bitcoin
          amountSat: Math.floor(Number(amountSat) * 100000000)
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
        const currentRate = await bchjs.Price.current('usd')
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
      inFetch: false
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
