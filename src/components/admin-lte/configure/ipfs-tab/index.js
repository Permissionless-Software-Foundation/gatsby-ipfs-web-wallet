import React from 'react'

import { Content, Row, Col, Inputs, Box } from 'adminlte-2-react'

import IPFSTabs from './ipfs-tabs'

import IpfsControl from '../lib/ipfs-control'

// const BchWallet = typeof window !== 'undefined' ? window.SlpWallet : null

const { Checkbox } = Inputs

let _this
class IPFS extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ipfsConnection: false
    }
    _this = this
  }

  render () {
    const { ipfsConnection } = _this.state
    return (
      <Content>
        <Row>
          <Col sm={2} />
          <Col sm={8}>
            <Box className='text-center'>
              <Checkbox
                value={ipfsConnection} // mark as checked
                text='Connect to wallet services over IPFS'
                labelPosition='none'
                labelXs={0}
                name='ipfsConnection'
                onChange={this.handleIpfs}
              />
            </Box>
          </Col>
          <Col sm={2} />
        </Row>
        {ipfsConnection && <IPFSTabs />}
      </Content>
    )
  }

  handleIpfs () {
    _this.setState(prevState => ({
      ipfsConnection: !_this.state.ipfsConnection
    }))
  }

  initIPFSControl (bchWallet) {
    try {
      const ipfsConfig = {
        statusLog: _this.onStatusLog,
        // handleChatLog: _this.onCommandLog
        handleChatLog: _this.incommingChat,
        bchWallet: bchWallet || _this.props.bchWallet, // bch wallet instance
        privateLog: _this.privLogChat
      }
      // Retrieve last ipfs control
      const { data } = _this.props.menuNavigation
      if (data && data.chatInfo.ipfsControl) {
        this.ipfsControl = data.chatInfo.ipfsControl
      } else {
        // Instantiate a new ipfs control
        this.ipfsControl = new IpfsControl(ipfsConfig)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Adds a line to the Command terminal
  onCommandLog (msg) {
    try {
      let commandOutput
      if (!msg) {
        commandOutput = ''
      } else {
        commandOutput = _this.state.commandOutput + '   ' + msg + '\n'
      }
      _this.setState({
        commandOutput
      })
    } catch (error) {
      console.warn(error)
    }
  }

  // Adds a line to the Status terminal
  onStatusLog (str) {
    try {
      // Update the Status terminal
      _this.setState({
        statusOutput: _this.state.statusOutput + '   ' + str + '\n'
      })

      // If a new peer is found, trigger handleNewPeer()
      if (str.includes('New peer found:')) {
        const ipfsId = str.substring(24)
        _this.handleNewPeer(ipfsId)
      }
    } catch (error) {
      console.warn(error)
    }
  }

  // Handle decrypted, private messages and send them to the right terminal.
  privLogChat (str, from) {
    try {
      // console.log(`privLogChat str: ${str}`)
      // console.log(`privLogChat from: ${from}`)

      const { chatOutputs } = _this.state

      const terminalOut = `peer: ${str}`

      // Asigns the output to the corresponding peer
      chatOutputs[from].output = chatOutputs[from].output + terminalOut + '\n'

      _this.setState({
        chatOutputs
      })
    } catch (err) {
      console.warn('Error in privLogChat():', err)
    }
  }

  // Handle chat messages coming in from the IPFS network.
  incommingChat (str) {
    try {
      const { chatOutputs, connectedPeer } = _this.state
      // console.log(`connectedPeer: ${JSON.stringify(connectedPeer, null, 2)}`)
      // console.log(`incommingChat str: ${JSON.stringify(str, null, 2)}`)

      const msg = str.data.data.message
      const handle = str.data.data.handle
      const terminalOut = `${handle}: ${msg}`

      if (str.data && str.data.apiName && str.data.apiName.includes('chat')) {
        // If the message is marked as 'chat' data, then post it to the public
        // chat terminal.
        chatOutputs.All.output = chatOutputs.All.output + terminalOut + '\n'
      } else {
        // Asigns the output to the corresponding peer
        chatOutputs[connectedPeer].output =
          chatOutputs[connectedPeer].output + terminalOut + '\n'
      }

      _this.setState({
        chatOutputs
      })
    } catch (err) {
      console.warn(err)
      // Don't throw an error as this is a top-level handler.
    }
  }
}

IPFS.propTypes = {}

export default IPFS
