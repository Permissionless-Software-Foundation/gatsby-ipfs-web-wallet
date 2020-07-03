import React, { Component } from "react"
import PropTypes from "prop-types"
import { Content, Button } from "adminlte-2-react"
import QScanner from "./qr-scanner"
let _this
class ScannerModal extends Component {
  constructor(props) {
    super(props)
    _this = this
    this.state = {}
  }

  modalFooter = (
    <React.Fragment>
      <Button text="Close" pullLeft onClick={this.props.onHide} />
    </React.Fragment>
  )

  render() {
    return (
      <Content
        title="Qr Scanner"
        modal
        modalFooter={this.modalFooter}
        show={_this.props.show}
        modalCloseButton={true}
        onHide={_this.props.onHide}
      >
        <QScanner onError={_this.props.onError} onScan={_this.props.onScan} />
      </Content>
    )
  }
}
ScannerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onScan: PropTypes.func,
}
export default ScannerModal
