import React from "react"

import { Row, Col, Box, Button, Inputs } from "adminlte-2-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
const { Text } = Inputs

let _this
class ImportWallet extends React.Component {
  constructor(props) {
    super(props)

    _this = this

    this.state = {
      mnemonic: "",
      privateKey: "",
    }
  }

  render() {
    return (
      <Row className="">
        <Col sm={2} />
        <Col sm={8}>
          <Box className="hover-shadow border-none mt-2">
            <Row>
              <Col sm={12} className="text-center">
                <h1>
                  <FontAwesomeIcon
                    className="title-icon"
                    size="xs"
                    icon={"file-import"}
                  />
                  <span>Import Wallet</span>
                </h1>
              </Col>
              <Col sm={12} className="text-center mt-2 mb-2">
                <Row className="flex justify-content-center">
                  <Col sm={8}>
                    <div>
                      <Text
                        id="import-mnemonic"
                        name="mnemonic"
                        placeholder="12 word mnemonic"
                        label="12 word mnemonic"
                        labelPosition="above"
                        maxlength={12}
                        onChange={_this.handleUpdate}
                      />
                      <Text
                        id="privateKey"
                        name="privateKey"
                        placeholder="Private Key"
                        label="Private Key"
                        labelPosition="above"
                        onChange={_this.handleUpdate}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col sm={12} className="text-center mt-2 mb-2">
                <Button text="Import" type="primary" className="btn-lg" />
              </Col>
            </Row>
          </Box>
        </Col>
        <Col sm={2} />
      </Row>
    )
  }
  componentDidMount(){
    // add max length property to mnemonic input
    document.getElementById("import-mnemonic").maxLength = "12";

  }
  handleUpdate(event) {
    let value = event.target.value
    if (event.target.name === "mnemonic") {
      value = value.toLowerCase()
    }
    _this.setState({
      [event.target.name]: value,
    })
    //console.log(_this.state)
  }
}

export default ImportWallet
