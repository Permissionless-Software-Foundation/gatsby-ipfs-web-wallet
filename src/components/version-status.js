import React from 'react'

class VersionStatus extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
  }

  render () {
    return (
      <>
        {this.state.show && (
          <div className='version-status'>
            <div>
              <p>
                <b>Warning: Open Alpha - things will break</b>
              </p>
            </div>
          </div>
        )}
      </>
    )
  }
}

export default VersionStatus
