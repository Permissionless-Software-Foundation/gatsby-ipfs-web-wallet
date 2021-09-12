import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import MenuComponents from './menu-components'

function TabsMenu (props) {
  const menuComponents = MenuComponents(props)
  return (
    <>
      {menuComponents.length > 0 && (
        <Tabs
          defaultActiveKey='Configure'
          id='configure-tabs'
          onSelect={props.onSelect}
        >
          <Tab title='General' eventKey='Configure' />

          {menuComponents.map((menuItem, i) => (
            <Tab
              key={`${menuItem.id}-${i}`}
              eventKey={menuItem.key}
              title={menuItem.key}
              {...props}
            />
          ))}
        </Tabs>
      )}
    </>
  )
}

export default TabsMenu
