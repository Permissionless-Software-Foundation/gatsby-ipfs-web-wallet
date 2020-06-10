import React from "react"

import { Content, Row, Col, Box } from "adminlte-2-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class Icons extends React.Component {
  state = {}

  render() {
    return (
      <Content>
        <Row>
          <Col sm={3} />
          <Col sm={6}>
            <Box className="hover-shadow border-none mt-2">
              <Row>
                <Col sm={12} className="text-center">
                  <h1>
                    <FontAwesomeIcon
                      className="title-icon"
                      size="xs"
                      icon={"plus"}
                    />
                    <span>Upload your token icon</span>
                  </h1>
                </Col>
                <Col sm={12} className="text-center mt-2 mb-2">
                  <p>
                    You currently have 0 BCH. Go to the Portfolio page and
                    Create a Wallet. Then deposit some BCH to use the SLP Icons
                    tool. Get free BCH from the Bitcoin.com Faucet!
                  </p>
                </Col>
              </Row>
            </Box>
          </Col>
          <Col sm={3} />
        </Row>
      </Content>
    )
  }
}

export default Icons
