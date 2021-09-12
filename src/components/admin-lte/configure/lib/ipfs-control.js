/*
  This library controls the IPFS interface for the app.
*/

/*
  This library contains the logic around the browser-based IPFS full node.
*/
import IPFS from '@chris.troutner/ipfs'
import IpfsCoord from 'ipfs-coord'

// CHANGE THESE VARIABLES
const CHAT_ROOM_NAME = 'psf-ipfs-chat-001'

// JSON-LD schema used in announcement.
// Customize this data for your own app.
const name = 'Browser Chat ' + Math.floor(Math.random() * 1000)
const announceJsonLd = {
  '@context': 'https://schema.org/',
  '@type': 'WebAPI',
  name: name,
  description: 'This is a browser-based IPFS node.',
  documentation: '',
  provider: {
    '@type': 'Organization',
    name: 'Permissionless Software Foundation',
    url: 'https://PSFoundation.cash'
  }
}

let _this

class IpfsControl {
  constructor (ipfsConfig) {
    this.statusLog = ipfsConfig.statusLog
    this.handleChatLog = ipfsConfig.handleChatLog
    this.wallet = ipfsConfig.bchWallet
    this.privateLog = ipfsConfig.privateLog

    _this = this
  }

  // Top level function for controlling the IPFS node. This funciton is called
  // by the componentDidMount() function of the page.
  async startIpfs () {
    try {
      console.log('Setting up instance of IPFS...')
      this.statusLog('Setting up instance  of IPFS...')

      // Use DHT routing and ipfs.io delegates.
      const ipfsOptions = {
        config: {
          Bootstrap: [],
          Swarm: {
            ConnMgr: {
              HighWater: 30,
              LowWater: 10
            },
            AddrFilters: []
          },
          Routing: {
            Type: 'dhtclient'
          },
          preload: {
            enabled: false
          },
          offline: true
        },
        libp2p: {
          config: {
            dht: {
              enabled: true,
              clientMode: true
            }
          }
        }
      }

      // const ipfsOptions = {
      //   Bootstrap: [],
      //   Swarm: {
      //     ConnMgr: {
      //       HighWater: 30,
      //       LowWater: 10
      //     },
      //     AddrFilters: []
      //   }
      // }

      this.ipfs = await IPFS.create(ipfsOptions)
      this.statusLog('IPFS node created.')

      // Set a 'low-power' profile for the IPFS node.
      await this.ipfs.config.profiles.apply('lowpower')

      // Generate a new wallet.
      // this.wallet = new BchWallet()
      // console.log("this.wallet: ", this.wallet);

      if (!this.wallet) {
        throw new Error('Wallet Not Found.! . Create or import a wallet')
      }
      // Wait for the wallet to initialize.
      await this.wallet.walletInfoPromise

      // Instantiate the IPFS Coordination library.
      this.ipfsCoord = new IpfsCoord({
        ipfs: this.ipfs,
        type: 'browser',
        statusLog: this.statusLog, // Status log
        bchjs: this.wallet.bchjs,
        mnemonic: this.wallet.walletInfo.mnemonic,
        privateLog: this.privateLog,
        announceJsonLd
      })
      this.statusLog('ipfs-coord library instantiated.')

      // Wait for the coordination stuff to be setup.
      await this.ipfsCoord.start()

      const nodeConfig = await this.ipfs.config.getAll()
      console.log(
        `IPFS node configuration: ${JSON.stringify(nodeConfig, null, 2)}`
      )

      // subscribe to the 'chat' chatroom.
      await this.ipfsCoord.adapters.pubsub.subscribeToPubsubChannel(
        CHAT_ROOM_NAME,
        this.handleChatLog,
        this.ipfsCoord.thisNode
      )

      // Pass the IPFS instance to the window object. Makes it easy to debug IPFS
      // issues in the browser console.
      if (typeof window !== 'undefined') window.ipfs = this.ipfs

      // Get this nodes IPFS ID
      const id = await this.ipfs.id()
      this.ipfsId = id.id
      this.statusLog(`This IPFS node ID: ${this.ipfsId}`)

      console.log('IPFS node setup complete.')
      this.statusLog('IPFS node setup complete.')
      _this.statusLog(' ')
    } catch (err) {
      console.error('Error in startIpfs(): ', err)
      this.statusLog(
        'Error trying to initialize IPFS node! Have you created a wallet?'
      )
    }
  }

  // This funciton handles incoming chat messages.
  handleChatMsg (msg) {
    try {
      console.log('handleChatMsg msg: ', msg)
    } catch (err) {
      console.error('Error in handleChatMsg(): ', err)
    }
  }

  getNodeInfo () {
    return {
      ipfsId: this.ipfsId,
      announceJsonLd
    }
  }
}

// module.exports = AppIpfs
export default IpfsControl
