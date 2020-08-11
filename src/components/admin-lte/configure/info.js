import React from 'react'
import { Row, Col, Box, Button } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setWalletInfo } from '../../localWallet'

// import BchWallet from 'minimal-slp-wallet'

const BchWallet =
  typeof window !== 'undefined'
    ? window.SlpWallet
    : null

let _this
class ConfigureInfo extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {

    }

    _this.BchWallet = BchWallet
  }

  render () {
    return (
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
                    Backup your wallet first. Updating the configuration
                    will restart the app.
                  </p>
                  <p>
                    This is just a placeholder. This View will allow the
                    user to pick alternate back-end servers. The default
                    will be{' '}
                    <a
                      href='https://fullstack.cash'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      FullStack.cash
                    </a>
                  </p>
                  <Button
                    text='Clear LocalStorage'
                    type='primary'
                    className='btn-lg mt-1'
                    onClick={_this.handleClearLocalStorage}
                  />
                </Box>
              </Col>
            </Row>
          </Box>
        </Col>
      </Row>
    )
  }

  // Clear localstorage info
  handleClearLocalStorage () {
    setWalletInfo({})
    window.location.reload()
  }
}

export default ConfigureInfo
