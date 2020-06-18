import { createStore as reduxCreateStore } from "redux"
// Wallet from localStorage
import { getWalletInfo, setWalletInfo } from "../components/localWallet"

const reducer = (state, action) => {
  // Update walletInfo state property
  if (action.type === `SET_WALLET`) {
    setWalletInfo(action.value) // Add wallet to local storage
    return Object.assign({}, state, {
      walletInfo: action.value,
    })
  }

  // Update bchBalance state property
  if (action.type === `UPDATE_BALANCE`) {
    // Convert satoshis to bch
    const satoshis = action.value
    const bch = satoshis / 100000000
    return Object.assign({}, state, {
      bchBalance: Number(bch.toFixed(8)),
    })
  }

  return state
}

// Wallet info from local storage
const localWallet = getWalletInfo()

const initialState = {
  walletInfo: localWallet.mnemonic ? localWallet : {},
  bchBalance: 0,
}

const createStore = () => reduxCreateStore(reducer, initialState)
export default createStore
