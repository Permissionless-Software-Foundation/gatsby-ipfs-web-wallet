import React from "react"
import PropTypes from "prop-types"
import { Content, Row, Col, Box, Inputs, Button } from "adminlte-2-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import BchWallet from "minimal-slp-wallet"

const { Text } = Inputs

let _this
class Configure extends React.Component {
  constructor(props) {
    super(props)

    _this = this

    this.state = {
      address: "",
      amountSat: "",
      errMsg: "",
      txId: "",
    }
    _this.BchWallet = BchWallet
  }

  render() {
    return (
      <Content>
        <Row>
          <Col sm={2} />
          <Col sm={8}>
            <Box className="hover-shadow border-none mt-2">
              <Row>
                <Col sm={12} className="text-center">
                  <h1>
                    <FontAwesomeIcon
                      className="title-icon"
                      size="xs"
                      icon={"paper-plane"}
                    />
                    <span>Send</span>
                  </h1>
                  <Box className="border-none">
                    <Text
                      id="addressToSend"
                      name="address"
                      placeholder="Enter bch address to send"
                      label="BCH Address"
                      labelPosition="above"
                      onChange={_this.handleUpdate}
                    />
                    <Text
                      id="amountToSend"
                      name="amountSat"
                      placeholder="Enter amount to send"
                      label="Amount"
                      labelPosition="above"
                      onChange={_this.handleUpdate}
                    />
                    <Button
                      text="Send"
                      type="primary"
                      className="btn-lg"
                      onClick={_this.send}
                    />
                  </Box>
                </Col>
                <Col sm={12} className="text-center">
                  {_this.state.errMsg && (
                    <p className="error-color">{_this.state.errMsg}</p>
                  )}
                  {_this.state.txId && (
                    <p className="">Transaction ID: {_this.state.txId}</p>
                  )}
                </Col>
              </Row>
            </Box>
          </Col>
          <Col sm={2} />
        </Row>
      </Content>
    )
  }
  componentDidMount() {}

  handleUpdate(event) {
    let value = event.target.value
    _this.setState({
      [event.target.name]: value,
    })
    //console.log(_this.state)
  }
  async send() {
    try {
      _this.validateInputs()

      const bchWalletLib = _this.props.bchWallet
      const { address, amountSat } = _this.state

      const receivers = [
        {
          address,
          // amount in satoshis, 1 satoshi = 0.00000001 Bitcoin
          amountSat: Math.floor(Number(amountSat) * 100000000),
        },
      ]
      // console.log("receivers", receivers)

      if (!bchWalletLib) {
        throw new Error("Wallet not found")
      }

      // Ensure the wallet UTXOs are up-to-date.
      const walletAddr = bchWalletLib.walletInfo.address
      bchWalletLib.utxos.bchUtxos = await bchWalletLib.utxos.initUtxoStore(walletAddr)

      // Send the BCH.
      const result = await bchWalletLib.send(receivers)
      // console.log('result',result)

      _this.setState({
        txId: result,
      })

      // update balance
      setTimeout(async () => {
        const myBalance = await bchWalletLib.getBalance()
        _this.props.updateBalance(myBalance)
      }, 1000)

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
          txId: "",
        }
      })
    }
  }

  // Reset form and component state
  resetValues() {
    _this.setState({
      address: "",
      amountSat: "",
      errMsg: "",
    })
    const amountEle = document.getElementById("amountToSend")
    amountEle.value = ""

    const addressEle = document.getElementById("addressToSend")
    addressEle.value = ""
  }
  validateInputs() {
    try {
      const { address, amountSat } = _this.state
      const amountNumber = Number(amountSat)
      console.log(_this.state)
      if (!address) {
        throw new Error("Address is required")
      }
      if (!amountSat) {
        throw new Error("Amount is required")
      }

      if (!amountNumber) {
        throw new Error("Amount must be a number")
      }
      if (amountNumber < 0) {
        throw new Error("Amount must be greater than zero")
      }
    } catch (error) {
      throw error
    }
  }
}
Configure.propTypes = {
  updateBalance: PropTypes.func.isRequired,
  bchWallet: PropTypes.object,
}

export default Configure
