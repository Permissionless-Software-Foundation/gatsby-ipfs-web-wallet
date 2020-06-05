import React from "react"
import Image from "../image"

import { Content, Row, Col } from "adminlte-2-react"

class Example2 extends React.Component {
  state = {}

  render() {
    return (
      <Content
        title="IMG"
        subTitle="Getting started with adminlte-2-react"
        browserTitle="Hello World"
      >
        <Row>
          <Col xs={3}></Col>
          <Col xs={6}>
            <Image />
          </Col>
          <Col xs={3}></Col>
        </Row>
      </Content>
    )
  }
}

export default Example2
