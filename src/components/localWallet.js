// Local storage handler

const localStorageWalletKey = 'fullstack-wallet-info'

// Detect if the app is running in a browser.
export const isBrowser = () => typeof window !== 'undefined'

export const getWalletInfo = () =>
  isBrowser() && window.localStorage.getItem(localStorageWalletKey)
    ? JSON.parse(window.localStorage.getItem(localStorageWalletKey))
    : {}

export const setWalletInfo = wallet =>
  window.localStorage.setItem(localStorageWalletKey, JSON.stringify(wallet))
