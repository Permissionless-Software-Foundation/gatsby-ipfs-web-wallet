import { createStore as reduxCreateStore } from 'redux'
// Wallet from localStorage
import { getWalletInfo, setWalletInfo } from '../components/localWallet'
// import BchWallet from 'minimal-slp-wallet'
const BchWallet = typeof window !== 'undefined' ? window.SlpWallet : null

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
    const { myBalance, currentRate, currency } = action.value
    console.log(`currentRate ${currency}: ${currentRate} dollarcent`)

    const satoshis = myBalance

    let coin = satoshis / 100000000
    if (currency === 'XEC') coin = satoshis / 100

    const bchBalance = Number(coin.toFixed(8))
    const _usdBalance = bchBalance * (currentRate / 100)
    const usdBalance = Number(_usdBalance.toFixed(2)) // usd balance

    return Object.assign({}, state, {
      bchBalance: { bchBalance, usdBalance },
      currentRate
    })
  }
  // Adds the minimal-slp-wallet instance to the Redux state
  if (action.type === 'SET_BCH_WALLET') {
    return Object.assign({}, state, {
      bchWallet: action.value
    })
  }

  // Get or update tokens information
  if (action.type === 'SET_TOKENS_INFO') {
    return Object.assign({}, state, {
      tokensInfo: action.value
    })
  }

  // Fuctionality to change between the different sections of the menu
  // a "data" property can be added with information
  // that can be handled by the other menu components
  if (action.type === 'MENU_NAVIGATION') {
    return Object.assign({}, state, {
      menuNavigation: {
        changeTo: action.value.changeTo || state.menuNavigation.changeTo,
        data: action.value.data
      }
    })
  }
  return state
}

// Wallet info from local storage
const localStorageInfo = getWalletInfo()

// Creates an instance  of minimal-slp-wallet, with
// the local storage information if it exists
const instanceWallet = () => {
  try {
    if (!localStorageInfo.mnemonic) return null

    const jwtToken = localStorageInfo.JWT
    const restURL = localStorageInfo.selectedServer
    const bchjsOptions = {}

    if (jwtToken) {
      bchjsOptions.apiToken = jwtToken
    }
    if (restURL) {
      bchjsOptions.restURL = restURL
    }

    // Assign the tx fee based on environment variable
    const FEE = process.env.FEE ? process.env.FEE : 1
    bchjsOptions.fee = FEE
    console.log(`Using ${bchjsOptions.fee} sats per byte for tx fees.`)

    const bchWalletLib = new BchWallet(localStorageInfo.mnemonic, bchjsOptions)

    // Update bchjs instances  of minimal-slp-wallet libraries
    bchWalletLib.tokens.sendBch.bchjs = new bchWalletLib.BCHJS(bchjsOptions)
    bchWalletLib.tokens.utxos.bchjs = new bchWalletLib.BCHJS(bchjsOptions)

    return bchWalletLib
  } catch (error) {
    console.warn(error)
  }
}

// initial state
const initialState = {
  walletInfo: localStorageInfo, // Object wallet info
  bchBalance: { bchBalance: 0, usdBalance: 0 }, // Wallet Balance
  bchWallet: instanceWallet(), // minimal-slp-wallet instance
  tokensInfo: [],
  currentRate: 0,
  menuNavigation: {
    changeTo: () => {},
    data: null
  }
}
let createStore
typeof window !== 'undefined'
  ? (createStore = () =>
      reduxCreateStore(
        reducer,
        initialState,
        /** Redux DevTools
         *  https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=es
         *
         */
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      ))
  : (createStore = () => reduxCreateStore(reducer, initialState))
export default createStore
