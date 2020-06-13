import React from "react"

import { Row, Col, Box, Button } from "adminlte-2-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
class NewWallet extends React.Component {
  state = {}

  render() {
    return (
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
                />
              </Col>
            </Row>
          </Box>
        </Col>
        <Col sm={2} />
      </Row>
    )
  }
}

export default NewWallet
