import React from "react"
import PropTypes from "prop-types"
import { Row, Col, Box, Button } from "adminlte-2-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import BchWallet from "minimal-slp-wallet"

let _this
class NewWallet extends React.Component {
  constructor(props) {
    super(props)
    _this = this
    this.state = {}

    _this.BchWallet = BchWallet
  }

  render() {
    return (
      <>
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
                      icon={"plus"}
                    />
                    <span>New Wallet</span>
                  </h1>
                </Col>
                <Col sm={12} className="text-center mt-2 mb-2">
                  <Button
                    text="Create Wallet"
                    type="primary"
                    className="btn-lg"
                    onClick={_this.createWallet}
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
  async createWallet() {
    try {
      const bchWalletLib = new _this.BchWallet()
      await bchWalletLib.walletInfoPromise // Wait for wallet to be created.
      console.log(
        `bchWalletLib.walletInfo: ${JSON.stringify(
          bchWalletLib.walletInfo,
          null,
          2
        )}`
      )

      const walletInfo = bchWalletLib.walletInfo
      walletInfo.from = "created"

      const myBalance = await bchWalletLib.getBalance()

      // Update redux state
      _this.props.setWallet(walletInfo)
      _this.props.updateBalance(myBalance)
    } catch (error) {
      console.error(error)
    }
  }
}
NewWallet.propTypes = {
  setWallet: PropTypes.func.isRequired,
  updateBalance: PropTypes.func.isRequired,
}
export default NewWallet
