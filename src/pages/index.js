import React from 'react'

let AdminLTE =
  typeof window !== `undefined`
    ? require('../components/admin-lte').default
    : null

class AdminLTEPage extends React.Component {
  state = {}


  render() {
    return <>{AdminLTE && <AdminLTE />}</>
  }
}

export default AdminLTEPage
