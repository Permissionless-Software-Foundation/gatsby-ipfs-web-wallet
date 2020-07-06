import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Box, Button, Inputs } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BchWallet from 'minimal-slp-wallet'

const { Text } = Inputs

let _this
class ImportWallet extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      mnemonic: '',
      privateKey: '',
      errMsg: ''
    }
    _this.BchWallet = BchWallet
  }

  render () {
    return (
      <Row className=''>
        <Col sm={2} />
        <Col sm={8}>
          <Box className='hover-shadow border-none mt-2'>
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
                      <Text
                        id='privateKey'
                        name='privateKey'
                        placeholder='Private Key'
                        label='Private Key'
                        labelPosition='above'
                        onChange={_this.handleUpdate}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col sm={12} className='text-center'>
                {_this.state.errMsg && (
                  <p className='error-color'>{_this.state.errMsg}</p>
                )}
              </Col>

              <Col sm={12} className='text-center mt-2 mb-2'>
                <Button
                  text='Import'
                  type='primary'
                  className='btn-lg'
                  onClick={_this.handleImportWallet}
                />
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

      const bchWalletLib = new _this.BchWallet(_this.state.mnemonic)
      const apiToken = currentWallet.JWT

      if (apiToken) {
        bchWalletLib.bchjs = new bchWalletLib.BCHJS({ apiToken: apiToken })
      }

      await bchWalletLib.walletInfoPromise // Wait for wallet to be created.

      const walletInfo = bchWalletLib.walletInfo
      walletInfo.from = 'imported'

      const myBalance = await bchWalletLib.getBalance()

      // Update redux state
      _this.props.setWalletInfo(walletInfo)
      _this.props.updateBalance(myBalance)
      _this.props.setBchWallet(bchWalletLib)

      // Reset form and component state
      _this.resetValues()
    } catch (error) {
      console.warn(error)
      _this.setState({
        errMsg: error.message
      })
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

    const privateKeyEle = document.getElementById('privateKey')
    privateKeyEle.value = ''
  }

  validateInputs () {
    const { mnemonic } = _this.state
    if (mnemonic) {
      const spaceCount = mnemonic.split(' ').length // mnemonic.match(/ /g).length

      if (spaceCount !== 12) {
        console.log('reject')
        throw new Error('mnemonic must contain 12 words')
      }
    } else {
      throw new Error('12 word mnemonic is required')
    }
  }
}

ImportWallet.propTypes = {
  walletInfo: PropTypes.object.isRequired,
  setWalletInfo: PropTypes.func.isRequired,
  updateBalance: PropTypes.func.isRequired,
  setBchWallet: PropTypes.func.isRequired
}

export default ImportWallet
