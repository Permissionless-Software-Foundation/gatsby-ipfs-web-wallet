import React from "react"

import { Content, Row, Col, Box } from "adminlte-2-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class Audit extends React.Component {
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
                      icon={"cog"}
                    />
                    <span>Configure</span>
                  </h1>
                  <Box className="border-none">
                    <h3>
                      <FontAwesomeIcon
                        className="title-icon"
                        size="xs"
                        icon={"exclamation-triangle"}
                      />
                      Be Careful
                    </h3>
                    <p>
                      Backup your wallet first. Updating the configuration will
                      restart the app.
                    </p>
                  </Box>
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

export default Audit
