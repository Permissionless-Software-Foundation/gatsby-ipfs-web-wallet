import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Box, Button } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import BchWallet from 'minimal-slp-wallet'

const BchWallet =
  typeof window !== 'undefined'
    ? window.SlpWallet
    : null

let _this
class NewWallet extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      inFetch: false,
      errMsg: ''
    }

    _this.BchWallet = BchWallet
  }

  render () {
    return (
      <>
        <Row>
          <Col sm={2} />
          <Col sm={8}>
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
                      icon='plus'
                    />
                    <span>New Wallet</span>
                  </h1>
                </Col>
                <Col sm={12} className='text-center mt-2 mb-2'>
                  <Button
                    text='Create Wallet'
                    type='primary'
                    className='btn-lg'
                    onClick={_this.handleCreateWallet}
                  />
                </Col>
                <Col sm={12} className='text-center '>
                  {_this.state.errMsg && (
                    <p className='error-color mt-2'>{_this.state.errMsg}</p>
                  )}
                </Col>
              </Row>
            </Box>
          </Col>
          <Col sm={2} />
        </Row>
      </>
    )
  }

  async handleCreateWallet () {
    try {
      const currentWallet = _this.props.walletInfo

      if (currentWallet.mnemonic) {
        console.warn('Wallet already exists')
        /*
         * TODO: notify the user that if it has an existing wallet,
         * it will get overwritten
         */
      }
      _this.setState({
        inFetch: true
      })
      const apiToken = currentWallet.JWT
      const restURL = currentWallet.selectedServer
      const bchjsOptions = {}

      if (apiToken || restURL) {
        if (apiToken) {
          bchjsOptions.apiToken = apiToken
        }
        if (restURL) {
          bchjsOptions.restURL = restURL
        }
      }

      const bchWalletLib = new _this.BchWallet(null, bchjsOptions)

      // Update bchjs instances  of minimal-slp-wallet libraries
      bchWalletLib.tokens.sendBch.bchjs = new bchWalletLib.BCHJS(bchjsOptions)
      bchWalletLib.tokens.utxos.bchjs = new bchWalletLib.BCHJS(bchjsOptions)

      await bchWalletLib.walletInfoPromise // Wait for wallet to be created.

      const walletInfo = bchWalletLib.walletInfo
      walletInfo.from = 'created'

      Object.assign(currentWallet, walletInfo)

      const myBalance = await bchWalletLib.getBalance()

      const bchjs = bchWalletLib.bchjs

      let currentRate

      if (bchjs.restURL.includes('abc.fullstack')) {
        currentRate = await bchjs.Price.getBchaUsd() * 100
      } else {
        // BCHN price.
        currentRate = (await bchjs.Price.getUsd()) * 100
      }

      // console.log("myBalance", myBalance)
      // Update redux state
      _this.props.setWalletInfo(currentWallet)
      _this.props.updateBalance({ myBalance, currentRate })
      _this.props.setBchWallet(bchWalletLib)

      _this.setState({
        inFetch: false,
        errMsg: ''
      })
    } catch (error) {
      _this.handleError(error)
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
    _this.setState({
      inFetch: false,
      errMsg: errMsg
    })
  }
}
NewWallet.propTypes = {
  walletInfo: PropTypes.object.isRequired,
  setWalletInfo: PropTypes.func.isRequired,
  updateBalance: PropTypes.func.isRequired,
  setBchWallet: PropTypes.func.isRequired
}
export default NewWallet
