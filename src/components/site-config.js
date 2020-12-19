/*
  This file is intended to be overwritten. It provides a common place to store
  site configuration data.
*/

const config = {
  title: 'FullStack.cash',
  titleShort: 'PSF',
  balanceText: 'BCH Balance',
  balanceIcon: 'fab-bitcoin',

  // The BCH address used in a memo.cash account. Used for tracking the IPFS
  // hash of the mirror of this site.
  memoAddr: 'bitcoincash:qqwdv3hkmvd5vk0uhwqrqnef54542e5ctvy3ppt0nq',

  // Footer Information
  hostText: 'FullStack.cash',
  hostUrl: 'https://fullstack.cash/',
  sourceCode: 'https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-web-wallet',
  torUrl: '2egutot63q765ciwsenlcy5zdyxwxt7olzbldr5dx5i3ixsef2nvrzid.onion',
  clearWebUrl: 'https://gatsby-ipfs-web-wallet.fullstack.cash'
}

module.exports = config
