import { createStore as reduxCreateStore } from 'redux'
// Wallet from localStorage
import { getWalletInfo, setWalletInfo } from '../components/localWallet'
import BchWallet from 'minimal-slp-wallet'

const reducer = (state, action) => {
  // Update walletInfo state property
  if (action.type === 'SET_WALLET_INFO') {
    const walletInfo = action.value

    // persist JWT when create or import wallet
    if (state.walletInfo.JWT && !walletInfo.JWT) {
      walletInfo.JWT = state.walletInfo.JWT
    }

    setWalletInfo(walletInfo) // Add wallet to local storage

    return Object.assign({}, state, {
      walletInfo: walletInfo
    })
  }

  // Update bchBalance state property
  if (action.type === 'UPDATE_BALANCE') {
    // Convert satoshis to bch
    const satoshis = action.value
    const bch = satoshis / 100000000

    return Object.assign({}, state, {
      bchBalance: Number(bch.toFixed(8))
    })
  }
  // Adds the minimal-slp-wallet instance to the Redux state
  if (action.type === 'SET_BCH_WALLET') {
    return Object.assign({}, state, {
      bchWallet: action.value
    })
  }

  return state
}

// Wallet info from local storage
const localWallet = getWalletInfo()

// Creates an instance  of minimal-slp-wallet, with
// the local storage information if it exists
const instanceWallet = () => {
  try {
    if (!localWallet.mnemonic) return null

    const bchWalletLib = new BchWallet(localWallet.mnemonic)

    const jwtToken = localWallet.JWT
    if (jwtToken) {
      bchWalletLib.bchjs = new bchWalletLib.BCHJS({ apiToken: jwtToken })
    }
    return bchWalletLib
  } catch (error) {
    console.warn(error)
  }
}
// initial state
const initialState = {
  walletInfo: localWallet.mnemonic ? localWallet : {}, // Object wallet info
  bchBalance: 0, // Wallet Balance
  bchWallet: instanceWallet() // minimal-slp-wallet instance
}

const createStore = () => reduxCreateStore(reducer, initialState)
export default createStore
