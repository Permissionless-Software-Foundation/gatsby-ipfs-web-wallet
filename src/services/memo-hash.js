/*
  This service file contains functions for retrieving an IPFS hash from the
  BCH blockchain, in a fasion similar to PS001:
  https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps001-media-sharing.md
*/

// These libraries are retrieved in /src/html.js
// minimal-slp-wallet-web
const BchWallet = typeof window !== 'undefined' ? window.SlpWallet : null

// bch-message-lib
const BchMessage = typeof window !== 'undefined' ? window.BchMessage : null

class Memo {
  constructor (config) {
    console.log('Memo config', config)
    // Throw an error if this class is instantiated without passing a BCH address.
    if (!config || !config.bchAddr) {
      throw new Error('Must pass a BCH address to Memo constructor.')
    } else this.bchAddr = config.bchAddr

    // Use the bchWallet instance if already exists otherwise
    // creates a new one with default values
    if (config && config.bchWallet) {
      this.wallet = config.bchWallet
      this.bchjs = this.wallet.bchjs

      // The way bchjs is used on the previous line
      // contains the configuration stablished by
      // the user ( apiToken, restURL )
      // for a new instance we could use the folowing code
      // const BCHJS = props.bchWallet.BCHJS
      // this.bchjs = new BCHJS()

      // debugger
    } else if (BchWallet) {
      this.wallet = new BchWallet()
      // bchjs instance with default values
      this.bchjs = this.wallet.bchjs
      // debugger
    } else {
      console.error('Could not access minimal-slp-wallet library.')
    }

    if (BchMessage) {
      this.bchMessage = new BchMessage({ bchjs: this.bchjs })
    } else {
      console.error('Could not access bch-message-lib library.')
    }
  }

  // Walk the transactions associated with an address until a proper IPFS hash is
  // found. If one is not found, will return false.
  //
  // See this Issue with ABC wallets:
  // https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-web-wallet/issues/136
  async findHash () {
    try {
      console.log(`finding latest IPFS hash for address: ${this.bchAddr}...`)

      const txs = await this.bchMessage.memo.memoRead(
        this.bchAddr,
        'IPFS UPDATE'
      )
      // console.log(`txs: ${JSON.stringify(txs, null, 2)}`)

      // If the array is empty, then return false.
      if (txs.length === 0) return false

      const hash = txs[0].subject

      console.log(`...found this IPFS hash: ${hash}`)

      // The transactions should automatically be sorted by the bchMessage
      // library. So Just return the subject.
      return hash
    } catch (err) {
      console.warn('Could not find IPFS hash in transaction history.')
      return false
    }
  }
}

export default Memo
