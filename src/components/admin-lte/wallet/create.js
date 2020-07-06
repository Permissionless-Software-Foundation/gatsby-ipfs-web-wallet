import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Box, Button } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BchWallet from 'minimal-slp-wallet'

let _this
class NewWallet extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {}

    _this.BchWallet = BchWallet
  }

  render () {
    return (
      <>
        <Row>
          <Col sm={2} />
          <Col sm={8}>
            <Box className='hover-shadow border-none mt-2'>
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

      const bchWalletLib = new _this.BchWallet()
      const apiToken = currentWallet.JWT

      if (apiToken) {
        bchWalletLib.bchjs = new bchWalletLib.BCHJS({ apiToken: apiToken })
      }

      await bchWalletLib.walletInfoPromise // Wait for wallet to be created.

      const walletInfo = bchWalletLib.walletInfo
      walletInfo.from = 'created'

      const myBalance = await bchWalletLib.getBalance()

      // Update redux state
      _this.props.setWalletInfo(walletInfo)
      _this.props.updateBalance(myBalance)
      _this.props.setBchWallet(bchWalletLib)
    } catch (error) {
      console.error(error)
    }
  }
}
NewWallet.propTypes = {
  walletInfo: PropTypes.object.isRequired,
  setWalletInfo: PropTypes.func.isRequired,
  updateBalance: PropTypes.func.isRequired,
  setBchWallet: PropTypes.func.isRequired
}
export default NewWallet
