import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Content, Button } from 'adminlte-2-react'
import QScanner from './qr-scanner'
let _this
class ScannerModal extends Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {}

    this.modalFooter = (
      <>
        <Button text='Close' pullLeft onClick={this.props.handleOnHide} />
      </>
    )
  }

  render () {
    return (
      <Content
        title='Qr Scanner'
        modal
        modalFooter={this.modalFooter}
        show={_this.props.show}
        modalCloseButton
        onHide={_this.props.handleOnHide}
      >
        <QScanner onError={_this.props.handleOnError} onScan={_this.props.handleOnScan} />
      </Content>
    )
  }
}

ScannerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleOnHide: PropTypes.func.isRequired,
  handleOnError: PropTypes.func,
  handleOnScan: PropTypes.func
}

export default ScannerModal
