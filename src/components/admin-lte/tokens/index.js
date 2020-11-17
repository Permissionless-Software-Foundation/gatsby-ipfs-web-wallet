import React from 'react'
import PropTypes from 'prop-types'
import { Content, Row, Col, Box, Button } from 'adminlte-2-react'
import TokenCard from './token-card'
import TokenModal from './token-modal'
import Spinner from '../../../images/loader.gif'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SendTokens from './send-tokens'

let _this
class Tokens extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      tokens: [],
      selectedTokenToView: '',
      showModal: false,
      inFetch: true,
      errMsg: '',
      selectedTokenToSend: '',
      showForm: false,
      txId: null
    }
  }

  render () {
    // const { JWT } = _this.props.walletInfo

    return (
      <>
        <Button
          text='Refresh'
          icon='fa-redo'
          type='primary'
          className='btn-md ml-1 mt-1 mb-1'
          onClick={() => _this.handleGetTokens(true)}
        />
        {_this.state.txId &&
          <div className='txIdContainer'>
            <button
              onClick={() => _this.setState({ txId: null })}
            >
              &times;
            </button>
            <Col xs={12} className='text-center mt-1'>
              <Box
                title='Transaction ID'
                type='primary'
                className='p-0'
              >
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href={`https://explorer.bitcoin.com/bch/tx/${_this.state.txId}`}
                >
                  {_this.state.txId}
                </a>
              </Box>
            </Col>
          </div>}
        {_this.state.showForm && (
          <SendTokens
            bchWallet={_this.props.bchWallet}
            walletInfo={_this.props.walletInfo}
            handleBack={_this.onHandleForm}
            selectedToken={
              _this.state.selectedTokenToSend
                ? _this.state.selectedTokenToSend
                : {}
            }
            handleSend={() => _this.onHandleGetTokens(true)}
            setTxId={_this.setTxId}
          />
        )}
        {_this.state.inFetch ? (
          <div className='spinner'>
            <img alt='Loading...' src={Spinner} width={100} />
          </div>
        ) : (
          <Content>
            {_this.state.errMsg && (
              <Box padding='true' className='container-nofound'>
                <Row>
                  <Col xs={12}>
                    <em>{_this.state.errMsg}</em>
                  </Col>
                </Row>
              </Box>
            )}

            {_this.state.tokens.length > 0 && (
              <>
                <Row>
                  {_this.state.tokens.map((val, i) => {
                    return (
                      <Col sm={4} key={`token-${i}`}>
                        <TokenCard
                          key={`token-${i}`}
                          id={`token-${i}`}
                          token={val}
                          showToken={_this.showToken}
                          selectToken={_this.selectToken}
                        />
                      </Col>
                    )
                  })}
                </Row>
              </>
            )}
          </Content>
        )}
        <TokenModal
          token={
            _this.state.selectedTokenToView
              ? _this.state.selectedTokenToView
              : {}
          }
          handleOnHide={_this.onHandleToggleModal}
          show={_this.state.showModal}
        />
      </>
    )
  }

  setTxId (txId = null) {
    _this.setState({
      txId: txId
    })
  }

  onHandleForm () {
    _this.setState({
      showForm: !_this.state.showForm
    })
  }

  async handleGetTokens (refresh = null) {
    _this.setState({
      inFetch: true
    })
    const { mnemonic } = _this.props.walletInfo
    const bchWallet = _this.props.bchWallet
    let tokens = []

    try {
      if (!mnemonic || !bchWallet) {
        throw new Error(
          'You need to create or import a wallet first, to view tokens'
        )
      }

      await bchWallet.walletInfoPromise

      if (_this.props.tokensInfo.length > 0 && refresh === null) {
        tokens = _this.props.tokensInfo
      } else {
        tokens = await bchWallet.listTokens()
      }

      _this.setState({
        tokens,
        inFetch: false
      })

      if (!tokens.length) {
        throw new Error('No tokens found on this wallet.')
      }

      _this.props.setTokensInfo(tokens)
    } catch (error) {
      _this.handleError(error)
    }
  }

  // Wrapper for handleGetTokens()
  async onHandleGetTokens (refresh = null) {
    return _this.handleGetTokens(refresh)
  }

  async componentDidMount () {
    await _this.handleGetTokens()
  }

  showToken (selectedTokenToView) {
    _this.setState({
      selectedTokenToView
    })
    _this.onHandleToggleModal()
  }

  selectToken (selectedTokenToSend) {
    _this.setState({
      selectedTokenToSend
    })
    !_this.state.showForm && _this.onHandleForm()

    const ele = document.getElementById('___gatsby')
    ele.scrollIntoView({ behavior: 'smooth' })
  }

  onHandleToggleModal () {
    _this.setState({
      showModal: !_this.state.showModal
    })
  }

  handleError (error) {
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
        errMsg: errMsg,
        txId: null,
        inFetch: false
      }
    })
  }
}
Tokens.propTypes = {
  walletInfo: PropTypes.object.isRequired, // wallet info
  bchWallet: PropTypes.object, // get minimal-slp-wallet instance
  setTokensInfo: PropTypes.func.isRequired, // set tokens info
  tokensInfo: PropTypes.array // tokens info
}
export default Tokens
