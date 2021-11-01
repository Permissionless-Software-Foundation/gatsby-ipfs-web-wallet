/*
  Handles commands from command terminal.
*/

let _this

class CommandRouter {
  constructor (cmdConfig) {
    if (cmdConfig && cmdConfig.ipfsControl) {
      this.ipfsControl = cmdConfig.ipfsControl
    }

    _this = this
  }

  // Parse and route a command to the proper handler.
  async route (command, appIpfs) {
    try {
      // console.log(`command: ${command}`)

      // Split the command into an array of words separated by a space
      const words = command.toString().split(' ')
      // console.log(`words: ${JSON.stringify(words, null, 2)}`)

      switch (words[0]) {
        case 'help':
          return this.help()
        case 'list':
          return await this.list(command, appIpfs)
        case 'clear':
          return 'clear'
        case 'pubsub':
          return await this.pubsub(command, appIpfs)
        default:
          return ''
      }
    } catch (err) {
      console.error('Error in commandRouter()')
      throw err
    }
  }

  // Display the help
  help () {
    const msg = `
  Available commands:
   - help - this help.
   - clear - clear the command terminal.
   - list peers - list all known ipfs-coord peers.
   - list relays - list all known circuit relays and their state.
   - pubsub list - list all subscribed pubsub channels.
  `

    return msg
  }

  async list (command, appIpfs) {
    const words = command.toString().split(' ')

    switch (words[1]) {
      case 'relays':
        return this.listRelays(_this.ipfsControl)
      case 'peers':
        return this.listPeers(_this.ipfsControl)
      default:
        return ''
    }
  }

  async pubsub (command, appIpfs) {
    const words = command.toString().split(' ')

    switch (words[1]) {
      case 'list':
        return this.listPubsubChannels(appIpfs)
      default:
        return ''
    }
  }

  // List known ipfs-coord peers.
  async listPeers (appIpfs) {
    try {
      // console.log('appIpfs: ', appIpfs)

      const relays = `Known ipfs-coord peers:\n${JSON.stringify(
        appIpfs.ipfsCoord.thisNode.peerData,
        null,
        2
      )}`
      return relays

      // return "test"
    } catch (err) {
      console.error('Error in listPeers(): ', err)
      return 'Error in listPeers()'
    }
  }

  // List the relays connected to this IPFS node.
  async listRelays (appIpfs) {
    try {
      // console.log('appIpfs: ', appIpfs)

      const relays = `Known Circuit Relays:\n${JSON.stringify(
        appIpfs.ipfsCoord.thisNode.relayData,
        null,
        2
      )}`
      return relays

      // return "test"
    } catch (err) {
      console.error('Error in listRelays(): ', err)
      return 'Error in listRelays()'
    }
  }

  async listPubsubChannels (appIpfs) {
    try {
      // console.log('appIpfs: ', appIpfs)

      const channels = await appIpfs.ipfs.pubsub.ls()

      const outStr = `Pubsub Subscriptions:\n${JSON.stringify(
        channels,
        null,
        2
      )}`

      return outStr
    } catch (err) {
      console.error('Error in listPubsubChannels(): ', err)
      return 'Error in listPubsubChannels()'
    }
  }
}

export default CommandRouter
