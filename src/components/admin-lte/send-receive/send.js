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
                      placeholder="Enter amount to send ( satoshis )"
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
      const bchWalletLib = _this.props.bchWallet
      const { address ,amountSat} = _this.state
      const receivers = [
        {
            address,
            // amount in satoshis, 1 satoshi = 0.00000001 Bitcoin
            amountSat :Number(amountSat)
        }
    ];
      // Update instance with JWT
       if (!bchWalletLib) {
         throw new Error("Wallet not found")
       }


      await bchWalletLib.walletInfoPromise

      console.log('receivers',receivers)

      const result = await bchWalletLib.send(receivers)
      console.log("result", result) 

    } catch (error) {
      console.warn(error)
      _this.setState({
        errMsg: error.message,
      })
    }
  }

  // Reset form and component state
  resetValues() {
    _this.setState({
      address: "",
      errMsg: "",
    })
  }
}
Configure.propTypes = {
  updateBalance: PropTypes.func.isRequired,
  bchWallet: PropTypes.object,
}

export default Configure
