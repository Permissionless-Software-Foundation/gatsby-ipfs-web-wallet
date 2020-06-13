import React, { Component } from "react"
import PropTypes from "prop-types"
import { Content, Button } from "adminlte-2-react"
import QScanner from "./qr-scanner"
let _this
class ScannerModal extends Component {
  constructor(props) {
    super(props)
    _this = this
    this.state = {
      show: true,
    }
  }

  modalFooter = (
    <React.Fragment>
      <Button text="Close" pullLeft onClick={this.onHide} />
    </React.Fragment>
  )

  render() {
    return (
      <Content
        title="Qr Scanner"
        modal
        modalFooter={this.modalFooter}
        show={_this.state.show}
        modalCloseButton={true}
        onHide={_this.onHide}
      >
        <QScanner></QScanner>
      </Content>
    )
  }

  UNSAFE_componentWillUpdate() {
    if (_this.props.show && _this.props.show !== _this.state.show) {
      _this.setState({
        show: _this.props.show,
      })
    }
  }
  onHide() {
    if (_this.props.onHide) {
      _this.props.onHide()
    } else {
      _this.setState({
        show: false,
      })
      // redirect
      // deleting focus from qr scanner menu
      const pageElement = document.querySelectorAll("a[href^='/']")
      if (pageElement.length) {
        pageElement[0].click()
      }
    }
  }
}
ScannerModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
}
export default ScannerModal
