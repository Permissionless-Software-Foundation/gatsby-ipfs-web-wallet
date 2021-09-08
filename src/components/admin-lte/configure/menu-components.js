// const MenuComponents = () => {}

// export default MenuComponents

import React from 'react'
import Ipfs from './ipfs-tab'
export default [
  {
    key: 'IPFS',
    icon: 'fas-message',
    component: (
      <>
        <Ipfs />
      </>
    )
  }
]
