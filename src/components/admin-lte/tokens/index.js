import React from 'react'
import PropTypes from 'prop-types'
import { Content, Row, Col, Box } from 'adminlte-2-react'
import TokenCard from './token-card'
import TokenModal from './token-modal'
import Spinner from '../../../images/loader.gif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

let _this
class Tokens extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      tokens: [],
      selectedToken: '',
      showModal: false,
      inFetch: true,
      onEmptyTokensMsg: 'No tokens found on this wallet..'
    }
  }

  render () {
    const { JWT } = _this.props.walletInfo

    return (
      <>
        {_this.state.inFetch ? (
          <div className='spinner'>
            <img alt='Loading...' src={Spinner} width={100} />
          </div>
        ) : (
          <Content>
            {!JWT && (
              <Box padding='true' className='container-nofound'>
                <Row>
                  <Col xs={12}>
                    <FontAwesomeIcon
                      className='icon btn-animation'
                      size='lg'
                      icon='exclamation-triangle'
                    />
                  </Col>

                  <Col xs={12}>
                    <em>
                      You don't have a registered JWT, you could encounter
                      errors viewing some of your tokens.
                    </em>
                  </Col>
                </Row>
              </Box>
            )}
            <br />
            {!_this.state.tokens.length && (
              <Box padding='true' className='container-nofound'>
                <Row>
                  <Col xs={12}>
                    <em>{_this.state.onEmptyTokensMsg}</em>
                  </Col>
                </Row>
              </Box>
            )}
            {_this.state.tokens.length && (
              <Row>
                {_this.state.tokens.map((val, i) => {
                  return (
                    <Col sm={4} key={`token-${i}`}>
                      <TokenCard
                        key={`token-${i}`}
                        id={`token-${i}`}
                        token={val}
                        showToken={_this.showToken}
                      />
                    </Col>
                  )
                })}
              </Row>
            )}
          </Content>
        )}
        <TokenModal
          token={_this.state.selectedToken ? _this.state.selectedToken : {}}
          onHide={_this.handleToggleModal}
          show={_this.state.showModal}
        />
      </>
    )
  }

  async componentDidMount () {
    const { mnemonic } = _this.props.walletInfo
    const bchWallet = _this.props.bchWallet
    let tokens = []
    let { onEmptyTokensMsg } = _this.state

    if (mnemonic && bchWallet) {
      try {
        await bchWallet.walletInfoPromise
        tokens = await bchWallet.listTokens()
      } catch (error) {
        console.error(error)
        if (error.error.match('rate limits')) onEmptyTokensMsg = error.error
      }
    } else {
      onEmptyTokensMsg =
        'You need to create or import a wallet first, to view tokens'
    }

    _this.setState({
      tokens,
      inFetch: false,
      onEmptyTokensMsg
    })
  }

  showToken (selectedToken) {
    console.log('selectedToken', selectedToken)
    _this.setState({
      selectedToken
    })
    _this.handleToggleModal()
  }

  handleToggleModal () {
    _this.setState({
      showModal: !_this.state.showModal
    })
  }
}
Tokens.propTypes = {
  walletInfo: PropTypes.object.isRequired, // wallet info
  bchWallet: PropTypes.object // get minimal-slp-wallet instance
}
export default Tokens
