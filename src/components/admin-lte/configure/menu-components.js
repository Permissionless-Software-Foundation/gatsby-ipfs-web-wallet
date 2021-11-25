import React from 'react'
import Ipfs from './ipfs-tab'
const MenuComponents = props => {
  return [
    {
      key: 'IPFS',
      icon: 'fas-message',
      component: (
        <>
          <Ipfs {...props} />
        </>
      )
    }
  ]
}
export default MenuComponents
