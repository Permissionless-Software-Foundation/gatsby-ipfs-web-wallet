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
  memoAddr: 'bitcoincash:qqwdv3hkmvd5vk0uhwqrqnef54542e5ctvy3ppt0nq'
}

module.exports = config
