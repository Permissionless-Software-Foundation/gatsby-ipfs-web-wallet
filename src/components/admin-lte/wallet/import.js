import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Box, Button, Inputs } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import BchWallet from 'minimal-slp-wallet'

const BchWallet =
  typeof window !== 'undefined'
    ? window.SlpWallet
    : null

const { Text } = Inputs

let _this
class ImportWallet extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      mnemonic: '',
      privateKey: '',
      errMsg: '',
      inFetch: false
    }
    _this.BchWallet = BchWallet
  }

  render () {
    return (
      <Row className=''>
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
                    icon='file-import'
                  />
                  <span>Import Wallet</span>
                </h1>
              </Col>
              <Col sm={12} className='text-center mt-2 mb-2'>
                <Row className='flex justify-content-center'>
                  <Col sm={8}>
                    <div>
                      <Text
                        id='import-mnemonic'
                        name='mnemonic'
                        placeholder='12 word mnemonic'
                        label='12 word mnemonic'
                        labelPosition='above'
                        onChange={_this.handleUpdate}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col sm={12} className='text-center mb-2'>
                <Button
                  text='Import'
                  type='primary'
                  className='btn-lg'
                  onClick={_this.handleImportWallet}
                />
              </Col>
              <Col sm={12} className='text-center'>
                {_this.state.errMsg && (
                  <p className='error-color'>{_this.state.errMsg}</p>
                )}
              </Col>
            </Row>
          </Box>
        </Col>
        <Col sm={2} />
      </Row>
    )
  }

  componentDidMount () {
    // add max length property to mnemonic input
    // document.getElementById("import-mnemonic").maxLength = "12"
  }

  handleUpdate (event) {
    let value = event.target.value
    if (event.target.name === 'mnemonic') {
      value = value.toLowerCase()
    }
    _this.setState({
      [event.target.name]: value
    })
  }

  async handleImportWallet () {
    try {
      _this.validateInputs()

      const currentWallet = _this.props.walletInfo

      if (currentWallet.mnemonic) {
        console.warn('Wallet already exists')
        /*
         * TODO: notify the user that it has an existing wallet,
         * and it will get overwritten
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

      const bchWalletLib = new _this.BchWallet(
        _this.state.mnemonic,
        bchjsOptions
      )
      // Update bchjs instances  of minimal-slp-wallet libraries

      bchWalletLib.tokens.sendBch.bchjs = new bchWalletLib.BCHJS(bchjsOptions)
      bchWalletLib.tokens.utxos.bchjs = new bchWalletLib.BCHJS(bchjsOptions)

      await bchWalletLib.walletInfoPromise // Wait for wallet to be created.

      const walletInfo = bchWalletLib.walletInfo
      walletInfo.from = 'imported'

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

      _this.setState({
        currentRate: currentRate
      })
      _this.props.updateBalance({ myBalance, currentRate })
      // Update redux state
      _this.props.setWalletInfo(currentWallet)
      _this.props.updateBalance({ myBalance, currentRate })
      _this.props.setBchWallet(bchWalletLib)

      // Reset form and component state
      _this.resetValues()
      _this.setState({
        inFetch: false
      })
    } catch (error) {
      _this.handleError(error)
    }
  }

  // Reset form and component state
  resetValues () {
    _this.setState({
      mnemonic: '',
      privateKey: '',
      errMsg: ''
    })
    const mnemonicEle = document.getElementById('import-mnemonic')
    mnemonicEle.value = ''
  }

  validateInputs () {
    const { mnemonic } = _this.state
    if (mnemonic) {
      const spaceCount = mnemonic.split(' ').length // mnemonic.match(/ /g).length

      if (spaceCount !== 12) {
        // console.log('reject')
        throw new Error('mnemonic must contain 12 words')
      }
    } else {
      throw new Error('12 word mnemonic is required')
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

ImportWallet.propTypes = {
  walletInfo: PropTypes.object.isRequired,
  setWalletInfo: PropTypes.func.isRequired,
  updateBalance: PropTypes.func.isRequired,
  setBchWallet: PropTypes.func.isRequired
}

export default ImportWallet

/*
CT 07/10/2020
I removed this element because it doesn't seem to be working. I need to do some
additional research to figure out if it's possible to generate a mnemonic from
a WIF private key.

<Text
  id='privateKey'
  name='privateKey'
  placeholder='Private Key'
  label='Private Key'
  labelPosition='above'
  onChange={_this.handleUpdate}
/>
*/
