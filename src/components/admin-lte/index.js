import React from "react"
import Example from "./example"
import Example2 from "./example2"
import Example3 from "./example3"

import AdminLTE, { Sidebar } from "adminlte-2-react"

const { Item } = Sidebar

class AdminLTEPage extends React.Component {
  state = {}

  sidebar = [
    <Item key="test" text="TEST" to="/test" />,
    <Item key="img" text="IMG" to="/img" />,
    <Item key="forms" text="FORMS" to="/forms" />,
  ]

  render() {
    return (
      <AdminLTE
        title={["Hello", "World"]}
        titleShort={["He", "we"]}
        theme="blue"
        sidebar={this.sidebar}
      >
        <Example path="/test" />
        <Example2 path="/img" />
        <Example3 path="/forms" />
      </AdminLTE>
    )
  }
}

export default AdminLTEPage
