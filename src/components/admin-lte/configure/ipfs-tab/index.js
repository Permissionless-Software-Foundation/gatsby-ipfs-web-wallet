import React from 'react'

import { Content, Row, Col, Inputs, Box } from 'adminlte-2-react'
import IpfsControl from '../lib/ipfs-control'
import IPFSTabs from './ipfs-tabs'
import CommandRouter from '../lib/commands'

import './ipfs.css'

// import RetryQueue from '../../../../lib/retry-queue.mjs'
// const queue = new RetryQueue()

const WalletService = require('../lib/wallet-service')
const BchWallet = typeof window !== 'undefined' ? window.SlpWallet : null

const { Checkbox } = Inputs

let _this
class IPFS extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isStarted: false,
      ipfsConnection: false,
      appStatusOutput: '',
      statusOutput: '',
      commandOutput: "Enter 'help' to see available commands.",
      commandInput: '',
      peers: [],
      chatOutputs: {
        All: {
          output: '',
          nickname: ''
        }
      }
    }
    _this = this
    _this.BchWallet = BchWallet
    _this.WalletService = WalletService

    this.initIPFSControl()
  }

  render () {
    const { ipfsConnection } = _this.state
    return (
      <Content>
        <Row>
          <Col sm={12}>
            <Box className='text-center ipfs-checkbox-container'>
              <Checkbox
                id='ipfs-checkbox'
                className='ipfs-checkbox'
                value={ipfsConnection} // mark as checked
                text='Connect to wallet services over IPFS'
                labelPosition='none'
                labelXs={0}
                name='ipfsConnection'
                onChange={this.handleIpfs}
              />
            </Box>
          </Col>
        </Row>
        {ipfsConnection && (
          <IPFSTabs
            ipfsControl={_this.ipfsControl}
            handleCommandLog={_this.onCommandLog}
            commandOutput={_this.state.commandOutput}
            statusOutput={_this.state.statusOutput}
            appStatusOutput={_this.state.appStatusOutput}
          />
        )}
      </Content>
    )
  }

  async handleIpfs () {
    const connect = !_this.state.ipfsConnection
    const { isStarted } = _this.state
    _this.setState(prevState => ({
      ipfsConnection: connect
    }))

    // Save checkbox state into localstorage
    const { walletInfo } = _this.props
    walletInfo.ipfsService = connect

    _this.props.setWalletInfo(walletInfo)

    if (!isStarted && connect) {
      try {
        await _this.ipfsControl.startIpfs()
        const nodeInfo = _this.ipfsControl.getNodeInfo()
        console.log('nodeInfo', nodeInfo)
        _this.setState({
          isStarted: true
        })
      } catch (error) {
        console.warn(error.message)
      }
    }
  }

  async componentDidMount () {
    await _this.getLastIpfsCoordInstance()
  }

  async componentWillUnmount () {
    try {
      const data = {
        ipfsInfo: {
          ipfsIsStarted: true,
          savedState: _this.state,
          ipfsControl: _this.ipfsControl
        }
      }
      // Save the current state
      _this.props.setMenuNavigation({ data })
    } catch (error) {
      console.warn(error)
    }
  }

  async getLastIpfsCoordInstance () {
    try {
      const { menuNavigation, walletInfo } = _this.props
      const data = menuNavigation.data
      // console.log('menuNavigation', menuNavigation)
      // console.log('walletInfo', walletInfo)
      // console.log('data', data)

      // Get local info and
      // Verify if checkbox has been marked
      // Return for unmarked checkbox
      if (!walletInfo.ipfsService) return

      _this.setState(prevState => ({
        ipfsConnection: true
      }))

      // Don't start ipfs if it has started already
      if (!data || !data.ipfsInfo.ipfsIsStarted) {
        await this.ipfsControl.startIpfs()
        _this.setState({
          isStarted: true
        })
      }

      // Loads the previous information and states
      if (data && data.ipfsInfo) {
        const { savedState } = data.ipfsInfo
        _this.setState(savedState)
      }
    } catch (error) {
      console.warn(error)
    }
  }

  initIPFSControl (bchWallet) {
    try {
      const ipfsConfig = {
        statusLog: _this.onStatusLog,
        // handleChatLog: _this.onCommandLog
        handleChatLog: _this.incommingChat,
        bchWallet: bchWallet || _this.props.bchWallet, // bch wallet instance
        privateLog: _this.privLogChat,
        pollLog: _this.onAppStatus
      }
      // Retrieve last ipfs control
      const { menuNavigation } = _this.props
      if (
        menuNavigation &&
        menuNavigation.data &&
        menuNavigation.data.ipfsInfo.ipfsControl
      ) {
        this.ipfsControl = menuNavigation.data.ipfsInfo.ipfsControl
      } else {
        // Instantiate a new ipfs control
        this.ipfsControl = new IpfsControl(ipfsConfig)
      }
      this.commandRouter = new CommandRouter({ ipfsControl: this.ipfsControl })
    } catch (err) {
      console.error(err)
    }
  }

  // Adds a line to the Status terminal
  onStatusLog (str) {
    console.log('onStatusLog', str)
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

  // Handle decrypted, private messages and send them to the right terminal.
  privLogChat (str, from) {
    try {
      console.log(`privLogChat str: ${str}`)
      // console.log(`privLogChat from: ${from}`)
      _this.handleRpcDataQueue(str)

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

  // This function is triggered when a new peer is detected.
  handleNewPeer (ipfsId) {
    try {
      console.log(`New IPFS peer discovered. ID: ${ipfsId}`)

      // Use the peer IPFS ID to identify the peers state.
      const { peers, chatOutputs } = _this.state

      // Add the new peer to the peers array.
      peers.push(ipfsId)

      // Add a chatOutput entry for the new peer.
      const obj = {
        output: '',
        nickname: ''
      }
      // chatOutputs[shortIpfsId] = obj
      chatOutputs[ipfsId] = obj

      _this.setState({
        peers,
        chatOutputs
      })
    } catch (err) {
      console.warn('Error in handleNewPeer(): ', err)
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

  // pollForServices callback
  async onAppStatus (msg) {
    try {
      let output
      if (!msg) {
        output = ''
      } else {
        output = _this.state.appStatusOutput + '   ' + msg + '\n'
      }
      _this.setState({
        appStatusOutput: output
      })

      // Updates the bchWallet instance so it works
      // under the ipfs services
      await _this.reInitialize()
    } catch (error) {
      console.warn(error)
      // Don't throw an error as this is a top-level handler.
    }
  }

  // Updates the bchWallet instance so it works
  // under the ipfs services
  async reInitialize () {
    try {
      _this.onStatusLog('waiting for re-initialize...')

      const currentWallet = _this.props.walletInfo
      const { mnemonic } = currentWallet

      const walletService = new _this.WalletService({
        ipfsControl: this.ipfsControl
      })
      const advancedConfig = {
        interface: 'json-rpc',
        jsonRpcWalletService: walletService
      }

      _this.bchWalletLib = new _this.BchWallet(mnemonic, advancedConfig)

      let utxosInitialized = false
      let cnt = 0
      do {
        cnt++

        try {
          // Wait for wallet to be created.
          await _this.bchWalletLib.walletInfoPromise

          // await _this.bchWalletLib.bchjs.Util.sleep(5000)
          await _this.sleep(5000)

          const utxos = await _this.bchWalletLib.getUtxos()
          if (_this.bchWalletLib.utxos.utxoStore) {
            _this.onStatusLog(
              `utxo initialization succeeded: ${JSON.stringify(utxos, null, 2)}`
            )
            utxosInitialized = true
          } else {
            _this.onStatusLog(
              `Attempt ${cnt} to re-initialize timed out. Will try again.`
            )
          }
        } catch (err) {
          _this.onStatusLog(
            `Attempt ${cnt} to re-initialize wallet failed. Will try again.`
          )
          console.log(err)

          await _this.sleep(5000)
        }
        // } while (!utxosInitialized)
      } while (!utxosInitialized && cnt < 10)

      // console.log('_this.bchWalletLib: ', _this.bchWalletLib)
      //
      // setInterval(async function () {
      //   const now = new Date()
      //   console.log(`Getting UTXOs at ${now.toLocaleString()}`)
      //   await _this.bchWalletLib.getUtxos()
      //   console.log(
      //     `_this.bchWalletLib.utxos.utxoStore: ${JSON.stringify(
      //       _this.bchWalletLib.utxos.utxoStore,
      //       null,
      //       2
      //     )}`
      //   )
      // }, 20000)

      // let now = new Date()
      // console.log(`Starting at ${now.toLocaleString()}`)
      // await _this.bchWalletLib.bchjs.Util.sleep(5000)
      // now = new Date()
      // console.log(`Finished at ${now.toLocaleString()}`)

      // // If UTXOs fail to update, try one more time.
      // if (!_this.bchWalletLib.utxos.utxoStore) {
      //   await _this.bchWalletLib.getUtxos()
      //
      //   // Throw an error if UTXOs are still not updated.
      //   if (!_this.bchWalletLib.utxos.utxoStore) {
      //     throw new Error('UTXOs failed to update. Try again.')
      //   }
      // }

      // Update redux state
      _this.props.setBchWallet(_this.bchWalletLib)
      _this.onStatusLog('re-initialize success!')
    } catch (error) {
      _this.onStatusLog('Error on re-initialize')
      _this.onStatusLog(error.message)
      // Don't throw an error as this is a top-level handler.
    }
  }

  // Fill the queue with the incoming data (private messages) from the petitions
  // So it will be sweeped by the lib/wallet-service/waitForRPCResponse() function
  handleRpcDataQueue (data) {
    try {
      _this.bchWalletLib.ar.jsonRpcWalletService.rpcHandler(data)
    } catch (error) {
      console.warn('Error in handleRpcDataQueue', error)
      // Don't throw an error as this is a top-level handler.
    }
  }

  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

IPFS.propTypes = {}

export default IPFS
