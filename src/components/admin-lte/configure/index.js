import React from 'react'
import PropTypes from 'prop-types'
import { Content, Row, Col, Box, Inputs, Button } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BchWallet from 'minimal-slp-wallet'

const { Text } = Inputs

let _this
class Configure extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      JWT: '',
      errMsg: ''
    }

    _this.BchWallet = BchWallet
  }

  render () {
    return (
      <Content>
        <Row>
          <Col sm={12}>
            <Box className='hover-shadow border-none mt-2'>
              <Row>
                <Col sm={12} className='text-center'>
                  <h1>
                    <FontAwesomeIcon
                      className='title-icon'
                      size='xs'
                      icon='cog'
                    />
                    <span>Configure</span>
                  </h1>
                  <Box className='border-none'>
                    <h3>
                      <FontAwesomeIcon
                        className='title-icon'
                        size='xs'
                        icon='exclamation-triangle'
                      />
                      Be Careful
                    </h3>
                    <p>
                      Backup your wallet first. Updating the configuration will
                      restart the app.
                    </p>
                    <p>
                      This is just a placeholder. This View will allow the user
                      to pick alternate back-end servers. The default will be{' '}
                      <a
                        href='https://fullstack.cash'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        FullStack.cash
                      </a>
                    </p>
                  </Box>
                </Col>
              </Row>
            </Box>
          </Col>
          <Col sm={12}>
            <Box className='hover-shadow border-none mt-2'>
              <Row>
                <Col sm={12} className='text-center'>
                  <h1>
                    <FontAwesomeIcon
                      className='title-icon'
                      size='xs'
                      icon='coins'
                    />
                    <span>JWT</span>
                  </h1>
                  <Box className='border-none'>
                    <Text
                      id='jwt'
                      name='JWT'
                      placeholder='Enter FullStack.cash JWT'
                      label='FullStack.cash JWT'
                      labelPosition='above'
                      onChange={_this.handleUpdate}
                    />
                    <Button
                      text='Update'
                      type='primary'
                      className='btn-lg'
                      onClick={_this.handleUpdateJWT}
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
      </Content>
    )
  }

  componentDidMount () {
    _this.setJwt()
  }

  setJwt () {
    const { JWT } = _this.props.walletInfo
    if (JWT) {
      const jwtElem = document.getElementById('jwt')
      jwtElem.value = JWT
    }
  }

  handleUpdate (event) {
    const value = event.target.value
    _this.setState({
      [event.target.name]: value
    })
    console.log(_this.state.JWT)
  }

  async handleUpdateJWT () {
    try {
      const { mnemonic } = _this.props.walletInfo
      const apiToken = _this.state.JWT

      // Update instance with JWT
      if (mnemonic && apiToken) {
        const bchWalletLib = new _this.BchWallet(mnemonic)
        bchWalletLib.bchjs = new bchWalletLib.BCHJS({ apiToken: apiToken })
        _this.props.setBchWallet(bchWalletLib)
      }

      const walletInfo = _this.props.walletInfo

      walletInfo.JWT = apiToken

      _this.props.setWalletInfo(walletInfo)
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
      JWT: '',
      errMsg: ''
    })
    const jwtElem = document.getElementById('jwt')
    jwtElem.value = ''
  }
}
Configure.propTypes = {
  setWalletInfo: PropTypes.func.isRequired,
  walletInfo: PropTypes.object.isRequired,
  setBchWallet: PropTypes.func.isRequired
}

export default Configure
