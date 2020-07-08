import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Box, Inputs, Button } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BchWallet from 'minimal-slp-wallet'
import ScannerModal from '../../qr-scanner/modal'
const { Text } = Inputs

let _this
class SendTokens extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      address: '',
      amountSat: '',
      errMsg: '',
      txId: '',
      showScan: false
    }
    _this.BchWallet = BchWallet
  }

  render () {
    const { name } = _this.props.selectedToken
    return (
      <>
        <Row>
          <Col sm={12}>
            <Box className=' border-none mt-2'>
              <Row>
                <Col sm={12} className='text-center'>
                  <h1 id='SendTokens'>
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
                      placeholder='Enter simpleledger address to send'
                      label='SLP Address'
                      labelPosition='above'
                      onChange={_this.handleUpdate}
                      className='title-icon'
                      buttonRight={
                        <Button icon='fa-qrcode' onClick={_this.handleModal} />
                      }
                    />

                    <Text
                      id='amountToSend'
                      name='amountSat'
                      placeholder='Enter amount to send'
                      label='Amount'
                      labelPosition='above'
                      onChange={_this.handleUpdate}
                    />
                    <Button
                      text='Close'
                      type='primary'
                      className='btn-lg mr-2'
                      onClick={_this.props.handleBack}
                    />
                    <Button
                      text='Send'
                      type='primary'
                      className='btn-lg '
                      onClick={_this.handleSend}
                    />
                  </Box>
                </Col>
                <Col sm={12} className='text-center'>
                  {_this.state.errMsg && (
                    <p className='error-color'>{_this.state.errMsg}</p>
                  )}
                  {_this.state.txId && (
                    <p className=''>Transaction ID: {_this.state.txId}</p>
                  )}
                  {name && (
                    <span>
                      Selected Token : <b>{name}</b>
                    </span>
                  )}
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
        <ScannerModal
          show={_this.state.showScan}
          handleOnHide={_this.onHandleToggleScanner}
          handleOnScan={_this.onHandleOnScan}
        />
      </>
    )
  }

  handleUpdate (event) {
    const value = event.target.value
    _this.setState({
      [event.target.name]: value
    })
    // console.log(_this.state)
  }

  async handleSend () {
    try {
      _this.validateInputs()

      const bchWalletLib = _this.props.bchWallet
      const { address, amountSat } = _this.state
      const { tokenId } = _this.props.selectedToken

      if (!tokenId) {
        throw new Error('There is no token selected')
      }
      const receiver = {
        address,
        tokenId,
        qty: Math.floor(Number(amountSat))
      }

      console.log('receiver', receiver)

      if (!bchWalletLib) {
        throw new Error('Wallet not found')
      }

      // Ensure the wallet UTXOs are up-to-date.
      const walletAddr = bchWalletLib.walletInfo.address
      const utxoStore = await bchWalletLib.utxos.initUtxoStore(walletAddr)
      console.log(`utxoStore: ${JSON.stringify(utxoStore, null, 2)}`)

      // For some reason, the utxo categories do not get populated, so we have
      // to do it manually.
      bchWalletLib.utxos.bchUtxos = await bchWalletLib.utxos.getBchUtxos()
      bchWalletLib.utxos.tokenUtxos = await bchWalletLib.utxos.getTokenUtxos()

      // Send token.
      const result = await bchWalletLib.sendTokens(receiver)
      console.log('result: ', result)

      _this.setState({
        txId: result
      })

      _this.resetValues()
    } catch (error) {
      let errMsg
      if (error.message) {
        errMsg = error.message
      } else if (error.error) {
        errMsg = error.error
      }
      _this.setState(prevState => {
        return {
          ...prevState,
          errMsg,
          txId: ''
        }
      })
    }
  }

  // Reset form and component state
  resetValues () {
    _this.setState({
      address: '',
      amountSat: '',
      errMsg: ''
    })
    const amountEle = document.getElementById('amountToSend')
    amountEle.value = ''

    const addressEle = document.getElementById('addressToSend')
    addressEle.value = ''
  }

  validateInputs () {
    const { address, amountSat } = _this.state
    const amountNumber = Number(amountSat)
    console.log(_this.state)

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

  onHandleOnScan (data) {
    const validateAdrrs = ['simpleledger']
    try {
      _this.resetAddressValue()
      if (!data) {
        throw new Error('No Result!')
      }
      if (typeof data !== 'string') {
        throw new Error('It should scan a bch address or slp address')
      }
      // Validates that the words "bitcoincash" or "simpleledger" are contained
      let isValid = false
      for (let i = 0; i < validateAdrrs.length; i++) {
        isValid = isValid ? true : data.match(validateAdrrs[i])
        if (isValid) {
          _this.setState({
            address: data,
            errMsg: ''
          })
          const addressEle = document.getElementById('addressToSend')
          addressEle.value = data
        }
      }
      if (!isValid) {
        throw new Error('It should scan a bch address or slp address')
      }
      _this.onHandleToggleScanner()
    } catch (error) {
      _this.onHandleToggleScanner()
      _this.setState({
        errMsg: error.message
      })
    }
  }

  componentDidMount () {}
}
SendTokens.propTypes = {
  walletInfo: PropTypes.object.isRequired, // wallet info
  bchWallet: PropTypes.object, // get minimal-slp-wallet instance
  selectedToken: PropTypes.object,
  handleBack: PropTypes.func.isRequired
}
export default SendTokens
