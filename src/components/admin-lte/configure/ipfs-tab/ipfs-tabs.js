import React from 'react'

import { Row, Col, Inputs } from 'adminlte-2-react'
import { Tabs, Tab } from 'react-bootstrap'
import PropTypes from 'prop-types'
import CommandRouter from '../lib/commands'

import 'adminlte-2-react/src/adminlte/css/AdminLTE.css'
const { Text } = Inputs

let _this
class IPFSTabs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      commandOutput: "Enter 'help' to see available commands."
    }
    _this = this
    // Starts ipfs control if there is a wallet registered already
    // console.log('props', props)

    if (props && props.ipfsControl) {
      this.ipfsControl = props.ipfsControl
      this.commandRouter = new CommandRouter({ ipfsControl: this.ipfsControl })
      // console.log('this.commandRouter: ', this.commandRouter)
    }
  }

  render () {
    const { commandOutput } = _this.state
    const { statusOutput, appStatusOutput } = _this.props

    return (
      <Row>
        <Col md={12}>
          <Tabs
            defaultActiveKey='status'
            id='ipfs-coord-tabs'
            className='mb-3 nav-tabs-custom'
          >
            <Tab eventKey='status' title='Status'>
              <Text
                id='statusLog'
                name='statusLog'
                inputType='textarea'
                labelPosition='none'
                rows={20}
                readOnly
                value={appStatusOutput}
                onChange={() => {
                  // Prevents DOM error
                }}
              />
            </Tab>
            <Tab eventKey='ipfs-coord' title='IPFS Coord'>
              <Text
                id='ipfsCoordLog'
                name='ipfsCoordLog'
                inputType='textarea'
                labelPosition='none'
                rows={20}
                readOnly
                value={statusOutput}
                onChange={() => {
                  // Prevents DOM error
                }}
              />
            </Tab>
            <Tab eventKey='command' title='Command'>
              <Text
                id='commandLog'
                name='commandLog'
                inputType='textarea'
                labelPosition='none'
                rows={20}
                readOnly
                value={`${commandOutput ? `${commandOutput}>` : '>'}`}
                onChange={() => {
                  // Prevents DOM error
                }}
              />
              <Text
                id='commandInput'
                name='commandInput'
                inputType='tex'
                labelPosition='none'
                value={this.state.commandInput}
                onChange={this.handleTextInput}
                onKeyDown={_this.handleCommandKeyDown}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    )
  }

  // Handles text typed into the input box.
  handleTextInput (event) {
    event.preventDefault()

    const target = event.target
    const value = target.value
    const name = target.name
    // console.log('value: ', value)

    _this.setState({
      [name]: value
    })
  }

  componentDidUpdate () {
    if (_this.state.commandOutput !== _this.props.commandOutput) {
      _this.setState({
        commandOutput: _this.props.commandOutput
      })
    }
  }

  /* START command handling functions */
  // Handles when the Enter key is pressed while in the chat input box.
  async handleCommandKeyDown (e) {
    if (e.key === 'Enter') {
      // _this.submitMsg()
      // console.log("Enter key");

      // Send a chat message to the chat pubsub room.
      // const now = new Date();
      // const msg = `Message from BROWSER at ${now.toLocaleString()}`
      const msg = _this.state.commandInput
      // console.log(`Sending this message: ${msg}`);

      // _this.handleCommandLog(`me: ${msg}`);

      // console.log('_this.commandRouter: ', _this.commandRouter)
      const outMsg = await _this.commandRouter.route(msg, _this.ipfsControl)

      if (outMsg === 'clear') {
        _this.props.handleCommandLog('')
      } else {
        _this.handleCommandLog(`\n${outMsg}`)
      }

      // Clear the input text box.
      _this.setState({
        commandInput: ''
      })
    }
  }

  // Adds a line to the terminal
  async handleCommandLog (msg) {
    try {
      // console.log("msg: ", msg);

      _this.props.handleCommandLog(msg)
      // Add a slight delay, to give the browser time to render the DOM.
      await this.sleep(250)

      // _this.keepScrolled();
      // _this.keepCommandScrolled()
    } catch (error) {
      console.warn(error)
    }
  }

  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

IPFSTabs.propTypes = {}

IPFSTabs.propTypes = {
  handleCommandLog: PropTypes.func,
  commandOutput: PropTypes.string,
  statusOutput: PropTypes.string,
  appStatusOutput: PropTypes.string
}
export default IPFSTabs
