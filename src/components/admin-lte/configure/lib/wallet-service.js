/*
This library interacts with the ipfs-bch-wallet-service via the JSON RPC
over IPFS.
*/

const { v4: uid } = require('uuid')
const jsonrpc = require('jsonrpc-lite')

// Public npm libraries.
const axios = require('axios')
// const Conf = require('conf')

class WalletService {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.axios = axios
    // this.conf = new Conf()
    // this.ipfsControl = localConfig.ipfsControl
    this.uid = uid
    this.jsonrpc = jsonrpc
    this.ipfsControl = localConfig.ipfsControl
    // A queue for holding RPC data that has arrived.
    this.rpcDataQueue = []
  }

  // This handler is triggered when RPC data comes in over IPFS.
  // Handle RPC input, and match the input to the RPC queue.

  // NOTE: This function is currently not called or controlled

  rpcHandler (data) {
    try {
      // Convert string input into an object.
      const jsonData = JSON.parse(data)

      // console.log(
      //   'rest-api.js/rpcHandler() data: ',
      //   JSON.stringify(jsonData, null, 2),
      // )
      console.log(`JSON RPC response for ID ${jsonData.id} received.`)

      this.rpcDataQueue.push(jsonData)
    } catch (err) {
      console.error('Error in rest-api.js/rpcHandler(): ', err)
      // Do not throw error. This is a top-level function.
    }
  }

  checkServiceId () {
    try {
      // this.conf = new Conf()

      const serviceId = this.ipfsControl.selectedServiceProvider
      console.log(`serviceId : ${serviceId}`)
      if (!serviceId) {
        throw new Error('Wallet service ID does not exist')
      }

      return serviceId
    } catch (error) {
      console.error('Error in checkServiceId()')
      throw error
    }
  }

  // Get up to 20 addresses.
  async getBalances (addrs) {
    try {
      // Input validation.
      if (!addrs || !Array.isArray(addrs)) {
        throw new Error(
          'addrs input to getBalance() must be an array, of up to 20 addresses.'
        )
      }

      const serviceId = this.checkServiceId()
      // console.log(`serviceId: ${serviceId}`)

      const rpcId = this.uid()
      const rpcData = {
        endpoint: 'balance',
        addresses: addrs
      }
      // Generate a JSON RPC command.
      const cmd = this.jsonrpc.request(rpcId, 'bch', rpcData)
      const cmdStr = JSON.stringify(cmd)
      const thisNode = this.ipfsControl.ipfsCoord.thisNode

      await this.ipfsControl.ipfsCoord.useCases.peer.sendPrivateMessage(
        serviceId,
        cmdStr,
        thisNode
      )

      const data = await this.waitForRPCResponse(rpcId)

      return data
    } catch (err) {
      console.error('Error in getBalance()')
      throw err
    }
  }

  // Get hydrated UTXOs for an address
  async getUtxos (addr) {
    try {
      // Input validation
      if (!addr || typeof addr !== 'string') {
        throw new Error('getUtxos() input address must be a string.')
      }

      const serviceId = this.checkServiceId()
      // console.log(`serviceId: ${serviceId}`)

      const rpcId = this.uid()
      const rpcData = {
        endpoint: 'utxos',
        address: addr
      }
      // Generate a JSON RPC command.
      const cmd = this.jsonrpc.request(rpcId, 'bch', rpcData)
      const cmdStr = JSON.stringify(cmd)
      const thisNode = this.ipfsControl.ipfsCoord.thisNode
      console.log('cmdStr', cmdStr)
      await this.ipfsControl.ipfsCoord.useCases.peer.sendPrivateMessage(
        serviceId,
        cmdStr,
        thisNode
      )
      // Wait for data to come back from the wallet service.
      const data = await this.waitForRPCResponse(rpcId)
      return data
    } catch (err) {
      console.error('Error in getUtxos()', err)
      throw err
    }
  }

  // Broadcast a transaction to the network.
  async sendTx (hex) {
    try {
      // Input validation
      if (!hex || typeof hex !== 'string') {
        throw new Error('sendTx() input hex must be a string.')
      }

      const serviceId = this.checkServiceId()
      // console.log(`serviceId: ${serviceId}`)
      const rpcId = this.uid()
      const rpcData = {
        endpoint: 'broadcast',
        hex
      }
      // Generate a JSON RPC command.
      const cmd = this.jsonrpc.request(rpcId, 'bch', rpcData)
      const cmdStr = JSON.stringify(cmd)
      const thisNode = this.ipfsControl.ipfsCoord.thisNode

      await this.ipfsControl.ipfsCoord.useCases.peer.sendPrivateMessage(
        serviceId,
        cmdStr,
        thisNode
      )
      const data = await this.waitForRPCResponse(rpcId)

      return data
    } catch (err) {
      console.error('Error in sendTx()')
      throw err
    }
  }

  // Returns a promise that resolves to data when the RPC response is recieved.
  async waitForRPCResponse (rpcId) {
    try {
      // Initialize variables for tracking the return data.
      let dataFound = false
      let cnt = 0
      let data = {
        success: false,
        message: 'request timed out',
        data: ''
      }

      // Loop that waits for a response from the service provider.
      do {
        for (let i = 0; i < this.rpcDataQueue.length; i++) {
          const rawData = this.rpcDataQueue[i]
          // console.log(`rawData: ${JSON.stringify(rawData, null, 2)}`)

          if (rawData.id === rpcId) {
            dataFound = true
            // console.log('data was found in the queue')

            data = rawData.result.value

            // Remove the data from the queue
            this.rpcDataQueue.splice(i, 1)

            break
          }
        }

        // Wait between loops.
        // await this.sleep(1000)
        await this.ipfsControl.wallet.bchjs.Util.sleep(13000)

        cnt++

        // Exit if data was returned, or the window for a response expires.
      } while (!dataFound && cnt < 10)
      // console.log(`dataFound: ${dataFound}, cnt: ${cnt}`)
      console.log('waitForRPCResponse', data)
      return data
    } catch (err) {
      console.error('Error in waitForRPCResponse()')
      throw err
    }
  }
}

module.exports = WalletService
