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

      const result = await this.ipfsControl.ipfsCoord.useCases.peer.sendPrivateMessage(
        serviceId,
        cmdStr,
        thisNode
      )
      /// ///
      /*       const result = await this.axios.post(LOCAL_REST_API, {
        sendTo: serviceId,
        rpcData: {
          endpoint: 'balance',
          addresses: addrs
        }
      }) */
      // console.log(`result.data: ${JSON.stringify(result.data, null, 2)}`)

      // If there is a timeout or other network failure.

      return result
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
      const result = await this.ipfsControl.ipfsCoord.useCases.peer.sendPrivateMessage(
        serviceId,
        cmdStr,
        thisNode
      )

      return result
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

      const result = await this.ipfsControl.ipfsCoord.useCases.peer.sendPrivateMessage(
        serviceId,
        cmdStr,
        thisNode
      )

      return result
    } catch (err) {
      console.error('Error in sendTx()')
      throw err
    }
  }
}

module.exports = WalletService
