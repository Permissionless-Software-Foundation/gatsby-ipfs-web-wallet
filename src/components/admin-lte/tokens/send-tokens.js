import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Box, Inputs, Button } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import BchWallet from 'minimal-slp-wallet'
import ScannerModal from '../../qr-scanner/modal'
const { Text } = Inputs

const BchWallet = typeof window !== 'undefined' ? window.SlpWallet : null

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
      showScan: false,
      inFetch: false,
      tokenId: ''
    }
    _this.BchWallet = BchWallet
  }

  render () {
    const { name } = _this.props.selectedToken
    return (
      <>
        <Row>
          <Col sm={12}>
            <Box className=' border-none mt-2' loaded={!this.state.inFetch}>
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
                      value={_this.state.amountSat}
                      labelPosition='above'
                      onChange={_this.handleUpdate}
                    />
                    <Row className='token-botton-container'>
                      <Col xs={12} sm={4}>
                        <Button
                          text='Send'
                          type='primary'
                          className='btn-lg btn-send-token mr-1 ml-1 mt-1'
                          onClick={_this.handleSend}
                        />
                      </Col>
                      <Col xs={12} sm={4}>
                        <Button
                          text='Send Max'
                          type='primary'
                          className='btn-lg btn-send-token mr-1 ml-1 mt-1'
                          onClick={_this.handleSendMax}
                        />
                      </Col>
                      <Col xs={12} sm={4}>
                        <Button
                          text='Close'
                          type='primary'
                          className='btn-lg btn-send-token mr-1 ml-1 mt-1'
                          onClick={_this.props.handleBack}
                        />
                      </Col>
                    </Row>
                  </Box>
                </Col>
                <Col sm={12} className='text-center'>
                  {_this.state.errMsg && (
                    <p className='error-color'>{_this.state.errMsg}</p>
                  )}
                  {/* {_this.state.txId && (
                    <p className=''>
                      Transaction ID:
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href={`https://explorer.bitcoin.com/bch/tx/${_this.state.txId}`}
                      >
                        {_this.state.txId}
                      </a>
                    </p>
                  )} */}
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

  // Sets the qty property with
  // the corresponding token decimals
  floorQty (qty, decimals) {
    try {
      const a = qty * Math.pow(10, decimals)
      const b = Math.floor(a)
      const result = b / Math.pow(10, decimals)
      return result
    } catch (error) {
      console.warn(error)
    }
  }

  async handleSendMax () {
    const { qty, decimals } = _this.props.selectedToken
    _this.setState({
      amountSat: _this.floorQty(qty, decimals)
    })
  }

  async handleSend () {
    try {
      _this.setState({
        txId: '',
        inFetch: true
      })
      _this.validateInputs()

      const bchWalletLib = _this.props.bchWallet
      const { address, amountSat } = _this.state
      const { tokenId, qty } = _this.props.selectedToken
      // console.log(`qty: ${qty}`)

      if (!tokenId) {
        throw new Error('There is no token selected')
      }

      const receiver = {
        address,
        tokenId,
        qty: amountSat
      }

      if (qty < receiver.qty) {
        throw new Error('Insufficient balance')
      }
      // console.log('receiver', receiver)

      if (!bchWalletLib) {
        throw new Error('Wallet not found')
      }

      // Ensure the wallet UTXOs are up-to-date.
      const walletAddr = bchWalletLib.walletInfo.address
      await bchWalletLib.utxos.initUtxoStore(walletAddr)

      // Used for debugging.
      // console.log(`receiver: ${JSON.stringify(receiver, null, 2)}`)
      // console.log(
      //   `bchWalletLib.utxos.bchUtxos: ${JSON.stringify(
      //     bchWalletLib.utxos.bchUtxos,
      //     null,
      //     2
      //   )}`
      // )
      // console.log(
      //   `bchWalletLib.utxos.tokenUtxos: ${JSON.stringify(
      //     bchWalletLib.utxos.tokenUtxos,
      //     null,
      //     2
      //   )}`
      // )

      // Send token.
      const result = await bchWalletLib.sendTokens(receiver, 5.0)
      // console.log('result: ', result)

      _this.setState({
        txId: result,
        inFetch: false
      })

      _this.props.setTxId(result) /* Set the transaction ID in Tokens state */

      _this.resetValues()

      setTimeout(() => {
        _this.props.handleSend()
        _this.props.handleBack()
      }, 3000)
    } catch (error) {
      _this.handleError(error)
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
    const validateAdrrs = ['simpleledger', 'bitcoincash']
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

  componentDidMount () {
    _this.setState({
      tokenId: _this.props.selectedToken.tokenId
    })
  }

  componentDidUpdate () {
    if (_this.props.selectedToken.tokenId !== _this.state.tokenId) {
      _this.setState({
        tokenId: _this.props.selectedToken.tokenId,
        amountSat: ''
      })
    }
  }
}
SendTokens.propTypes = {
  walletInfo: PropTypes.object.isRequired, // wallet info
  bchWallet: PropTypes.object, // get minimal-slp-wallet instance
  selectedToken: PropTypes.object,
  handleBack: PropTypes.func.isRequired,
  handleSend: PropTypes.func.isRequired,
  setTxId: PropTypes.func.isRequired
}
export default SendTokens
