import React from 'react'
import { Sidebar } from 'adminlte-2-react'

import Wallet from './admin-lte/wallet'
import Tokens from './admin-lte/tokens'
import Configure from './admin-lte/configure'
import SendReceive from './admin-lte/send-receive'

const { Item } = Sidebar

const MenuComponents = (props) => {
  return [
    {
      key: 'Send/Receive',
      component: <SendReceive key='Send/Receive' {...props} />,
      menuItem: <Item icon='fa-exchange-alt' key='Send/Receive' text='Send/Receive' />
    },
    {
      key: 'Tokens',
      component: <Tokens key='Tokens' {...props} />,
      menuItem: <Item icon='fas-coins' key='Tokens' text='Tokens' activeOn='/' />
    },
    {
      key: 'Wallet',
      component: <Wallet key='Wallet' {...props} />,
      menuItem: <Item icon='fa-wallet' key='Wallet' text='Wallet' />
    },
    {
      key: 'Configure',
      component: <Configure key='Configure' {...props} />,
      menuItem: <Item icon='fas-cog' key='Configure' text='Configure' />
    }
  ]
}

export default MenuComponents
