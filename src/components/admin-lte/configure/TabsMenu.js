import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import MenuComponents from './menu-components'


function TabsMenu(props) {
    return (   
        <React.Fragment>         
            {MenuComponents.length > 0 &&
            <Tabs defaultActiveKey="Configure" id="configure-tabs" onSelect={props.onSelect}>
                <Tab
                    title="General"
                    eventKey="Configure"
                />
        
                {MenuComponents.map(menuItem => <Tab key={menuItem.id} eventKey={menuItem.key} title={menuItem.key}/>)}
            </Tabs>}
        </React.Fragment> 
    )
}

export default TabsMenu; 
